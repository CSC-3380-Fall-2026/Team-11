import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'user_model.dart';

class AuthService {
  final FirebaseAuth _authService = FirebaseAuth.instance;
  final FirebaseFirestore _dataBase = FirebaseFirestore.instance;

  Future<UserCredential> createUser(
    String fullName, 
    String username, 
    String password, 
    String email) async {
    
    final cleanUsername = username.trim().toLowerCase(); // Normalize the username
    //check if the username is already taken
    final usernameDoc = 
        await _dataBase.collection('usernames').doc(cleanUsername).get();
    if (usernameDoc.exists) {
      throw FirebaseAuthException(
        code: 'username-already-in-use',
        message: 'That username is already taken.',
      );
    }    
    
    UserCredential userCredential; 
    
    try { userCredential = await _authService.createUserWithEmailAndPassword(
        email: email.trim(),
        password: password.trim(),
      );
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
  
    // Store user data in Firestore
    final uid =userCredential.user!.uid;

    WriteBatch batch = _dataBase.batch();

    DocumentReference userRef = _dataBase.collection('users').doc(uid);
    UserModel newUser = UserModel(
      uid: uid,
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      createdAt: DateTime.now(),
    );

    batch.set(userRef, newUser.toMap());

    DocumentReference usernameRef = _dataBase.collection('usernames').doc(username.trim());
    batch.set(usernameRef, {'uid': uid});

    await batch.commit();  

    return userCredential;  
  } 


  Future<UserCredential> loginWithEmailAndPassword(
    String email, 
    String password) async {
    try {
      return await _authService.signInWithEmailAndPassword(
        email: email.trim(),
        password: password.trim(),
      );
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