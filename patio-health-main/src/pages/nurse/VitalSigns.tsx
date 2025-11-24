import { useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { dummyPatients, dummyVitalSigns } from '@/data/dummyData';
import type { VitalSign } from '@/data/dummyData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Thermometer, Activity, HeartPulse, Stethoscope } from 'lucide-react';

type VitalFormState = {
  patientId: string;
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  notes: string;
};

const initialForm: VitalFormState = {
  patientId: '',
  temperature: '',
  bloodPressure: '',
  heartRate: '',
  respiratoryRate: '',
  oxygenSaturation: '',
  notes: '',
};

const VitalSigns = () => {
  const { toast } = useToast();
  const { state } = useAuth();
  const nurseName = state.user?.name ?? 'Nurse Emily Johnson';

  const [vitals, setVitals] = useState<VitalSign[]>(dummyVitalSigns);
  const [form, setForm] = useState<VitalFormState>(initialForm);
  const [patientFilter, setPatientFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedVital, setSelectedVital] = useState<VitalSign | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const patientLookup = useMemo(
    () =>
      dummyPatients.reduce<Record<string, string>>((acc, patient) => {
        acc[patient.id] = patient.name;
        return acc;
      }, {}),
    []
  );

  const filteredVitals = vitals.filter((vital) => {
    const matchesPatient = patientFilter === 'all' || vital.patientId === patientFilter;
    const matchesSearch =
      !search ||
      vital.patientName.toLowerCase().includes(search.toLowerCase()) ||
      vital.bloodPressure.toLowerCase().includes(search.toLowerCase());
    return matchesPatient && matchesSearch;
  });

  const captureVital = () => {
    if (
      !form.patientId ||
      !form.temperature ||
      !form.bloodPressure ||
      !form.heartRate ||
      !form.respiratoryRate ||
      !form.oxygenSaturation
    ) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const patientName = patientLookup[form.patientId];
    if (!patientName) {
      toast({
        title: 'Invalid patient',
        description: 'Please choose a valid patient.',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const newVital: VitalSign = {
      id: Date.now().toString(),
      patientId: form.patientId,
      patientName,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Number(form.temperature),
      bloodPressure: form.bloodPressure,
      heartRate: Number(form.heartRate),
      respiratoryRate: Number(form.respiratoryRate),
      oxygenSaturation: Number(form.oxygenSaturation),
      recordedBy: nurseName,
    };

    setVitals((prev) => [newVital, ...prev]);
    setForm(initialForm);
    toast({
      title: 'Vitals recorded',
      description: `${patientName}'s vital signs saved.`,
    });
  };

  const openVitalDetail = (vital: VitalSign) => {
    setSelectedVital(vital);
    setDetailOpen(true);
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
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Nurse Workspace</p>
          <h1 className="text-3xl font-bold">Vital Signs</h1>
          <p className="text-muted-foreground">
            Record new vitals and review the latest measurements for your roster.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Record Vitals</CardTitle>
            <CardDescription>All fields are required unless marked optional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select value={form.patientId} onValueChange={(value) => setForm((prev) => ({ ...prev, patientId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyPatients.map((patient) => (
                      <SelectItem value={patient.id} key={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Temperature (°F)</Label>
                <Input
                  type="number"
                  placeholder="98.6"
                  value={form.temperature}
                  onChange={(event) => setForm((prev) => ({ ...prev, temperature: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Blood Pressure</Label>
                <Input
                  placeholder="120/80"
                  value={form.bloodPressure}
                  onChange={(event) => setForm((prev) => ({ ...prev, bloodPressure: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Heart Rate (bpm)</Label>
                <Input
                  type="number"
                  placeholder="72"
                  value={form.heartRate}
                  onChange={(event) => setForm((prev) => ({ ...prev, heartRate: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Respiratory Rate</Label>
                <Input
                  type="number"
                  placeholder="16"
                  value={form.respiratoryRate}
                  onChange={(event) => setForm((prev) => ({ ...prev, respiratoryRate: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Oxygen Saturation (%)</Label>
                <Input
                  type="number"
                  placeholder="98"
                  value={form.oxygenSaturation}
                  onChange={(event) => setForm((prev) => ({ ...prev, oxygenSaturation: event.target.value }))}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Any additional context or observations..."
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </div>
            </div>
            <Button className="gap-2" onClick={captureVital}>
              <Thermometer className="h-4 w-4" />
              Save vitals
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Recent Vital Signs</CardTitle>
              <CardDescription>Filter by patient or search for specific readings</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select value={patientFilter} onValueChange={setPatientFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All patients</SelectItem>
                  {dummyPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search e.g. BP 120/80"
                  className="pl-9"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Blood Pressure</TableHead>
                  <TableHead>Heart Rate</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVitals.map((vital) => (
                  <TableRow key={vital.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      {vital.patientName}
                    </TableCell>
                    <TableCell>
                      {vital.date} • {vital.time}
                    </TableCell>
                    <TableCell>{vital.temperature}°F</TableCell>
                    <TableCell>{vital.bloodPressure}</TableCell>
                    <TableCell>{vital.heartRate} bpm</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => openVitalDetail(vital)}>
                        <Stethoscope className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!filteredVitals.length && (
              <p className="text-center py-8 text-muted-foreground text-sm">No vitals match your filters.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vital details</DialogTitle>
            <DialogDescription>
              {selectedVital?.patientName} • {selectedVital?.date} at {selectedVital?.time}
            </DialogDescription>
          </DialogHeader>
          {selectedVital && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Temperature</p>
                <p className="font-semibold">{selectedVital.temperature}°F</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Pressure</p>
                <p className="font-semibold">{selectedVital.bloodPressure}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Heart Rate</p>
                <p className="font-semibold">{selectedVital.heartRate} bpm</p>
              </div>
              <div>
                <p className="text-muted-foreground">Respiratory Rate</p>
                <p className="font-semibold">{selectedVital.respiratoryRate} bpm</p>
              </div>
              <div>
                <p className="text-muted-foreground">Oxygen Saturation</p>
                <p className="font-semibold">{selectedVital.oxygenSaturation}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recorded by</p>
                <p className="font-semibold">{selectedVital.recordedBy}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VitalSigns;

