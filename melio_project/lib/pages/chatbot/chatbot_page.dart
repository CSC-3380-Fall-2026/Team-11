import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
//direct free sdk for generative ai
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:melio_project/pages/chatbot/chatbot_theme.dart';

class ChatMessage {
  final String text;
  final bool isUser;

  ChatMessage({required this.text, required this.isUser});
}

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isLoading = false;

  late final GenerativeModel _model;
  late final ChatSession _chatSession;

  @override
  void initState() {
    super.initState();

    final apiKey = dotenv.env['GOOGLE_GEN_AI_API_KEY'] ?? '';

    _model = GenerativeModel(model: 'gemini-3.8-flash', apiKey: apiKey);

    _chatSession = _model.startChat();
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _textController.text.trim();
    if (text.isEmpty || _isLoading) return;

    _textController.clear();
    setState(() {
      _messages.add(ChatMessage(text: text, isUser: true));
      _isLoading = true;
    });

    //replace this with your actual API call to the chatbot
    await Future.delayed(
      const Duration(seconds: 2),
    ); // Simulate a delay for the chatbot response

    final aiResponse =
        "Hello! This is a simulated response from the chatbot. You said: '$text'"; // Simulated response

    _scrollToBottom();

    try {
      final response = await _chatSession.sendMessage(Content.text(text));
      final reply =
          response.text ?? "I didnt catch that. Could you please try again?";

      setState(() {
        _messages.add(ChatMessage(text: reply, isUser: false));
      });
    } catch (e) {
      setState(() {
        _messages.add(ChatMessage(text: "Error: $e", isUser: false));
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
      _scrollToBottom();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ChatBotTheme.background,
      appBar: ChatBotTheme.buildAppBar(title: 'Melio Assistant'),
      body: Column(
        children: [
          //chat messages area
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 12.0,
              ),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  return _buildLoadingBubble();
                }
                final message = _messages[index];
                return _buildBubble(message);
              },
            ),
          ),

          //themed input bar
          _buildInputBar(),
        ],
      ),
    );
  }

  //forumlate bubble w chatbotTheme class
  Widget _buildBubble(ChatMessage message) {
    final isUser = message.isUser;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6.0),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        //rounded static decoration
        decoration: ChatBotTheme.bubbleDecoration(isUser: isUser),
        child: Text(
          message.text,
          //josefin sans bodylarge
          style: ChatBotTheme.melioTextTheme.bodyLarge,
        ),
      ),
    );
  }

  //typing/thinking indicator
  Widget _buildLoadingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6.0),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        decoration: ChatBotTheme.bubbleDecoration(isUser: false),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              "Melio is thinking...",
              style: ChatBotTheme.melioTextTheme.bodyLarge?.copyWith(
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
      ),
    );
  }

  //input box
  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
      color: Colors.white,
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _textController,
                style: const TextStyle(color: Colors.black87),
                onSubmitted: (_) => _sendMessage(),
                decoration: InputDecoration(
                  hintText: 'Ask Melio anything...',
                  hintStyle: TextStyle(color: Colors.grey.shade400),
                  filled: true,
                  fillColor: ChatBotTheme.background,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16.0,
                    vertical: 10.0,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24.0),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8.0),
            IconButton.filled(
              icon: const Icon(Icons.send_rounded),
              style: IconButton.styleFrom(
                backgroundColor: ChatBotTheme.userTextBox,
                foregroundColor: Colors.white,
              ),
              onPressed: _sendMessage,
            ),
          ],
        ),
      ),
    );
  }
}
