import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:melio_project/pages/login/login_page.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:device_preview/device_preview.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

void main() async{

  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: "assets/secrets.env");

  try {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (e) { 
    debugPrint('Error initializing Firebase: $e');
  }

  //connect to local emulators ONLY in debug mode
  if (kDebugMode){
    try {
    
    //android emulators use '10.0.2.2' to refer to computers localhost
    //ios simulators, web, or desktop use 'localhost' to refer to computers localhost
      String host ='localhost';  

      //connect to the Firestore and Auth emulators
      FirebaseFirestore.instance.useFirestoreEmulator(host, 8080);
      await FirebaseAuth.instance.useAuthEmulator(host, 9099);

      print ("Successfully connected to Firebase emulators at $host");
    } catch (e) {
      debugPrint('Error connecting to Firebase emulators: $e');
    }
  }

  runApp(DevicePreview(enabled: true, builder: (context) => const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      locale: DevicePreview.locale(context),
      builder: DevicePreview.appBuilder,

      initialRoute: '/',
      routes: {
        '/': (context) => LoginPage(),
        '/home': (context) => const HomePage(),

        // home: LoginPage(), // App start point is the LoginPage
      },
    );
  }
}
