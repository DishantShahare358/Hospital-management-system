import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { dummyPatients, dummyVitalSigns } from '@/data/dummyData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Activity,
  Pill,
  FileText,
  ArrowRight,
  AlertTriangle,
  Bed,
  ClipboardList,
} from 'lucide-react';

const medicationPreview = [
  { id: 'med-1', patient: 'John Patient', medicine: 'Lisinopril 10mg', time: '08:00', status: 'Pending' },
  { id: 'med-2', patient: 'Jane Doe', medicine: 'Sumatriptan 50mg', time: '10:00', status: 'Completed' },
  { id: 'med-3', patient: 'Robert Miller', medicine: 'Aspirin 81mg', time: '12:00', status: 'Pending' },
];

const shiftSchedule = [
  { id: 'shift-1', day: 'Monday', shift: 'Morning', time: '06:00 - 14:00' },
  { id: 'shift-2', day: 'Tuesday', shift: 'Morning', time: '06:00 - 14:00' },
  { id: 'shift-3', day: 'Wednesday', shift: 'Afternoon', time: '14:00 - 22:00' },
];

interface BedSlot {
  id: number;
  status: 'Occupied' | 'Available' | 'Cleaning';
  patient?: string;
}

const initialBeds: BedSlot[] = [
  { id: 201, status: 'Occupied', patient: 'John Patient' },
  { id: 202, status: 'Occupied', patient: 'Jane Doe' },
  { id: 203, status: 'Available' },
  { id: 204, status: 'Cleaning' },
  { id: 205, status: 'Available' },
  { id: 206, status: 'Occupied', patient: 'Robert Miller' },
];

