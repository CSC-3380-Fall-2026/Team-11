import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

class SocialLoginRow extends StatelessWidget {
  final String assetPath;
  final String signInText;
  final VoidCallback onPressed;

  const SocialLoginRow({
    super.key,
    required this.assetPath,
    required this.signInText,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: Colors.black, width: 1.50),
          shape: const StadiumBorder(),
          backgroundColor: Colors.white,
          elevation: 0,
        ),

        onPressed: onPressed,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(assetPath, height: 24, width: 24),
            const SizedBox(width: 12),
            Text(
              signInText,
              style: GoogleFonts.inter(
                color: Colors.black87,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
