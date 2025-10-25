import { Header } from '@/Presentation/components';
import { useNavigate } from 'react-router';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome to your dashboard!</p>
        <button onClick={()=>{navigate('/diagram');}}>Create</button>
      </div>
    </div>
  );
};

export default Dashboard;
