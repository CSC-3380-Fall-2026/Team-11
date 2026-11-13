// tests the validity of input fields with examples

import 'package:flutter_test/flutter_test.dart';
import 'package:melio_project/unit_test/validators.dart';

void main() {
  group('Full name validator', () {
    test('accepts a normal first and last name', () {
      expect(Validators.fullName('Mike Tiger'), isNull);
    });

    test('accepts a hyphenated name', () {
      expect(Validators.fullName('Mary-Jane Watson'), isNull);
    });

    test('accepts a name with an apostrophe', () {
      expect(Validators.fullName("Conan O'Brien"), isNull);
    });

    test('rejects a name containing numbers', () {
      expect(Validators.fullName('Mike123'), isNotNull);
    });

    test('rejects a name that starts with a hyphen', () {
      expect(Validators.fullName('-Mike'), isNotNull);
    });

    test('rejects an empty name', () {
      expect(Validators.fullName(''), 'Please fill in all fields');
    });

    test('accepts a name with an accented letter', () {
      expect(Validators.fullName('José Garcia'), isNull);
    });
  });

  group('Email validator', () {
    test('accepts a normal email', () {
      expect(Validators.email('mike@example.com'), isNull);
    });

    test('rejects an email with no @', () {
      expect(Validators.email('mikeexample.com'), 'Enter a valid email.');
    });

    test('rejects an email with no dot in the domain', () {
      expect(Validators.email('mike@example'), 'Enter a valid email.');
    });

    test('rejects an email containing a space', () {
      expect(Validators.email('mike @example.com'), 'Enter a valid email.');
    });

    test('rejects an email with nothing before the @', () {
      expect(Validators.email('@example.com'), 'Enter a valid email.');
    });

    test('rejects an email with two dots in a row in the domain', () {
      expect(Validators.email('mike@example..com'), isNotNull);
    });

    test('rejects an email ending in a dot', () {
      expect(Validators.email('mike@example.com.'), isNotNull);
    });
  });
}
