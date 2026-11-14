import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:melio_project/pages/create_account/body_and_targets_page.dart';

void main() {
  testWidgets('Continue reports missing body and target values', (
    tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(home: BodyAndTargetsPage()),
    );

    await tester.tap(find.text('Continue'));
    await tester.pump();

    expect(
      find.text('Please fill out all text boxes to continue'),
      findsOneWidget,
    );
  });

  testWidgets('Continue opens the protein and activity step when valid', (
    tester,
  ) async {
    await tester.pumpWidget(
      const MaterialApp(home: BodyAndTargetsPage()),
    );

    final fields = find.byType(TextField);
    await tester.enterText(fields.at(0), '180');
    await tester.enterText(fields.at(1), '165');
    await tester.enterText(fields.at(2), '2100');
    await tester.tap(find.text('Continue'));
    await tester.pumpAndSettle();

    expect(find.text('Protein & activity'), findsOneWidget);
  });
}