const NurseDashboard = () => {
  const { state } = useAuth();
  const { toast } = useToast();
  const nurseName = state.user?.name ?? 'Nurse Emily Johnson';

  const assignedPreview = dummyPatients.slice(0, 3);
  const assignedCount = dummyPatients.length;
  const vitalsToday = dummyVitalSigns.length;
  const medsDue = medicationPreview.filter((med) => med.status === 'Pending').length;
  const notesLogged = 7;
  const [bedSlots, setBedSlots] = useState<BedSlot[]>(initialBeds);
  const [bedDialogOpen, setBedDialogOpen] = useState(false);
  const [activeBed, setActiveBed] = useState<BedSlot | null>(null);
  const [bedPatientId, setBedPatientId] = useState('');

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Nurse Console</p>
        <h1 className="text-3xl font-bold">Welcome back, {nurseName}</h1>
        <p className="text-muted-foreground">
          Use the left drawer to jump into bedside workflows. Key stats below reflect your current roster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Patients</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assignedCount}</p>
            <p className="text-xs text-muted-foreground">Under your care this shift</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vitals Logged</CardTitle>
            <Activity className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{vitalsToday}</p>
            <p className="text-xs text-muted-foreground">Entries captured today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medications Due</CardTitle>
            <Pill className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{medsDue}</p>
            <p className="text-xs text-muted-foreground">Pending administrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notes Logged</CardTitle>
            <FileText className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{notesLogged}</p>
            <p className="text-xs text-muted-foreground">Hand-off updates this week</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-300/60 bg-red-50 dark:bg-red-950/40">
        <CardHeader className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <Badge variant="destructive">Critical alert</Badge>
            </div>
            <CardTitle>Room 204 &middot; Robert Miller</CardTitle>
            <p className="text-sm text-muted-foreground">
              BP spiked to 168/94. Please reassess within 10 minutes and capture vitals in the Vital Signs workspace.
            </p>
          </div>
          <Button asChild variant="destructive">
            <Link to="/nurse/vitals">
              Respond
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Patients</CardTitle>
            <CardDescription>Quick view of your current rooms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedPreview.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">Room 20{patient.id}</p>
                </div>
                <Badge variant="secondary">{patient.gender.toUpperCase()}</Badge>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/nurse/patients">Manage assignments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medication Snapshot</CardTitle>
            <CardDescription>Upcoming administrations this shift</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicationPreview.map((med) => (
              <div key={med.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{med.patient}</p>
                  <p className="text-xs text-muted-foreground">{med.medicine} • {med.time}</p>
                </div>
                <Badge variant={med.status === 'Pending' ? 'outline' : 'default'}>{med.status}</Badge>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/nurse/medications">Open medication schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="schedule">Shift Schedule</TabsTrigger>
          <TabsTrigger value="beds">Bed Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Recent Vitals</CardTitle>
                <CardDescription>Latest measurements captured today</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link to="/nurse/vitals">Record vitals</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Blood Pressure</TableHead>
                    <TableHead>Heart Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyVitalSigns.slice(0, 4).map((vital) => (
                    <TableRow key={vital.id}>
                      <TableCell className="font-semibold flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        {vital.patientName}
                      </TableCell>
                      <TableCell>{vital.date} • {vital.time}</TableCell>
                      <TableCell>{vital.temperature}°F</TableCell>
                      <TableCell>{vital.bloodPressure}</TableCell>
                      <TableCell>{vital.heartRate} bpm</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Upcoming Shifts</CardTitle>
                <CardDescription>At-a-glance weekly coverage</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link to="/nurse/notes">Add shift note</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {shiftSchedule.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-semibold">{shift.day}</p>
                    <p className="text-xs text-muted-foreground">{shift.shift} shift</p>
                  </div>
                  <p className="text-sm font-medium">{shift.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beds">
          <Card>
            <CardHeader>
              <CardTitle>Bed Allocation</CardTitle>
              <CardDescription>Live room readiness overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bedSlots.map((bed) => (
                  <Card key={bed.id} className="border-dashed">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold flex items-center gap-2">
                          <Bed className="h-4 w-4 text-amber-500" />
                          Bed {bed.id}
                        </p>
                        <Badge
                          variant={
                            bed.status === 'Occupied'
                              ? 'default'
                              : bed.status === 'Cleaning'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {bed.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bed.patient ? bed.patient : 'No patient assigned'}
                      </p>
                      <div className="flex gap-2">
                        {bed.status === 'Occupied' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setBedSlots((prev) =>
                                prev.map((slot) =>
                                  slot.id === bed.id ? { ...slot, status: 'Cleaning', patient: undefined } : slot
                                )
                              );
                              toast({
                                title: 'Bed released',
                                description: `Housekeeping notified for bed ${bed.id}.`,
                              });
                            }}
                          >
                            Release
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setActiveBed(bed);
                              setBedDialogOpen(true);
                            }}
                          >
                            Assign
                          </Button>
                        )}
                        {bed.status === 'Cleaning' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setBedSlots((prev) =>
                                prev.map((slot) =>
                                  slot.id === bed.id ? { ...slot, status: 'Available' } : slot
                                )
                              )
                            }
                          >
                            Ready
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/nurse/patients">
                  Update allocation
                  <ClipboardList className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={bedDialogOpen} onOpenChange={setBedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign bed</DialogTitle>
            <DialogDescription>
              {activeBed ? `Select a patient for bed ${activeBed.id}` : 'Choose a bed to assign'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Patient</Label>
            <Select value={bedPatientId} onValueChange={setBedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {dummyPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.name}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBedDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!activeBed || !bedPatientId) {
                  toast({
                    title: 'Select a patient',
                    description: 'Choose a patient before assigning the bed.',
                    variant: 'destructive',
                  });
                  return;
                }
                setBedSlots((prev) =>
                  prev.map((slot) =>
                    slot.id === activeBed.id ? { ...slot, status: 'Occupied', patient: bedPatientId } : slot
                  )
                );
                toast({
                  title: 'Bed assigned',
                  description: `${bedPatientId} assigned to bed ${activeBed.id}.`,
                });
                setBedPatientId('');
                setBedDialogOpen(false);
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default NurseDashboard;

