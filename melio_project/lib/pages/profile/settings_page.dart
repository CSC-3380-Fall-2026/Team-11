import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:melio_project/pages/chatbot/chatbot_theme.dart';

const _dark = Color(0xFF2B2833);
const _muted = Color(0xFF7A7685);
const _divider = Color(0xFFF0A860); // orange divider lines from the mockup
const _cardColor = Color(0xFFE9E9E9);

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _darkMode = false;

  Future<void> _logout() async {
    await FirebaseAuth.instance.signOut();
    // TODO: navigate back to your login page
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final String name = user?.displayName ?? 'No Name';
    final String email = user?.email ?? '';
    final String? photoUrl = user?.photoURL;

    return Theme(
      data: ThemeData(
        scaffoldBackgroundColor: ChatBotTheme.background,
        textTheme: GoogleFonts.josefinSansTextTheme().apply(
          bodyColor: _dark,
          displayColor: _dark,
        ),
      ),
      child: Scaffold(
        appBar: ChatBotTheme.buildAppBar(title: 'Settings'),
        body: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            // Avatar + name + email
            Row(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: ChatBotTheme.mint,
                  backgroundImage: photoUrl != null
                      ? NetworkImage(photoUrl)
                      : null,
                  child: photoUrl == null
                      ? const Icon(Icons.person, size: 36, color: Colors.white)
                      : null,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if (email.isNotEmpty)
                        Text(
                          email,
                          style: const TextStyle(fontSize: 13, color: _muted),
                        ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Settings card
            Container(
              decoration: BoxDecoration(
                color: _cardColor,
                borderRadius: BorderRadius.circular(24),
              ),
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Column(
                children: [
                  _SettingsRow(
                    icon: Icons.notifications_none,
                    label: 'Notifications',
                    onTap: () {},
                  ),
                  const _RowDivider(),
                  _SettingsRow(
                    icon: Icons.location_on_outlined,
                    label: 'Location',
                    onTap: () {},
                  ),
                  const _RowDivider(),
                  _SettingsRow(
                    icon: Icons.brightness_6_outlined,
                    label: 'Appearance Mode',
                    trailing: Switch(
                      value: _darkMode,
                      activeColor: ChatBotTheme.lavender,
                      onChanged: (v) => setState(() => _darkMode = v),
                    ),
                    onTap: () => setState(() => _darkMode = !_darkMode),
                  ),
                  const _RowDivider(),
                  _SettingsRow(
                    icon: Icons.description_outlined,
                    label: 'Terms and Privacy',
                    onTap: () {},
                  ),
                  const _RowDivider(),
                  _SettingsRow(
                    icon: Icons.help_outline,
                    label: 'Support',
                    onTap: () {},
                  ),
                  const _RowDivider(),
                  _SettingsRow(
                    icon: Icons.info_outline,
                    label: 'About',
                    onTap: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Log out
            SizedBox(
              height: 50,
              child: OutlinedButton(
                onPressed: _logout,
                style: OutlinedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  side: const BorderSide(color: Colors.black),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                child: const Text(
                  'Log out',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsRow extends StatelessWidget {
  const _SettingsRow({
    required this.icon,
    required this.label,
    required this.onTap,
    this.trailing,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(icon, size: 28, color: _dark),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            if (trailing != null) trailing!,
          ],
        ),
      ),
    );
  }
}

class _RowDivider extends StatelessWidget {
  const _RowDivider();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 8),
      child: Divider(height: 1, thickness: 1, color: _divider),
    );
  }
}
