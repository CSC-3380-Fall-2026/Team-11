import "package:melio_project/pages/access/components/gradient_box.dart";
import "package:melio_project/pages/create_account/components/email_textbox.dart";
import "package:melio_project/pages/create_account/components/password_textbox.dart";
import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:firebase_auth/firebase_auth.dart";
import "package:melio_project/pages/create_account/create_account_page.dart";
import "package:melio_project/pages/login_user/forgot_password_page.dart";
import '../services/account_authentication.dart';
import '../home/home_page.dart';

class LoginUserPage extends StatefulWidget {
  const LoginUserPage({super.key});

  @override
  State<LoginUserPage> createState() => _LoginUserPageState();
}

class _LoginUserPageState extends State<LoginUserPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final AuthService _authService = AuthService();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const GradientBox(
              logoLetter: "M",
              subtext: "Your personal wellness companion",
              headerText: "Melio",
            ),

            Expanded(
              child: Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(30),
                    topRight: Radius.circular(30),
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24.0,
                    vertical: 16.0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      const SizedBox(height: 10),

                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(
                              Icons.arrow_back,
                              color: Color(0xFF2D3142),
                            ),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            onPressed: () => Navigator.maybePop(context),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            "Welcome back",
                            style: GoogleFonts.inter(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFF2D3142),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 20),

                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Email",
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF4E4B66),
                            ),
                          ),
                          const SizedBox(height: 6),
                          EmailTextbox(
                            controller: emailController,
                            hintText: "mike@example.com",
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Password",
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF4E4B66),
                            ),
                          ),
                          const SizedBox(height: 6),
                          PasswordTextbox(
                            controller: passwordController,
                            hintText: "Your password",
                          ),
                          const SizedBox(height: 12),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => const ForgotPasswordPage()),
                                );
                              },
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: Text(
                                "Forgot password?",
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF4E8D79),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 18),
                        ],
                      ),

                      FilledButton(
                        onPressed: () async {
                          String email = emailController.text.trim();
                          String password = passwordController.text.trim();

                          if (email.isEmpty || password.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text("Please fill in all fields"),
                              ),
                            );
                            return;
                          }

                          try {
                            UserCredential userCredential = await _authService
                                .loginWithEmailAndPassword(email, password);

                            if (context.mounted &&
                                userCredential.user != null) {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const HomePage(),
                                ),
                              );
                            }
                          } on FirebaseAuthException catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(e.message ?? "Login failed"),
                                ),
                              );
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    "An unexpected error occurred: $e",
                                  ),
                                ),
                              );
                            }
                          }
                        },
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFF2D3142),
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Log In",
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(
                              Icons.arrow_forward,
                              color: Colors.white,
                              size: 18,
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 16),

                      Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Don't have an account? ",
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                color: const Color(0xFF8C90AB),
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        const CreateAccountPage(),
                                  ),
                                );
                              },
                              child: Text(
                                "Sign up",
                                style: GoogleFonts.inter(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF4E8D79),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
