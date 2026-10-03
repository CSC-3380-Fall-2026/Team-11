import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "components/log_in_botton.dart";
import "components/create_account_button.dart";
import '../create_account/create_account_page.dart';
import "components/social_login_row.dart";

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(height: MediaQuery.of(context).size.height * 0.34),

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

              LogInBotton(text: 'Log In', onPressed: () {}),

              const SizedBox(height: 24),

              Row(children: [
                const Expanded(
                  child: Divider(
                    color: Colors.black,
                    thickness: 3,
                  ),
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
                  child: Divider(
                    color: Colors.black,
                    thickness: 3, 
                 ),
                ),
               ],
              ),

              const SizedBox(height: 16),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SocialLoginRow(
                    assetPath: 'assets/images/google_logo.svg',
                    onTap: () {},
                  ),

                  const SizedBox(width: 16),

                  SocialLoginRow(
                    assetPath: 'assets/images/apple_logo.svg',
                     onTap: () {}
                  ),
                ],
              ),

              const Spacer(flex: 2),
            ],
          ),
        ),
      ),
    );
  }
}
