import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'workout_model.dart';

class WorkoutService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  String? get _uid => _auth.currentUser?.uid;

  CollectionReference<Map<String, dynamic>>? get _workoutRef {
    if (_uid == null) return null;
    return _db.collection('users').doc(_uid).collection('workouts');
  }

  //listen to workout routines in real time
  //updates workout routines live
  Stream<List<WorkoutRoutine>> getWorkoutsStream() {
    if (_workoutRef == null) {
      return Stream.value([]);
    }

    return _workoutRef!.snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => WorkoutRoutine.fromMap(doc.id, doc.data()))
          .toList();
    });
  }

  // Save a new or edited workout routine
  Future<void> saveWorkout(WorkoutRoutine routine) async {
    if (_workoutRef == null) return;

    if (routine.id == null) {
      // Create new
      await _workoutRef!.add(routine.toMap());
    } else {
      // Edit existing
      await _workoutRef!
          .doc(routine.id)
          .set(routine.toMap(), SetOptions(merge: true));
    }
  }

  // Delete a workout routine
  Future<void> deleteWorkout(String workoutId) async {
    if (_workoutRef == null) return;
    await _workoutRef!.doc(workoutId).delete();
  }

  //Get today's workouts
  Stream<WorkoutRoutine?> getTodaysWorkout() {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    final String todayName = daysOfWeek[DateTime.now().weekday - 1];

    return getWorkoutsStream().map((routines) {
      try {
        return routines.firstWhere(
          (routine) => routine.scheduledDays.any(
            (day) => day.trim().toLowerCase() == todayName.toLowerCase(),
          ),
        );
      } catch (_) {
        return null; // No workout found for today
      }
    });
  }

  //Checks if any scheduled workout was missed since the last completed workout.
  //If a scheduled day was skipped, it returns 0.
  Future<int> getVerifiedStreak() async {
    if (_uid == null) return 0;

    final userRef = _db.collection('users').doc(_uid);
    final userSnap = await userRef.get();
    final userData = userSnap.data() ?? {};

    final int currentStreak = (userData['currentStreak'] as num?)?.toInt() ?? 0;
    final String? lastDateStr = userData['lastCompletedDate'] as String?;

    if (currentStreak == 0 || lastDateStr == null) return 0;

    // Gather all scheduled days across all routines
    final workoutsSnap = await _workoutRef?.get();
    final Set<String> scheduledDays = {};
    if (workoutsSnap != null) {
      for (var doc in workoutsSnap.docs) {
        final days = List<String>.from(doc.data()['scheduledDays'] ?? []);
        scheduledDays.addAll(days);
      }
    }

    if (scheduledDays.isEmpty) return currentStreak;

    const weekdayNames = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final parts = lastDateStr.split('-');
    final lastDate = DateTime(
      int.parse(parts[0]),
      int.parse(parts[1]),
      int.parse(parts[2]),
    );

    // Check every day between the last workout and yesterday
    // If ANY scheduled day was skipped, the streak is broken (0)!
    int daysDifference = today.difference(lastDate).inDays;
    for (int i = 1; i < daysDifference; i++) {
      final missedDate = lastDate.add(Duration(days: i));
      final missedDayName = weekdayNames[missedDate.weekday - 1];

      if (scheduledDays.contains(missedDayName)) {
        // Missed a scheduled workout! Reset streak to 0 in Firestore
        await userRef.update({'currentStreak': 0});
        return 0;
      }
    }

    return currentStreak;
  }

  //called when they complete a workout session
  Future<void> recordWorkoutCompletion() async {
    if (_uid == null) return;

    final userRef = _db.collection('users').doc(_uid);
    final userSnap = await userRef.get();
    final userData = userSnap.data() ?? {};

    final int longestStreak = (userData['longestStreak'] as num?)?.toInt() ?? 0;
    final int totalWorkouts = (userData['totalWorkouts'] as num?)?.toInt() ?? 0;
    final String? lastDateStr = userData['lastCompletedDate'] as String?;

    final now = DateTime.now();
    final todayStr =
        "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";

    // Prevent double counting if they workout twice on the same day
    if (lastDateStr == todayStr) {
      await userRef.update({'totalWorkouts': totalWorkouts + 1});
      return;
    }

    // Check if their existing streak is still alive or already broken
    final int activeStreak = await getVerifiedStreak();

    // If streak was broken/0, it starts over at 1. Otherwise it increments (+1).
    final int newStreak = (activeStreak > 0) ? activeStreak + 1 : 1;
    final int newLongest = newStreak > longestStreak
        ? newStreak
        : longestStreak;

    await userRef.set({
      'currentStreak': newStreak,
      'longestStreak': newLongest,
      'totalWorkouts': totalWorkouts + 1,
      'lastCompletedDate': todayStr,
    }, SetOptions(merge: true));
  }
}
