import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'user_model.dart';

class AuthService {
  final FirebaseAuth _authService = FirebaseAuth.instance;
  final FirebaseFirestore _dataBase = FirebaseFirestore.instance;

  Future<UserCredential> createUser(
    String fullName,
    String password,
    String email,
  ) async {
    UserCredential userCredential;

    try {
      userCredential = await _authService.createUserWithEmailAndPassword(
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
    final uid = userCredential.user!.uid;

    WriteBatch batch = _dataBase.batch();

    DocumentReference userRef = _dataBase.collection('users').doc(uid);
    UserModel newUser = UserModel(
      uid: uid,
      fullName: fullName.trim(),
      email: email.trim(),
      createdAt: DateTime.now(),
    );

    batch.set(userRef, newUser.toMap());

    await batch.commit();

    return userCredential;
  }

  Future<UserCredential> loginWithEmailAndPassword(
    String email,
    String password,
  ) async {
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

  Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _authService.sendPasswordResetEmail(
        email: email.trim(),
        actionCodeSettings: ActionCodeSettings(
          url: 'https://melioapp.page.link/reset-password',
          handleCodeInApp: true,
          androidPackageName: 'com.example.melio_project',
          iOSBundleId: 'com.example.melioProject',
        ),
      );
    } on FirebaseAuthException catch (e) {
      if (e.code == 'user-not-found') {
        print('No account found for that email address.');
      } else if (e.code == 'invalid-email') {
        print('The email address is improperly formatted.');
      }
      rethrow;
    } catch (e) {
      print(e);
      rethrow;
    }
  }

  Future<void> confirmPasswordReset({
    required String code,
    required String newPassword,
  }) async {
    try {
      await _authService.confirmPasswordReset(
        code: code,
        newPassword: newPassword.trim(),
      );
    } on FirebaseAuthException catch (e) {
      if (e.code == 'expired-action-code') {
        print('The reset link has expired.');
      } else if (e.code == 'invalid-action-code') {
        print('The reset code is invalid or already used.');
      }
      rethrow;
    } catch (e) {
      print(e);
      rethrow;
    }
  }
}
