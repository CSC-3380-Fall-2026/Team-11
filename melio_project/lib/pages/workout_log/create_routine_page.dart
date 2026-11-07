import 'package:flutter/material.dart';
import 'workout_model.dart';
import 'workout_service.dart';

class CreateRoutinePage extends StatefulWidget{
  final WorkoutRoutine? routine; //pass existing routine to edit, 
  // or null to create new

  const CreateRoutinePage({super.key, this.routine});

  @override
  State<CreateRoutinePage> createState() => 
    _CreateRoutinePageState();
}

class _CreateRoutinePageState extends State<CreateRoutinePage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late List<String> _selectedDays;
  late List<Exercise> _exercises;
  bool _isSaving = false;

  final List<String> _weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
    ];

      @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.routine?.name ?? '');
    _selectedDays = List.from(widget.routine?.scheduledDays ?? []);
    // If editing, load existing exercises; otherwise start with 1 blank exercise
    _exercises = widget.routine != null
        ? widget.routine!.exercises.map((e) => Exercise.fromMap(e.toMap())).toList()
        : [Exercise(name: '', sets: 3, reps: 10)];
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _addExercise() {
    setState(() {
      _exercises.add(Exercise(name: '', sets: 3, reps: 10));
    });
  }

  void _removeExercise(int index) {
    if (_exercises.length > 1) {
      setState(() {
        _exercises.removeAt(index);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must have at least one exercise.')),
      );
    }
  }

  Future<void> _saveRoutine() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedDays.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one day of the week.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    try {
      final newRoutine = WorkoutRoutine(
        id: widget.routine?.id,
        name: _nameController.text.trim(),
        scheduledDays: _selectedDays,
        exercises: _exercises,
      );

      await WorkoutService().saveWorkout(newRoutine);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Workout routine saved successfully!')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.routine == null ? 'New Routine' : 'Edit Routine'),
        actions: [
          _isSaving
              ? const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                )
              : IconButton(
                  icon: const Icon(Icons.check),
                  tooltip: 'Save Routine',
                  onPressed: _saveRoutine,
                ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            // Routine Name
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Routine Name',
                hintText: 'e.g. Push Day, Full Body, Upper Body',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.fitness_center),
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) {
                  return 'Please enter a routine name';
                }
                return null;
              },
            ),
            const SizedBox(height: 24),

            // Schedule Days Section
            Text(
              'Schedule Days',
              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              'Which days of the week do you want to perform this routine?',
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
            ),
            const SizedBox(height: 10),

            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: _weekdays.map((day) {
                final isSelected = _selectedDays.contains(day);
                return FilterChip(
                  label: Text(day.substring(0, 3)), // Shows Mon, Tue, etc.
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedDays.add(day);
                      } else {
                        _selectedDays.remove(day);
                      }
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 28),

            // Exercises Section Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Exercises (${_exercises.length})',
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                TextButton.icon(
                  onPressed: _addExercise,
                  icon: const Icon(Icons.add),
                  label: const Text('Add Exercise'),
                ),
              ],
            ),
            const Divider(),

            // Dynamic Exercise Cards
            ..._exercises.asMap().entries.map((entry) {
              final index = entry.key;
              final exercise = entry.value;

              return Card(
                elevation: 2,
                margin: const EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(14.0),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 12,
                            child: Text(
                              '${index + 1}',
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: TextFormField(
                              initialValue: exercise.name,
                              decoration: const InputDecoration(
                                labelText: 'Exercise Name',
                                hintText: 'e.g. Bench Press, Squats',
                                isDense: true,
                              ),
                              validator: (val) {
                                if (val == null || val.trim().isEmpty) {
                                  return 'Enter exercise name';
                                }
                                return null;
                              },
                              onChanged: (val) => exercise.name = val.trim(),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Colors.red),
                            tooltip: 'Delete exercise',
                            onPressed: () => _removeExercise(index),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          // Sets
                          Expanded(
                            child: TextFormField(
                              initialValue: exercise.sets.toString(),
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(
                                labelText: 'Sets',
                                isDense: true,
                                border: OutlineInputBorder(),
                              ),
                              onChanged: (val) => exercise.sets = int.tryParse(val) ?? 3,
                            ),
                          ),
                          const SizedBox(width: 10),

                          // Reps
                          Expanded(
                            child: TextFormField(
                              initialValue: exercise.reps.toString(),
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(
                                labelText: 'Reps',
                                isDense: true,
                                border: OutlineInputBorder(),
                              ),
                              onChanged: (val) => exercise.reps = int.tryParse(val) ?? 10,
                            ),
                          ),
                          const SizedBox(width: 10),

                          // Weight
                          Expanded(
                            child: TextFormField(
                              initialValue: exercise.weight?.toString() ?? '',
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(
                                labelText: 'Weight (lbs/kg)',
                                isDense: true,
                                border: OutlineInputBorder(),
                              ),
                              onChanged: (val) => exercise.weight = double.tryParse(val),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: 32),

            // Big Save Button at bottom
            SizedBox(
              width: double.infinity,
              height: 50,
              child: FilledButton.icon(
                onPressed: _isSaving ? null : _saveRoutine,
                icon: const Icon(Icons.save),
                label: Text(
                  _isSaving ? 'Saving...' : 'Save Routine',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}