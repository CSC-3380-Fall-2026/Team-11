import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";

class UploadButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const UploadButton({super.key, required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        gradient: const LinearGradient(
          colors: [Color(0xFFC5E7DB), Color(0xFFB5DEFF)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(25),
          onTap: onPressed,
          child: Center(
            child: Text(
              text,
              style: GoogleFonts.inter(
                color: Colors.black,
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
