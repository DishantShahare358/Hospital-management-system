import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  Phone, 
  FileText, 
  Clock,
  CheckCircle,
  UserPlus,
  Clipboard
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { state } = useAuth();

  const mockTasks = [
    { id: 1, task: 'Check-in patient registration', status: 'pending', priority: 'high', time: '9:00 AM' },
    { id: 2, task: 'Insurance verification', status: 'completed', priority: 'normal', time: '10:30 AM' },
    { id: 3, task: 'Appointment scheduling', status: 'in-progress', priority: 'normal', time: '11:00 AM' },
    { id: 4, task: 'Patient discharge documentation', status: 'pending', priority: 'high', time: '2:00 PM' },
  ];

  const mockAppointments = [
    { id: 1, patient: 'John Smith', doctor: 'Dr. Johnson', time: '9:30 AM', status: 'confirmed' },
    { id: 2, patient: 'Mary Wilson', doctor: 'Dr. Chen', time: '10:00 AM', status: 'waiting' },
    { id: 3, patient: 'Robert Davis', doctor: 'Dr. Anderson', time: '11:30 AM', status: 'confirmed' },
  ];

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
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
          <h2 className="text-2xl font-bold mb-2">Welcome, {state.user?.name}!</h2>
          <p className="opacity-90">
            {state.user?.department} Department • Today's Tasks: {mockTasks.filter(t => t.status !== 'completed').length} pending
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
                    <p className="text-sm font-medium text-muted-foreground">Today's Tasks</p>
                    <p className="text-3xl font-bold">{mockTasks.length}</p>
                  </div>
                  <Clipboard className="h-8 w-8 text-primary" />
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
                    <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                    <p className="text-3xl font-bold">{mockAppointments.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-secondary" />
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
                    <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                    <p className="text-3xl font-bold">
                      {mockTasks.filter(t => t.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
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
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold">
                      {mockTasks.filter(t => t.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Today's Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        {getTaskIcon(task.status)}
                        <div>
                          <h3 className="font-medium">{task.task}</h3>
                          <p className="text-sm text-muted-foreground">{task.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.status === 'pending' && (
                          <Button size="sm" variant="medical">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appointment Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Today's Appointments
                  <Button variant="medical" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {appointment.patient.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.patient}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                          <p className="text-xs text-muted-foreground">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {appointment.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
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
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm">Register Patient</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Schedule Appointment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Insurance Verification</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm">Patient Contact</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Staff Directory</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;