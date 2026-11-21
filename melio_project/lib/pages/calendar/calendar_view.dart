import "dart:async";
import "package:flutter/material.dart";
import "package:google_fonts/google_fonts.dart";
import "package:melio_project/pages/nutrition_log/nutrition_model.dart";
import "package:melio_project/pages/nutrition_log/nutrition_service.dart";
import "package:melio_project/pages/services/calendar_plan.dart";
import "package:melio_project/pages/workout_log/workout_model.dart";
import "package:melio_project/pages/workout_log/workout_service.dart";

class CalendarView extends StatefulWidget {
  const CalendarView({super.key});

  @override
  State<CalendarView> createState() => _CalendarViewState();
}

class _CalendarViewState extends State<CalendarView> {
  late DateTime today;
  late DateTime weekStart; // the monday of the week being shown
  late DateTime selectedDay;

  final List<String> monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  final List<String> dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // things on one exact date, right now these are the meals from the nutrition log
  final List<CalendarPlan> plans = [];

  // the user's saved workout routines, these repeat every week
  List<WorkoutRoutine> routines = [];
  StreamSubscription<List<WorkoutRoutine>>? routineListener;

  // one listener for each day of the week being shown
  List<StreamSubscription<DailyNutrition>> mealListeners = [];

  @override
  void initState() {
    super.initState();
    goToToday();
    listenToMeals();

    // keeps the calendar updated whenever a routine is added, edited, or deleted
    routineListener = WorkoutService().getWorkoutsStream().listen((saved) {
      setState(() {
        routines = saved;
      });
    });
  }

  @override
  void dispose() {
    routineListener?.cancel();
    for (var listener in mealListeners) {
      listener.cancel();
    }
    super.dispose();
  }

  // gets the meals logged on each day of the week being shown
  void listenToMeals() {
    for (var listener in mealListeners) {
      listener.cancel();
    }
    mealListeners = [];

    for (int i = 0; i < 7; i++) {
      DateTime day = DateTime(
        weekStart.year,
        weekStart.month,
        weekStart.day + i,
      );
      var dayStream = NutritionService().streamDailyNutrition(day);
      var listener = dayStream.listen((daily) {
        setState(() {
          // clear this day's old meals first so they don't show up twice
          plans.removeWhere(
            (plan) => plan.type == "meal" && isSameDay(plan.date, day),
          );
          for (var meal in daily.meals) {
            plans.add(
              CalendarPlan(
                title: meal.name,
                time: "${meal.mealType} · ${meal.calories} cal",
                type: "meal",
                date: day,
                completed: true,
              ),
            );
          }
        });
      });
      mealListeners.add(listener);
    }
  }

  void goToToday() {
    DateTime now = DateTime.now();
    today = DateTime(now.year, now.month, now.day);
    selectedDay = today;
    weekStart = DateTime(
      today.year,
      today.month,
      today.day - (today.weekday - 1),
    );
  }

  // moves the whole week forward or back by 7 days
  void changeWeek(int days) {
    setState(() {
      weekStart = DateTime(
        weekStart.year,
        weekStart.month,
        weekStart.day + days,
      );
      selectedDay = DateTime(
        selectedDay.year,
        selectedDay.month,
        selectedDay.day + days,
      );
    });
    listenToMeals();
  }

  bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  List<CalendarPlan> plansFor(DateTime day) {
    List<CalendarPlan> result = [];
    for (var plan in plans) {
      if (isSameDay(plan.date, day)) {
        result.add(plan);
      }
    }

    // a routine shows up on every day of the week it was scheduled for
    String dayName = dayNames[day.weekday - 1];
    for (var routine in routines) {
      if (routine.scheduledDays.contains(dayName)) {
        result.add(
          CalendarPlan(
            title: routine.name,
            time: "${routine.exercises.length} exercises",
            type: "workout",
            date: day,
          ),
        );
      }
    }
    return result;
  }

  Color cardColor(String type) {
    if (type == "meal") return const Color(0xFFFBE3CF);
    if (type == "rest") return const Color(0xFFE7DDF7);
    return const Color(0xFFD6ECFF);
  }

