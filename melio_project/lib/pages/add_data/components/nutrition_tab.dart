import "package:flutter/material.dart";
import "upload_button.dart";

class NutritionTab extends StatelessWidget {
  const NutritionTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // nutrition fields go here
          const Spacer(),
          UploadButton(text: "Upload Nutrition", onPressed: () {}),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
