import 'package:firebase_auth/firebase_auth.dart';

/*
the following code is a snippet from the firebase documentation on how to 
create a user with email and password. I will use this as a reference to implement 
the createUserWithEmailAndPassword method in the AuthService class.

try {
  final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
    email: emailAddress,
    password: password,
  );
} on FirebaseAuthException catch (e) {
  if (e.code == 'weak-password') {
    print('The password provided is too weak.');
  } else if (e.code == 'email-already-in-use') {
    print('The account already exists for that email.');
  }
} catch (e) {
  print(e);
}
*/

class AuthService {
  final FirebaseAuth _authService = FirebaseAuth.instance;

 //wrapped in reuseable async method to create a user with email and password
  Future<UserCredential> createUserWithEmailAndPassword(String username, String password) async {

    String email = "${username.trim()}@melio.com"; // Assuming the username is the email address
    try {
       UserCredential userCredential = await _authService.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
    return userCredential;
    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        print('The password provided is too weak.');
      } else if (e.code == 'email-already-in-use') {
        print('That username is already taken.');
      }
      rethrow; // rethrow the exception to be handled by the caller
    } catch (e) {
      print(e);
      rethrow; // rethrow the exception to be handled by the caller
    }
  }
/* 
this snippet is a reference to the firebase documentation on how to 
sign in a user with email and passowrd.

try {
  final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
    email: emailAddress,
    password: password
  );
} on FirebaseAuthException catch (e) {
  if (e.code == 'user-not-found') {
    print('No user found for that email.');
  } else if (e.code == 'wrong-password') {
    print('Wrong password provided for that user.');
  }
} */

  Future<UserCredential> loginWithEmailAndPassword(String username, String password) async {
    String email = "${username.trim()}@melio.com"; // Assuming the username is the email address
    try {
      UserCredential userCredential = await _authService.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential;
    } on FirebaseAuthException catch (e) {
      if (e.code == 'user-not-found') {
        print('No account found for that username.');
      } else if (e.code == 'wrong-password') {
        print('Wrong password provided for that user.');
      }
      rethrow; // rethrow the exception to be handled by the caller
    } catch (e) {
      print(e);
      rethrow; // rethrow the exception to be handled by the caller
    }
  }
}