import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import { Settings } from 'lucide-react';

const CalculatorMechanical = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-secondary">Calculadora Mecânica</h1>
        </div>

        <div className="card max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Calculadora de Torque</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Força (N)
                </label>
                <input type="number" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raio (m)
                </label>
                <input type="number" className="input-field" />
              </div>
            </div>
            
            <button className="btn btn-primary w-full">
              Calcular Torque
            </button>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Resultado:
              </h3>
              <div className="text-2xl font-bold text-primary">
                0 N·m
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalculatorMechanical;
 