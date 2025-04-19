
import { useState } from 'react';
import { GeminiChat } from '@/components/chatbot/GeminiChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';

const roleContexts = {
  admin: {
    title: 'Admin Assistant',
    description: 'School administration, policy making, and management',
    context: 'educational administration',
  },
  teacher: {
    title: 'Teacher Assistant',
    description: 'Curriculum planning, teaching methods, and student assessment',
    context: 'teaching and pedagogy',
  },
  student: {
    title: 'Student Assistant',
    description: 'Learning assistance, study tips, and academic guidance',
    context: 'student learning',
  },
};

export const RoleSpecificAIAssistant = () => {
  const { role } = useAuthStore();
  const contextData = role ? roleContexts[role as keyof typeof roleContexts] : roleContexts.student;

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>{contextData.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{contextData.description}</p>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <GeminiChat context={contextData.context} />
      </CardContent>
    </Card>
  );
};

