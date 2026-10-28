import "package:flutter/material.dart";
import "upload_button.dart";

class WorkoutTab extends StatefulWidget {
  const WorkoutTab({super.key});

  @override
  State<WorkoutTab> createState() => _WorkoutTabState();
}

class _WorkoutTabState extends State<WorkoutTab> {
  String type = "Cardio";
  String time = "Morning";
  Set<String> activities = {}; // multi-select
  double hours = 0.5;
  String calories = "--"; // chatbot fills this in later

  final Map<String, List<String>> activityOptions = {
    "Cardio": ["Walking", "Running", "Inclined"],
    "Strength": ["Upper Body", "Lower Body", "Core"],
  };

  String get hoursText => hours % 1 == 0 ? "${hours.toInt()} hr" : "$hours hr";

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
                  "Time of Day",
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
                  "Workout Type",
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8.0),
                Wrap(
                  spacing: 8.0,
                  children: ["Cardio", "Strength"]
                      .map(
                        (o) => ChoiceChip(
                          label: Text(o),
                          selected: type == o,
                          onSelected: (_) => setState(() {
                            type = o;
                            activities.clear(); // reset when switching
                          }),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: 16.0),
                const Text(
                  "Select All Activities Performed",
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8.0),
                Wrap(
                  spacing: 8.0,
                  children: activityOptions[type]!
                      .map(
                        (o) => FilterChip(
                          label: Text(o),
                          selected: activities.contains(o),
                          onSelected: (selected) => setState(() {
                            if (selected) {
                              activities.add(o);
                            } else {
                              activities.remove(o);
                            }
                          }),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: 16.0),
                const Text(
                  "Workout Duration",
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      iconSize: 36,
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: hours > 0.5
                          ? () => setState(() => hours -= 0.5)
                          : null,
                    ),
                    SizedBox(
                      width: 90,
                      child: Text(
                        hoursText,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    IconButton(
                      iconSize: 36,
                      icon: const Icon(Icons.add_circle_outline),
                      onPressed: () => setState(() => hours += 0.5),
                    ),
                  ],
                ),
                const SizedBox(height: 16.0),
                OutlinedButton(
                  onPressed: () {
                    // TODO: send type, activities, and hours to the chatbot
                    debugPrint("Estimate: $type $activities for $hours hr");
                  },
                  child: const Text("Estimate Calories Burned"),
                ),
                const SizedBox(height: 12.0),
                Center(
                  child: Text(
                    "Calories burned: $calories",
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
          ),
          UploadButton(
            text: "Upload Workout",
            onPressed: () {
              debugPrint("$time, $type, $activities, $hours hr, $calories cal");
            },
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
