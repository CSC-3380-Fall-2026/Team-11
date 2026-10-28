import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "components/workout_tab.dart";
import "components/nutrition_tab.dart";

class AddDataPage extends StatelessWidget {
  const AddDataPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: Text(
            "New Entry",
            style: GoogleFonts.inter(
              color: Colors.black,
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
          backgroundColor: Colors.white,
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.black),
          bottom: TabBar(
            labelColor: Colors.black,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.black,
            labelStyle: GoogleFonts.inter(fontWeight: FontWeight.w800),
            tabs: const [
              Tab(text: "Workout"),
              Tab(text: "Nutrition"),
            ],
          ),
        ),
        body: const TabBarView(
          physics: NeverScrollableScrollPhysics(),
          children: [WorkoutTab(), NutritionTab()],
        ),
      ),
    );
  }
}
