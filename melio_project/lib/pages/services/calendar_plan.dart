class CalendarPlan {
  final String title;
  final String time; // shown under the title, like "7:00 · 30 min"
  final String type; // "workout", "meal", or "rest"
  final DateTime date;
  bool completed;

  CalendarPlan({
    required this.title,
    required this.time,
    required this.type,
    required this.date,
    this.completed = false,
  });
}
