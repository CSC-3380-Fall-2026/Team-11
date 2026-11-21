import 'package:flutter/material.dart';
import 'recipe_url_manual.dart';
import 'recipe_detail_page.dart';

const cream = Color(0xFFFFFBF5);
const navy = Color(0xFF2D3047);
const coral = Color(0xFFE0896A);
const green = Color(0xFF6BAA8E);
const grey = Color(0xFF6B7080);

const cardColors = [Color(0xFFE3F2EA), Color(0xFFFDEBD9), Color(0xFFE4ECF7)];

class RecipePage extends StatefulWidget {
  const RecipePage({super.key});

  @override
  State<RecipePage> createState() => _RecipePageState();
}

class _RecipePageState extends State<RecipePage> {
  final _service = RecipeService();
  final _urlController = TextEditingController();
  final _searchController = TextEditingController();
  bool _loading = false;
  bool _searching = false;
  String _urlError = ''; //when empty = no error
  String _searchText = '';

  @override
  void dispose() {
    _urlController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _import() async {
    final url = _urlController.text.trim();

    if (url.isEmpty) {
      setState(() => _urlError = 'Please enter a link');
      return;
    }

    //checking if it actually is a link
    final uri = Uri.tryParse(url);
    final looksValid =
        uri != null &&
        (uri.scheme == 'http' || uri.scheme == 'https') &&
        uri.host.contains('.');
    if (!looksValid) {
      setState(
        () => _urlError = 'Please enter a valid link (starting with https://)',
      );
      return;
    }

    setState(() => _urlError = '');

    setState(() => _loading = true);
    try {
      await _service.importRecipeFromUrl(url);
      _urlController.clear();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Could not import: $e')));
      }
    }
    if (mounted) setState(() => _loading = false);
  }

