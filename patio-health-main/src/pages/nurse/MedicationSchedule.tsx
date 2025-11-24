import { useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dummyPatients } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarClock, Pill, Search, Check, XCircle, Plus } from 'lucide-react';

type MedicationStatus = 'pending' | 'completed' | 'missed';

interface MedicationItem {
  id: string;
  patientId: string;
  patientName: string;
  medicine: string;
  dosage: string;
  time: string;
  status: MedicationStatus;
  notes?: string;
  recordedBy: string;
}

const initialMeds: MedicationItem[] = [
  {
    id: 'med-1',
    patientId: '1',
    patientName: 'John Patient',
    medicine: 'Lisinopril',
    dosage: '10mg',
    time: '08:00',
    status: 'pending',
    recordedBy: 'Nurse Emily',
    notes: 'Check blood pressure prior to dose.',
  },
  {
    id: 'med-2',
    patientId: '2',
    patientName: 'Jane Doe',
    medicine: 'Sumatriptan',
    dosage: '50mg',
    time: '10:00',
    status: 'completed',
    recordedBy: 'Nurse Emily',
  },
  {
    id: 'med-3',
    patientId: '3',
    patientName: 'Robert Miller',
    medicine: 'Aspirin',
    dosage: '81mg',
    time: '12:00',
    status: 'pending',
    recordedBy: 'Nurse Emily',
  },
];

const MedicationSchedule = () => {
  const { toast } = useToast();
  const { state } = useAuth();
  const nurseName = state.user?.name ?? 'Nurse Emily';

  const [medications, setMedications] = useState<MedicationItem[]>(initialMeds);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | MedicationStatus>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    medicine: '',
    dosage: '',
    time: '',
    notes: '',
  });

  const patientLookup = useMemo(
    () =>
      dummyPatients.reduce<Record<string, string>>((acc, patient) => {
        acc[patient.id] = patient.name;
        return acc;
      }, {}),
    []
  );

  const filteredMedications = medications.filter((med) => {
    const matchesStatus = status === 'all' || med.status === status;
    const matchesSearch = !search || med.patientName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateStatus = (id: string, nextStatus: MedicationStatus) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, status: nextStatus } : med)));
  };

  const addMedication = () => {
    if (!form.patientId || !form.medicine || !form.dosage || !form.time) {
      toast({
        title: 'Missing information',
        description: 'Patient, medicine, dosage, and time are required.',
        variant: 'destructive',
      });
      return;
    }

    const patientName = patientLookup[form.patientId];
    if (!patientName) {
      toast({
        title: 'Invalid patient',
        description: 'Choose one of your assigned patients.',
        variant: 'destructive',
      });
      return;
    }

    const newMed: MedicationItem = {
      id: Date.now().toString(),
      patientId: form.patientId,
      patientName,
      medicine: form.medicine,
      dosage: form.dosage,
      time: form.time,
      status: 'pending',
      notes: form.notes,
      recordedBy: nurseName,
    };

    setMedications((prev) => [newMed, ...prev]);
    setForm({ patientId: '', medicine: '', dosage: '', time: '', notes: '' });
    setFormOpen(false);
    toast({
      title: 'Medication scheduled',
      description: `${patientName} has a new scheduled dose.`,
    });
  };

  if (state.user?.role !== 'nurse') {
    return (
      <DashboardLayout>
        <div className="py-12 text-center text-muted-foreground">
          This workspace is available for nurses only.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Nurse Workspace</p>
            <h1 className="text-3xl font-bold">Medication Schedule</h1>
            <p className="text-muted-foreground">
              Review, administer, and add medications for your current roster.
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule medication
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Current schedule</CardTitle>
              <CardDescription>Update statuses as you administer meds</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
                <SelectTrigger className="md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient"
                  className="pl-9"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredMedications.map((med) => (
              <div key={med.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <Pill className="h-4 w-4 text-primary" />
                      {med.patientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {med.medicine} &middot; {med.dosage}
                    </p>
                  </div>
                  <Badge
                    variant={
                      med.status === 'pending'
                        ? 'outline'
                        : med.status === 'completed'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {med.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" />
                    {med.time}
                  </span>
                  <div className="flex items-center gap-1">
                    {med.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-emerald-600"
                        onClick={() => updateStatus(med.id, 'completed')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {med.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => updateStatus(med.id, 'missed')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Missed
                      </Button>
                    )}
                  </div>
                </div>
                {med.notes && <p className="text-sm text-muted-foreground">{med.notes}</p>}
                <p className="text-xs text-muted-foreground">Recorded by {med.recordedBy}</p>
              </div>
            ))}
            {!filteredMedications.length && (
              <p className="text-center text-muted-foreground text-sm py-8">
                No medications match your filters.
              </p>
            )}
          </CardContent>
        </Card>

        {formOpen && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Schedule medication</CardTitle>
              <CardDescription>Fill the details below and save</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Patient</p>
                  <Select value={form.patientId} onValueChange={(value) => setForm((prev) => ({ ...prev, patientId: value }))}>
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
                  <p className="text-sm font-medium">Medicine</p>
                  <Input
                    placeholder="e.g. Lisinopril"
                    value={form.medicine}
                    onChange={(event) => setForm((prev) => ({ ...prev, medicine: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Dosage</p>
                  <Input
                    placeholder="10mg"
                    value={form.dosage}
                    onChange={(event) => setForm((prev) => ({ ...prev, dosage: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Time</p>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <p className="text-sm font-medium">Notes</p>
                  <Textarea
                    placeholder="Monitoring instructions or reminders"
                    value={form.notes}
                    onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={addMedication}>Save</Button>
                <Button variant="ghost" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicationSchedule;

