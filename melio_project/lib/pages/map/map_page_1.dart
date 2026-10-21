//contains map permissions 
// uses button to gather and display location

import 'package:flutter/material.dart';
import 'map_permissions_location.dart';

class MapCodeScreen extends StatelessWidget{
  const MapCodeScreen({super.key});

  @override
  Widget build(BuildContext context){
    return Scaffold(appBar: AppBar(title: const Text('Map Location')),
    body: Center(
      child: ElevatedButton(
        onPressed: () async {
      try{ 
        final position = await determinePosition();
        if (position != null) {
          print('Latitude: ${position.latitude}, Longitude: ${position.longitude}');

        }
      } catch(e) {
        print(e);
      }
    },
    child:const Text('Get Current Location'),
    ),
    ),
    );
  }
}