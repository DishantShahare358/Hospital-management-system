import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { hospitalApi } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Activity
} from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsData = await hospitalApi.getAppointments(state.user?.id);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state.user?.id]);

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Stethoscope className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-medical rounded-lg p-6 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Good morning, {state.user?.name}!</h2>
          <p className="opacity-90">
            You have {todayAppointments.length} appointments today and {pendingAppointments.length} pending approvals.
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
                    <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                    <p className="text-3xl font-bold">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
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
                    <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                    <p className="text-3xl font-bold">{pendingAppointments.length}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
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
                    <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                    <p className="text-3xl font-bold">45</p>
                  </div>
                  <Users className="h-8 w-8 text-secondary" />
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
                    <p className="text-sm font-medium text-muted-foreground">Records Updated</p>
                    <p className="text-3xl font-bold">8</p>
                  </div>
                  <FileText className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pending Appointments
                  <Badge variant="outline">{pendingAppointments.length} pending</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No pending appointments</p>
                      <p className="text-sm">All caught up!</p>
                    </div>
                  ) : (
                    pendingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {appointment.patientName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patientName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {appointment.reason}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                          <Button size="sm" variant="medical">
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Today's Schedule
                  <Badge variant="outline">{todayAppointments.length} appointments</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments today</p>
                      <p className="text-sm">Enjoy your free day!</p>
                    </div>
                  ) : (
                    <>
                      {/* Mock today's appointments since we don't have real data */}
                      <div className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">John Smith</h3>
                            <p className="text-sm text-muted-foreground">09:00 AM</p>
                            <p className="text-xs text-muted-foreground">Regular checkup</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Sarah Johnson</h3>
                            <p className="text-sm text-muted-foreground">10:30 AM</p>
                            <p className="text-xs text-muted-foreground">Follow-up consultation</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">RM</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Robert Miller</h3>
                            <p className="text-sm text-muted-foreground">02:00 PM</p>
                            <p className="text-xs text-muted-foreground">Routine examination</p>
                          </div>
                        </div>
                        <Badge variant="outline">Upcoming</Badge>
                      </div>
                    </>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">View Patients</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Medical Records</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Schedule</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm">Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;