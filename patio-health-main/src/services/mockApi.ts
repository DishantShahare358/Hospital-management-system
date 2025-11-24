import { User, LoginCredentials, RegisterData } from '@/types/auth';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    email: 'dr.smith@hospital.com',
    name: 'Dr. Sarah Smith',
    role: 'doctor',
    specialization: 'Cardiology',
    department: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1594824204356-d2e7cb98f1b0?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    email: 'nurse.johnson@hospital.com',
    name: 'Nurse Emily Johnson',
    role: 'nurse',
    department: 'Emergency',
    avatar: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    email: 'patient@example.com',
    name: 'John Patient',
    role: 'patient',
    phone: '+1-555-0123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  {
    id: '5',
    email: 'receptionist@hospital.com',
    name: 'Receptionist Mary',
    role: 'receptionist',
    department: 'Administration',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  {
    id: '6',
    email: 'labtech@hospital.com',
    name: 'Lab Technician Tom',
    role: 'lab_technician',
    department: 'Laboratory',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  }
];

const mockDoctors = [
  {
    id: '2',
    name: 'Dr. Sarah Smith',
    specialization: 'Cardiology',
    department: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1594824204356-d2e7cb98f1b0?w=400&h=400&fit=crop',
    available: true,
    rating: 4.8
  },
  {
    id: '5',
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    department: 'Neurology',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    available: true,
    rating: 4.9
  },
  {
    id: '6',
    name: 'Dr. Lisa Anderson',
    specialization: 'Pediatrics',
    department: 'Pediatrics',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
    available: false,
    rating: 4.7
  }
];

const mockAppointments = [
  {
    id: '1',
    patientId: '4',
    doctorId: '2',
    patientName: 'John Patient',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-15',
    time: '10:00',
    status: 'pending',
    reason: 'Regular checkup'
  }
];

// Mock API functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      token: 'mock-jwt-token-' + user.id
    };
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      specialization: data.specialization,
      department: data.department,
      phone: data.phone
    };
    
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      token: 'mock-jwt-token-' + newUser.id
    };
  },

  verify: async (token: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userId = token.replace('mock-jwt-token-', '');
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Invalid token');
    }
    
    return user;
  }
};

export const hospitalApi = {
  getDoctors: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDoctors;
  },

  getAppointments: async (userId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (userId) {
      return mockAppointments.filter(apt => apt.patientId === userId || apt.doctorId === userId);
    }
    return mockAppointments;
  },

  bookAppointment: async (appointment: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAppointment = {
      id: Date.now().toString(),
      ...appointment,
      status: 'pending'
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  },

  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  }
};