import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { dummyPatients } from '@/data/dummyData';
import type { Patient } from '@/data/dummyData';
import { HeartPulse, Search, Users, Phone, Mail, ClipboardList } from 'lucide-react';

interface PatientTask {
  id: string;
  label: string;
  done: boolean;
}

interface AssignedPatient extends Patient {
  room: string;
  priority: 'high' | 'medium' | 'low';
  lastCheckIn: string;
  tasks: PatientTask[];
  carePlan: string;
}

const buildInitialPatients = (): AssignedPatient[] =>
  dummyPatients.slice(0, 5).map((patient, index) => ({
    ...patient,
    room: `20${index + 1}`,
    priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    lastCheckIn: ['07:45', '08:20', '09:10', '09:55', '10:30'][index] ?? '08:00',
    carePlan:
      index === 0
        ? 'Neuro checks every 2h. Keep head elevated, monitor BP spikes.'
        : 'Standard vitals every 4h. Encourage light ambulation.',
    tasks: [
      { id: 'task-vitals', label: 'Vitals', done: index % 2 === 1 },
      { id: 'task-med', label: 'Medications', done: index === 2 },
      { id: 'task-mob', label: 'Mobility Check', done: false },
    ],
  }));

const AssignedPatients = () => {
  const { state } = useAuth();
  const [patients, setPatients] = useState<AssignedPatient[]>(buildInitialPatients);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<AssignedPatient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(
    () => patients.filter((patient) => patient.name.toLowerCase().includes(search.toLowerCase())),
    [patients, search]
  );

  const toggleTask = (patientId: string, taskId: string) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              tasks: patient.tasks.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task
              ),
            }
          : patient
      )
    );
  };

  const openDetails = (patient: AssignedPatient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
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
          <h1 className="text-3xl font-bold">Assigned Patients</h1>
          <p className="text-muted-foreground">
            Review bedside priorities, room assignments, and care plans.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Roster</CardTitle>
            <CardDescription>Filter by name and update bedside tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient"
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-4">
              {filtered.map((patient) => (
                <div key={patient.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 text-rose-500" />
                        {patient.name}
                        <Badge variant={patient.priority === 'high' ? 'destructive' : 'secondary'}>
                          {patient.priority === 'high' ? 'High Priority' : patient.priority}
                        </Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Room {patient.room} • Last check-in {patient.lastCheckIn}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => openDetails(patient)}>
                      View details
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Tasks</p>
                    {patient.tasks.map((task) => (
                      <label key={task.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={task.done}
                          onCheckedChange={() => toggleTask(patient.id, task.id)}
                        />
                        {task.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {!filtered.length && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No patients match your search.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPatient?.name}</DialogTitle>
            <DialogDescription>Room {selectedPatient?.room}</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {selectedPatient.gender.toUpperCase()}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {selectedPatient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {selectedPatient.email}
                </span>
              </div>
              <div>
                <p className="font-semibold mb-1">Care plan</p>
                <p className="text-muted-foreground">{selectedPatient.carePlan}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Outstanding tasks</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {selectedPatient.tasks
                    .filter((task) => !task.done)
                    .map((task) => (
                      <li key={task.id}>{task.label}</li>
                    ))}
                  {!selectedPatient.tasks.filter((task) => !task.done).length && (
                    <li>All assigned tasks completed.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Document Check-in
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AssignedPatients;

