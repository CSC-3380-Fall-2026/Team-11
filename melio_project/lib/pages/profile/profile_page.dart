import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:firebase_auth/firebase_auth.dart";
import "package:cloud_firestore/cloud_firestore.dart";
import "package:melio_project/pages/chatbot/chatbot_theme.dart";
import "package:melio_project/pages/profile/settings_page.dart";
import "package:melio_project/pages/profile/edit_profile_page.dart";
import "package:melio_project/pages/workout_log/workout_service.dart";

typedef T = ChatBotTheme;

const _dark = Color(0xFF2B2833);
const _muted = Color(0xFF7A7685);

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  void initState() {
    super.initState();
    //checks for missed workouts to update streak
    WorkoutService().getVerifiedStreak();
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = FirebaseAuth.instance.currentUser;

    if (currentUser == null) {
      return Scaffold(
        appBar: AppBar(title: const Text("Profile")),
        body: const Center(child: Text("No user is currently logged in.")),
      );
    }

    //calculate member since year 
    final creationDate = currentUser.metadata.creationTime ?? DateTime.now();
    const monthsUpper = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 
    'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    final memberSince = '${monthsUpper[creationDate.month -1]} ${creationDate.year}';

    const monthsTitle = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 
    'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    final currentMonthName = monthsTitle[DateTime.now().month - 1];    

    //streambuilder keeps profile updated in realtime
    return StreamBuilder<DocumentSnapshot<Map<String, dynamic>>>(
      stream: FirebaseFirestore.instance
          .collection('users')
          .doc(currentUser.uid)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final data = snapshot.data?.data() ?? {};

        //profile info
        final String name =
            data['fullName'] ?? currentUser.displayName ?? "No Name";
        final String rawUsername = data['username'] ?? "username";
        final String username = rawUsername.startsWith('@')
            ? rawUsername
            : '@$rawUsername';
        final String? photoUrl = data['photoUrl'] ?? currentUser.photoURL;
        final String bio = data['bio'] ?? "No bio yet. Tap 'Edit Profile' to add one!";

        //real stats
        final String totalWorkouts = (data['totalWorkouts'] ?? 0).toString();
        final String longestStreak = (data['longestStreak'] ?? 0).toString();
        final String avgWorkoutTime = (data['avgWorkoutTime'] ?? 0).toString();
        final int currentStreak = (data['currentStreak'] as num?)?.toInt() ?? 0;

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
              title: "Profile",
              actions: [
                IconButton(
                  icon: const Icon(Icons.settings_outlined),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SettingsPage()),
                    );
                  },
                ),
              ],
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
                              ? NetworkImage(photoUrl)
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
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => EditProfilePage(
                              currentName: name,
                              currentUsername : rawUsername,
                              currentBio : data['bio'] ?? '',
                            ),
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
                Row(
                  children: [
                    Icon(Icons.north_east, size: 12),
                    SizedBox(width: 6),
                    Text(
                      'MEMBER SINCE $memberSince',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),

                // Dynamic Bio
                const SizedBox(height: 20),
                Text(
                 bio,
                  style: TextStyle(fontSize: 14, color: _muted),
                ),

                const Divider(height: 48),

                // Stats
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('My Stats', style: TextStyle(fontSize: 20)),
                    Text('$currentMonthName ↗', style: TextStyle(fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 20),
                IntrinsicHeight(
                  child: Row(
                    children: [
                      Expanded(child: Stat(totalWorkouts, '', 'Workouts')),
                      VerticalDivider(),
                      Expanded(child: Stat(longestStreak, ' weeks', 'Longest Streak')),
                      VerticalDivider(),
                      Expanded(child: Stat(avgWorkoutTime, ' hours', 'Avg Workout Time')),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Streak card
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: T.lavender.withValues(alpha: 0.2),
                    border: Border.all(color: T.lavender),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.local_fire_department_outlined),
                      const SizedBox(width: 9),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              currentStreak > 0 
                                ? 'Showing up looks good on you.'
                                : 'Missed a workout! Complete your next session to start a streak.',
                              style: const TextStyle(fontSize: 11, color: _muted),
                            ),
                          ],
                        ),
                      ),

                      
                      if (currentStreak > 0)
                        for (var i = 0; i < 3; i++)
                          const Padding(
                            padding: EdgeInsets.only(left: 5),
                            child: CircleAvatar(
                              radius: 12,
                              backgroundColor: T.lavender,
                              child: Icon(
                                Icons.check,
                                size: 13,
                                color: T.textLight,
                              ),
                            ),
                          )
                        else 
                          const Padding(
                            padding: EdgeInsets.only(left: 4),
                            child: Text(
                              "0 days",
                              style: TextStyle( 
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _muted,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
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
