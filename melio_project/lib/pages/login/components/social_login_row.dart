import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SocialLoginRow extends StatelessWidget{
  final String assetPath;
  final VoidCallback onTap;

  const SocialLoginRow({
    super.key,
    required this.assetPath,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(30),
      child: Container(
        width: 70,
        height: 49,
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30),
          border: Border.all(
            color: Colors.black,
            width: 2.0,
          )
        ),
        child: SvgPicture.asset(
          assetPath,
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}