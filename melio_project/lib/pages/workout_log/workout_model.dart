class Exercise {
  String name;
  int sets;
  int reps;
  double? weight;

  Exercise({
    required this.name,
    this.sets = 3, //temp parameter
    this.reps = 10, //temp parameter
    this.weight,
  });

  Map<String, dynamic> toMap() {
    return {
      'name' : name,
      'sets' : sets,
      'reps' : reps,
      'weight': weight,
    };
  }

  factory Exercise.fromMap(Map<String, dynamic> map){
    return Exercise(
      name: map['name'] ?? '',
      sets: map['sets'] ?? 3,
      reps: map['reps'] ?? 10,
      weight: (map['weight'] as num?)?.toDouble(),
    );
  }
}

class WorkoutRoutine {
  String? id;
  String name;
  List<String> scheduledDays;
  List<Exercise> exercises;

  WorkoutRoutine({
    this.id,
    required this.name,
    required this.scheduledDays,
    required this.exercises,
  });

  Map<String, dynamic> toMap(){
    return {
      'name' : name,
      'scheduledDays' : scheduledDays,
      'exercises' : exercises.map((e) => e.toMap()).toList(),
      'updatedAt' : DateTime.now(),
    };
  }

  factory WorkoutRoutine.fromMap(String id, Map<String, dynamic> map){
    return WorkoutRoutine(
      id: id,
      name: map['name'] ?? '',
      scheduledDays: List<String>.from(map['scheduledDays']??[]),
      exercises: (map['exercises'] as List<dynamic>? ??[])
        .map((e) => Exercise.fromMap(e as Map <String, dynamic>))
        .toList(),
    );
  }
}