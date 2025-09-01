import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  FileText, 
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const NurseDashboard = () => {
  const { state } = useAuth();

  const mockPatients = [
    { id: 1, name: 'John Doe', room: '101', condition: 'Stable', priority: 'normal' },
    { id: 2, name: 'Jane Smith', room: '102', condition: 'Critical', priority: 'high' },
    { id: 3, name: 'Bob Johnson', room: '103', condition: 'Recovering', priority: 'normal' },
    { id: 4, name: 'Alice Brown', room: '104', condition: 'Observation', priority: 'low' },
  ];

  const mockVitals = [
    { patient: 'John Doe', type: 'Blood Pressure', value: '120/80', time: '10:30 AM', status: 'normal' },
    { patient: 'Jane Smith', type: 'Heart Rate', value: '110 bpm', time: '10:45 AM', status: 'high' },
    { patient: 'Bob Johnson', type: 'Temperature', value: '98.6°F', time: '11:00 AM', status: 'normal' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVitalStatus = (status: string) => {
    switch (status) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-medical rounded-lg p-6 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Hello, {state.user?.name}!</h2>
          <p className="opacity-90">
            {state.user?.department} Department • Shift: Day (8:00 AM - 8:00 PM)
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assigned Patients</p>
                    <p className="text-3xl font-bold">{mockPatients.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical Patients</p>
                    <p className="text-3xl font-bold">
                      {mockPatients.filter(p => p.priority === 'high').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vitals Recorded</p>
                    <p className="text-3xl font-bold">{mockVitals.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes Updated</p>
                    <p className="text-3xl font-bold">7</p>
                  </div>
                  <FileText className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>My Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">Room {patient.room}</p>
                          <p className="text-xs text-muted-foreground">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(patient.priority)}>
                          {patient.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Vitals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Vitals
                  <Button variant="medical" size="sm">
                    Record New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVitals.map((vital, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        {getVitalStatus(vital.status)}
                        <div>
                          <h3 className="font-medium">{vital.patient}</h3>
                          <p className="text-sm text-muted-foreground">{vital.type}</p>
                          <p className="text-xs text-muted-foreground">{vital.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{vital.value}</p>
                        <Badge 
                          variant="outline"
                          className={vital.status === 'high' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}
                        >
                          {vital.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Thermometer className="h-5 w-5" />
                  <span className="text-sm">Record Vitals</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Add Notes</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">Medication</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Patient Care</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">Emergency</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;