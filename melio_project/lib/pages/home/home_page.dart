import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:melio_project/pages/chatbot/chatbot_page.dart";
import "package:melio_project/pages/add_data/add_data_page.dart";
import "package:melio_project/pages/calendar/calendar_page.dart";
import "package:melio_project/pages/profile/profile_page.dart";
import "package:melio_project/pages/workout_log/workout_log_page.dart";

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "Home",
          style: GoogleFonts.inter(
            fontSize: 30,
            fontWeight: FontWeight.w800,
            color: Colors.black,
          ),
        ),
      ),

      //wrapping body in a stack to float widgets over content
      body: Stack(
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 50.0, vertical: 150.0),
            child: Center(child: Text("Home Content")),
          ),
          Positioned(
            bottom: 20,
            right: 20,
            child: Container(
              width: 55,
              height: 55,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [Color(0xFFC5E7DB), Color(0xFFB5DEFF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  customBorder: const CircleBorder(),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const ChatbotPage(),
                      ),
                    );
                  },
                  child: const Icon(
                    Icons.smart_toy_outlined,
                    color: Colors.black87,
                    size: 28,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),

      floatingActionButton: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 4),
          gradient: const LinearGradient(
            colors: [Color(0xFFC5E7DB), Color(0xFFB5DEFF)],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
        ),

        child: Material(
          color: Colors.transparent,
          child: InkWell(
            customBorder: const CircleBorder(),
            child: const Icon(Icons.add, size: 40, color: Colors.black),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AddDataPage()),
              );
            },
          ),
        ),
      ),

      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,

      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFC5E7DB), Color(0xFFB5DEFF)],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
        ),
        child: BottomAppBar(
          height: 60,
          color: Colors.transparent,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                icon: const Icon(Icons.calendar_today_outlined),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const CalendarPage(),
                    ),
                  );
                },
              ),
              IconButton(icon: const Icon(Icons.more_horiz), onPressed: () {}),
              IconButton(icon: const Icon(Icons.more_horiz), onPressed: () {}),
              IconButton(icon: const Icon(Icons.fitness_center_rounded), onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const
                  WorkoutLogPage()),
                );
              }),
              
              const SizedBox(width: 140), // space for the plus button
              IconButton(icon: const Icon(Icons.more_horiz), onPressed: () {}),
              IconButton(
                icon: const Icon(Icons.account_circle),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ProfilePage(),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
