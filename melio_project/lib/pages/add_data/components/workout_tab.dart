import "package:flutter/material.dart";
import "upload_button.dart";

class WorkoutTab extends StatelessWidget {
  const WorkoutTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // workout fields go here
          const Spacer(),
          UploadButton(text: "Upload Workout", onPressed: () {}),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
