import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'chatbox_message.dart';

void main() async {
  // Ensure Flutter engine bindings are ready before reading configuration files
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  
  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: ChatBotPage(),
  ));
}

class ChatBotPage extends StatefulWidget {
  const ChatBotPage({super.key});

  @override
  State<ChatBotPage> createState() => _ChatBotPageState();
}

class _ChatBotPageState extends State<ChatBotPage> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  late final GenerativeModel _model; // Correct class from google_generative_ai package
  late final ChatSession _chat;
  bool _isLoading = false; // Declared missing variable for loading states

  final List<ChatBoxMessage> _messages = [
    ChatBoxMessage(text: "Hello! I am your AI assistant. How can I help you today?", isUser: false, timestamp: DateTime.now()),
  ];

  @override 
  void initState() {
    super.initState();
    
    // 1. Fetch your securely stored key from dotenv using your exact key string
    final key = dotenv.env['GOOGLE_GEN_AI_API_KEY'];
    if (key == null || key.isEmpty) {
      throw Exception("Google Generative AI API key is not set. Please check your .env file.");
    }
    
    // 2. Initialize the official Gemini model correctly
    _model = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: key,
    );
    
    // 3. Start a multi-turn continuous conversation thread
    _chat = _model.startChat();
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

  // 4. Added async designation to safely await the network request
  void _handleSubmitted() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _isLoading) return;
      
    _controller.clear();
    setState(() {
      _messages.add(
        ChatBoxMessage(
          text: text, 
          isUser: true, 
          timestamp: DateTime.now(),
        ),
      );
      _isLoading = true; // Turn loading on
    });
    _scrollToBottom();

    try {
      // 5. Send message inside the active multi-turn context wrapper
      final response = await _chat.sendMessage(Content.text(text));
      final botResponse = response.text ?? "I'm sorry, I couldn't compute an output.";

      setState(() {
        _messages.add(
          ChatBoxMessage(
            text: botResponse,
            isUser: false,
            timestamp: DateTime.now(),
          ),
        );
      });
    } catch (e) {
      setState(() {
        _messages.add(
          ChatBoxMessage(
            text: "Error: Failed to connect to AI server.",
            isUser: false,
            timestamp: DateTime.now(),
          ),
        );
      });
    } finally {
      setState(() {
        _isLoading = false; // Turn loading off
      });
      _scrollToBottom();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('ChatBot', style: GoogleFonts.roboto(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0.5,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                controller: _scrollController, // Connected scroll controller here
                padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final message = _messages[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4.0),
                    child: Align(
                      alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.of(context).size.width * 0.75, // Cap bubble widths
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
                        decoration: BoxDecoration(
                          color: message.isUser ? Colors.blueAccent : Colors.grey[200],
                          borderRadius: BorderRadius.only(
                            topLeft: const Radius.circular(12.0),
                            topRight: const Radius.circular(12.0),
                            bottomLeft: Radius.circular(message.isUser ? 12.0 : 0),
                            bottomRight: Radius.circular(message.isUser ? 0 : 12.0),
                          ),
                        ),
                        child: Text(
                          message.text, 
                          style: GoogleFonts.roboto(
                            color: message.isUser ? Colors.white : Colors.black87,
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            
            // Loading indicator display row
            if (_isLoading)
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Row(
                    children: [
                      const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.blueAccent),
                      ),
                      const SizedBox(width: 8),
                      Text("Bot is generating response...", style: GoogleFonts.roboto(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                ),
              ),
            
            const Divider(height: 1),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textCapitalization: TextCapitalization.sentences,
                      enabled: !_isLoading,
                      decoration: const InputDecoration(
                        hintText: 'Type your message...',
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 12.0),
                      ),
                      onSubmitted: (_) => _handleSubmitted(),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.send, color: _isLoading ? Colors.grey : Colors.blueAccent),
                    onPressed: _isLoading ? null : _handleSubmitted,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
