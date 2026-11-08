import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'body_and_targets_page.dart';

class ProteinAndActivityPage extends StatefulWidget {
  const ProteinAndActivityPage({super.key});

  @override
  State<ProteinAndActivityPage> createState() => _ProteinAndActivityPageState();
}

class _ProteinAndActivityPageState extends State<ProteinAndActivityPage> {
  String? _selectedProtein;
  String? _selectedActivityLevel;

  final List<String> _proteinOptions = [
    '100g', '120g', '140g', '160g', '180g', '200g'
  ];

  final List<Map<String, String>> _activityOptions = [
    {
      "title": "Sedentary",
      "subtitle": "Desk job, little exercise",
      "icon": "🪑",
    },
    {
      "title": "Lightly Active",
      "subtitle": "1-3 workouts/week",
      "icon": "🚶‍♂️",
    },
    {
      "title": "Moderately Active",
      "subtitle": "3-5 workouts / week",
      "icon": "🚴‍♂️",
    },
    {
      "title": "Very Active",
      "subtitle": "6+ workouts / week",
      "icon": "🏋️‍♂️",
    },
  ];

  bool get _isFormValid =>
  _selectedProtein != null && _selectedActivityLevel != null;

  void _onLetsGo() {
    if (!_isFormValid) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please select your protein target and activity level"),
        ),
      );
      return;
    }
  }

  Widget _buildDot({required bool isActive, bool isWide = false}) {
    return Container(
      width: isWide ? 23 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: isActive? const Color(0xFF5FBF9B) : const Color(0xFFA8E6CF),
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
          padding: const EdgeInsets.symmetric(horizontal: 24),
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
                          builder: (context) => const BodyAndTargetsPage(),
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
                          width: 1.2
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
                      _buildDot(isActive: false),
                      const SizedBox(width: 6),
                      _buildDot(isActive: false),
                      const SizedBox(width: 6),
                      _buildDot(isActive: false),
                      const SizedBox(width: 6),
                      _buildDot(isActive: true, isWide: true),
                    ],
                  ),
                  const SizedBox(width: 24),
                ],
              ),
              const SizedBox(height: 24),

              Text(
                "STEP 4 OF 4",
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                  color: const Color(0xFF8C90AB),
                ),
              ),
              const SizedBox(height: 8),

              Text(
                "Protein & activity",
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF2D3142),
                ),
              ),
              const SizedBox(height: 6),

              Text(
                "Fine-tune your nutrition targets and training intensity.",
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: const Color(0xFF4E4B66),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),

              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Daily Protein Target",
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF2D3142),
                            ),
                          ),
                          Text(
                            _selectedProtein != null ? _selectedProtein! : "-",
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFFE5A953),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: _proteinOptions.map((protein) {
                          final isSelected = _selectedProtein == protein;
                          return InkWell(
                            onTap: () {
                              setState(() {
                                _selectedProtein = protein;
                              });
                            },
                            borderRadius: BorderRadius.circular(24),
                            child: Container(
                              width: 74,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: isSelected
                                ? const Color(0xFFFFF8EE)
                                : const Color(0xFFF7F7F9),
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(
                                  color: isSelected
                                  ? const Color(0xFFD48806)
                                  : const Color(0xFF2D3142),
                                ),
                              ) ,
                              child: Text(
                                protein,
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: isSelected
                                      ? FontWeight.w700
                                      : FontWeight.w500,
                                  color: const Color(0xFF2D3142),
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 16),

                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFFBE6),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: const Color(0xFFFFEE99),
                              width: 1,
                            ),
                        ),
                        child: Row(
                          children: [
                            const Text("💡", style: TextStyle(fontSize: 16)),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                "For Muscle Gain, we recommend 140-180g per day.",
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: const Color(0xFF8C6D1B),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      Text(
                        "Activity Level",
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF2D3142),
                        ),
                      ),
                      const SizedBox(height: 12),

                      ..._activityOptions.map((activity) {
                        final isSelected =
                        _selectedActivityLevel == activity["title"];
                        return InkWell(
                          onTap: () {
                            setState(() {
                              _selectedActivityLevel = activity["title"];
                            });
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 12),
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
                                  offset: const Offset(0,2),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF7F7F9),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    activity["icon"]!,
                                    style: const TextStyle(fontSize: 20),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        activity["title"]!,
                                        style: GoogleFonts.inter(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                          color: const Color(0xFF2D3142),
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        activity["subtitle"]!,
                                        style: GoogleFonts.inter(
                                          fontSize: 13,
                                          color: const Color(0xFF8C90AB),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
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
                      }),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: FilledButton(
                  onPressed: _isFormValid ? _onLetsGo : null,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF2D3142),
                    disabledBackgroundColor: const Color(0xFFE4E4E7),
                    minimumSize: const Size(double.infinity, 54),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(28),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Let's go! 🎉",
                        style: GoogleFonts.inter(
                          color: _isFormValid
                          ? Colors.white
                          : const Color(0xFF8C90AB),
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
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