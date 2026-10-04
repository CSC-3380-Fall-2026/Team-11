import "components/password_textbox.dart";
import "components/username_textbox.dart";
import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:firebase_auth/firebase_auth.dart";
import '../services/account_authentication.dart';

class CreateAccountPage extends StatelessWidget {

  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final AuthService _authService = AuthService();

  CreateAccountPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Create Account",
          style: GoogleFonts.inter(
            color: Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            UsernameTextbox(
              controller: usernameController,
              hintText: "Enter your username",
            ),
            const SizedBox(height: 20),
            PasswordTextbox(
              controller: passwordController,
              hintText: "Enter your password",
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () async {
                // Handle account creation logic here
                String username = usernameController.text;
                String password = passwordController.text;

                print("Username: $username, Password: $password");
                try {
                  UserCredential userCredential = 
                  await _authService.createUserWithEmailAndPassword
                  (username, password);
                
                  if (context.mounted && userCredential.user != null){
                    Navigator.pushReplacementNamed(context, '/home');
                }

                } on FirebaseAuthException catch (e) {

                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(e.message ?? "Account creation failed"),
                      )
                    );
                  }
                }
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                "Create Account",
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
