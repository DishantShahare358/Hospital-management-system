// Comprehensive dummy data for Hospital Management System

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  phone: string;
  avatar?: string;
  available: boolean;
  rating: number;
  experience: number;
}

export interface Nurse {
  id: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  avatar?: string;
  shift: 'morning' | 'afternoon' | 'night';
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  address: string;
  avatar?: string;
  emergencyContact: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testType: string;
  requestedDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  result?: string;
  technicianId?: string;
  completedDate?: string;
}

export interface Billing {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid' | 'overdue';
  items: Array<{
    description: string;
    amount: number;
  }>;
  paymentMethod?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  prescription: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
  }>;
  notes: string;
}

export interface Schedule {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlots: Array<{
    time: string;
    available: boolean;
    appointmentId?: string;
  }>;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  bedCount: number;
  occupiedBeds: number;
}

export interface VitalSign {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  recordedBy: string;
}

// Dummy Data
export const dummyDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    email: 'dr.smith@hospital.com',
    specialization: 'Cardiology',
    department: 'Cardiology',
    phone: '+1-555-0101',
    avatar: 'https://images.unsplash.com/photo-1594824204356-d2e7cb98f1b0?w=400&h=400&fit=crop',
    available: true,
    rating: 4.8,
    experience: 12
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'dr.chen@hospital.com',
    specialization: 'Neurology',
    department: 'Neurology',
    phone: '+1-555-0102',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    available: true,
    rating: 4.9,
    experience: 15
  },
  {
    id: '3',
    name: 'Dr. Lisa Anderson',
    email: 'dr.anderson@hospital.com',
    specialization: 'Pediatrics',
    department: 'Pediatrics',
    phone: '+1-555-0103',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop',
    available: false,
    rating: 4.7,
    experience: 10
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'dr.wilson@hospital.com',
    specialization: 'Orthopedics',
    department: 'Orthopedics',
    phone: '+1-555-0104',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop',
    available: true,
    rating: 4.6,
    experience: 8
  },
  {
    id: '5',
    name: 'Dr. Emily Davis',
    email: 'dr.davis@hospital.com',
    specialization: 'Dermatology',
    department: 'Dermatology',
    phone: '+1-555-0105',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    available: true,
    rating: 4.8,
    experience: 11
  }
];

export const dummyNurses: Nurse[] = [
  {
    id: '1',
    name: 'Nurse Emily Johnson',
    email: 'nurse.johnson@hospital.com',
    department: 'Emergency',
    phone: '+1-555-0201',
    avatar: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop',
    shift: 'morning'
  },
  {
    id: '2',
    name: 'Nurse Robert Brown',
    email: 'nurse.brown@hospital.com',
    department: 'ICU',
    phone: '+1-555-0202',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    shift: 'afternoon'
  },
  {
    id: '3',
    name: 'Nurse Maria Garcia',
    email: 'nurse.garcia@hospital.com',
    department: 'Cardiology',
    phone: '+1-555-0203',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    shift: 'night'
  }
];

export const dummyPatients: Patient[] = [
  {
    id: '1',
    name: 'John Patient',
    email: 'patient@example.com',
    phone: '+1-555-0301',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    bloodGroup: 'O+',
    address: '123 Main St, City, State',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    emergencyContact: '+1-555-9999'
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1-555-0302',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    bloodGroup: 'A+',
    address: '456 Oak Ave, City, State',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    emergencyContact: '+1-555-9998'
  },
  {
    id: '3',
    name: 'Robert Miller',
    email: 'robert.miller@example.com',
    phone: '+1-555-0303',
    dateOfBirth: '1978-12-10',
    gender: 'male',
    bloodGroup: 'B+',
    address: '789 Pine Rd, City, State',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    emergencyContact: '+1-555-9997'
  }
];

export const dummyAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Patient',
    doctorId: '1',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-15',
    time: '10:00',
    status: 'confirmed',
    reason: 'Regular checkup',
    notes: 'Follow-up appointment'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Doe',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-16',
    time: '14:30',
    status: 'pending',
    reason: 'Headache consultation'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Robert Miller',
    doctorId: '1',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-17',
    time: '09:00',
    status: 'completed',
    reason: 'Cardiac evaluation',
    notes: 'Patient responded well to treatment'
  }
];

export const dummyLabTests: LabTest[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Patient',
    doctorId: '1',
    doctorName: 'Dr. Sarah Smith',
    testType: 'Blood Test',
    requestedDate: '2024-01-10',
    status: 'completed',
    result: 'All parameters within normal range',
    technicianId: '1',
    completedDate: '2024-01-11'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Doe',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    testType: 'MRI Scan',
    requestedDate: '2024-01-12',
    status: 'in_progress'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Robert Miller',
    doctorId: '1',
    doctorName: 'Dr. Sarah Smith',
    testType: 'ECG',
    requestedDate: '2024-01-13',
    status: 'pending'
  }
];

export const dummyBilling: Billing[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Patient',
    amount: 450.00,
    date: '2024-01-15',
    status: 'paid',
    items: [
      { description: 'Consultation Fee', amount: 150.00 },
      { description: 'Lab Tests', amount: 200.00 },
      { description: 'Medication', amount: 100.00 }
    ],
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Doe',
    amount: 320.00,
    date: '2024-01-16',
    status: 'pending',
    items: [
      { description: 'Consultation Fee', amount: 150.00 },
      { description: 'MRI Scan', amount: 170.00 }
    ]
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Robert Miller',
    amount: 280.00,
    date: '2024-01-17',
    status: 'paid',
    items: [
      { description: 'Consultation Fee', amount: 150.00 },
      { description: 'ECG', amount: 130.00 }
    ],
    paymentMethod: 'Cash'
  }
];

export const dummyMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Patient',
    doctorId: '1',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-15',
    diagnosis: 'Hypertension - Controlled',
    prescription: [
      { medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { medicine: 'Aspirin', dosage: '81mg', frequency: 'Once daily' }
    ],
    notes: 'Patient shows improvement. Continue current medication. Follow-up in 3 months.'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Doe',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-16',
    diagnosis: 'Migraine',
    prescription: [
      { medicine: 'Sumatriptan', dosage: '50mg', frequency: 'As needed' }
    ],
    notes: 'Patient reports frequent headaches. MRI scan recommended.'
  }
];

export const dummyDepartments: Department[] = [
  {
    id: '1',
    name: 'Cardiology',
    head: 'Dr. Sarah Smith',
    staffCount: 15,
    bedCount: 30,
    occupiedBeds: 22
  },
  {
    id: '2',
    name: 'Neurology',
    head: 'Dr. Michael Chen',
    staffCount: 12,
    bedCount: 25,
    occupiedBeds: 18
  },
  {
    id: '3',
    name: 'Emergency',
    head: 'Dr. Emergency Head',
    staffCount: 20,
    bedCount: 40,
    occupiedBeds: 35
  },
  {
    id: '4',
    name: 'Pediatrics',
    head: 'Dr. Lisa Anderson',
    staffCount: 18,
    bedCount: 35,
    occupiedBeds: 28
  }
];

export const dummyVitalSigns: VitalSign[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Patient',
    date: '2024-01-15',
    time: '10:00',
    temperature: 98.6,
    bloodPressure: '120/80',
    heartRate: 72,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    recordedBy: 'Nurse Emily Johnson'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Doe',
    date: '2024-01-16',
    time: '14:30',
    temperature: 99.2,
    bloodPressure: '118/75',
    heartRate: 68,
    respiratoryRate: 18,
    oxygenSaturation: 97,
    recordedBy: 'Nurse Robert Brown'
  }
];

