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
  const { data: existingMarks } = await supabase
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
      course_code: 'CS101',
      course_name: 'Introduction to Programming',
      subject: 'Computer Science',
      internal_1: 85,
      internal_2: 88,
      internal_3: 92,
      external_exam: 82,
      series_exam: 90,
      predicted: 92,
      semester: 1,
      academic_year: '2024-25',
      department: 'Computer Science',
      batch_year: '2024'
    },
    {
      student_id: studentId,
      course_code: 'MA101',
      course_name: 'Engineering Mathematics I',
      subject: 'Mathematics',
      internal_1: 78,
      internal_2: 82,
      internal_3: 85,
      external_exam: 75,
      series_exam: 80,
      predicted: 83,
      semester: 1,
      academic_year: '2024-25',
      department: 'Computer Science',
      batch_year: '2024'
    },
    {
      student_id: studentId,
      course_code: 'PH101',
      course_name: 'Engineering Physics',
      subject: 'Physics',
      internal_1: 72,
      internal_2: 68,
      internal_3: 75,
      external_exam: 70,
      series_exam: 75,
      predicted: 78,
      semester: 1,
      academic_year: '2024-25',
      department: 'Computer Science',
      batch_year: '2024'
    }
  ];

  try {
    const { error } = await supabase
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
  const { data: existingBadges } = await supabase
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
    const { error } = await supabase
      .from('badges')
      .insert(sampleBadges);

    if (error) throw error;
    console.log('Sample badges inserted successfully');
  } catch (error) {
    console.error('Error inserting sample badges:', error);
  }
};

// Function to generate random student data for teachers
export const generateRandomStudentData = (count: number = 20) => {
  const firstNames = ['Rahul', 'Priya', 'Ananya', 'Vikram', 'Neha', 'Arjun', 'Meera', 'Rohan', 'Divya', 'Aditya'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Reddy', 'Das', 'Joshi', 'Malhotra'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const grades = ['9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C'];
  
  const students = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];
    
    const internal1 = Math.floor(Math.random() * 30) + 60; // 60-90
    const internal2 = Math.floor(Math.random() * 30) + 60; // 60-90
    const midTerm = Math.floor(Math.random() * 30) + 60; // 60-90
    const preFinal = Math.floor(Math.random() * 30) + 60; // 60-90
    const predicted = Math.round((internal1 + internal2 + midTerm + preFinal) / 4 * 1.05);
    
    const attendance = Math.floor(Math.random() * 20) + 80; // 80-100%
    
    students.push({
      id: (i + 1).toString(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edu`,
      grade,
      section,
      rollNumber: `${grade[0]}${section}${Math.floor(Math.random() * 1000)}`,
      internal1,
      internal2,
      midTerm,
      preFinal,
      predicted,
      attendance: `${attendance}%`,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      parentName: `Parent of ${firstName} ${lastName}`,
      parentContact: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      address: `${Math.floor(Math.random() * 1000) + 1} Main Street, ${['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'][Math.floor(Math.random() * 5)]}`,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      subjectPerformance: subjects.map(subject => ({
        subject,
        internal1: Math.floor(Math.random() * 30) + 60,
        internal2: Math.floor(Math.random() * 30) + 60,
        midTerm: Math.floor(Math.random() * 30) + 60,
        preFinal: Math.floor(Math.random() * 30) + 60,
        predicted: Math.floor(Math.random() * 20) + 75,
      })),
      risk: internal1 < 70 || attendance < 85 ? 
             'High' : 
             (internal1 < 80 || attendance < 90 ? 'Medium' : 'Low'),
      riskFactors: []
    });
    
    // Add risk factors
    const student = students[i];
    if (student.internal1 < 70) student.riskFactors.push('Low internal marks');
    if (parseInt(student.attendance) < 85) student.riskFactors.push('Poor attendance');
    if (student.internal2 < student.internal1) student.riskFactors.push('Declining performance');
    if (student.riskFactors.length === 0) student.riskFactors.push('None');
  }
  
  return students;
};

// Function to generate random teacher data for admin
export const generateRandomTeacherData = (count: number = 10) => {
  const firstNames = ['Prakash', 'Sona', 'Rajiv', 'Priya', 'Vikram', 'Anjali', 'Deepak', 'Nandini', 'Suresh', 'Kavita'];
  const lastNames = ['Sharma', 'Gupta', 'Mehta', 'Desai', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Joshi', 'Malhotra'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const education = [
    'M.Sc. Mathematics', 
    'Ph.D. Chemistry', 
    'M.A. English Literature', 
    'M.A. History', 
    'M.Tech Computer Science',
    'B.Ed with Mathematics',
    'M.Sc. Physics',
    'Ph.D. Biology',
    'M.A. Economics',
    'M.Phil. Political Science'
  ];
  const classes = ['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];
  
  const teachers = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const educationDegree = education[Math.floor(Math.random() * education.length)];
    
    // Assign 2-3 random classes to each teacher
    const assignedClasses = [];
    const numClasses = Math.floor(Math.random() * 2) + 2; // 2-3 classes
    for (let j = 0; j < numClasses; j++) {
      const cls = classes[Math.floor(Math.random() * classes.length)];
      if (!assignedClasses.includes(cls)) {
        assignedClasses.push(cls);
      }
    }
    
    teachers.push({
      id: (i + 1).toString(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@edupulse.com`,
      subject,
      phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      education: educationDegree,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 1000) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      classes: assignedClasses,
    });
  }
  
  return teachers;
};

// Function to generate sample marks data for charts
export const generateChartData = () => {
  // Performance trend data for admin/teacher dashboard
  const performanceTrendData = Array(6).fill(0).map((_, i) => {
    const month = new Date(2025, i, 1).toLocaleString('default', { month: 'short' });
    return {
      month,
      avg: Math.floor(Math.random() * 10) + 75 // 75-85
    };
  });
  
  // Class performance data for charts
  const classPerformanceData = ['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'].map(className => {
    const avg = Math.floor(Math.random() * 15) + 70; // 70-85
    const min = Math.floor(Math.random() * 30) + 40; // 40-70
    const max = Math.floor(Math.random() * 15) + 85; // 85-100
    
    return {
      name: `Class ${className}`,
      avg,
      min,
      max
    };
  });
  
  // Subject performance data
  const subjectPerformanceData = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'].map(subject => {
    const passing = Math.floor(Math.random() * 20) + 75; // 75-95%
    const distinction = Math.floor(Math.random() * 30) + 20; // 20-50%
    
    return {
      subject,
      passing,
      distinction
    };
  });
  
  // Attendance data
  const attendanceData = ['9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'].map(className => {
    return {
      name: `Class ${className}`,
      attendance: Math.floor(Math.random() * 15) + 80 // 80-95%
    };
  });
  
  // AI prediction accuracy data
  const predictionAccuracyData = Array(5).fill(0).map((_, i) => {
    const term = `Term ${i + 1}`;
    return {
      term,
      accuracy: Math.floor(Math.random() * 15) + 80 // 80-95%
    };
  });
  
  return {
    performanceTrendData,
    classPerformanceData,
    subjectPerformanceData,
    attendanceData,
    predictionAccuracyData
  };
};
