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
  Users, 
  Stethoscope, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  Activity,
  TrendingUp,
  Building2,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  dummyDoctors, 
  dummyNurses, 
  dummyPatients, 
  dummyAppointments, 
  dummyBilling, 
  dummyDepartments,
  type Doctor,
  type Nurse,
  type Department,
  type Appointment,
  type Billing
} from '@/data/dummyData';

const AdminDashboard = () => {
  const { toast } = useToast();

  // State management
  const [doctors, setDoctors] = useState<Doctor[]>(dummyDoctors);
  const [nurses, setNurses] = useState<Nurse[]>(dummyNurses);
  const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments);
  const [billing, setBilling] = useState<Billing[]>(dummyBilling);
  const [departments, setDepartments] = useState<Department[]>(dummyDepartments);

  // Modal states
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [viewAppointmentModalOpen, setViewAppointmentModalOpen] = useState(false);
  const [viewBillingModalOpen, setViewBillingModalOpen] = useState(false);

  // Selected items
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [editingStaff, setEditingStaff] = useState<Doctor | Nurse | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [staffType, setStaffType] = useState<'doctor' | 'nurse'>('doctor');

  // Form states
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    available: true,
    shift: 'morning' as 'morning' | 'afternoon' | 'night',
    experience: '',
    rating: ''
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    head: '',
    staffCount: '',
    bedCount: '',
    occupiedBeds: ''
  });

  const [billingForm, setBillingForm] = useState({
    patientId: '',
    items: [{ description: '', amount: '' }],
    paymentMethod: ''
  });

  // Calculate dynamic stats
  const totalRevenue = billing
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const stats = [
    { label: 'Total Doctors', value: doctors.length, icon: Stethoscope, color: 'text-blue-500' },
    { label: 'Total Nurses', value: nurses.length, icon: UserCheck, color: 'text-green-500' },
    { label: 'Total Patients', value: dummyPatients.length, icon: Users, color: 'text-purple-500' },
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-500' },
  ];

  // Generate chart data from actual data
  const chartData = [
    { name: 'Jan', admissions: 45, discharges: 38, occupancy: 85 },
    { name: 'Feb', admissions: 52, discharges: 42, occupancy: 88 },
    { name: 'Mar', admissions: 48, discharges: 40, occupancy: 87 },
    { name: 'Apr', admissions: 61, discharges: 55, occupancy: 92 },
    { name: 'May', admissions: 55, discharges: 48, occupancy: 90 },
    { name: 'Jun', admissions: 67, discharges: 60, occupancy: 94 },
  ];

  const bedOccupancyData = departments.map(dept => ({
    name: dept.name,
    occupied: dept.occupiedBeds,
    total: dept.bedCount,
    occupancy: Math.round((dept.occupiedBeds / dept.bedCount) * 100)
  }));

  // Staff Management Handlers
  const handleCreateStaff = () => {
    if (!staffForm.name || !staffForm.email || !staffForm.phone || !staffForm.department) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (staffType === 'doctor') {
      if (!staffForm.specialization) {
        toast({
          title: 'Validation Error',
          description: 'Specialization is required for doctors',
          variant: 'destructive',
        });
        return;
      }

      const newDoctor: Doctor = {
        id: Date.now().toString(),
        name: staffForm.name,
        email: staffForm.email,
        phone: staffForm.phone,
        specialization: staffForm.specialization,
        department: staffForm.department,
        available: staffForm.available,
        rating: parseFloat(staffForm.rating) || 4.5,
        experience: parseInt(staffForm.experience) || 5
      };

      setDoctors([...doctors, newDoctor]);
    } else {
      const newNurse: Nurse = {
        id: Date.now().toString(),
        name: staffForm.name,
        email: staffForm.email,
        phone: staffForm.phone,
        department: staffForm.department,
        shift: staffForm.shift
      };

      setNurses([...nurses, newNurse]);
    }

    setStaffModalOpen(false);
    resetStaffForm();
    toast({
      title: 'Success',
      description: `${staffType === 'doctor' ? 'Doctor' : 'Nurse'} added successfully`,
    });
  };

  const handleEditStaff = (staff: Doctor | Nurse) => {
    setEditingStaff(staff);
    setStaffType('specialization' in staff ? 'doctor' : 'nurse');
    setStaffForm({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      specialization: 'specialization' in staff ? staff.specialization : '',
      department: staff.department,
      available: 'available' in staff ? staff.available : true,
      shift: 'shift' in staff ? staff.shift : 'morning',
      experience: 'experience' in staff ? staff.experience.toString() : '',
      rating: 'rating' in staff ? staff.rating.toString() : ''
    });
    setStaffModalOpen(true);
  };

  const handleUpdateStaff = () => {
    if (!editingStaff) return;

    if (staffType === 'doctor' && 'specialization' in editingStaff) {
      setDoctors(doctors.map(doc => 
        doc.id === editingStaff.id ? {
          ...doc,
          name: staffForm.name,
          email: staffForm.email,
          phone: staffForm.phone,
          specialization: staffForm.specialization,
          department: staffForm.department,
          available: staffForm.available,
          rating: parseFloat(staffForm.rating) || doc.rating,
          experience: parseInt(staffForm.experience) || doc.experience
        } : doc
      ));
    } else if (staffType === 'nurse' && 'shift' in editingStaff) {
      setNurses(nurses.map(nurse => 
        nurse.id === editingStaff.id ? {
          ...nurse,
          name: staffForm.name,
          email: staffForm.email,
          phone: staffForm.phone,
          department: staffForm.department,
          shift: staffForm.shift
        } : nurse
      ));
    }

    setStaffModalOpen(false);
    setEditingStaff(null);
    resetStaffForm();
    toast({
      title: 'Success',
      description: 'Staff updated successfully',
    });
  };

  const handleDeleteStaff = (id: string, type: 'doctor' | 'nurse') => {
    if (type === 'doctor') {
      setDoctors(doctors.filter(doc => doc.id !== id));
    } else {
      setNurses(nurses.filter(nurse => nurse.id !== id));
    }
    toast({
      title: 'Success',
      description: 'Staff member deleted',
    });
  };

  const resetStaffForm = () => {
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      department: '',
      available: true,
      shift: 'morning',
      experience: '',
      rating: ''
    });
  };

  // Department Handlers
  const handleCreateDepartment = () => {
    if (!departmentForm.name || !departmentForm.head) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newDepartment: Department = {
      id: Date.now().toString(),
      name: departmentForm.name,
      head: departmentForm.head,
      staffCount: parseInt(departmentForm.staffCount) || 0,
      bedCount: parseInt(departmentForm.bedCount) || 0,
      occupiedBeds: parseInt(departmentForm.occupiedBeds) || 0
    };

    setDepartments([...departments, newDepartment]);
    setDepartmentModalOpen(false);
    resetDepartmentForm();
    toast({
      title: 'Success',
      description: 'Department created successfully',
    });
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setDepartmentForm({
      name: dept.name,
      head: dept.head,
      staffCount: dept.staffCount.toString(),
      bedCount: dept.bedCount.toString(),
      occupiedBeds: dept.occupiedBeds.toString()
    });
    setDepartmentModalOpen(true);
  };

  const handleUpdateDepartment = () => {
    if (!editingDepartment) return;

    setDepartments(departments.map(dept => 
      dept.id === editingDepartment.id ? {
        ...dept,
        name: departmentForm.name,
        head: departmentForm.head,
        staffCount: parseInt(departmentForm.staffCount) || dept.staffCount,
        bedCount: parseInt(departmentForm.bedCount) || dept.bedCount,
        occupiedBeds: parseInt(departmentForm.occupiedBeds) || dept.occupiedBeds
      } : dept
    ));

    setDepartmentModalOpen(false);
    setEditingDepartment(null);
    resetDepartmentForm();
    toast({
      title: 'Success',
      description: 'Department updated successfully',
    });
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    toast({
      title: 'Success',
      description: 'Department deleted',
    });
  };

  const resetDepartmentForm = () => {
    setDepartmentForm({
      name: '',
      head: '',
      staffCount: '',
      bedCount: '',
      occupiedBeds: ''
    });
  };

  // Appointment Handlers
  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
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

  // Billing Handlers
  const handleCreateBilling = () => {
    if (!billingForm.patientId || billingForm.items.length === 0 || !billingForm.items[0].description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const patient = dummyPatients.find(p => p.id === billingForm.patientId);
    const totalAmount = billingForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    const newBilling: Billing = {
      id: Date.now().toString(),
      patientId: billingForm.patientId,
      patientName: patient?.name || '',
      amount: totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: billingForm.items.map(item => ({
        description: item.description,
        amount: parseFloat(item.amount) || 0
      })),
      paymentMethod: billingForm.paymentMethod || undefined
    };

    setBilling([...billing, newBilling]);
    setBillingModalOpen(false);
    resetBillingForm();
    toast({
      title: 'Success',
      description: 'Billing record created successfully',
    });
  };

  const handleUpdateBillingStatus = (id: string, status: Billing['status'], paymentMethod?: string) => {
    setBilling(billing.map(bill => 
      bill.id === id ? { ...bill, status, paymentMethod } : bill
    ));
    toast({
      title: 'Success',
      description: `Billing status updated to ${status}`,
    });
  };

  const handleDeleteBilling = (id: string) => {
    setBilling(billing.filter(bill => bill.id !== id));
    toast({
      title: 'Success',
      description: 'Billing record deleted',
    });
  };

  const handleAddBillingItem = () => {
    setBillingForm({
      ...billingForm,
      items: [...billingForm.items, { description: '', amount: '' }]
    });
  };

  const handleRemoveBillingItem = (index: number) => {
    setBillingForm({
      ...billingForm,
      items: billingForm.items.filter((_, i) => i !== index)
    });
  };

  const handleBillingItemChange = (index: number, field: string, value: string) => {
    const newItems = [...billingForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setBillingForm({ ...billingForm, items: newItems });
  };

  const resetBillingForm = () => {
    setBillingForm({
      patientId: '',
      items: [{ description: '', amount: '' }],
      paymentMethod: ''
    });
  };

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Gynecology', 'Psychiatry', 'Emergency Medicine', 'Internal Medicine', 'Surgery'
  ];

  const departmentsList = [
    'Emergency', 'ICU', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'Surgery', 'Radiology', 'Laboratory', 'Pharmacy', 'Administration'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your hospital operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admissions & Discharges</CardTitle>
            <CardDescription>Monthly statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="admissions" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="discharges" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bed Occupancy by Department</CardTitle>
            <CardDescription>Current occupancy rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bedOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" fill="#3b82f6" />
                <Bar dataKey="total" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>Manage doctors, nurses, and staff</CardDescription>
                </div>
                <Dialog open={staffModalOpen} onOpenChange={(open) => {
                  setStaffModalOpen(open);
                  if (!open) {
                    setEditingStaff(null);
                    resetStaffForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
                      <DialogDescription>
                        {editingStaff ? 'Update staff member information' : 'Add a new doctor or nurse to the system'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Staff Type *</Label>
                        <Select 
                          value={staffType} 
                          onValueChange={(value: 'doctor' | 'nurse') => setStaffType(value)}
                          disabled={!!editingStaff}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="nurse">Nurse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input 
                          placeholder="Enter full name" 
                          value={staffForm.name} 
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input 
                          type="email" 
                          placeholder="Enter email" 
                          value={staffForm.email} 
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone *</Label>
                        <Input 
                          type="tel" 
                          placeholder="Enter phone number" 
                          value={staffForm.phone} 
                          onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Department *</Label>
                        <Select 
                          value={staffForm.department} 
                          onValueChange={(value) => setStaffForm({ ...staffForm, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentsList.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {staffType === 'doctor' && (
                        <>
                          <div className="space-y-2">
                            <Label>Specialization *</Label>
                            <Select 
                              value={staffForm.specialization} 
                              onValueChange={(value) => setStaffForm({ ...staffForm, specialization: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select specialization" />
                              </SelectTrigger>
                              <SelectContent>
                                {specializations.map((spec) => (
                                  <SelectItem key={spec} value={spec}>
                                    {spec}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Experience (years)</Label>
                              <Input 
                                type="number" 
                                placeholder="Years" 
                                value={staffForm.experience} 
                                onChange={(e) => setStaffForm({ ...staffForm, experience: e.target.value })} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Rating</Label>
                              <Input 
                                type="number" 
                                step="0.1" 
                                min="0" 
                                max="5" 
                                placeholder="4.5" 
                                value={staffForm.rating} 
                                onChange={(e) => setStaffForm({ ...staffForm, rating: e.target.value })} 
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="available" 
                              checked={staffForm.available} 
                              onChange={(e) => setStaffForm({ ...staffForm, available: e.target.checked })} 
                              className="rounded"
                            />
                            <Label htmlFor="available">Available</Label>
                          </div>
                        </>
                      )}
                      {staffType === 'nurse' && (
                        <div className="space-y-2">
                          <Label>Shift *</Label>
                          <Select 
                            value={staffForm.shift} 
                            onValueChange={(value: 'morning' | 'afternoon' | 'night') => setStaffForm({ ...staffForm, shift: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning</SelectItem>
                              <SelectItem value="afternoon">Afternoon</SelectItem>
                              <SelectItem value="night">Night</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setStaffModalOpen(false);
                        setEditingStaff(null);
                        resetStaffForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={editingStaff ? handleUpdateStaff : handleCreateStaff}>
                        {editingStaff ? 'Update Staff' : 'Add Staff'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Doctors</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.department}</TableCell>
                          <TableCell>
                            <Badge variant={doctor.available ? 'default' : 'secondary'}>
                              {doctor.available ? 'Available' : 'Busy'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditStaff(doctor)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteStaff(doctor.id, 'doctor')}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Nurses</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nurses.map((nurse) => (
                        <TableRow key={nurse.id}>
                          <TableCell className="font-medium">{nurse.name}</TableCell>
                          <TableCell>{nurse.email}</TableCell>
                          <TableCell>{nurse.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{nurse.shift}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditStaff(nurse)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteStaff(nurse.id, 'nurse')}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>Manage hospital departments</CardDescription>
                </div>
                <Dialog open={departmentModalOpen} onOpenChange={(open) => {
                  setDepartmentModalOpen(open);
                  if (!open) {
                    setEditingDepartment(null);
                    resetDepartmentForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Building2 className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingDepartment ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                      <DialogDescription>
                        {editingDepartment ? 'Update department information' : 'Create a new department'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Department Name *</Label>
                        <Input 
                          placeholder="Enter department name" 
                          value={departmentForm.name} 
                          onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Department Head *</Label>
                        <Input 
                          placeholder="Enter department head name" 
                          value={departmentForm.head} 
                          onChange={(e) => setDepartmentForm({ ...departmentForm, head: e.target.value })} 
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Staff Count</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={departmentForm.staffCount} 
                            onChange={(e) => setDepartmentForm({ ...departmentForm, staffCount: e.target.value })} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Total Beds</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={departmentForm.bedCount} 
                            onChange={(e) => setDepartmentForm({ ...departmentForm, bedCount: e.target.value })} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Occupied Beds</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={departmentForm.occupiedBeds} 
                            onChange={(e) => setDepartmentForm({ ...departmentForm, occupiedBeds: e.target.value })} 
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setDepartmentModalOpen(false);
                        setEditingDepartment(null);
                        resetDepartmentForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}>
                        {editingDepartment ? 'Update Department' : 'Create Department'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <Card key={dept.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditDepartment(dept)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteDepartment(dept.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Head:</span>
                          <span className="text-sm font-medium">{dept.head}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Staff:</span>
                          <span className="text-sm font-medium">{dept.staffCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Beds:</span>
                          <span className="text-sm font-medium">
                            {dept.occupiedBeds}/{dept.bedCount}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Occupancy</span>
                            <span>{Math.round((dept.occupiedBeds / dept.bedCount) * 100) || 0}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(dept.occupiedBeds / dept.bedCount) * 100 || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>View and manage all appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
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
                      <TableCell>{apt.doctorName}</TableCell>
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
                      <Label className="text-muted-foreground">Doctor</Label>
                      <p className="font-medium">{selectedAppointment.doctorName}</p>
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

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Billing Overview</CardTitle>
                  <CardDescription>Revenue and billing information</CardDescription>
                </div>
                <Dialog open={billingModalOpen} onOpenChange={(open) => {
                  setBillingModalOpen(open);
                  if (!open) {
                    resetBillingForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Bill
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Billing Record</DialogTitle>
                      <DialogDescription>Generate a new billing record for a patient</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Patient *</Label>
                        <Select 
                          value={billingForm.patientId} 
                          onValueChange={(value) => setBillingForm({ ...billingForm, patientId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {dummyPatients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Billing Items *</Label>
                          <Button type="button" variant="outline" size="sm" onClick={handleAddBillingItem}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                        <div className="space-y-3 border rounded-lg p-4">
                          {billingForm.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end">
                              <div className="col-span-6">
                                <Input 
                                  placeholder="Item description" 
                                  value={item.description} 
                                  onChange={(e) => handleBillingItemChange(index, 'description', e.target.value)} 
                                />
                              </div>
                              <div className="col-span-4">
                                <Input 
                                  type="number" 
                                  placeholder="Amount" 
                                  value={item.amount} 
                                  onChange={(e) => handleBillingItemChange(index, 'amount', e.target.value)} 
                                />
                              </div>
                              <div className="col-span-2">
                                {billingForm.items.length > 1 && (
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveBillingItem(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Total: ${billingForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select 
                          value={billingForm.paymentMethod} 
                          onValueChange={(value) => setBillingForm({ ...billingForm, paymentMethod: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="debit_card">Debit Card</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setBillingModalOpen(false);
                        resetBillingForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateBilling}>Create Bill</Button>
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
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billing.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.patientName}</TableCell>
                      <TableCell>${bill.amount.toFixed(2)}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                          bill.status === 'paid' ? 'default' :
                          bill.status === 'pending' ? 'outline' : 'destructive'
                        }>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bill.paymentMethod || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedBilling(bill);
                              setViewBillingModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bill.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUpdateBillingStatus(bill.id, 'paid', 'credit_card')}
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteBilling(bill.id)}
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

          {/* View Billing Modal */}
          <Dialog open={viewBillingModalOpen} onOpenChange={setViewBillingModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Billing Details</DialogTitle>
              </DialogHeader>
              {selectedBilling && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Patient</Label>
                      <p className="font-medium">{selectedBilling.patientName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date</Label>
                      <p className="font-medium">{selectedBilling.date}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge variant={
                        selectedBilling.status === 'paid' ? 'default' :
                        selectedBilling.status === 'pending' ? 'outline' : 'destructive'
                      }>
                        {selectedBilling.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Payment Method</Label>
                      <p className="font-medium">{selectedBilling.paymentMethod || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Billing Items</Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBilling.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">${selectedBilling.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
