import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:http/http.dart' as http;
import 'map_permissions_location.dart';

/// Simple holder for a gym found on the map.
class Gym {
  final String name;
  final LatLng position;
  const Gym({required this.name, required this.position});
}

class MapSearchScreen extends StatefulWidget {
  const MapSearchScreen({super.key});

  @override
  State<MapSearchScreen> createState() => _MapSearchScreenState();
}

class _MapSearchScreenState extends State<MapSearchScreen> {
  final MapController _mapController = MapController();
  final TextEditingController _searchController = TextEditingController();

  // Default to San Francisco until the real location loads.
  LatLng _currentPosition = const LatLng(37.7749, -122.4194);

  LatLng? _searchedPosition;
  String _searchedPlaceName = '';
  double? _distanceInMeters;
  bool _isLoading = true;

  // Search results the user can tap on.
  List<dynamic> _results = [];

  // Gyms shown on the map.
  List<Gym> _gyms = [];
  bool _isLoadingGyms = false;

  @override
  void initState() {
    super.initState();
    _loadUserLocation();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _mapController.dispose();
    super.dispose();
  }

  Future<void> _loadUserLocation() async {
    try {
      final position = await determinePosition();
      if (position != null && mounted) {
        setState(() {
          _currentPosition = LatLng(position.latitude, position.longitude);
        });
        // Wait until the map is built before moving it.
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) _mapController.move(_currentPosition, 14.0);
        });
        _loadNearbyGyms(_currentPosition);
      }
    } catch (e) {
      debugPrint('Location error: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // Finds gyms around [center] using the OpenStreetMap Overpass API.
  Future<void> _loadNearbyGyms(LatLng center, {int radiusMeters = 5000}) async {
    setState(() => _isLoadingGyms = true);

    final lat = center.latitude;
    final lon = center.longitude;

    // Nodes (points) and ways (building outlines) tagged as gyms.
    final query =
        '''
[out:json][timeout:25];
(
  node["leisure"="fitness_centre"](around:$radiusMeters,$lat,$lon);
  way["leisure"="fitness_centre"](around:$radiusMeters,$lat,$lon);
  node["leisure"="sports_centre"]["sport"="fitness"](around:$radiusMeters,$lat,$lon);
  way["leisure"="sports_centre"]["sport"="fitness"](around:$radiusMeters,$lat,$lon);
);
out center 80;
''';

    try {
      final response = await http.post(
        Uri.https('overpass-api.de', '/api/interpreter'),
        headers: {'User-Agent': 'flutter_map_app'},
        body: {'data': query},
      );
      if (!mounted) return;

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final elements = data['elements'] as List<dynamic>;

        final gyms = <Gym>[];
        for (final el in elements) {
          // Nodes have lat/lon directly; ways have a "center".
          final latValue = el['lat'] ?? el['center']?['lat'];
          final lonValue = el['lon'] ?? el['center']?['lon'];
          if (latValue == null || lonValue == null) continue;

          gyms.add(
            Gym(
              name: el['tags']?['name'] ?? 'Gym',
              position: LatLng(
                (latValue as num).toDouble(),
                (lonValue as num).toDouble(),
              ),
            ),
          );
        }

        setState(() => _gyms = gyms);

        if (gyms.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No gyms found in this area.')),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Gym search is busy. Try again in a moment.'),
          ),
        );
      }
    } catch (e) {
      debugPrint('Gym load error: $e');
    } finally {
      if (mounted) setState(() => _isLoadingGyms = false);
    }
  }

  // Shows a gym's name + distance in the bottom card.
  void _selectGym(Gym gym) {
    setState(() {
      _searchedPosition = gym.position;
      _searchedPlaceName = gym.name;
      _distanceInMeters = const Distance().as(
        LengthUnit.Meter,
        _currentPosition,
        gym.position,
      );
    });
  }

  // Search using the OpenStreetMap (Nominatim) API.
  // Format meters as "850 m" or "3.2 km".
  String _formatDistance(double meters) {
    return meters > 1000
        ? '${(meters / 1000).toStringAsFixed(1)} km'
        : '${meters.toStringAsFixed(0)} m';
  }

  // Fetches places from Nominatim. If [nearbyOnly] is true, results are
  // restricted to a box of roughly 40 km around the user's position.
  Future<List<dynamic>> _fetchPlaces(
    String query, {
    required bool nearbyOnly,
  }) async {
    final params = <String, String>{
      'q': query,
      'format': 'json',
      'limit': '15',
    };

    if (nearbyOnly) {
      const delta = 0.35; // degrees, roughly 40 km
      final lat = _currentPosition.latitude;
      final lon = _currentPosition.longitude;
      // viewbox = left,top,right,bottom (lon_min, lat_max, lon_max, lat_min)
      params['viewbox'] =
          '${lon - delta},${lat + delta},${lon + delta},${lat - delta}';
      params['bounded'] = '1';
    }

    final response = await http.get(
      Uri.https('nominatim.openstreetmap.org', '/search', params),
      headers: {'User-Agent': 'flutter_map_app'},
    );

    if (response.statusCode != 200) return [];
    return json.decode(response.body) as List<dynamic>;
  }

  // Search using the OpenStreetMap (Nominatim) API, nearest results first.
  Future<void> _searchLocation(String query) async {
    if (query.trim().isEmpty) return;

    try {
      // 1) Look near the user first.
      var data = await _fetchPlaces(query, nearbyOnly: true);

      // 2) Nothing nearby? Search everywhere.
      if (data.isEmpty) {
        data = await _fetchPlaces(query, nearbyOnly: false);
      }
      if (!mounted) return;

      if (data.isEmpty) {
        setState(() => _results = []);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sorry! Location not found!')),
        );
        return;
      }

      // 3) Work out each result's distance from the user and sort by it.
      const distance = Distance();
      for (final r in data) {
        r['distance'] = distance.as(
          LengthUnit.Meter,
          _currentPosition,
          LatLng(double.parse(r['lat']), double.parse(r['lon'])),
        );
      }
      data.sort(
        (a, b) => (a['distance'] as double).compareTo(b['distance'] as double),
      );

      setState(() => _results = data.take(8).toList());
    } catch (e) {
      debugPrint('Search error: $e');
    }
  }

  // Called when the user taps one of the search results.
  void _selectResult(dynamic result) {
    final lat = double.parse(result['lat']);
    final lon = double.parse(result['lon']);

    setState(() {
      _searchedPosition = LatLng(lat, lon);
      _searchedPlaceName = result['display_name'];
      _distanceInMeters = const Distance().as(
        LengthUnit.Meter,
        _currentPosition,
        _searchedPosition!,
      );
      _results = [];
    });

    FocusScope.of(context).unfocus();
    _mapController.move(_searchedPosition!, 15.0);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Stack(
              children: [
                FlutterMap(
                  mapController: _mapController,
                  options: MapOptions(
                    initialCenter: _currentPosition,
                    initialZoom: 14.0,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate:
                          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.example.app',
                    ),

                    // Line to selected location.
                    // Must live INSIDE FlutterMap's children.
                    if (_searchedPosition != null)
                      PolylineLayer(
                        polylines: [
                          Polyline(
                            points: [_currentPosition, _searchedPosition!],
                            color: Colors.blue,
                            strokeWidth: 4.0,
                          ),
                        ],
                      ),

                    MarkerLayer(
                      markers: [
                        // Gym markers (tap to select)
                        for (final gym in _gyms)
                          Marker(
                            point: gym.position,
                            width: 44,
                            height: 44,
                            child: GestureDetector(
                              onTap: () => _selectGym(gym),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.deepOrange,
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white,
                                    width: 2,
                                  ),
                                  boxShadow: const [
                                    BoxShadow(
                                      color: Colors.black26,
                                      blurRadius: 4,
                                    ),
                                  ],
                                ),
                                child: const Icon(
                                  Icons.fitness_center,
                                  color: Colors.white,
                                  size: 22,
                                ),
                              ),
                            ),
                          ),

                        // Searched location marker
                        if (_searchedPosition != null)
                          Marker(
                            point: _searchedPosition!,
                            width: 50,
                            height: 50,
                            child: const Icon(
                              Icons.location_pin,
                              size: 45,
                              color: Colors.blueGrey,
                            ),
                          ),

                        // Current location marker
                        Marker(
                          point: _currentPosition,
                          width: 50,
                          height: 50,
                          child: const Icon(
                            Icons.my_location,
                            size: 40,
                            color: Color(0xFF86B8A6),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                // Search bar + results list
                Positioned(
                  top: 50,
                  left: 15,
                  right: 15,
                  child: Column(
                    children: [
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: TextField(
                            controller: _searchController,
                            textInputAction: TextInputAction.search,
                            decoration: InputDecoration(
                              hintText: 'Search for a place...',
                              border: InputBorder.none,
                              icon: const Icon(Icons.search),
                              suffixIcon: IconButton(
                                icon: const Icon(Icons.clear),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() {
                                    _searchedPosition = null;
                                    _distanceInMeters = null;
                                    _results = [];
                                  });
                                },
                              ),
                            ),
                            onSubmitted: _searchLocation,
                          ),
                        ),
                      ),
                      if (_results.isNotEmpty)
                        Card(
                          elevation: 4,
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(maxHeight: 250),
                            child: ListView.separated(
                              shrinkWrap: true,
                              padding: EdgeInsets.zero,
                              itemCount: _results.length,
                              separatorBuilder: (_, __) =>
                                  const Divider(height: 1),
                              itemBuilder: (context, i) => ListTile(
                                dense: true,
                                leading: const Icon(Icons.place),
                                title: Text(
                                  _results[i]['display_name'],
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                subtitle: Text(
                                  _formatDistance(_results[i]['distance']),
                                ),
                                onTap: () => _selectResult(_results[i]),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),

                // Loading indicator while gyms are being fetched
                if (_isLoadingGyms)
                  const Positioned(
                    top: 120,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: Card(
                        child: Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 8,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                              SizedBox(width: 10),
                              Text('Finding gyms...'),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                // Distance and info overlay
                if (_distanceInMeters != null)
                  Positioned(
                    bottom: 30,
                    left: 15,
                    right: 90, // leave room for the buttons
                    child: Card(
                      color: Colors.white,
                      elevation: 6,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _searchedPlaceName,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Distance: ${_distanceInMeters! > 1000 ? '${(_distanceInMeters! / 1000).toStringAsFixed(2)} km' : '${_distanceInMeters!.toStringAsFixed(0)} meters'}',
                              style: const TextStyle(
                                fontSize: 16,
                                color: Colors.black,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Re-search for gyms in the area currently on screen.
          FloatingActionButton(
            heroTag: 'gyms_here',
            tooltip: 'Find gyms in this area',
            onPressed: () => _loadNearbyGyms(_mapController.camera.center),
            child: const Icon(Icons.fitness_center),
          ),
          const SizedBox(height: 12),
          // Go back to the user's location.
          FloatingActionButton(
            heroTag: 'gps',
            tooltip: 'My location',
            onPressed: _loadUserLocation,
            child: const Icon(Icons.gps_fixed),
          ),
        ],
      ),
    );
  }
}
