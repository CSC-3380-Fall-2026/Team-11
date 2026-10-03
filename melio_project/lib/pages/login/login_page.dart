import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:melio_project/pages/login/components/log_in_botton.dart";
import "components/create_account_button.dart";

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
              
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.33,
              ),
            
              Text('Get started',
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
               onPressed: () {},
              ),

              const SizedBox(height: 12),

              LogInBotton(
                text: 'Log In',
                onPressed: () {},
              ),

              const Spacer(flex: 5), 
            ],
          ),
        ),
      ),
    );
  }
}
