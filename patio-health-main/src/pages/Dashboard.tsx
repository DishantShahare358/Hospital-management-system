import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import PatientDashboard from '@/components/dashboards/PatientDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';

const Dashboard = () => {
  const { state } = useAuth();

  if (!state.user) {
    return null;
  }

  const DashboardComponent = {
    admin: AdminDashboard,
    doctor: DoctorDashboard,
    nurse: NurseDashboard,
    patient: PatientDashboard,
    employee: EmployeeDashboard,
  }[state.user.role];

  return <DashboardComponent />;
};

export default Dashboard;