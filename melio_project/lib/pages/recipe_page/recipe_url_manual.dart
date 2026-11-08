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

    String title = document.querySelector('meta[property = "og:title"]')?.attributes['content'] ??
        document.querySelector('title')?.text ??
        'Untitled Recipe';

    String imageUrl = document.querySelector('meta[property="og:image"]')?.attributes['content'] ?? '';

    final recipeData = {
      'title': title,
      'imageUrl': imageUrl,
      'recipeUrl': urlString,
      'createdAt': FieldValue.serverTimestamp(),
    };

    DocumentReference docRef = await _firestore.collection('recipes').add(recipeData);

    return {
      'id': docRef.id,
      ...recipeData,
    };
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
      'createdAt': FieldValue.serverTimestamp(),
    };

    DocumentReference docRef = await _firestore.collection('recipes').add(recipeData);
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
      return {
        'id': doc.id,
        ...data,
      };
    }).toList();
  }
}