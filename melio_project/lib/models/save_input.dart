class SaveInput {
  int? primaryGoalIndex;
  String? currentWeight;
  String? targetWeight;
  String? calorieGoal;
  String? proteinTarget;
  String? activityLevel;

  SaveInput({
    this.primaryGoalIndex,
    this.currentWeight,
    this.targetWeight,
    this.calorieGoal,
    this.proteinTarget,
    this.activityLevel,
  });

  SaveInput copyWith({
    int? primaryGoalIndex,
    String? currentWeight,
    String? targetWeight,
    String? calorieGoal,
    String? proteinTarget,
    String? activityLevel,
  }) {
    return SaveInput(
      primaryGoalIndex: primaryGoalIndex ?? this.primaryGoalIndex,
      currentWeight: currentWeight ?? this.currentWeight,
      targetWeight: targetWeight ?? this.targetWeight,
      calorieGoal: calorieGoal ?? this.calorieGoal,
      proteinTarget: proteinTarget ?? this.proteinTarget,
      activityLevel: activityLevel ?? this.activityLevel,
    );
  }
}
