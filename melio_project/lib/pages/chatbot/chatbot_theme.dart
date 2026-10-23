import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:math' as math;

class ChatBotTheme {

  //colors  
  static const Color background = Color (0xFFFCF8FC);
  static const Color mint = Color(0xFFC5E7DB);
  static const Color skyBlue = Color(0xFFB5DEFF);
  static const Color lavender = Color(0xFFC9B6E4);

  static const Color textLight = Colors.white;
  static const Color userTextBox = skyBlue;
  static const Color chatbotTextBox = lavender;
  
  static TextTheme melioTextTheme = TextTheme (
    displayLarge: GoogleFonts.josefinSans(
      fontSize: 22.0,
      fontWeight: FontWeight.bold,
      color: textLight),
    bodyLarge: GoogleFonts.josefinSans(
      fontSize: 15.0,
      fontWeight: FontWeight.w600,
      color: textLight),
    );
  
  //AppBar Gradient 
  static const LinearGradient appBarGradient = LinearGradient(
    colors: [mint, skyBlue, lavender], 
    begin: Alignment(-1.0, 0.0),
    end: Alignment(1.0, 0.0),
    transform: GradientRotation(math.pi / 4),
  );

  
  static BoxDecoration bubbleDecoration ({required bool isUser}) {
    return BoxDecoration(
      color: isUser ? userTextBox : chatbotTextBox,
      borderRadius: BorderRadius.only (
        topLeft: const Radius.circular(20.0),
        topRight: const Radius.circular(20.0),
        bottomLeft: Radius.circular( isUser? 20.0 : 4.0),
        bottomRight: Radius.circular(isUser ? 4.0 : 20.0),
      ),
    );
  }

  static AppBar buildAppBar({required String title, 
    List<Widget>? actions}){
      return AppBar(
        title: Text(
          title,
          style: melioTextTheme.titleLarge
          ),
        centerTitle:true,
        foregroundColor: textLight,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: actions,
        flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: appBarGradient,
        ),
      ),
    );
  }
}