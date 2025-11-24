import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { dummyPatients } from '@/data/dummyData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Clock } from 'lucide-react';

interface NurseNote {
  id: string;
  patientId: string;
  patientName: string;
  summary: string;
  timestamp: string;
  author: string;
  category: 'handoff' | 'rounds' | 'reminder';
}

const initialNotes: NurseNote[] = [
  {
    id: 'note-1',
    patientId: '1',
    patientName: 'John Patient',
    summary: 'Post-op dressing clean and dry. Pain managed with Tylenol. Encourage IS hourly.',
    timestamp: 'Today • 09:30',
    author: 'Nurse Emily',
    category: 'rounds',
  },
  {
    id: 'note-2',
    patientId: '2',
    patientName: 'Jane Doe',
    summary: 'Migraine med administered at 10:05. Reassess pain at 10:35.',
    timestamp: 'Today • 10:10',
    author: 'Nurse Emily',
    category: 'reminder',
  },
];

const Notes = () => {
  const { state } = useAuth();
  const { toast } = useToast();
  const nurseName = state.user?.name ?? 'Nurse Emily';

  const [notes, setNotes] = useState<NurseNote[]>(initialNotes);
  const [patientId, setPatientId] = useState('');
  const [category, setCategory] = useState<NurseNote['category']>('handoff');
  const [summary, setSummary] = useState('');
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      !search ||
      note.patientName.toLowerCase().includes(search.toLowerCase()) ||
      note.summary.toLowerCase().includes(search.toLowerCase())
  );

  const saveNote = () => {
    if (!patientId || !summary.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please choose a patient and enter a note.',
        variant: 'destructive',
      });
      return;
    }
    const patientName = dummyPatients.find((patient) => patient.id === patientId)?.name;
    if (!patientName) {
      toast({
        title: 'Invalid patient',
        description: 'Select a patient from your roster.',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date();
    const newNote: NurseNote = {
      id: Date.now().toString(),
      patientId,
      patientName,
      summary: summary.trim(),
      timestamp: `Today • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      author: nurseName,
      category,
    };

    setNotes((prev) => [newNote, ...prev]);
    setSummary('');
    setPatientId('');
    toast({
      title: 'Note saved',
      description: `Added to ${patientName}'s chart.`,
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
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Nurse Workspace</p>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Capture handoffs, rounding updates, and reminders in one place.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Log a note</CardTitle>
            <CardDescription>Share context for the oncoming nurse or for your own reminders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Patient</p>
                <Select value={patientId} onValueChange={setPatientId}>
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
                <p className="text-sm font-medium">Category</p>
                <Select value={category} onValueChange={(value) => setCategory(value as NurseNote['category'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Handoff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="handoff">Handoff</SelectItem>
                    <SelectItem value="rounds">Rounds</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Quick search</p>
                <Input
                  placeholder="Filter existing notes"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
            <Textarea
              placeholder="Enter your note..."
              rows={4}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
            <Button className="gap-2" onClick={saveNote}>
              <ClipboardList className="h-4 w-4" />
              Save note
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent notes</CardTitle>
            <CardDescription>Ordered from newest to oldest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{note.patientName}</p>
                    <p className="text-xs text-muted-foreground">By {note.author}</p>
                  </div>
                  <Badge
                    variant={
                      note.category === 'reminder'
                        ? 'outline'
                        : note.category === 'rounds'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {note.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{note.summary}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {note.timestamp}
                </p>
              </div>
            ))}
            {!filteredNotes.length && (
              <p className="text-sm text-muted-foreground text-center py-8">No notes yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notes;

