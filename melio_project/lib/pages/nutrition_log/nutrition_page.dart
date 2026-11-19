import 'package:flutter/material.dart';
import 'nutrition_model.dart';
import 'nutrition_service.dart';

class NutritionPage extends StatelessWidget {
  const NutritionPage({super.key});

  void _showAddMealSheet(BuildContext context, String defaultCategory) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => _AddMealBottomSheet(defaultCategory: defaultCategory),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Meals & Nutrition'),
        centerTitle: true,
      ),
      body: StreamBuilder<DailyNutrition>(
        stream: NutritionService().streamDailyNutrition(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final daily = snapshot.data ?? DailyNutrition(date: '');
          const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Summary Banner Card
              Card(
                elevation: 0,
                color: theme.colorScheme.primaryContainer.withValues(alpha: 0.4),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _SummaryItem(
                        title: 'Eaten',
                        value: '${daily.totalCalories}',
                        unit: 'kcal',
                      ),
                      _SummaryItem(
                        title: 'Remaining',
                        value: '${daily.remainingCalories > 0 ? daily.remainingCalories : 0}',
                        unit: 'kcal',
                      ),
                      _SummaryItem(
                        title: 'Protein',
                        value: '${daily.totalProtein.toStringAsFixed(0)}',
                        unit: 'g',
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Meal Sections: Breakfast, Lunch, Dinner, Snack
              ...categories.map((category) {
                final categoryMeals =
                    daily.meals.where((m) => m.mealType == category).toList();
                final categoryCalories =
                    categoryMeals.fold(0, (sum, m) => sum + m.calories);

                return Card(
                  elevation: 2,
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Category Header
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  category,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '$categoryCalories kcal',
                                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                                ),
                              ],
                            ),
                            IconButton(
                              onPressed: () => _showAddMealSheet(context, category),
                              icon: const Icon(Icons.add_circle_outline, color: Colors.blue),
                              tooltip: 'Add $category',
                            ),
                          ],
                        ),
                        if (categoryMeals.isNotEmpty) const Divider(),

                        // List of Meals in this category
                        if (categoryMeals.isEmpty)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: Text(
                              'No food logged yet. Tap + to add.',
                              style: TextStyle(color: Colors.grey[400], fontSize: 13),
                            ),
                          )
                        else
                          ...categoryMeals.map((meal) {
                            return ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text(
                                meal.name,
                                style: const TextStyle(fontWeight: FontWeight.w600),
                              ),
                              subtitle: Text(
                                '${meal.calories} kcal • P: ${meal.protein.toStringAsFixed(0)}g  C: ${meal.carbs.toStringAsFixed(0)}g  F: ${meal.fat.toStringAsFixed(0)}g',
                                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                              ),
                              trailing: IconButton(
                                icon: const Icon(Icons.delete_outline, size: 20, color: Colors.red),
                                onPressed: () async {
                                  await NutritionService().deleteMeal(meal.id);
                                },
                              ),
                            );
                          }),
                      ],
                    ),
                  ),
                );
              }),
            ],
          );
        },
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String title;
  final String value;
  final String unit;

  const _SummaryItem({
    required this.title,
    required this.value,
    required this.unit,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(title, style: TextStyle(color: Colors.grey[700], fontSize: 12)),
        const SizedBox(height: 4),
        Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text(
              value,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(width: 2),
            Text(unit, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ],
    );
  }
}

// Bottom Sheet Form to Log a Meal
class _AddMealBottomSheet extends StatefulWidget {
  final String defaultCategory;

  const _AddMealBottomSheet({required this.defaultCategory});

  @override
  State<_AddMealBottomSheet> createState() => _AddMealBottomSheetState();
}

class _AddMealBottomSheetState extends State<_AddMealBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _calController = TextEditingController();
  final _proteinController = TextEditingController();
  final _carbsController = TextEditingController();
  final _fatController = TextEditingController();
  late String _selectedCategory;

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.defaultCategory;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _calController.dispose();
    _proteinController.dispose();
    _carbsController.dispose();
    _fatController.dispose();
    super.dispose();
  }

  void _saveMeal() async {
    if (!_formKey.currentState!.validate()) return;

    final newMeal = MealItem(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameController.text.trim(),
      calories: int.tryParse(_calController.text.trim()) ?? 0,
      protein: double.tryParse(_proteinController.text.trim()) ?? 0.0,
      carbs: double.tryParse(_carbsController.text.trim()) ?? 0.0,
      fat: double.tryParse(_fatController.text.trim()) ?? 0.0,
      mealType: _selectedCategory,
    );

    await NutritionService().addMeal(newMeal);
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Log Food',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  DropdownButton<String>(
                    value: _selectedCategory,
                    items: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCategory = val);
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Food Name',
                  hintText: 'e.g. Oatmeal, Grilled Chicken',
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter food name' : null,
              ),
              const SizedBox(height: 12),

              TextFormField(
                controller: _calController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Calories (kcal)',
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Enter calories' : null,
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _proteinController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Protein (g)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      controller: _carbsController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Carbs (g)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      controller: _fatController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Fat (g)',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: FilledButton(
                  onPressed: _saveMeal,
                  child: const Text('Add to Log', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}