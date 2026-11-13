// tests the validity of input fields

class Validators {
  static final RegExp _namePattern = RegExp(r"^[A-Za-z]+([ '’-][A-Za-z]+)*$");
  static final RegExp _emailPattern = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

  static String? fullName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please fill in all fields';
    }
    if (!_namePattern.hasMatch(value)) {
      return 'Name can contain letters, spaces, hyphens, and apostrophes only.';
    }
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please fill in all fields';
    }
    if (!_emailPattern.hasMatch(value)) {
      return 'Enter a valid email.';
    }
    return null;
  }
}
