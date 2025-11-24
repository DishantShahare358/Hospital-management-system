import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Users,
  DoorOpen,
  DoorClosed,
  UserPlus,
  Clock,
  MapPin,
  Plus,
} from 'lucide-react';
import { dummyAppointments, dummyPatients, dummyDoctors } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';

interface CheckIn {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  status: 'pending' | 'checked-in';
}

interface RoomAssignment {
  number: string;
  type: 'Single' | 'Double' | 'Suite';
  capacity: number;
  status: 'occupied' | 'available' | 'cleaning';
  occupants: Array<{ patientId: string; patientName: string }>;
}

interface VisitorEntry {
  id: string;
  name: string;
  visitingPatientId: string;
  visitingPatientName: string;
  time: string;
  status: 'registered' | 'pending';
}

const initialCheckIns: CheckIn[] = [
  { id: '1', patientId: '1', patientName: 'John Patient', time: '09:00', status: 'checked-in' },
  { id: '2', patientId: '2', patientName: 'Jane Doe', time: '10:30', status: 'pending' },
  { id: '3', patientId: '3', patientName: 'Robert Miller', time: '11:00', status: 'checked-in' },
];

const initialRooms: RoomAssignment[] = [
  {
    number: '101',
    type: 'Single',
    capacity: 1,
    status: 'occupied',
    occupants: [{ patientId: '1', patientName: 'John Patient' }],
  },
  { number: '102', type: 'Single', capacity: 1, status: 'available', occupants: [] },
  {
    number: '103',
    type: 'Double',
    capacity: 2,
    status: 'occupied',
    occupants: [{ patientId: '2', patientName: 'Jane Doe' }],
  },
  { number: '104', type: 'Suite', capacity: 2, status: 'available', occupants: [] },
];

const initialVisitors: VisitorEntry[] = [
  { id: 'v1', name: 'Sarah Johnson', visitingPatientId: '1', visitingPatientName: 'John Patient', time: '10:00', status: 'registered' },
  { id: 'v2', name: 'Mike Smith', visitingPatientId: '2', visitingPatientName: 'Jane Doe', time: '11:30', status: 'pending' },
];

