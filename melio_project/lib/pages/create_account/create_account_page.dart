import "package:melio_project/pages/access/components/gradient_box.dart";
import "components/fullname_textbox.dart";
import "components/email_textbox.dart";
import "components/password_textbox.dart";
import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:firebase_auth/firebase_auth.dart";
import '../services/account_authentication.dart';
import '../home/home_page.dart';
import '../create_account/primary_goal_page.dart';

class CreateAccountPage extends StatefulWidget {
  const CreateAccountPage({super.key});

  @override
  State<CreateAccountPage> createState() => _CreateAccountPageState();
}

class _CreateAccountPageState extends State<CreateAccountPage> {
  final TextEditingController fullNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final AuthService _authService = AuthService();

  @override
  void dispose() {
    fullNameController.dispose();
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
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(
                              Icons.arrow_back,
                              color: Color(0xFF8A95A3),
                            ),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            onPressed: () => Navigator.maybePop(context),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            "Create your account",
                            style: GoogleFonts.inter(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFF2D3142),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      const Text(
                        "Full Name",
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF8A95A3),
                        ),
                      ),
                      const SizedBox(height: 8),
                      FullNameTextbox(
                        controller: fullNameController,
                        hintText: "Mike Tiger",
                      ),
                      const SizedBox(height: 16),

                      const Text(
                        "Email",
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF8A95A3),
                        ),
                      ),
                      const SizedBox(height: 8),
                      EmailTextbox(
                        controller: emailController,
                        hintText: "mike@example.com",
                      ),
                      const SizedBox(height: 16),

                      const Text(
                        "Password",
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF8A95A3),
                        ),
                      ),
                      const SizedBox(height: 8),
                      PasswordTextbox(
                        controller: passwordController,
                        hintText: "At least 6 characters",
                      ),
                      const SizedBox(height: 20),

                      FilledButton(
                        onPressed: () async {
                          String fullName = fullNameController.text.trim();
                          String email = emailController.text.trim();
                          String password = passwordController.text.trim();

                          if (fullName.isEmpty ||
                              email.isEmpty ||
                              password.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text("Please fill in all fields"),
                              ),
                            );
                            return;
                          }

                          final namePattern = RegExp(r"^[A-Za-z'’]+$");
                          if (!namePattern.hasMatch(fullName)) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Name can contain letters and apostrophes only.',
                                ),
                              ),
                            );
                            return;
                          }

                          final emailPattern = RegExp(
                            r'^[^@\s]+@[^@\s]+\.[^@\s]+$',
                          );
                          if (!emailPattern.hasMatch(email)) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Enter a valid email.'),
                              ),
                            );
                            return;
                          }

                          try {
                            final UserCredential userCredential =
                                await _authService.createUser(
                                  fullName,
                                  password,
                                  email,
                                );

                            if (context.mounted &&
                                userCredential.user != null) {
                              Navigator.pushReplacementNamed(context, '/home');
                            }
                          } on FirebaseAuthException catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    e.message ?? "Account creation failed",
                                  ),
                                ),
                              );
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    "An unexpected error occured: $e",
                                  ),
                                ),
                              );
                            }
                          }
                        },
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFFE3E4EC),
                          minimumSize: const Size(double.infinity, 54),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Create Account",
                              style: GoogleFonts.inter(
                                color: const Color(0xFF8A95A8),
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(
                              Icons.arrow_forward,
                              color: Color(0xFF8A95A8),
                              size: 18,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 15),
                      Center(
                        child: Text(
                          "By creating an account you agree to our Terms & Privacy Policy.",
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: const Color(0xFF8C90AB),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const HomePage(),
                            ),
                          );
                        },
                        child: const Text("Go to Home"),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const PrimaryGoalPage(),
                            ),
                          );
                        },
                        child: const Text("To next step"),
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
