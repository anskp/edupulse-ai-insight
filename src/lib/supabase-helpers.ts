
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

    return signUpData.user?.id;
  }

  return existingUser.id;
};
