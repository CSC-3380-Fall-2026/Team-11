import 'package:flutter/material.dart';
import 'recipe_page.dart';
import 'recipe_url_manual.dart';

class RecipeDetailPage extends StatefulWidget {
  final Map<String, dynamic> recipe;

  const RecipeDetailPage({super.key, required this.recipe});

  @override
  State<RecipeDetailPage> createState() => _RecipeDetailPageState();
}

class _RecipeDetailPageState extends State<RecipeDetailPage> {
  late Map<String, dynamic> _r;
  bool _loading = false;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _r = Map<String, dynamic>.from(widget.recipe);
  }

  List<String> _list(String key) {
    final v = _r[key];
    if (v is List) return v.map((e) => e.toString()).toList();
    return [];
  }

  void _loadDetails() async {
    setState(() {
      _loading = true;
      _error = '';
    });
    try {
      final details = await RecipeService().refreshRecipeDetails(
        _r['id'],
        _r['recipeUrl'],
      );
      setState(() => _r.addAll(details));
    } catch (e) {
      setState(() => _error = 'Could not load this reicpe.');
    }
    if (mounted) setState(() => _loading = false);
  }

  Widget _sectionTitle(String text, Color color) {
    return Padding(
      padding: const EdgeInsets.only(top: 24, bottom: 10),
      child: Text(
        text.toUpperCase(),
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
          letterSpacing: 2,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ingredients = _list('ingredients');
    final steps = _list('steps');
    final tools = _list('tools');
    final time = (_r['prepTime'] ?? '').toString();
    final hasDetails = ingredients.isNotEmpty || steps.isNotEmpty;
    final hasUrl = (_r['recipeUrl'] ?? '').toString().isNotEmpty;

    return Scaffold(
      backgroundColor: cream,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: navy),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              (_r['title'] ?? 'Untitled').toString(),
              style: const TextStyle(
                color: navy,
                fontSize: 28,
                fontWeight: FontWeight.w800,
              ),
            ),
            if (time.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 10),
                child: Row(
                  children: [
                    const Icon(Icons.schedule, size: 16, color: green),
                    const SizedBox(width: 6),
                    Text(
                      time,
                      style: const TextStyle(
                        color: grey,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),

            if (!hasDetails) ...[
              const SizedBox(height: 30),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFFFDEBD9),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: [
                    const Text(
                      "We don't have the ingredients or steps for this recipe yet.",
                      style: TextStyle(color: navy),
                      textAlign: TextAlign.center,
                    ),
                    if (hasUrl) ...[
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: _loading ? null : _loadDetails,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: coral,
                          foregroundColor: Colors.white,
                        ),
                        child: _loading
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Text('Try to load recipe'),
                      ),
                    ],
                    if (_error.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          _error,
                          style: const TextStyle(color: Colors.red),
                        ),
                      ),
                  ],
                ),
              ),
            ],

            // ingredients
            if (ingredients.isNotEmpty) ...[
              _sectionTitle('Ingredients', coral),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: cardColors[0],
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: ingredients
                      .map(
                        (i) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 5),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Padding(
                                padding: EdgeInsets.only(top: 6, right: 10),
                                child: Icon(
                                  Icons.circle,
                                  size: 7,
                                  color: green,
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  i,
                                  style: const TextStyle(
                                    color: navy,
                                    fontSize: 15,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                      .toList(),
                ),
              ),
            ],

            // kitchen tools
            if (tools.isNotEmpty) ...[
              _sectionTitle("Tools you'll need", green),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: tools
                    .map(
                      (t) => Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: cardColors[2],
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          t,
                          style: const TextStyle(
                            color: navy,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ],

            // recipe steps
            if (steps.isNotEmpty) ...[
              _sectionTitle('Instructions', coral),
              ...List.generate(steps.length, (i) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        alignment: Alignment.center,
                        decoration: const BoxDecoration(
                          color: coral,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          '${i + 1}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          steps[i],
                          style: const TextStyle(
                            color: navy,
                            fontSize: 15,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
