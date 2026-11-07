import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'primary_goal_page.dart';

class BodyAndTargetsPage extends StatefulWidget {
  const BodyAndTargetsPage({super.key});

  @override
  State<BodyAndTargetsPage> createState() => _BodyAndTargetsPageState();
}

class _BodyAndTargetsPageState extends State<BodyAndTargetsPage> {
  final TextEditingController _currentWeightController =
      TextEditingController();
  final TextEditingController _targetWeightController = TextEditingController();
  final TextEditingController _calorieGoalController = TextEditingController();

  bool _isFormValid = false;
  String? _selectedQuickPick;

  @override
  void initState() {
    super.initState();
    _currentWeightController.addListener(_validateForm);
    _targetWeightController.addListener(_validateForm);
    _calorieGoalController.addListener(_validateForm);
  }

  void _validateForm() {
    final isValid =
        _currentWeightController.text.trim().isNotEmpty &&
        _targetWeightController.text.trim().isNotEmpty &&
        _calorieGoalController.text.trim().isNotEmpty;

    if (isValid != _isFormValid) {
      setState(() {
        _isFormValid = isValid;
      });
    }
  }

  @override
  void dispose() {
    _currentWeightController.dispose();
    _targetWeightController.dispose();
    _calorieGoalController.dispose();
    super.dispose();
  }

  void _handleQuickPick(String value) {
    setState(() {
      _selectedQuickPick = value;
      _calorieGoalController.text = value.replaceAll('  kcal', '');
    });
  }

  void _onContinue() {
    if (!_isFormValid) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please fill out all text boxes to contine"),
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
                          builder: (context) => const PrimaryGoalPage(),
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
                      _buildDot(status: DotStatus.completed),
                      const SizedBox(width: 6),
                      _buildDot(status: DotStatus.active),
                      const SizedBox(width: 6),
                      _buildDot(status: DotStatus.upcoming),
                    ],
                  ),
                  const SizedBox(width: 24),
                ],
              ),
              const SizedBox(height: 24),

              Text(
                "STEP 3 OF 4",
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                  color: const Color(0xFF8C90AB),
                ),
              ),
              const SizedBox(height: 8),

              Text(
                "Your body & targets",
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF2D3142),
                ),
              ),
              const SizedBox(height: 6),

              Text(
                "Used to calculate your daily energy needs and track your progress.",
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
                      _buildInputField(
                        label: "Current Weight",
                        unit: "in lbs",
                        hintText: "e.g. 180",
                        controller: _currentWeightController,
                      ),
                      const SizedBox(height: 16),

                      _buildInputField(
                        label: 'Target Weight',
                        unit: 'in lbs',
                        hintText: 'e.g. 165',
                        controller: _targetWeightController,
                      ),
                      const SizedBox(height: 20),

                      _buildInputField(
                        label: "Daily Calorie Goal",
                        unit: "kcal/day",
                        hintText: "e.g. 2100",
                        controller: _calorieGoalController,
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          _buildQuickPickChip("2400 kcal"),
                          const SizedBox(width: 8),
                          _buildQuickPickChip("2700 kcal"),
                          const SizedBox(width: 8),
                          _buildQuickPickChip("3000 kcal"),
                        ],
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: FilledButton(
                  onPressed: _isFormValid ? _onContinue : null,
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
                        "Continue",
                        style: GoogleFonts.inter(
                          color: _isFormValid
                              ? Colors.white
                              : const Color(0xFF8C90AB),
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(
                        Icons.arrow_forward,
                        color: _isFormValid
                            ? Colors.white
                            : const Color(0xFF8C90AB),
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

  Widget _buildInputField({
    required String label,
    required String unit,
    required String hintText,
    required TextEditingController controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF2D3142),
              ),
            ),
            Text(
              unit,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: const Color(0xFF8C90AB),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          style: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF2D3142),
          ),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w500,
              color: const Color(0xFFD1D1D6),
            ),
            filled: true,
            fillColor: const Color(0xFFF7F7F9),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFFE4E4E7), width: 1),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(
                color: Color(0xFF4E8D79),
                width: 1.5,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildQuickPickChip(String label) {
    final isSelected = _selectedQuickPick == label;

    return Expanded(
      child: InkWell(
        onTap: () => _handleQuickPick(label),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFFE6F4F1)
                : const Color(0xFFF7F7F9),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFF5FBF9B)
                  : const Color(0xFFE4E4E7),
              width: isSelected ? 1.5 : 1.0,
            ),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isSelected
                  ? const Color(0xFF2E7D32)
                  : const Color(0xFF2D3142),
            ),
          ),
        ),
      ),
    );
  }
}