const ReceptionistDashboard = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState(dummyAppointments);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialCheckIns);
  const [rooms, setRooms] = useState<RoomAssignment[]>(initialRooms);
  const [visitors, setVisitors] = useState<VisitorEntry[]>(initialVisitors);
  const [checkInForm, setCheckInForm] = useState({ patientId: '', time: '' });
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
  });
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<RoomAssignment | null>(null);
  const [roomPatientId, setRoomPatientId] = useState('');
  const [visitorDialogOpen, setVisitorDialogOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({ name: '', patientId: '', time: '' });
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof dummyAppointments[number] | null>(null);
  const [visitorViewOpen, setVisitorViewOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorEntry | null>(null);

  const patientMap = useMemo(
    () =>
      dummyPatients.reduce<Record<string, string>>((acc, patient) => {
        acc[patient.id] = patient.name;
        return acc;
      }, {}),
    []
  );

  const doctorMap = useMemo(
    () =>
      dummyDoctors.reduce<Record<string, string>>((acc, doctor) => {
        acc[doctor.id] = doctor.name;
        return acc;
      }, {}),
    []
  );

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  );
  const completedCheckIns = checkIns.filter((c) => c.status === 'checked-in').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const availableBeds = rooms.reduce((total, room) => {
    if (room.status === 'cleaning') return total;
    const freeBeds = Math.max(room.capacity - room.occupants.length, 0);
    return total + (room.status === 'available' ? room.capacity : freeBeds);
  }, 0);

  const handleCheckIn = () => {
    if (!checkInForm.patientId || !checkInForm.time) {
      toast({
        title: 'Missing information',
        description: 'Select a patient and time before checking in.',
        variant: 'destructive',
      });
      return;
    }
    const patientName = patientMap[checkInForm.patientId];
    setCheckIns((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        patientId: checkInForm.patientId,
        patientName,
        time: checkInForm.time,
        status: 'checked-in',
      },
    ]);
    setCheckInForm({ patientId: '', time: '' });
    toast({ title: 'Patient checked in', description: `${patientName} is marked as arrived.` });
  };

  const handleBookAppointment = () => {
    if (!appointmentForm.patientId || !appointmentForm.doctorId || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: 'Missing fields',
        description: 'Patient, doctor, date, and time are required.',
        variant: 'destructive',
      });
      return;
    }
    const patientName = patientMap[appointmentForm.patientId];
    const doctorName = doctorMap[appointmentForm.doctorId];
    setAppointments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        patientId: appointmentForm.patientId,
        patientName,
        doctorId: appointmentForm.doctorId,
        doctorName,
        date: appointmentForm.date,
        time: appointmentForm.time,
        status: 'pending',
        reason: 'General visit',
      },
    ]);
    setAppointmentForm({ patientId: '', doctorId: '', date: '', time: '' });
    toast({ title: 'Appointment booked', description: `${patientName} with ${doctorName}.` });
  };

  const handleCheckStatusUpdate = (id: string, status: CheckIn['status']) => {
    setCheckIns((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status } : entry)));
  };

  const openRoomDialog = (room: RoomAssignment) => {
    setActiveRoom(room);
    setRoomPatientId('');
    setRoomDialogOpen(true);
  };

  const handleAssignRoom = () => {
    if (!activeRoom || !roomPatientId) {
      toast({
        title: 'Select a patient',
        description: 'Choose a patient before assigning the room.',
        variant: 'destructive',
      });
      return;
    }
    const patientName = patientMap[roomPatientId];
    setRooms((prev) =>
      prev.map((room) => {
        if (room.number !== activeRoom.number) return room;
        if (room.occupants.some((occ) => occ.patientId === roomPatientId)) {
          toast({
            title: 'Already assigned',
            description: 'This patient is already in the room.',
            variant: 'destructive',
          });
          return room;
        }
        if (room.occupants.length >= room.capacity) {
          toast({
            title: 'Room full',
            description: 'No free beds remain in this room.',
            variant: 'destructive',
          });
          return room;
        }
        return {
          ...room,
          status: 'occupied',
          occupants: [...room.occupants, { patientId: roomPatientId, patientName }],
        };
      })
    );
    toast({ title: 'Room assigned', description: `${patientName} moved to room ${activeRoom.number}.` });
    setRoomDialogOpen(false);
    setActiveRoom(null);
    setRoomPatientId('');
  };

  const releaseBed = (roomNumber: string, patientId: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.number !== roomNumber) return room;
        const updated = room.occupants.filter((occ) => occ.patientId !== patientId);
        return {
          ...room,
          occupants: updated,
          status: updated.length === 0 ? 'available' : room.status,
        };
      })
    );
    toast({ title: 'Patient removed', description: `Patient discharged from room ${roomNumber}.` });
  };

  const markRoomCleaning = (roomNumber: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.number === roomNumber ? { ...room, status: 'cleaning', occupants: [] } : room
      )
    );
    toast({ title: 'Room released', description: `Room ${roomNumber} marked for cleaning.` });
  };

  const markRoomAvailable = (roomNumber: string) => {
    setRooms((prev) =>
      prev.map((room) => (room.number === roomNumber ? { ...room, status: 'available' } : room))
    );
    toast({ title: 'Room ready', description: `Room ${roomNumber} is now available.` });
  };

  const handleRegisterVisitor = () => {
    if (!visitorForm.name || !visitorForm.patientId || !visitorForm.time) {
      toast({
        title: 'Missing information',
        description: 'Complete all visitor fields.',
        variant: 'destructive',
      });
      return;
    }
    const patientName = patientMap[visitorForm.patientId];
    setVisitors((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: visitorForm.name,
        visitingPatientId: visitorForm.patientId,
        visitingPatientName: patientName,
        time: visitorForm.time,
        status: 'pending',
      },
    ]);
    setVisitorForm({ name: '', patientId: '', time: '' });
    setVisitorDialogOpen(false);
    toast({ title: 'Visitor registered', description: `${visitorForm.name} can now check in.` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
        <p className="text-muted-foreground">Patient check-in and appointment management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <DoorOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCheckIns}</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableRooms}</div>
            <p className="text-xs text-muted-foreground">{availableBeds} beds available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitors.length}</div>
            <p className="text-xs text-muted-foreground">Registered today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Check-in</CardTitle>
            <CardDescription>Register patient arrival</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Select value={checkInForm.patientId} onValueChange={(value) => setCheckInForm((prev) => ({ ...prev, patientId: value }))}>
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
                <Label>Appointment Time</Label>
                <Input
                  type="time"
                  value={checkInForm.time}
                  onChange={(event) => setCheckInForm((prev) => ({ ...prev, time: event.target.value }))}
                />
              </div>
              <Button className="w-full" onClick={handleCheckIn}>
                <DoorOpen className="h-4 w-4 mr-2" />
                Check In Patient
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
            <CardDescription>Schedule a new appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select value={appointmentForm.patientId} onValueChange={(value) => setAppointmentForm((prev) => ({ ...prev, patientId: value }))}>
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
                <Label>Doctor</Label>
                <Select value={appointmentForm.doctorId} onValueChange={(value) => setAppointmentForm((prev) => ({ ...prev, doctorId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(event) => setAppointmentForm((prev) => ({ ...prev, date: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(event) => setAppointmentForm((prev) => ({ ...prev, time: event.target.value }))}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleBookAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="checkin">Check-in/Check-out</TabsTrigger>
          <TabsTrigger value="rooms">Room Allocation</TabsTrigger>
          <TabsTrigger value="visitors">Visitor Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Today's scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{apt.patientName}</TableCell>
                      <TableCell>{apt.doctorName}</TableCell>
                      <TableCell>{apt.date}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>
                        <Badge variant={
                          apt.status === 'confirmed' ? 'default' :
                          apt.status === 'pending' ? 'outline' : 'secondary'
                        }>
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setAppointmentDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Check-in/Check-out</CardTitle>
              <CardDescription>Manage patient arrivals and departures</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkIns.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium">{check.patientName}</TableCell>
                      <TableCell>{check.time}</TableCell>
                      <TableCell>
                        <Badge variant={check.status === 'checked-in' ? 'default' : 'outline'}>
                          {check.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {check.status === 'pending' ? (
                          <Button size="sm" onClick={() => handleCheckStatusUpdate(check.id, 'checked-in')}>
                            <DoorOpen className="h-4 w-4 mr-2" />
                            Check In
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleCheckStatusUpdate(check.id, 'pending')}>
                            <DoorClosed className="h-4 w-4 mr-2" />
                            Check Out
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

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Allocation</CardTitle>
              <CardDescription>View and manage room assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {rooms.map((room) => {
                  const freeBeds = Math.max(room.capacity - room.occupants.length, 0);
                  return (
                    <Card key={room.number} className={room.status === 'occupied' ? 'border-primary' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Room {room.number}</CardTitle>
                          <Badge
                            variant={
                              room.status === 'occupied'
                                ? 'default'
                                : room.status === 'cleaning'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {room.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Type: {room.type} • Beds: {room.capacity}
                        </p>
                        <p className="text-sm font-medium">
                          Available beds: {room.status === 'cleaning' ? 0 : freeBeds}
                        </p>
                        <div className="space-y-2">
                          {room.occupants.length ? (
                            room.occupants.map((occ) => (
                              <div
                                key={occ.patientId}
                                className="flex items-center justify-between rounded bg-muted/50 px-3 py-2 text-sm"
                              >
                                <span>{occ.patientName}</span>
                                <Button size="sm" variant="ghost" onClick={() => releaseBed(room.number, occ.patientId)}>
                                  Release
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No patients assigned</p>
                          )}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            variant={room.status === 'available' ? 'default' : 'outline'}
                            onClick={() => openRoomDialog(room)}
                            disabled={room.status === 'cleaning' || freeBeds === 0}
                          >
                            Assign
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => markRoomCleaning(room.number)}>
                            Cleaning
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => markRoomAvailable(room.number)}
                            disabled={room.status === 'available'}
                          >
                            Ready
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Visitor Registration</CardTitle>
                  <CardDescription>Register and manage visitors</CardDescription>
                </div>
                <Button onClick={() => setVisitorDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Visitor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Visiting</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell>{visitor.visitingPatientName}</TableCell>
                      <TableCell>{visitor.time}</TableCell>
                      <TableCell>
                        <Badge variant={visitor.status === 'registered' ? 'default' : 'outline'}>
                          {visitor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setVisitorViewOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Room</DialogTitle>
            <DialogDescription>
              {activeRoom ? `Select a patient for room ${activeRoom.number}` : 'Select a room to assign'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Patient</Label>
            <Select value={roomPatientId} onValueChange={setRoomPatientId}>
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
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRoomDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRoom}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={visitorDialogOpen} onOpenChange={setVisitorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Visitor</DialogTitle>
            <DialogDescription>Add a new visitor entry</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Visitor Name</Label>
              <Input
                placeholder="Enter visitor name"
                value={visitorForm.name}
                onChange={(event) => setVisitorForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select value={visitorForm.patientId} onValueChange={(value) => setVisitorForm((prev) => ({ ...prev, patientId: value }))}>
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
              <Label>Visit Time</Label>
              <Input
                type="time"
                value={visitorForm.time}
                onChange={(event) => setVisitorForm((prev) => ({ ...prev, time: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setVisitorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegisterVisitor}>Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Review appointment information</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Patient:</span> {selectedAppointment.patientName}</p>
              <p><span className="font-medium">Doctor:</span> {selectedAppointment.doctorName}</p>
              <p><span className="font-medium">Date:</span> {selectedAppointment.date}</p>
              <p><span className="font-medium">Time:</span> {selectedAppointment.time}</p>
              <p><span className="font-medium">Status:</span> {selectedAppointment.status}</p>
              <p><span className="font-medium">Reason:</span> {selectedAppointment.reason}</p>
              {selectedAppointment.notes && (
                <p><span className="font-medium">Notes:</span> {selectedAppointment.notes}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setAppointmentDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={visitorViewOpen} onOpenChange={setVisitorViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visitor Details</DialogTitle>
            <DialogDescription>Registration information</DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Visitor:</span> {selectedVisitor.name}</p>
              <p><span className="font-medium">Patient:</span> {selectedVisitor.visitingPatientName}</p>
              <p><span className="font-medium">Time:</span> {selectedVisitor.time}</p>
              <p><span className="font-medium">Status:</span> {selectedVisitor.status}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setVisitorViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceptionistDashboard;

