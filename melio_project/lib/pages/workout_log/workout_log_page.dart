import 'package:flutter/material.dart';
import 'workout_model.dart';
import 'workout_service.dart';
//import 'create_routine_page.dart';

class WorkoutLogPage extends StatelessWidget {
  const WorkoutLogPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Workouts'),
        centerTitle: true,
      ),
      // The "+ New Routine" button that opens your creator screen
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          //Navigator.push(
            //context,
            //MaterialPageRoute(builder: (context) => const CreateRoutinePage()),
          //);
        },
        icon: const Icon(Icons.add),
        label: const Text('New Routine'),
      ),
      body: StreamBuilder<List<WorkoutRoutine>>(
        stream: WorkoutService().getWorkoutsStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final routines = snapshot.data ?? [];

          // If the user hasn't created any routines yet
          if (routines.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.fitness_center_outlined,
                      size: 80,
                      color: Colors.grey[400],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No Routines Yet',
                      style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Create your first workout routine by tapping the button below!',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            );
          }

          // List of saved workout routines
          return ListView.builder(
            padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 80),
            itemCount: routines.length,
            itemBuilder: (context, index) {
              final routine = routines[index];

              return Card(
                elevation: 2,
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  leading: CircleAvatar(
                    backgroundColor: theme.colorScheme.primaryContainer,
                    child: Icon(Icons.fitness_center, color: theme.colorScheme.onPrimaryContainer),
                  ),
                  title: Text(
                    routine.name,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Text(
                        '${routine.exercises.length} exercises',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 8),
                      // Badges for scheduled days
                      Wrap(
                        spacing: 4,
                        children: routine.scheduledDays.map((day) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.surfaceVariant,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              day.substring(0, 3), // e.g. Mon, Wed
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                  trailing: PopupMenuButton<String>(
                    onSelected: (value) async {
                      if (value == 'edit') {
                        // Open creator pre-filled with this routine's data
                        //Navigator.push(
                          //context,
                          //MaterialPageRoute(
                            //builder: (context) => CreateRoutinePage(routine: routine),
                          //),
                        //);
                      } else if (value == 'delete') {
                        if (routine.id != null) {
                          await WorkoutService().deleteWorkout(routine.id!);
                        }
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit_outlined, size: 20),
                            SizedBox(width: 8),
                            Text('Edit'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete_outline, size: 20, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}