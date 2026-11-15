import 'dart:async';
import 'package:flutter/material.dart';
import "package:melio_project/pages/workout_log/workout_model.dart";

//class tracks live workout session
class SetLog {
  int setNumber = 1;
  int reps = 10;
  double weight = 0.0;  
  bool isCompleted = false;


SetLog({
  this.setNumber = 1,
  this.reps = 10,
  this.weight = 0.0,
  this.isCompleted = false,
});
}

class ActiveWorkoutPage extends StatefulWidget {
  final WorkoutRoutine routine;

  const ActiveWorkoutPage({super.key, required this.routine});

  @override
  State<ActiveWorkoutPage> createState() => _ActiveWorkoutPageState();
}

class _ActiveWorkoutPageState extends State<ActiveWorkoutPage> {
  
  late Stopwatch stopwatch;
  late Timer timer;
  String _elapsedTimeString = "00:00";

  late List<List<SetLog>> _exerciseSets = [];

  @override
  void initState() {
    super.initState();

    //start stopwatch
    stopwatch = Stopwatch()..start();
    timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _elapsedTimeString = _formatDuration(stopwatch.elapsed);
        });
      }
    });


    _exerciseSets = widget.routine.exercises.map((exercise){
      return List.generate(exercise.sets, (index) {
        return SetLog(
          setNumber: index + 1,
          reps: exercise.reps,
          weight: exercise.weight ?? 0.0,
        );
      }); 
    }).toList();
  }

  @override
  void dispose() {
    timer?.cancel();
    stopwatch.stop();
    super.dispose();
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
      if (duration.inHours > 0) {
        return '${twoDigits(duration.inHours)}:$minutes:$seconds';
      } 
    return '$minutes:$seconds';
  }

  int get totalCompletedSets {
    int count = 0;
    for (var sets in _exerciseSets) {
      count += sets.where((set) => set.isCompleted).length;
    }
    return count;
  }

  int get totalPlannedSets {
    int count = 0;
    for (var sets in _exerciseSets) {
      count += sets.length;
    }
    return count;
  }

  void _finishWorkout(){
    stopwatch.stop();

    showDialog(
      context: context, 
      barrierDismissible: false,
      builder : (context) =>  AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.emoji_events, color: Colors.amber),
            SizedBox(width:8),
            Text("Workout Finished!"),
          ],
        ),
        content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Great job on finishing ${widget.routine.name}!"),
          const SizedBox(height: 16),
          Row(
            children: [
              const SizedBox (width: 6),
              Text("Total Time: $_elapsedTimeString",
                style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.check_circle_outline, size: 20, color: Colors.green),
              const SizedBox(width: 6),
              Text("Sets Completed: $totalCompletedSets/$totalPlannedSets",
              style: const TextStyle(fontWeight: FontWeight.bold)
              ),
            ],
          ),
        ],
      ), 
      actions : [
        TextButton(
          onPressed:(){
            Navigator.pop(context);//close dialog
            stopwatch.start();//resume stopwatch
          },
          child: const Text("Resume"),
        ),
        FilledButton(
          onPressed:() {
            Navigator.pop(context);//close dialog
            Navigator.pop(context);//close active workout screen
          },
          child: const Text("Save & Exit"),
        ),
      ],
    ),
    ); 
  }


@override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          children: [
            Text(widget.routine.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text(
              _elapsedTimeString,
              style: TextStyle(
                fontSize: 14,
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: FilledButton.tonal(
              onPressed: _finishWorkout,
              child: const Text("Finish"),
            ),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: widget.routine.exercises.length,
        itemBuilder: (context, exIndex) {
          final exercise = widget.routine.exercises[exIndex];
          final sets = _exerciseSets[exIndex];

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Exercise Title
                  Text(
                    exercise.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Table header
                  const Row(
                    children: [
                      SizedBox(width: 40, child: Text("SET", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 12))),
                      Expanded(child: Center(child: Text("WEIGHT", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 12)))),
                      Expanded(child: Center(child: Text("REPS", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 12)))),
                      SizedBox(width: 50, child: Center(child: Text("DONE", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 12)))),
                    ],
                  ),
                  const Divider(),

                  // List of sets for this exercise
                  ...sets.map((setLog) {
                    return Container(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      color: setLog.isCompleted
                          ? Colors.green.shade50
                          : Colors.transparent,
                      child: Row(
                        children: [
                          // Set number badge
                          SizedBox(
                            width: 40,
                            child: CircleAvatar(
                              radius: 12,
                              backgroundColor: setLog.isCompleted
                                  ? Colors.green
                                  : theme.colorScheme.surfaceContainerHighest,
                              child: Text(
                                "${setLog.setNumber}",
                                style: TextStyle(
                                  fontSize: 12,
                                  color: setLog.isCompleted
                                      ? Colors.white
                                      : theme.colorScheme.onSurfaceVariant,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),

                          // Weight entry
                          Expanded(
                            child: Center(
                              child: Text(
                                "${setLog.weight > 0 ? setLog.weight : '-'} lbs",
                                style: const TextStyle(fontWeight: FontWeight.w600),
                              ),
                            ),
                          ),

                          // Reps entry
                          Expanded(
                            child: Center(
                              child: Text(
                                "${setLog.reps}",
                                style: const TextStyle(fontWeight: FontWeight.w600),
                              ),
                            ),
                          ),

                          // Complete Checkbox Button
                          SizedBox(
                            width: 50,
                            child: IconButton(
                              icon: Icon(
                                setLog.isCompleted
                                    ? Icons.check_circle
                                    : Icons.check_circle_outline,
                                color: setLog.isCompleted ? Colors.green : Colors.grey,
                              ),
                              onPressed: () {
                                setState(() {
                                  setLog.isCompleted = !setLog.isCompleted;
                                });
                              },
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          );
        },
      ),
    );
  }  }