  Color edgeColor(String type) {
    if (type == "meal") return const Color(0xFFE59A5C);
    if (type == "rest") return const Color(0xFF9B7BD4);
    return const Color(0xFF5AA9E6);
  }

  @override
  Widget build(BuildContext context) {
    // count how many of this week's plans are marked completed
    int total = 0;
    int done = 0;
    for (int i = 0; i < 7; i++) {
      DateTime day = DateTime(
        weekStart.year,
        weekStart.month,
        weekStart.day + i,
      );
      for (var plan in plansFor(day)) {
        total++;
        if (plan.completed) {
          done++;
        }
      }
    }

    List<CalendarPlan> dayPlans = plansFor(selectedDay);

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
      children: [
        Text(
          "YOUR CALENDAR",
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.5,
            color: const Color(0xFF4CAF8C),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          "${monthNames[selectedDay.month - 1]} ${selectedDay.year}",
          style: GoogleFonts.inter(
            fontSize: 30,
            fontWeight: FontWeight.w800,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 16),

        Row(
          children: [
            weekButton(Icons.chevron_left, () => changeWeek(-7)),
            const SizedBox(width: 8),
            OutlinedButton(
              onPressed: () {
                setState(() => goToToday());
                listenToMeals();
              },
              style: OutlinedButton.styleFrom(
                backgroundColor: Colors.white,
                side: BorderSide(color: Colors.grey.shade300),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                "Today",
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w700,
                  color: Colors.black,
                ),
              ),
            ),
            const SizedBox(width: 8),
            weekButton(Icons.chevron_right, () => changeWeek(7)),
          ],
        ),
        const SizedBox(height: 16),

        // weekly progress card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: const LinearGradient(
              colors: [Color(0xFFC5E7DB), Color(0xFFB5DEFF)],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
          ),
          child: Row(
            children: [
              SizedBox(
                width: 70,
                height: 70,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 70,
                      height: 70,
                      child: CircularProgressIndicator(
                        value: total == 0 ? 0 : done / total,
                        strokeWidth: 6,
                        backgroundColor: Colors.white,
                        color: const Color(0xFF4CAF8C),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          "$done",
                          style: GoogleFonts.inter(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          "/ $total",
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: Colors.black54,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "WEEKLY RHYTHM",
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                        color: const Color(0xFF3E8F72),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "Keep it going",
                      style: GoogleFonts.inter(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "${total - done} planned moments left",
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // the row of 7 days
        Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              for (int i = 0; i < 7; i++)
                dayBox(
                  DateTime(weekStart.year, weekStart.month, weekStart.day + i),
                ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              dayNames[selectedDay.weekday - 1],
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            Text(
              dayPlans.length == 1 ? "1 plan" : "${dayPlans.length} plans",
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Colors.black54,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        if (dayPlans.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Text(
              "Nothing planned yet.",
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(color: Colors.black54),
            ),
          ),

        for (var plan in dayPlans) planCard(plan),
      ],
    );
  }

  Widget weekButton(IconData icon, VoidCallback onTap) {
    return SizedBox(
      width: 44,
      height: 44,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          padding: EdgeInsets.zero,
          backgroundColor: Colors.white,
          side: BorderSide(color: Colors.grey.shade300),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Icon(icon, color: Colors.black),
      ),
    );
  }

  Widget dayBox(DateTime day) {
    bool selected = isSameDay(day, selectedDay);
    bool isToday = isSameDay(day, today);

    // Expanded splits the row evenly so all 7 days fit on smaller phones too
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => selectedDay = day),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 2),
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: selected ? const Color(0xFFC5E7DB) : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            border: isToday
                ? Border.all(color: const Color(0xFF5AA9E6), width: 2)
                : null,
          ),
          child: Column(
            children: [
              Text(
                dayNames[day.weekday - 1].substring(0, 3).toUpperCase(),
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Colors.black54,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                "${day.day}",
                style: GoogleFonts.inter(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget planCard(CalendarPlan plan) {
    // flutter won't round the corners of a border that's only on one side,
    // so the card gets clipped round instead
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          decoration: BoxDecoration(
            color: cardColor(plan.type),
            border: Border(
              left: BorderSide(color: edgeColor(plan.type), width: 5),
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.7),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: edgeColor(plan.type),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      plan.title,
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      plan.time,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
