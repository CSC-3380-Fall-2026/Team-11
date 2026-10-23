import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:melio_project/pages/access/components/gradient_box.dart";
import "components/log_in_botton.dart";
import "components/create_account_button.dart";
import '../create_account/create_account_page.dart';
import "components/social_login_row.dart";
import "package:firebase_auth/firebase_auth.dart";
import '../services/account_authentication.dart';
import '../services/google_authentication.dart';

class LoginPage extends StatelessWidget {
  LoginPage({super.key}); //removed const

  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final AuthService _authService = AuthService();
  final GoogleAuthentication _googleAuth = GoogleAuthentication();

  void _Login(BuildContext context) async {
    String username = usernameController.text.trim();
    String password = passwordController.text.trim();

    if (username.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter both username and password'),
        ),
      );
      return;
    }

    try {
      UserCredential userCredential = await _authService
          .loginWithEmailAndPassword(username, password);

      if (context.mounted && userCredential.user != null) {
        Navigator.pushReplacementNamed(context, '/home');
      }
    } on FirebaseAuthException catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Login failed: ${e.message}')));
      }
    }
  }

  Future<void> _loginWithGoogle(BuildContext context) async {
    final messenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);

    try {
      final User? user = await _googleAuth.signInWithGoogle();

      if (!context.mounted) return;

      if (user == null) {
        messenger.showSnackBar(
          const SnackBar(content: Text('Google sign-in was cancelled')),
        );
        return;
      }

      messenger.showSnackBar(
        const SnackBar(content: Text('Connected successfully')),
      );
      navigator.pushReplacementNamed('/home');
    } catch (e) {
      if (!context.mounted) return;
      messenger.showSnackBar(
        SnackBar(content: Text('Google login failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const GradientBox(
                logoLetter: 'M',
                subtext: "Your personal wellness companion",
                headerText: "Melio",
              ),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 28.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 20),

                    Text(
                      'Get started',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 30,
                        fontWeight: FontWeight.w800,
                        color: Colors.black,
                      ),
                    ),

                    const SizedBox(height: 10),

                    CreateAccountButton(
                      text: 'Create An Account',
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CreateAccountPage(),
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 12),

                    LogInBotton(
                      text: 'Log In',
                      onPressed: () => _Login(context),
                    ),

                    const SizedBox(height: 24),

                    Row(
                      children: [
                        const Expanded(
                          child: Divider(color: Colors.black, thickness: 3),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Text(
                            'or continue with',
                            style: GoogleFonts.inter(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Colors.black,
                            ),
                          ),
                        ),
                        const Expanded(
                          child: Divider(color: Colors.black, thickness: 3),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    SocialLoginRow(
                      assetPath: 'assets/images/google_logo.svg',
                      signInText: 'Sign in with Google',
                      onPressed: () => _loginWithGoogle(context),
                    ),

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
