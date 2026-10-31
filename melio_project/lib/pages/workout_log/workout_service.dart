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
  Stream<List<WorkoutRoutine>> getWorkoutsStream(){
    if (_workoutRef == null)
    return Stream.value([]);

    return _workoutRef!.snapshots().map((snapshot){
      return snapshot.docs.map((doc) => WorkoutRoutine.fromMap(doc.id, doc.data())).toList();
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
      await _workoutRef!.doc(routine.id).set(routine.toMap(), SetOptions(merge: true));
    }
  }

  // Delete a workout routine
  Future<void> deleteWorkout(String workoutId) async {
    if (_workoutRef == null) return;
    await _workoutRef!.doc(workoutId).delete();
  }
}