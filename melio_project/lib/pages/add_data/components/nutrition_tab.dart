import "package:flutter/material.dart";
import "upload_button.dart";

class NutritionTab extends StatefulWidget {
  const NutritionTab({super.key});

  @override
  State<NutritionTab> createState() => _NutritionTabState();
}

class _NutritionTabState extends State<NutritionTab> {
  final descriptionController = TextEditingController();
  final caloriesController = TextEditingController();
  final proteinController = TextEditingController();
  final carbsController = TextEditingController();
  final fatsController = TextEditingController();
  String type = "Meal";
  String time = "Morning";
  bool manuallyEntered = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Expanded(
            child: ListView(
              children: [
                const Text(
                  "Time of day",
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8.0),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ["Morning", "Afternoon", "Evening", "Night"]
                        .map(
                          (o) => Padding(
                            padding: const EdgeInsets.only(right: 8.0),
                            child: ChoiceChip(
                              label: Text(o),
                              selected: time == o,
                              onSelected: (_) => setState(() => time = o),
                            ),
                          ),
                        )
                        .toList(),
                  ),
                ),
                const SizedBox(height: 16.0),
                const Text(
                  "Type",
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8.0),
                Wrap(
                  spacing: 8.0,
                  children: ["Meal", "Snack", "Drink"]
                      .map(
                        (o) => ChoiceChip(
                          label: Text(o),
                          selected: type == o,
                          onSelected: (_) => setState(() => type = o),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: 16.0),
                Text(
                  "Describe your ${type.toLowerCase()}",
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8.0),
                TextField(
                  controller: descriptionController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    hintText:
                        "e.g. 2 scrambled eggs, toast with butter, orange juice",
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16.0),
                const Text(
                  "Macros",
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8.0),
                Wrap(
                  spacing: 8.0,
                  children: [
                    ChoiceChip(
                      label: const Text("Estimate for me"),
                      selected: !manuallyEntered,
                      onSelected: (_) =>
                          setState(() => manuallyEntered = false),
                    ),
                    ChoiceChip(
                      label: const Text("Enter myself"),
                      selected: manuallyEntered,
                      onSelected: (_) => setState(() => manuallyEntered = true),
                    ),
                  ],
                ),
                const SizedBox(height: 16.0),
                if (!manuallyEntered)
                  OutlinedButton(
                    onPressed: () {
                      // TODO: send descriptionController.text to the chatbot
                      debugPrint("Estimate: ${descriptionController.text}");
                    },
                    child: const Text("Estimate Macros"),
                  ),
                if (manuallyEntered) ...[
                  TextField(
                    controller: caloriesController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: "Calories",
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  TextField(
                    controller: proteinController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: "Protein (g)",
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  TextField(
                    controller: carbsController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: "Carbs (g)",
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  TextField(
                    controller: fatsController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: "Fat (g)",
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ],
            ),
          ),
          UploadButton(text: "Upload Nutrition", onPressed: () {}),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
