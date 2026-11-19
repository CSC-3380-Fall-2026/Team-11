class MealItem{
  String id;
  String name;
  int calories;
  double protein; //in grams
  double carbs; //in grams
  double fat; //in grams
  String mealType; //breakfast, lunch, dinner, snack
  DateTime timestamp;

  MealItem({
    required this.id,
    required this.name,
    required this.calories,
    this.protein = 0.0,
    this.carbs = 0.0,
    this.fat = 0.0,
    required this.mealType,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();


  Map<String, dynamic> toMap(){
    return {
      'id' : id,
      'name' : name,
      'calories' : calories, 
      'protein' : protein,
      'carbs' : carbs,
      'fat' : fat,
      'mealType' : mealType,
      'timestamp' : timestamp.toIso8601String(),
    };
  }

  factory MealItem.fromMap(Map<String, dynamic> map) {
    return MealItem(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      calories: (map['calories'] as num?)?.toInt() ?? 0,
      protein: (map['protein'] as num?)?.toDouble() ?? 0.0,
      carbs: (map['carbs'] as num?)?.toDouble() ?? 0.0,
      fat: (map['fat'] as num?)?.toDouble() ?? 0.0,
      mealType: map['mealType'] ?? 'Snack',
      timestamp: map['timestamp'] != null 
        ? DateTime.tryParse(map['timestamp']) ?? 
        DateTime.now() : DateTime.now(),
    );
  }
}

class DailyNutrition {
  String date; // Formatted 'YYYY-MM-DD'
  int calorieGoal;
  int waterCurrentMl;
  int waterGoalMl;
  List<MealItem> meals;

  DailyNutrition({
    required this.date,
    this.calorieGoal = 2000,
    this.waterCurrentMl = 0,
    this.waterGoalMl = 2500, // 2500 ml (~8-10 glasses)
    List<MealItem>? meals,
  }) : meals = meals ?? [];

  // Computed Totals for Today
  int get totalCalories => meals.fold(0, (sum, m) => sum + m.calories);
  double get totalProtein => meals.fold(0.0, (sum, m) => sum + m.protein);
  double get totalCarbs => meals.fold(0.0, (sum, m) => sum + m.carbs);
  double get totalFat => meals.fold(0.0, (sum, m) => sum + m.fat);

  // Remaining calories toward goal
  int get remainingCalories => calorieGoal - totalCalories;

  Map<String, dynamic> toMap() {
    return {
      'date': date,
      'calorieGoal': calorieGoal,
      'waterCurrentMl': waterCurrentMl,
      'waterGoalMl': waterGoalMl,
      'meals': meals.map((m) => m.toMap()).toList(),
    };
  }

  factory DailyNutrition.fromMap(String date, Map<String, dynamic>? map) {
    if (map == null) {
      return DailyNutrition(date: date);
    }

    final rawMeals = map['meals'] as List<dynamic>? ?? [];
    final parsedMeals = rawMeals
        .map((m) => MealItem.fromMap(m as Map<String, dynamic>))
        .toList();

    return DailyNutrition(
      date: date,
      calorieGoal: (map['calorieGoal'] as num?)?.toInt() ?? 2000,
      waterCurrentMl: (map['waterCurrentMl'] as num?)?.toInt() ?? 0,
      waterGoalMl: (map['waterGoalMl'] as num?)?.toInt() ?? 2500,
      meals: parsedMeals,
    );
  }
}