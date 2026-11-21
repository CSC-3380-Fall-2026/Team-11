import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:html/parser.dart' as html_parser;
import 'package:http/http.dart' as http;

class RecipeService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future importRecipeFromUrl(String urlString) async {
    final Uri uri = Uri.parse(urlString);
    final response = await http.get(uri);

    if (response.statusCode != 200) {
      throw Exception("Sorry! Recipe URL failed to load!");
    }

    final document = html_parser.parse(response.body);

    String title =
        document
            .querySelector('meta[property = "og:title"]')
            ?.attributes['content'] ??
        document.querySelector('title')?.text ??
        'Untitled Recipe';

    String imageUrl =
        document
            .querySelector('meta[property="og:image"]')
            ?.attributes['content'] ??
        '';

    String prepTime = _findTime(document);
    final details = _extractDetails(document);

    final recipeData = {
      'title': title,
      'imageUrl': imageUrl,
      'recipeUrl': urlString,
      'category': 'Recipe',
      'prepTime': prepTime,
      'piined': false,
      ...details,
      'createdAt': FieldValue.serverTimestamp(),
    };

    DocumentReference docRef = await _firestore
        .collection('recipes')
        .add(recipeData);

    return {'id': docRef.id, ...recipeData};
  }

  String _findTime(dynamic document) {
    final scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    for (final s in scripts) {
      try {
        final decoded = jsonDecode(s.text);
        final result = _searchTime(decoded);
        if (result.isNotEmpty) return result;
      } catch (e) {}
    }
    return '';
  }

  String _searchTime(dynamic node) {
    if (node is List) {
      for (final n in node) {
        final r = _searchTime(n);
        if (r.isNotEmpty) return r;
      }
    } else if (node is Map) {
      final t = node['totalTime'] ?? node['cookTime'] ?? node['prepTime'];
      if (t is String && t.isNotEmpty) {
        final f = _formatIso(t);
        if (f.isNotEmpty) return f;
      }
      if (node['@graph'] != null) return _searchTime(node['@graph']);
    }
    return '';
  }

  String _formatIso(String iso) {
    final m = RegExp(r'PT(?:(\d+)H)?(?:(\d+)M)?').firstMatch(iso);
    if (m == null) return '';
    final h = int.tryParse(m.group(1) ?? '') ?? 0;
    final min = int.tryParse(m.group(2) ?? '') ?? 0;
    if (h == 0 && min == 0) return '';
    if (h == 0) return '$min MIN';
    if (min == 0) return '$h HR';
    return '$h HR $min MIN';
  }

  Map<String, dynamic> _extractDetails(dynamic document) {
    List<String> ingredients = [];
    List<String> steps = [];
    List<String> tools = [];

    final scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    for (final sc in scripts) {
      try {
        final node = _findRecipeNode(jsonDecode(sc.text));
        if (node == null) continue;

        final ing = node['recipeIngredient'];
        if (ing is List) {
          ingredients = ing
              .map((e) => _clean(e.toString()))
              .where((e) => e.isNotEmpty)
              .toList();
        }

        steps = _flattenSteps(node['recipeInstructions']);

        final t = node['tool'];
        if (t is List) {
          tools = t
              .map(
                (e) => e is Map
                    ? _clean((e['name'] ?? '').toString())
                    : _clean(e.toString()),
              )
              .where((e) => e.isNotEmpty)
              .toList();
        }
        break;
      } catch (e) {}
    }

    if (tools.isEmpty && steps.isNotEmpty) {
      tools = _guessTools(steps.join(' ').toLowerCase());
    }

    return {'ingredients': ingredients, 'steps': steps, 'tools': tools};
  }

  Map? _findRecipeNode(dynamic node) {
    if (node is List) {
      for (final n in node) {
        final r = _findRecipeNode(n);
        if (r != null) return r;
      }
    } else if (node is Map) {
      final type = node['@type'];
      if (type == 'Recipe' || (type is List && type.contains('Recipe')))
        return node;
      if (node['@graph'] != null) return _findRecipeNode(node['@graph']);
    }
    return null;
  }

  List<String> _flattenSteps(dynamic node) {
    List<String> out = [];
    if (node is String) {
      for (final line in node.split('\n')) {
        final c = _clean(line);
        if (c.isNotEmpty) out.add(c);
      }
    } else if (node is List) {
      for (final n in node) {
        out.addAll(_flattenSteps(n));
      }
    } else if (node is Map) {
      if (node['itemListElement'] != null) {
        out.addAll(_flattenSteps(node['itemListElement']));
      } else {
        final c = _clean((node['text'] ?? node['name'] ?? '').toString());
        if (c.isNotEmpty) out.add(c);
      }
    }
    return out;
  }

  String _clean(String text) {
    return html_parser.parseFragment(text).text?.trim() ?? text.trim();
  }

  List<String> _guessTools(String text) {
    const toolWords = {
      'oven': 'Oven',
      'skillet': 'Skillet',
      'frying pan': 'Frying pan',
      'saucepan': 'Saucepan',
      'pot': 'Pot',
      'baking sheet': 'Baking sheet',
      'baking dish': 'Baking dish',
      'bowl': 'Mixing bowl',
      'whisk': 'Whisk',
      'blender': 'Blender',
      'food processor': 'Food processor',
      'grill': 'Grill',
      'spatula': 'Spatula',
      'knife': 'Knife',
      'cutting board': 'Cutting board',
      'colander': 'Colander',
      'strainer': 'Strainer',
      'mixer': 'Mixer',
      'microwave': 'Microwave',
      'slow cooker': 'Slow cooker',
      'air fryer': 'Air fryer',
      'parchment': 'Parchment paper',
      'foil': 'Foil',
      'tongs': 'Tongs',
      'wooden spoon': 'Wooden spoon',
    };
    List<String> found = [];
    toolWords.forEach((k, v) {
      if (text.contains(k)) found.add(v);
    });
    return found;
  }

  Future<Map<String, dynamic>> refreshRecipeDetails(
    String id,
    String url,
  ) async {
    final response = await http.get(Uri.parse(url));
    if (response.statusCode != 200) {
      throw Exception("Sorry! Recipe URL failed to load!");
    }
    final document = html_parser.parse(response.body);
    final details = _extractDetails(document);
    await _firestore.collection('recipes').doc(id).update(details);
    return details;
  }

  Future addRecipeManually({
    required String title,
    required String imageUrl,
    required String category,
    required String prepTime,
  }) async {
    final recipeData = {
      'title': title,
      'imageUrl': imageUrl,
      'category': category,
      'prepTime': prepTime,
      'recipeUrl': '',
      'pinned': false,
      'createdAt': FieldValue.serverTimestamp(),
    };

    DocumentReference docRef = await _firestore
        .collection('recipes')
        .add(recipeData);
    return docRef.id;
  }

  Future searchRecipes(String query) async {
    if (query.trim().isEmpty) {
      return [];
    }

    String searchQuery = query.toLowerCase();

    QuerySnapshot snapshot = await _firestore
        .collection('recipes')
        .orderBy('title')
        .startAt([searchQuery])
        .endAt(['$searchQuery\uf8ff'])
        .get();

    return snapshot.docs.map((doc) {
      final data = doc.data() as Map<String, dynamic>;
      return {'id': doc.id, ...data};
    }).toList();
  }

  Stream<List<Map<String, dynamic>>> streamRecipes() {
    return _firestore
        .collection('recipes')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map(
          (snap) => snap.docs.map((doc) {
            final data = doc.data();
            return {'id': doc.id, ...data};
          }).toList(),
        );
  }

  Future togglePin(String id, bool pinned) async {
    await _firestore.collection('recipes').doc(id).update({'pinned': pinned});
  }
}
