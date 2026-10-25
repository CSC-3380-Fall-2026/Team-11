import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'map_permissions_location.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Map with Search and Distance',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFC5E7DB)),
      ),
      home: const MapSearchScreen(),
    );
  }
}

class MapSearchScreen extends StatefulWidget {
  const MapSearchScreen({super.key});

  @override
  State<MapSearchScreen> createState() => _MapSearchScreenState();
}

class _MapSearchScreenState extends State<MapSearchScreen> {
  final MapController _mapController = MapController();
  final TextEditingController _searchController = TextEditingController();

  LatLng _currentPosition = const LatLng(37.7749, -122.4194); 
  //sets default to San Fran.

  LatLng? _searchedPosition;
  String _searchedPlaceName = '';
  double? _distanceInMeters;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserLocation();
  }

  Future<void> _loadUserLocation() async {
    Position? position = await determinePosition();
    if (position != null) {
      setState(() {
        _currentPosition = LatLng(position.latitude, position.longitude);
        _isLoading = false;
      });
      _mapController.move(_currentPosition, 14.0);
    } else {
      setState(() => _isLoading = false);
    }
  }

  //Search that uses OpenStreetMap Api
  Future<void> _searchLocation(String query) async {
    if (query.isEmpty) return;
    final url = Uri.parse(
      'https://nominatim.openstreetmap.org/search?q=$query&format=json&limit=1',
    );
    try {
      final response = await http.get(
        url,
        headers: {'User-Agent': 'flutter_map_app'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data.isNotEmpty) {
          final lat = double.parse(data[0]['lat']);
          final lon = double.parse(data[0]['lon']);
          final displayName = data[0]['display_name'];
          
          setState(() {
            _searchedPosition = LatLng(lat, lon);
            _searchedPlaceName = displayName;

            //distance between curr. pos. and searched pos.
            const Distance distance = Distance();
            _distanceInMeters = distance.as(
              LengthUnit.Meter,
              _currentPosition,
              _searchedPosition!,
            );
          });
          _mapController.move(_searchedPosition!, 15.0);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Sorry! Location not found!')),
          );
        }
      }
    } catch (e) {
      debugPrint('Search error: $e');
    }
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
                      urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      subdomains: const ['a', 'b', 'c'],
                      userAgentPackageName: 'com.example.app',
                    ),
                    MarkerLayer(
                      markers: [
                        //Current marker
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

                        //Searched Marker
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
                      ],
                    ),
                  ],
                ),

                //Line for searched location
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

                //Search Overlay
                Positioned(
                  top: 50,
                  left: 15,
                  right: 15,
                  child: Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child:  TextField(controller: _searchController,
                        decoration: InputDecoration(
                              hintText: 'Search for local fitness locations...',
                              border: InputBorder.none,
                              icon: Icon(Icons.search),
                              
                              suffixIcon: IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                              _searchController.clear();
                              setState(() {

_searchedPosition = null;

_distanceInMeters = null;

});

                            },

                              ),
                        ),
                                onSubmitted: (value) => _searchLocation(value),

                      ),
                    ),
                  ),
                ),

                //Distance and info overlay
                if (_distanceInMeters != null)
                  Positioned(
                    bottom: 30,
                    left: 15,
                    right: 15,
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
      floatingActionButton: FloatingActionButton(
        onPressed: _loadUserLocation,
        child: const Icon(Icons.gps_fixed),
      ),
    );
  }
}

