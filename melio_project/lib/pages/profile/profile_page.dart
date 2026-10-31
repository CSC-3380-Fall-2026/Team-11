import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:firebase_auth/firebase_auth.dart";
import "package:cloud_firestore/cloud_firestore.dart";


class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

 
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    const double avatarRadius = 100;

    final currentUser = FirebaseAuth.instance.currentUser;

    if(currentUser == null){
      return Scaffold(
        appBar: AppBar(
          title: const Text("Profile")
        ),
        body: const Center(
          child: Text("No user is currently logged in.")
        ),
      );
    }

    return FutureBuilder<DocumentSnapshot<Map<String, dynamic>>>(
      future: FirebaseFirestore.instance
        .collection('users')
        .doc(currentUser.uid)
        .get(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting){
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final data = snapshot.data?.data() ?? {};
        final String name = data ['fullName'] ?? currentUser.displayName ?? "No Name";
        final String rawUsername = data['username'] ?? "username";
        final String username = rawUsername.startsWith('@') ? rawUsername : '@$rawUsername';
        final String? photoUrl = data['photoUrl'] ?? currentUser.photoURL;
    
    
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
  },
  );
}
}
