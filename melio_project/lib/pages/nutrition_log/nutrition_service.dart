import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'nutrition_model.dart';

class NutritionService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  String? get _uid => _auth.currentUser?.uid;

  // Helper to format any DateTime into 'YYYY-MM-DD'
  String _dateKey(DateTime date) {
    final y = date.year.toString();
    final m = date.month.toString().padLeft(2, '0');
    final d = date.day.toString().padLeft(2, '0');
    return "$y-$m-$d";
  }

  DocumentReference<Map<String, dynamic>>? _nutritionDoc([DateTime? date]) {
    if (_uid == null) return null;
    final dateString = _dateKey(date ?? DateTime.now());
    return _db
        .collection('users')
        .doc(_uid)
        .collection('daily_nutrition')
        .doc(dateString);
  }

  // 1. Listen to today's (or any date's) nutrition in real time
  Stream<DailyNutrition> streamDailyNutrition([DateTime? date]) {
    final docRef = _nutritionDoc(date);
    final dateString = _dateKey(date ?? DateTime.now());

    if (docRef == null) {
      return Stream.value(DailyNutrition(date: dateString));
    }

    return docRef.snapshots().map((snapshot) {
      if (!snapshot.exists || snapshot.data() == null) {
        return DailyNutrition(date: dateString);
      }
      return DailyNutrition.fromMap(dateString, snapshot.data()!);
    });
  }

  // 2. Add a meal (Breakfast, Lunch, Dinner, Snack)
  Future<void> addMeal(MealItem meal, [DateTime? date]) async {
    final docRef = _nutritionDoc(date);
    if (docRef == null) return;

    final docSnap = await docRef.get();

    if (!docSnap.exists) {
      // First meal of the day: create the document with default goals
      final newDay = DailyNutrition(
        date: _dateKey(date ?? DateTime.now()),
        meals: [meal],
      );
      await docRef.set(newDay.toMap());
    } else {
      // Append the new meal to the existing list
      await docRef.update({
        'meals': FieldValue.arrayUnion([meal.toMap()]),
      });
    }
  }

  // 3. Delete a meal by ID
  Future<void> deleteMeal(String mealId, [DateTime? date]) async {
    final docRef = _nutritionDoc(date);
    if (docRef == null) return;

    final docSnap = await docRef.get();
    if (!docSnap.exists) return;

    final daily = DailyNutrition.fromMap(
      _dateKey(date ?? DateTime.now()),
      docSnap.data(),
    );

    // Remove the meal matching mealId
    final updatedMeals = daily.meals.where((m) => m.id != mealId).toList();

    await docRef.update({
      'meals': updatedMeals.map((m) => m.toMap()).toList(),
    });
  }

  // 4. Update water intake (e.g. +250ml for a glass, or -250ml to undo)
  Future<void> updateWater(int deltaMl, [DateTime? date]) async {
    final docRef = _nutritionDoc(date);
    if (docRef == null) return;

    final docSnap = await docRef.get();

    if (!docSnap.exists) {
      final initialWater = deltaMl > 0 ? deltaMl : 0;
      final newDay = DailyNutrition(
        date: _dateKey(date ?? DateTime.now()),
        waterCurrentMl: initialWater,
      );
      await docRef.set(newDay.toMap());
    } else {
      final currentWater = (docSnap.data()?['waterCurrentMl'] as num?)?.toInt() ?? 0;
      final newTotal = (currentWater + deltaMl).clamp(0, 10000); // Prevent negative numbers

      await docRef.update({
        'waterCurrentMl': newTotal,
      });
    }
  }

  // 5. Update user's calorie or water goals
  Future<void> updateGoals({int? calorieGoal, int? waterGoalMl, DateTime? date}) async {
    final docRef = _nutritionDoc(date);
    if (docRef == null) return;

    final updates = <String, dynamic>{};
    if (calorieGoal != null) updates['calorieGoal'] = calorieGoal;
    if (waterGoalMl != null) updates['waterGoalMl'] = waterGoalMl;

    await docRef.set(updates, SetOptions(merge: true));
  }
}