class UserModel {
  final String uid;
  final String fullName;
  final String email;
  final DateTime createdAt;

  UserModel({
    required this.uid,
    required this.fullName,
    required this.email,
    required this.createdAt,
  });

  factory UserModel.fromMap(Map<String, dynamic> map, String id) {
    return UserModel(
      uid: id,
      fullName: map['fullName'] ?? '',
      email: map['email'] ?? '',
      createdAt: map['createdAt'] != null
          ? (map['createdAt'] as dynamic).toDate()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'fullName': fullName,
      'email': email,
      'createdAt': createdAt,
    };
  }
}
