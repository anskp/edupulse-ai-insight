
import { useState } from 'react';
import { GeminiChat } from '@/components/chatbot/GeminiChat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const roleContexts = {
  admin: {
    title: 'Admin Assistant',
    description: 'School administration, policy making, and management',
    context: 'educational administration',
    prompts: [
      "How can I improve student attendance rates?",
      "What are best practices for teacher evaluations?",
      "How to implement effective academic policies?"
    ]
  },
  teacher: {
    title: 'Teacher Assistant',
    description: 'Curriculum planning, teaching methods, and student assessment',
    context: 'teaching and pedagogy',
    prompts: [
      "How can I make my lessons more engaging?",
      "What are effective grading strategies?",
      "How to identify and help struggling students?"
    ]
  },
  student: {
    title: 'Student Assistant',
    description: 'Learning assistance, study tips, and academic guidance',
    context: 'student learning',
    prompts: [
      "How can I improve my study habits?",
      "What are effective note-taking strategies?",
      "How to prepare for exams more efficiently?"
    ]
  },
};

export const RoleSpecificAIAssistant = () => {
  const { role, theme } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('chat');
  
  const contextData = role ? roleContexts[role as keyof typeof roleContexts] : roleContexts.student;
  
  // Get theme-specific styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'car':
        return 'bg-gradient-to-br from-blue-900 to-blue-800 text-white';
      case 'onepiece':
        return 'bg-gradient-to-br from-red-600 to-yellow-500 text-white';
      case 'robotic':
        return 'bg-gradient-to-br from-gray-900 to-gray-800 text-green-400';
      case 'mathematics':
        return 'bg-gradient-to-br from-green-700 to-green-600 text-white';
      case 'moana':
        return 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white';
      case 'flower':
        return 'bg-gradient-to-br from-pink-500 to-rose-400 text-white';
      default:
        return '';
    }
  };

  return (
    <Card className="h-[600px] overflow-hidden">
      <CardHeader className={getThemeStyles()}>
        <CardTitle>{contextData.title}</CardTitle>
        <CardDescription className={theme !== 'default' ? 'text-white/80' : ''}>
          {contextData.description}
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100%-5rem)]">
        <div className="px-4 border-b">
          <TabsList className="grid w-full grid-cols-2 my-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chat" className="h-full mt-0">
          <CardContent className="h-full pt-4">
            <GeminiChat context={contextData.context} />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="suggestions" className="h-full mt-0">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Here are some suggested topics you can discuss with the AI assistant:
              </p>
              <div className="grid gap-2">
                {contextData.prompts.map((prompt, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="justify-start text-left h-auto py-3"
                    onClick={() => {
                      // This would ideally trigger the chat with this prompt
                      setActiveTab('chat');
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-2">What you can ask:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {role === 'admin' && (
                    <>
                      <li>Administrative policy questions</li>
                      <li>Leadership strategies</li>
                      <li>Staff management techniques</li>
                      <li>Educational regulations</li>
                    </>
                  )}
                  
                  {role === 'teacher' && (
                    <>
                      <li>Lesson planning ideas</li>
                      <li>Classroom management techniques</li>
                      <li>Assessment strategies</li>
                      <li>Educational psychology insights</li>
                    </>
                  )}
                  
                  {role === 'student' && (
                    <>
                      <li>Study techniques</li>
                      <li>Assignment help</li>
                      <li>Academic planning</li>
                      <li>Career guidance</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
