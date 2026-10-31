import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:melio_project/pages/chatbot/chatbot_theme.dart';
import 'package:melio_project/pages/profile/edit_profile_page.dart';

typedef T = ChatBotTheme;

const _dark = Color(0xFF2B2833);
const _muted = Color(0xFF7A7685);

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  // SWAP WITH DATABASE INFO
  final String name = "Placeholder"; // TODO: REPLACE WITH DATABASE NAME
  final String username =
      "@place_holder"; // TODO: REPLACE WITH DATABASE USERNAME
  final String? photoUrl = null; // TODO: REPLACE WITH DATABASE PHOTO

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData(
        scaffoldBackgroundColor: T.background,
        textTheme: GoogleFonts.josefinSansTextTheme().apply(
          bodyColor: _dark,
          displayColor: _dark,
        ),
      ),
      child: Scaffold(
        appBar: T.buildAppBar(
          title: 'Profile',
          actions: [IconButton(onPressed: () {}, icon: const Icon(Icons.tune))],
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
                      backgroundColor: T.mint,
                      backgroundImage: photoUrl != null
                          ? NetworkImage(photoUrl!)
                          : null,
                      child: photoUrl == null
                          ? const Icon(
                              Icons.person,
                              size: 42,
                              color: Colors.white,
                            )
                          : null,
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          color: const Color(0xFF81FD47),
                          shape: BoxShape.circle,
                          border: Border.all(color: T.background, width: 4),
                        ),
                      ),
                    ),
                  ],
                ),
                OutlinedButton.icon(
                  onPressed: () {
                    // Navigate to edit profile page
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const EditProfilePage(),
                      ),
                    );
                  },
                  icon: const Icon(Icons.edit_outlined, size: 14),
                  label: const Text('Edit profile'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: _dark,
                    side: const BorderSide(color: T.lavender, width: 1.5),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Name block
            Text(
              name,
              style: const TextStyle(
                fontSize: 38,
                fontWeight: FontWeight.w700,
                letterSpacing: -1,
              ),
            ),
            Text(username, style: const TextStyle(color: _muted)),
            const SizedBox(height: 10),
            const Row(
              children: [
                Icon(Icons.north_east, size: 12),
                SizedBox(width: 6),
                Text(
                  'MEMBER SINCE 2XXX',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
            // Bio
            const SizedBox(height: 20),
            Text(
              'Bio goes here...',
              style: const TextStyle(fontSize: 14, color: _muted),
            ),

            const Divider(height: 48),

            // Stats
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('My Stats', style: TextStyle(fontSize: 20)),
                Text('October ↗', style: TextStyle(fontSize: 12)),
              ],
            ),
            const SizedBox(height: 20),
            const IntrinsicHeight(
              child: Row(
                children: [
                  Expanded(child: Stat('150', '', 'Workouts')),
                  VerticalDivider(),
                  Expanded(child: Stat('10', ' weeks', 'Longest Streak')),
                  VerticalDivider(),
                  Expanded(child: Stat('2', ' hours', 'Avg Workout Time')),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Streak card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: T.lavender.withOpacity(0.2),
                border: Border.all(color: T.lavender),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.local_fire_department_outlined),
                  const SizedBox(width: 9),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Current Streak', style: TextStyle(fontSize: 14)),
                        Text(
                          'Showing up looks good on you.',
                          style: TextStyle(fontSize: 11, color: _muted),
                        ),
                      ],
                    ),
                  ),
                  for (var i = 0; i < 3; i++)
                    const Padding(
                      padding: EdgeInsets.only(left: 5),
                      child: CircleAvatar(
                        radius: 12,
                        backgroundColor: T.lavender,
                        child: Icon(Icons.check, size: 13, color: T.textLight),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Stat extends StatelessWidget {
  const Stat(this.value, this.unit, this.label, {super.key});
  final String value, unit, label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text.rich(
            TextSpan(
              text: value,
              style: const TextStyle(fontSize: 32, letterSpacing: -1),
              children: [
                TextSpan(
                  text: unit,
                  style: const TextStyle(fontSize: 12, letterSpacing: 0),
                ),
              ],
            ),
          ),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 11, color: _muted)),
        ],
      ),
    );
  }
}
