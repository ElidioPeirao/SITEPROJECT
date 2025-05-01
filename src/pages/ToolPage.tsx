import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import { FileCheck, Download, ArrowLeft, Settings } from 'lucide-react';

type ToolParams = {
  toolId: string;
};

const ToolPage = () => {
  const navigate = useNavigate();
  const { toolId } = useParams<ToolParams>();
  const { user, tools } = useUser();
  const [activeTool, setActiveTool] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (toolId) {
      const foundTool = tools.find(t => t.link === `/tool/${toolId}`);
      if (foundTool) {
        if (foundTool.accessLevel === 'Pro' && user.role === 'Basic') {
          alert('Esta ferramenta é exclusiva para usuários Pro.');
          navigate('/dashboard');
          return;
        }
        setActiveTool(foundTool);
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, toolId, tools, navigate]);

  if (!user || !activeTool) return null;

  // Define different tool contents based on toolId
  const renderToolContent = () => {
    switch (toolId) {
      case 'torque-calculator':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Calculadora de Torque</h2>
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
        );
        
      case 'stress-analysis':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Análise de Tensão em Componentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Força Aplicada (N)
                </label>
                <input type="number" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área da Seção (mm²)
                </label>
                <input type="number" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Módulo de Elasticidade (GPa)
                </label>
                <input type="number" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coeficiente de Poisson
                </label>
                <input type="number" className="input-field" step="0.01" min="0" max="0.5" />
              </div>
            </div>
            
            <button className="btn btn-primary w-full">
              Calcular Tensões
            </button>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Resultados:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tensão Normal:</p>
                  <p className="text-xl font-bold text-primary">0 MPa</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deformação:</p>
                  <p className="text-xl font-bold text-primary">0 %</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'gear-design':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Dimensionamento de Engrenagens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Módulo (mm)
                </label>
                <input type="number" className="input-field" min="0.5" step="0.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Dentes (Z)
                </label>
                <input type="number" className="input-field" min="10" step="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ângulo de Pressão (°)
                </label>
                <select className="input-field">
                  <option value="14.5">14.5°</option>
                  <option value="20">20°</option>
                  <option value="25">25°</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Largura da Face (mm)
                </label>
                <input type="number" className="input-field" min="5" />
              </div>
            </div>
            
            <button className="btn btn-primary w-full">
              Calcular Parâmetros
            </button>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Parâmetros da Engrenagem:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Diâmetro Primitivo:</p>
                  <p className="text-xl font-bold text-primary">0 mm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Diâmetro Externo:</p>
                  <p className="text-xl font-bold text-primary">0 mm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Diâmetro Interno:</p>
                  <p className="text-xl font-bold text-primary">0 mm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passo:</p>
                  <p className="text-xl font-bold text-primary">0 mm</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="btn flex items-center gap-2 bg-secondary text-white hover:bg-secondary/90">
                  <Download className="h-4 w-4" />
                  Exportar Dados
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <FileCheck className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-medium">Ferramenta em Desenvolvimento</h2>
            <p className="text-gray-500 mt-2">Esta ferramenta ainda está sendo implementada.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-primary flex items-center mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Ferramentas
          </button>
          
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-secondary">{activeTool.name}</h1>
            
            {activeTool.accessLevel === 'Pro' && (
              <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                PRO
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            {activeTool.description}
          </p>
        </div>

        <div className="card max-w-3xl mx-auto">
          {renderToolContent()}
        </div>
        
        <div className="mt-8">
          <div className="relative h-48 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxtZWNoYW5pY2FsJTIwZW5naW5lZXJpbmclMjB0b29scyUyMGJsdWVwcmludHxlbnwwfHx8fDE3NDYxMzQ0NDl8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800"
              alt="Engineering testing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-6">
              <p className="text-white text-center text-lg font-medium">
                Ferramentas precisas para engenheiros profissionais
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolPage;
 