import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:melio_project/pages/chatbot/chatbot_theme.dart';

class EditProfilePage extends StatelessWidget {
  const EditProfilePage({super.key});

  void _save() {
    // Save action
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData(
        scaffoldBackgroundColor: ChatBotTheme.background,
        textTheme: GoogleFonts.josefinSansTextTheme().apply(
          bodyColor: Colors.black,
          displayColor: Colors.black,
        ),
      ),
      child: Scaffold(
        appBar: ChatBotTheme.buildAppBar(
          title: 'Edit Profile',
          actions: [IconButton(onPressed: _save, icon: const Icon(Icons.save))],
        ),
        body: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            // Avatar + edit button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Stack(
                  children: [
                    CircleAvatar(
                      radius: 42,
                      backgroundColor: ChatBotTheme.mint,
                      child: const Icon(
                        Icons.person,
                        size: 42,
                        color: Colors.white,
                      ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: ChatBotTheme.skyBlue,
                        ),
                        child: const Padding(
                          padding: EdgeInsets.all(4.0),
                          child: Icon(
                            Icons.edit,
                            size: 16,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    // Change photo action
                  },
                  icon: const Icon(Icons.photo_camera),
                  label: const Text('Change Photo'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Name field
            const Text(
              'Edit Name',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 3),
            TextField(
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Bio field
            const Text(
              'Edit Bio',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 3),
            TextField(
              maxLines: 6,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
        // Save button pinned to the bottom
        bottomNavigationBar: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
            child: UploadButton(text: 'Save', onPressed: _save),
          ),
        ),
      ),
    );
  }
}

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
