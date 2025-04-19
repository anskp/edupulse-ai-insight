
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth-store';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  error?: {
    message: string;
  };
}

export const GeminiChat = ({ context = "education" }: { context?: string }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: `Hello! I'm your EduPulse AI assistant. How can I help you with your ${context} today?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme } = useAuthStore();
  
  const API_KEY = "AIzaSyCguSI_n0JLY1j_5WPn7RKckJMhFxVHi4U";
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');
    
    try {
      // Call Gemini API
      const themeContext = theme !== 'default' ? ` Your responses should be styled with a ${theme} theme when possible.` : '';
      
      const contextPrompt = `You are an educational assistant for a college platform called EduPulse.${themeContext} 
        You help with ${context}-related questions. Be concise, helpful, and accurate. 
        If asked about attendance, exams, or courses, provide general guidance on these topics.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: contextPrompt },
                  { text: input }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );
      
      const data: GeminiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const botMessage = { 
          role: 'bot' as const, 
          content: data.candidates[0].content.parts[0].text 
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No response from the model');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'bot', 
          content: 'I\'m sorry, I encountered an error processing your request. Please try again later.' 
        }
      ]);
      
      toast({
        title: "Error",
        description: "Failed to get response from the AI assistant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply different chat bubble styles based on theme
  const getThemeStyles = () => {
    switch (theme) {
      case 'car':
        return {
          userBubble: 'bg-blue-600 text-white',
          botBubble: 'bg-gray-200 text-gray-800',
        };
      case 'onepiece':
        return {
          userBubble: 'bg-red-600 text-white',
          botBubble: 'bg-yellow-100 text-gray-800 border border-yellow-400',
        };
      case 'robotic':
        return {
          userBubble: 'bg-gray-700 text-green-400 border border-green-400',
          botBubble: 'bg-gray-800 text-gray-100 border border-gray-600',
        };
      case 'mathematics':
        return {
          userBubble: 'bg-green-600 text-white',
          botBubble: 'bg-green-100 text-gray-800 border border-green-200',
        };
      case 'moana':
        return {
          userBubble: 'bg-cyan-600 text-white',
          botBubble: 'bg-blue-100 text-gray-800 border border-blue-200',
        };
      case 'flower':
        return {
          userBubble: 'bg-pink-500 text-white',
          botBubble: 'bg-pink-100 text-gray-800 border border-pink-200',
        };
      default:
        return {
          userBubble: 'bg-primary text-primary-foreground',
          botBubble: 'bg-muted text-muted-foreground',
        };
    }
  };
  
  const themeStyles = getThemeStyles();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user' 
                  ? themeStyles.userBubble
                  : themeStyles.botBubble
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className={`rounded-lg px-4 py-2 ${themeStyles.botBubble}`}>
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
