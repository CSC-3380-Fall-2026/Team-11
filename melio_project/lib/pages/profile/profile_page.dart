import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  // SWAP WITH DATABASE INFO
  final String name = "Placeholder"; // TODO: REPLACE WITH DATABASE NAME
  final String username =
      "@place_holder"; // TODO: REPLACE WITH DATABASE USERNAME
  final String? photoUrl = null; // TODO: REPLACE WITH DATABASE PHOTO

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    const double avatarRadius = 100;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Profile",
          style: GoogleFonts.roboto(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Stack(
        alignment: Alignment.topCenter,
        children: [
          // Styled background color block
          Container(
            width: double.infinity,
            height: screenHeight / 5,
            color: Colors.blueGrey,
          ),
          // Info
          Align(
            alignment: Alignment.topCenter,
            child: Padding(
              padding: const EdgeInsets.only(top: 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircleAvatar(
                    radius: avatarRadius,
                    backgroundColor: Colors.grey.shade300,
                    backgroundImage: photoUrl != null
                        ? NetworkImage(photoUrl!)
                        : null,
                    child: photoUrl == null
                        ? const Icon(
                            Icons.person,
                            size: avatarRadius,
                            color: Colors.white,
                          )
                        : null,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    username,
                    style: GoogleFonts.roboto(
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    name,
                    style: GoogleFonts.roboto(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