  void _showManualDialog() {
    final title = TextEditingController();
    final image = TextEditingController();
    final cat = TextEditingController();
    final time = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add manually'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: title,
                decoration: const InputDecoration(labelText: 'Title'),
              ),
              TextField(
                controller: image,
                decoration: const InputDecoration(labelText: 'Image URL'),
              ),
              TextField(
                controller: cat,
                decoration: const InputDecoration(
                  labelText: 'Category (Lunch, Dinner...)',
                ),
              ),
              TextField(
                controller: time,
                decoration: const InputDecoration(
                  labelText: 'Time (e.g. 25 MIN)',
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              if (title.text.trim().isEmpty) return;
              await _service.addRecipeManually(
                title: title.text.trim(),
                imageUrl: image.text.trim(),
                category: cat.text.trim(),
                prepTime: time.text.trim(),
              );
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text('Save', style: TextStyle(color: coral)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: cream,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: navy),
                  onPressed: () => Navigator.pop(context),
                ),
                InkWell(
                  onTap: () => setState(() {
                    _searching = !_searching;
                    if (!_searching) {
                      _searchText = '';
                      _searchController.clear();
                    }
                  }),
                  child: Container(
                    width: 46,
                    height: 46,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE4EEFA),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.search, color: navy, size: 20),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            if (_searching)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: TextField(
                  controller: _searchController,
                  autofocus: true,
                  onChanged: (v) =>
                      setState(() => _searchText = v.toLowerCase()),
                  decoration: InputDecoration(
                    hintText: 'Search your recipes',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),

            const Text(
              'YOUR MELIO RECIPES',
              style: TextStyle(
                color: green,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Import a recipe',
              style: TextStyle(
                color: navy,
                fontSize: 32,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 20),

            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(28),
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFFCFEBDD), Color(0xFFC9DDF2)],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.6),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.link, color: green),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Found something delicious?',
                              style: TextStyle(
                                color: navy,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              "Paste the link and we'll organize the recipe for you.",
                              style: TextStyle(color: grey, fontSize: 14),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.only(
                      left: 16,
                      right: 6,
                      top: 6,
                      bottom: 6,
                    ),
                    decoration: BoxDecoration(
                      color: _urlError.isNotEmpty
                          ? const Color(0xFFFDE3E3)
                          : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: _urlError.isEmpty
                            ? Colors.red
                            : Colors.transparent,
                        width: 1.5,
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _urlController,
                            keyboardType: TextInputType.url,
                            onChanged: (_) {
                              if (_urlError.isNotEmpty)
                                setState(() => _urlError = '');
                            },
                            decoration: const InputDecoration(
                              hintText: 'https://recipe-website.com',
                              hintStyle: TextStyle(
                                color: Colors.grey,
                                fontSize: 14,
                              ),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 46,
                          child: ElevatedButton(
                            onPressed: _loading ? null : _import,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: coral,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadiusGeometry.circular(16),
                              ),
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
                                : const Text(
                                    'Import',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (_urlError.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 10, left: 6),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.error_outline,
                            color: Colors.red,
                            size: 16,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              _urlError,
                              style: const TextStyle(
                                color: Colors.red,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),

            const SizedBox(height: 14),
            Center(
              child: TextButton.icon(
                onPressed: _showManualDialog,
                icon: const Icon(Icons.add, size: 16, color: grey),
                label: const Text(
                  'Add manually instead',
                  style: TextStyle(
                    color: navy,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            const Text(
              'COOKED & LOVED',
              style: TextStyle(
                color: coral,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Recent saves',
              style: TextStyle(
                color: navy,
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 14),

            //recipe list
            StreamBuilder<List<Map<String, dynamic>>>(
              stream: _service.streamRecipes(),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                }
                if (!snapshot.hasData) {
                  return const Padding(
                    padding: EdgeInsets.all(30),
                    child: Center(
                      child: CircularProgressIndicator(color: coral),
                    ),
                  );
                }

                var recipes = List<Map<String, dynamic>>.from(snapshot.data!);

                if (_searchText.isNotEmpty) {
                  recipes = recipes
                      .where(
                        (r) => (r['title'] ?? '')
                            .toString()
                            .toLowerCase()
                            .contains(_searchText),
                      )
                      .toList();
                }

                final pinned = recipes
                    .where((r) => r['pinned'] == true)
                    .toList();
                final others = recipes
                    .where((r) => r['pinned'] != true)
                    .toList();
                recipes = [...pinned, ...others];

                if (recipes.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 30),
                    child: Center(
                      child: Text(
                        'No recipes yet. Paste a link above!',
                        style: TextStyle(color: grey),
                      ),
                    ),
                  );
                }

                return SizedBox(
                  height: 270,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: recipes.length,
                    itemBuilder: (context, i) => _buildCard(recipes[i], i),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard(Map<String, dynamic> r, int index) {
    final isPinned = r['pinned'] == true;
    final imageUrl = (r['imageUrl'] ?? '').toString();
    final category = (r['category'] ?? '').toString();
    final time = (r['prepTime'] ?? '').toString().toUpperCase();

    final tagParts = [category, time].where((s) => s.isNotEmpty).toList();
    final tagLine = tagParts.join('  •  ');

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => RecipeDetailPage(recipe: r)),
        );
      },
      child: Container(
        width: 240,
        margin: const EdgeInsets.only(right: 14),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: cardColors[index % cardColors.length],
          borderRadius: BorderRadius.circular(26),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: SizedBox(
                    height: 140,
                    width: double.infinity,
                    child: imageUrl.isEmpty
                        ? Container(
                            color: Colors.white54,
                            child: const Icon(Icons.restaurant, color: grey),
                          )
                        : Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (c, e, s) => Container(
                              color: Colors.white54,
                              child: const Icon(
                                Icons.broken_image,
                                color: grey,
                              ),
                            ),
                          ),
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: InkWell(
                    onTap: () => _service.togglePin(r['id'], !isPinned),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        isPinned ? Icons.bookmark : Icons.bookmark_border,
                        size: 20,
                        color: isPinned ? coral : navy,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (tagLine.isNotEmpty)
              Text(
                tagLine,
                style: const TextStyle(
                  color: grey,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
            const SizedBox(height: 6),
            Text(
              (r['title'] ?? 'Untitled').toString(),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: navy,
                fontSize: 16,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
