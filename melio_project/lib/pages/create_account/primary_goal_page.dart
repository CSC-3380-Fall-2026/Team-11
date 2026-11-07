import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'create_account_page.dart';

enum DotStatus { completed, active, upcoming }

class PrimaryGoalPage extends StatefulWidget {
  const PrimaryGoalPage({super.key});

  @override
  State<PrimaryGoalPage> createState() => _PrimaryGoalPageState();
}

class _PrimaryGoalPageState extends State<PrimaryGoalPage> {
  int? selectedIndex;

  final List<Map<String, String>> goals = [
    {
      "emoji": "🔥",
      "title": "Weight Loss",
      "subtitle": "Reduce body fat and feel lighter",
    },
    {
      "emoji": "💪",
      "title": "Muscle Gain",
      "subtitle": "Build strength and lean mass",
    },
    {
      "emoji": "🏃",
      "title": "Endurance",
      "subtitle": "Improve stamina and cardio fitness",
    },
    {
      "emoji": "🌿",
      "title": "General Health",
      "subtitle": "Balance, energy, and well-being",
    },
  ];

  void _onContinue() {
    if (selectedIndex == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please select a primary goal to continue"),
        ),
      );
      return;
    }
  }

  Widget _buildDot({required DotStatus status}) {
    final isCurrent = status == DotStatus.active;

    Color color;
    if (status == DotStatus.completed) {
      color = const Color(0xFFA8E6CF);
    } else if (status == DotStatus.active) {
      color = const Color(0xFF5FBF9B);
    } else {
      color = const Color(0xFFE3E4EC);
    }

    return Container(
      width: isCurrent ? 23 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const CreateAccountPage(),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: const Color(0xFFE4E4E7),
                          width: 1.2,
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.arrow_back,
                        color: Color(0xFF2D3142),
                        size: 18,
                      ),
                    ),
                  ),

                  Row(
                    children: [
                      _buildDot(status: DotStatus.completed),
                      const SizedBox(width: 6),
                      _buildDot(status: DotStatus.active),
                      const SizedBox(width: 6),
                      _buildDot(status: DotStatus.upcoming),
                      const SizedBox(width: 6),
                      _buildDot(status: DotStatus.upcoming),
                    ],
                  ),
                  const SizedBox(width: 24),
                ],
              ),
              const SizedBox(height: 24),

              Text(
                "STEP 2 OF 4",
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                  color: const Color(0xFF8C90AB),
                ),
              ),
              const SizedBox(height: 8),

              Text(
                "What's your primary goal?",
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF2D3142),
                ),
              ),
              const SizedBox(height: 6),

              Text(
                "This shapes your workouts, nutrition targets, and AI recommendations.",
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: const Color(0xFF4E4B66),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),

              Expanded(
                child: ListView.builder(
                  itemCount: goals.length,
                  itemBuilder: (context, index) {
                    final isSelected = selectedIndex == index;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedIndex = index;
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 14),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFF4E8D79)
                                : const Color(0xFFE4E4E7),
                            width: isSelected ? 1.5 : 1.0,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: const Color(0xFFF7F7F9),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                goals[index]["emoji"]!,
                                style: const TextStyle(fontSize: 22),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    goals[index]["title"]!,
                                    style: GoogleFonts.inter(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: const Color(0xFF2D3142),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    goals[index]["subtitle"]!,
                                    style: GoogleFonts.inter(
                                      fontSize: 13,
                                      color: const Color(0xFF8C90AB),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected
                                      ? const Color(0xFF2D3142)
                                      : const Color(0xFFD1D1D6),
                                  width: 2,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: isSelected
                                  ? Container(
                                      width: 10,
                                      height: 10,
                                      decoration: const BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Color(0xFF2D3142),
                                      ),
                                    )
                                  : null,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: FilledButton(
                  onPressed: _onContinue,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF2D3142),
                    minimumSize: const Size(double.infinity, 54),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(28),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Continue",
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(
                        Icons.arrow_forward,
                        color: Colors.white,
                        size: 18,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
