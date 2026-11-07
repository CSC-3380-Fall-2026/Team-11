import "package:flutter/material.dart";
import "package:melio_project/pages/workout_log/workout_service.dart";
import "package:melio_project/pages/workout_log/workout_model.dart";

const _textDark = Color(0xFF1E252D);
const _textMuted = Color(0xFF7A8699);
const _mintButton = Color(0xFFBBE5D4);
const _mintButtonText = Color(0xFF1B3D2F);
const _iconBg = Color(0xFFF0F8F5);

class TodaysWorkoutWidget extends StatelessWidget {

  final VoidCallback? onAddWorkout; 
  final VoidCallback? onSeeAll;
  final void Function(WorkoutRoutine routine)? onStartWorkout;

  const TodaysWorkoutWidget({
    super.key, 
    this.onAddWorkout, 
    this.onSeeAll, 
    this.onStartWorkout
  });

  @override
  Widget build(BuildContext context) {
    final workoutService = WorkoutService();
   
    return StreamBuilder<WorkoutRoutine?>(
      stream: workoutService.getTodaysWorkout(),
      builder: (context, snapshot){
        if (snapshot.connectionState == ConnectionState.waiting){
          return const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: CircularProgressIndicator(),
              ),
            );
          }

          final routine = snapshot.data;

          //rest day, no workouts scheduled for today
          if (routine == null){ 
            return Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 22),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  )
                ]
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: _iconBg,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.fitness_center_outlined, color: _mintButtonText),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Rest Day",
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w600,
                            color: _textDark,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "No workouts scheduled for today!",
                          style: TextStyle(color: _textMuted, fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                  if (onAddWorkout != null)
                    ElevatedButton(
                      onPressed: onAddWorkout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _mintButton,
                        elevation: 0,
                        shape: const StadiumBorder(),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 18, 
                          vertical: 8,
                        ),
                      ),
                      child: const Text(
                        "+ Add",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: _mintButtonText,
                        ),
                      ),
                    ),
                ],
              ),
            );
          }

          //Workouts exist for today, display them in a list
          final int exerciseCount = routine.exercises.length;
          //estimates 10 minutes per exercise, can be adjusted later
          final int estimatedMinutes = (exerciseCount * 10).clamp(20, 90);

          return Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
          child: Row(
            children: [
              // Icon container with soft rounded border
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: _iconBg,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(
                  child: Text(
                    "🏋️",
                    style: TextStyle(fontSize: 24),
                  ),
                ),
              ),
              const SizedBox(width: 14),

              // Title and details (No "Today's Workout" label)
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "TODAY'S WORKOUT",
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF5DBB93),
                        letterSpacing: 0.6,
                      ),
                    ),
                    const SizedBox(height: 2),
                    //workout name
                    Text(
                      routine.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                        color: _textDark,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      "$exerciseCount exercises • ~$estimatedMinutes min",
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: _textMuted,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 10),

              //mint button to start the workout 
              ElevatedButton(
                onPressed: () {
                  if (onStartWorkout != null) {
                    onStartWorkout!(routine);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _mintButton,
                  elevation: 0,
                  shadowColor: Colors.transparent,
                  shape: const StadiumBorder(),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 22,
                    vertical: 12,
                  ),
                ),
                child: const Text(
                  "Start",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: _mintButtonText,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}