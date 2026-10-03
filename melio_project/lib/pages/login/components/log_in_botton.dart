import 'package:flutter/material.dart';
import "package:google_fonts/google_fonts.dart";

class LogInBotton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const LogInBotton({
    super.key,
    required this.text,
    required this.onPressed,
  });


  @override
  Widget build(BuildContext context){
    return Container(
      width:double.infinity,
      height: 60,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        border: Border.all(
          color: const Color(0xFFC5E7DB),
          width: 3.0,
           ),
        ),
        child: OutlinedButton(
          onPressed: onPressed,
          style: OutlinedButton.styleFrom(
            side: BorderSide.none,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(25),
            ),
          ),
          child: Text(
            text,
            style: GoogleFonts.inter(
              color: const Color(0xFFC5E7DB),
              fontSize: 25,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      );
    }
  }


