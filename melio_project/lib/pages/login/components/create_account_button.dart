import 'package:flutter/material.dart';
import "package:google_fonts/google_fonts.dart";


class CreateAccountButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const CreateAccountButton({
    super.key,
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width:double.infinity,
      height: 60,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xFFC5E7DB),
            Color(0xFFB5DEFF),
            ],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(25),
      ),
      child: FilledButton(
        onPressed: onPressed,
        style: FilledButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadiusGeometry.circular(25),
          ),
        ),
        child: Text(
          text,
          style: GoogleFonts.inter(
            color: Colors.black,
            fontSize: 25,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}