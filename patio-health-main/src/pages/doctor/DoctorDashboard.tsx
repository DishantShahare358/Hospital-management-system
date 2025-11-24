import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Users, 
  FileText, 
  ClipboardList,
  Activity,
  Clock,
  Stethoscope,
  Plus,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dummyAppointments, dummyPatients, dummyMedicalRecords, dummyLabTests, dummyDoctors } from '@/data/dummyData';
import { useAuth } from '@/contexts/AuthContext';
import type { Appointment, MedicalRecord, LabTest, Patient } from '@/data/dummyData';

const DoctorDashboard = () => {
  const { state } = useAuth();
  const { toast } = useToast();
  const doctorId = state.user?.id || '2';
  const doctorName = state.user?.name || 'Dr. Sarah Smith';

  // State management
  const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments.filter(apt => apt.doctorId === doctorId));
  const [patients] = useState<Patient[]>(dummyPatients);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(dummyMedicalRecords.filter(rec => rec.doctorId === doctorId));
  const [labTests, setLabTests] = useState<LabTest[]>(dummyLabTests.filter(test => test.doctorId === doctorId));

  // Modal states
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [labRequestModalOpen, setLabRequestModalOpen] = useState(false);
  const [viewPatientModalOpen, setViewPatientModalOpen] = useState(false);
  const [viewAppointmentModalOpen, setViewAppointmentModalOpen] = useState(false);
  const [viewRecordModalOpen, setViewRecordModalOpen] = useState(false);

  // Selected items
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  // Form states
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  const [recordForm, setRecordForm] = useState({
    patientId: '',
    diagnosis: '',
    prescription: [{ medicine: '', dosage: '', frequency: '' }],
    notes: ''
  });

  const [labRequestForm, setLabRequestForm] = useState({
    patientId: '',
    testType: '',
    notes: ''
  });

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  
  const patientVitalsData = [
    { name: 'Mon', temperature: 98.6, heartRate: 72, bp: 120 },
    { name: 'Tue', temperature: 98.4, heartRate: 70, bp: 118 },
    { name: 'Wed', temperature: 98.8, heartRate: 75, bp: 122 },
    { name: 'Thu', temperature: 98.5, heartRate: 73, bp: 119 },
    { name: 'Fri', temperature: 98.7, heartRate: 74, bp: 121 },
    { name: 'Sat', temperature: 98.6, heartRate: 72, bp: 120 },
    { name: 'Sun', temperature: 98.5, heartRate: 71, bp: 118 },
  ];

  // Appointment handlers
  const handleCreateAppointment = () => {
    if (!appointmentForm.patientId || !appointmentForm.date || !appointmentForm.time || !appointmentForm.reason) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const patient = patients.find(p => p.id === appointmentForm.patientId);
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId: appointmentForm.patientId,
      patientName: patient?.name || '',
      doctorId: doctorId,
      doctorName: doctorName,
      date: appointmentForm.date,
      time: appointmentForm.time,
      status: 'pending',
      reason: appointmentForm.reason,
      notes: appointmentForm.notes
    };

    setAppointments([...appointments, newAppointment]);
    setAppointmentModalOpen(false);
    setAppointmentForm({ patientId: '', date: '', time: '', reason: '', notes: '' });
    toast({
      title: 'Success',
      description: 'Appointment created successfully',
    });
  };

  const handleUpdateAppointmentStatus = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
    toast({
      title: 'Success',
      description: `Appointment ${status}`,
    });
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    toast({
      title: 'Success',
      description: 'Appointment deleted',
    });
  };

  // Medical Record handlers
  const handleCreateRecord = () => {
    if (!recordForm.patientId || !recordForm.diagnosis) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const patient = patients.find(p => p.id === recordForm.patientId);
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientId: recordForm.patientId,
      patientName: patient?.name || '',
      doctorId: doctorId,
      doctorName: doctorName,
      date: new Date().toISOString().split('T')[0],
      diagnosis: recordForm.diagnosis,
      prescription: recordForm.prescription.filter(p => p.medicine),
      notes: recordForm.notes
    };

    setMedicalRecords([...medicalRecords, newRecord]);
    setRecordModalOpen(false);
    setRecordForm({ patientId: '', diagnosis: '', prescription: [{ medicine: '', dosage: '', frequency: '' }], notes: '' });
    toast({
      title: 'Success',
      description: 'Medical record created successfully',
    });
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setEditingRecord(record);
    setRecordForm({
      patientId: record.patientId,
      diagnosis: record.diagnosis,
      prescription: record.prescription.length > 0 ? record.prescription : [{ medicine: '', dosage: '', frequency: '' }],
      notes: record.notes
    });
    setRecordModalOpen(true);
  };

  const handleUpdateRecord = () => {
    if (!editingRecord) return;

    setMedicalRecords(medicalRecords.map(rec => 
      rec.id === editingRecord.id ? {
        ...rec,
        diagnosis: recordForm.diagnosis,
        prescription: recordForm.prescription.filter(p => p.medicine),
        notes: recordForm.notes
      } : rec
    ));
    setRecordModalOpen(false);
    setEditingRecord(null);
    setRecordForm({ patientId: '', diagnosis: '', prescription: [{ medicine: '', dosage: '', frequency: '' }], notes: '' });
    toast({
      title: 'Success',
      description: 'Medical record updated successfully',
    });
  };

  const handleDeleteRecord = (id: string) => {
    setMedicalRecords(medicalRecords.filter(rec => rec.id !== id));
    toast({
      title: 'Success',
      description: 'Medical record deleted',
    });
  };

  const handleAddPrescription = () => {
    setRecordForm({
      ...recordForm,
      prescription: [...recordForm.prescription, { medicine: '', dosage: '', frequency: '' }]
    });
  };

  const handleRemovePrescription = (index: number) => {
    setRecordForm({
      ...recordForm,
      prescription: recordForm.prescription.filter((_, i) => i !== index)
    });
  };

  const handlePrescriptionChange = (index: number, field: string, value: string) => {
    const newPrescription = [...recordForm.prescription];
    newPrescription[index] = { ...newPrescription[index], [field]: value };
    setRecordForm({ ...recordForm, prescription: newPrescription });
  };

  // Lab Request handlers
  const handleCreateLabRequest = () => {
    if (!labRequestForm.patientId || !labRequestForm.testType) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const patient = patients.find(p => p.id === labRequestForm.patientId);
    const newLabTest: LabTest = {
      id: Date.now().toString(),
      patientId: labRequestForm.patientId,
      patientName: patient?.name || '',
      doctorId: doctorId,
      doctorName: doctorName,
      testType: labRequestForm.testType,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setLabTests([...labTests, newLabTest]);
    setLabRequestModalOpen(false);
    setLabRequestForm({ patientId: '', testType: '', notes: '' });
    toast({
      title: 'Success',
      description: 'Lab test requested successfully',
    });
  };

  const handleDeleteLabTest = (id: string) => {
    setLabTests(labTests.filter(test => test.id !== id));
    toast({
      title: 'Success',
      description: 'Lab test request deleted',
    });
  };

  const testTypes = ['Blood Test', 'MRI Scan', 'CT Scan', 'X-Ray', 'ECG', 'Ultrasound', 'Urine Test', 'Stool Test'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your patients and appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <ClipboardList className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labTests.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Lab test requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicalRecords.length}</div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </div>
              <Dialog open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Appointment</DialogTitle>
                    <DialogDescription>Schedule a new appointment with a patient</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Patient *</Label>
                      <Select value={appointmentForm.patientId} onValueChange={(value) => setAppointmentForm({ ...appointmentForm, patientId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date *</Label>
                        <Input type="date" value={appointmentForm.date} onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Time *</Label>
                        <Input type="time" value={appointmentForm.time} onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Visit *</Label>
                      <Input placeholder="e.g., Regular checkup" value={appointmentForm.reason} onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea placeholder="Additional notes..." value={appointmentForm.notes} onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAppointmentModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateAppointment}>Create Appointment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.time} - {apt.reason}</p>
                      </div>
                    </div>
                    <Badge variant={apt.status === 'confirmed' ? 'default' : 'outline'}>
                      {apt.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No appointments scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Vitals Trend</CardTitle>
            <CardDescription>Weekly vital signs overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={patientVitalsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="temperature" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="heartRate" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab-requests">Lab Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Your active patients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.bloodGroup}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setViewPatientModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* View Patient Modal */}
          <Dialog open={viewPatientModalOpen} onOpenChange={setViewPatientModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Patient Details</DialogTitle>
                <DialogDescription>Complete patient information</DialogDescription>
              </DialogHeader>
              {selectedPatient && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-medium">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date of Birth</Label>
                      <p className="font-medium">{selectedPatient.dateOfBirth}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Gender</Label>
                      <p className="font-medium capitalize">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Blood Group</Label>
                      <p className="font-medium">{selectedPatient.bloodGroup}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="font-medium">{selectedPatient.address}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Emergency Contact</Label>
                      <p className="font-medium">{selectedPatient.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Appointments</CardTitle>
                  <CardDescription>View and manage appointments</CardDescription>
                </div>
                <Dialog open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Appointment</DialogTitle>
                      <DialogDescription>Schedule a new appointment with a patient</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Patient *</Label>
                        <Select value={appointmentForm.patientId} onValueChange={(value) => setAppointmentForm({ ...appointmentForm, patientId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <Input type="date" value={appointmentForm.date} onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Time *</Label>
                          <Input type="time" value={appointmentForm.time} onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Reason for Visit *</Label>
                        <Input placeholder="e.g., Regular checkup" value={appointmentForm.reason} onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Additional notes..." value={appointmentForm.notes} onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAppointmentModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateAppointment}>Create Appointment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{apt.patientName}</TableCell>
                      <TableCell>{apt.date}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.reason}</TableCell>
                      <TableCell>
                        <Badge variant={
                          apt.status === 'confirmed' ? 'default' :
                          apt.status === 'completed' ? 'secondary' :
                          apt.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setViewAppointmentModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {apt.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {apt.status === 'confirmed' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteAppointment(apt.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* View Appointment Modal */}
          <Dialog open={viewAppointmentModalOpen} onOpenChange={setViewAppointmentModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
              </DialogHeader>
              {selectedAppointment && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Patient</Label>
                      <p className="font-medium">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date</Label>
                      <p className="font-medium">{selectedAppointment.date}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Time</Label>
                      <p className="font-medium">{selectedAppointment.time}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge variant={
                        selectedAppointment.status === 'confirmed' ? 'default' :
                        selectedAppointment.status === 'completed' ? 'secondary' :
                        selectedAppointment.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {selectedAppointment.status}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Reason</Label>
                      <p className="font-medium">{selectedAppointment.reason}</p>
                    </div>
                    {selectedAppointment.notes && (
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Notes</Label>
                        <p className="font-medium">{selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Patient medical history</CardDescription>
                </div>
                <Dialog open={recordModalOpen} onOpenChange={(open) => {
                  setRecordModalOpen(open);
                  if (!open) {
                    setEditingRecord(null);
                    setRecordForm({ patientId: '', diagnosis: '', prescription: [{ medicine: '', dosage: '', frequency: '' }], notes: '' });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingRecord ? 'Edit Medical Record' : 'Create Medical Record'}</DialogTitle>
                      <DialogDescription>Add or update patient medical record</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Patient *</Label>
                        <Select 
                          value={recordForm.patientId} 
                          onValueChange={(value) => setRecordForm({ ...recordForm, patientId: value })}
                          disabled={!!editingRecord}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Diagnosis *</Label>
                        <Input 
                          placeholder="Enter diagnosis" 
                          value={recordForm.diagnosis} 
                          onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Prescription</Label>
                          <Button type="button" variant="outline" size="sm" onClick={handleAddPrescription}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Medicine
                          </Button>
                        </div>
                        <div className="space-y-3 border rounded-lg p-4">
                          {recordForm.prescription.map((pres, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end">
                              <div className="col-span-4">
                                <Input 
                                  placeholder="Medicine name" 
                                  value={pres.medicine} 
                                  onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)} 
                                />
                              </div>
                              <div className="col-span-3">
                                <Input 
                                  placeholder="Dosage" 
                                  value={pres.dosage} 
                                  onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)} 
                                />
                              </div>
                              <div className="col-span-4">
                                <Input 
                                  placeholder="Frequency" 
                                  value={pres.frequency} 
                                  onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)} 
                                />
                              </div>
                              <div className="col-span-1">
                                {recordForm.prescription.length > 1 && (
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemovePrescription(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea 
                          placeholder="Additional notes..." 
                          value={recordForm.notes} 
                          onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} 
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setRecordModalOpen(false);
                        setEditingRecord(null);
                        setRecordForm({ patientId: '', diagnosis: '', prescription: [{ medicine: '', dosage: '', frequency: '' }], notes: '' });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={editingRecord ? handleUpdateRecord : handleCreateRecord}>
                        {editingRecord ? 'Update Record' : 'Create Record'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{record.patientName}</CardTitle>
                          <CardDescription>{record.date} - {record.doctorName}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>{record.diagnosis}</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Diagnosis:</p>
                          <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                        </div>
                        {record.prescription.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Prescription:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {record.prescription.map((med, idx) => (
                                <li key={idx}>{med.medicine} - {med.dosage} ({med.frequency})</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {record.notes && (
                          <div>
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-muted-foreground">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions</CardTitle>
              <CardDescription>All patient prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  record.prescription.length > 0 && (
                    <Card key={record.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{record.patientName}</CardTitle>
                            <CardDescription>{record.date} - {record.diagnosis}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Prescribed Medications:</p>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medicine</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Frequency</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {record.prescription.map((med, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">{med.medicine}</TableCell>
                                  <TableCell>{med.dosage}</TableCell>
                                  <TableCell>{med.frequency}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lab Test Requests</CardTitle>
                  <CardDescription>Request and view lab tests</CardDescription>
                </div>
                <Dialog open={labRequestModalOpen} onOpenChange={setLabRequestModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Request Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Lab Test</DialogTitle>
                      <DialogDescription>Create a new lab test request</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Patient *</Label>
                        <Select value={labRequestForm.patientId} onValueChange={(value) => setLabRequestForm({ ...labRequestForm, patientId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Test Type *</Label>
                        <Select value={labRequestForm.testType} onValueChange={(value) => setLabRequestForm({ ...labRequestForm, testType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                          <SelectContent>
                            {testTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Additional notes..." value={labRequestForm.notes} onChange={(e) => setLabRequestForm({ ...labRequestForm, notes: e.target.value })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setLabRequestModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateLabRequest}>Request Test</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.patientName}</TableCell>
                      <TableCell>{test.testType}</TableCell>
                      <TableCell>{test.requestedDate}</TableCell>
                      <TableCell>
                        <Badge variant={
                          test.status === 'completed' ? 'default' :
                          test.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {test.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteLabTest(test.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                        {test.status === 'completed' && test.result && (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Result
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
