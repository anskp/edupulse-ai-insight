
import { supabase } from '@/integrations/supabase/client';

export const insertSampleStudentData = async () => {
  const { data: existingUser, error: userCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'sample.student@edupulse.com')
    .single();

  if (userCheckError || !existingUser) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'sample.student@edupulse.com',
      password: 'SampleStudent123!',
      options: {
        data: {
          first_name: 'Sample',
          last_name: 'Student',
          role: 'student'
        }
      }
    });

    if (signUpError) {
      console.error('Error creating sample student:', signUpError);
      return null;
    }

    const userId = signUpData.user?.id;
    if (userId) {
      await insertSampleMarks(userId);
      await insertSampleBadges(userId);
    }
    
    return userId;
  }

  const userId = existingUser.id;
  await insertSampleMarks(userId);
  await insertSampleBadges(userId);
  
  return userId;
};

const insertSampleMarks = async (studentId: string) => {
  // Check if marks already exist for this student
  const { data: existingMarks } = await (supabase as any)
    .from('marks')
    .select('id')
    .eq('student_id', studentId)
    .limit(1);

  if (existingMarks && existingMarks.length > 0) {
    console.log('Sample marks already exist for this student');
    return;
  }

  // Sample mark data
  const sampleMarks = [
    {
      student_id: studentId,
      subject: 'Mathematics',
      internal1: 85,
      internal2: 88,
      mid_term: 82,
      pre_final: 90,
      predicted: 92,
      term: 'Spring 2025'
    },
    {
      student_id: studentId,
      subject: 'Science',
      internal1: 78,
      internal2: 82,
      mid_term: 75,
      pre_final: 80,
      predicted: 83,
      term: 'Spring 2025'
    },
    {
      student_id: studentId,
      subject: 'History',
      internal1: 72,
      internal2: 68,
      mid_term: 70,
      pre_final: 75,
      predicted: 78,
      term: 'Spring 2025'
    },
    {
      student_id: studentId,
      subject: 'English',
      internal1: 90,
      internal2: 92,
      mid_term: 88,
      pre_final: 95,
      predicted: 94,
      term: 'Spring 2025'
    },
    {
      student_id: studentId,
      subject: 'Computer Science',
      internal1: 95,
      internal2: 92,
      mid_term: 90,
      pre_final: 98,
      predicted: 96,
      term: 'Spring 2025'
    }
  ];

  try {
    const { error } = await (supabase as any)
      .from('marks')
      .insert(sampleMarks);

    if (error) throw error;
    console.log('Sample marks inserted successfully');
  } catch (error) {
    console.error('Error inserting sample marks:', error);
  }
};

const insertSampleBadges = async (studentId: string) => {
  // Check if badges already exist for this student
  const { data: existingBadges } = await (supabase as any)
    .from('badges')
    .select('id')
    .eq('student_id', studentId)
    .limit(1);

  if (existingBadges && existingBadges.length > 0) {
    console.log('Sample badges already exist for this student');
    return;
  }

  // Sample badge data
  const sampleBadges = [
    {
      student_id: studentId,
      name: 'Math Star',
      description: 'Outstanding performance in Mathematics',
      achieved_at: new Date().toISOString(),
    },
    {
      student_id: studentId,
      name: 'Perfect Attendance',
      description: 'Never missed a class all semester',
      achieved_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      student_id: studentId,
      name: 'Science Explorer',
      description: 'Top performer in Science projects',
      achieved_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  try {
    const { error } = await (supabase as any)
      .from('badges')
      .insert(sampleBadges);

    if (error) throw error;
    console.log('Sample badges inserted successfully');
  } catch (error) {
    console.error('Error inserting sample badges:', error);
  }
};
