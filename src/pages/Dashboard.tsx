import  { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ExternalLink, Settings, Tag, Loader } from 'lucide-react';
import { useUser } from '../context/UserContext';

type CategoryFilter = 'Todas' | 'Mecânica' | 'Elétrica' | 'Estrutural';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, tools, usePromoCode, loading } = useUser();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('Todas');
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, navigate, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-700">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Filter tools based on user access level and selected category
  const filteredTools = tools.filter(tool => {
    const hasAccess = tool.accessLevel === 'Basic' || user.role === 'Pro' || user.role === 'Admin';
    const matchesCategory = activeFilter === 'Todas' || tool.category === activeFilter;
    return hasAccess && matchesCategory;
  });

  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    
    const result = usePromoCode(promoCode);
    setPromoResult(result);
    
    if (result.success) {
      setPromoCode('');
      // Clear the result message after 5 seconds if successful
      setTimeout(() => {
        setPromoResult(null);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">Ferramentas de Engenharia</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo, {user.username}. 
            {user.role === 'Pro' && user.proExpiryDate && (
              <span className="ml-2 text-blue-600">
                Seu acesso Pro expira em {new Date(user.proExpiryDate).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>

        {/* Promo Code Redemption */}
        {user.role !== 'Admin' && (
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Resgatar Código Promocional</h2>
            </div>
            
            <form onSubmit={handlePromoCodeSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Digite seu código promocional"
                className="input-field flex-grow"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Resgatar Código
              </button>
            </form>
            
            {promoResult && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                promoResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {promoResult.message}
              </div>
            )}
          </div>
        )}

        {/* Filter Categories */}
        <div className="flex flex-wrap mb-8 gap-2">
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'Todas' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
            onClick={() => setActiveFilter('Todas')}
          >
            Todas
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'Mecânica' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
            onClick={() => setActiveFilter('Mecânica')}
          >
            Mecânica
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'Elétrica' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
            onClick={() => setActiveFilter('Elétrica')}
          >
            Elétrica
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'Estrutural' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
            onClick={() => setActiveFilter('Estrutural')}
          >
            Estrutural
          </button>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-md">
            <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">Nenhuma ferramenta encontrada</h3>
            <p className="text-gray-500 mt-2">
              Não há ferramentas disponíveis para a categoria selecionada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <div key={tool.id} className="card hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  {tool.name}
                  
                  {tool.accessLevel === 'Pro' && (
                    <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {tool.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 text-sm">{tool.description}</p>
                
                {tool.type === 'External' ? (
                  <a 
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 w-full"
                  >
                    <span>Abrir Link</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link 
                    to={tool.link}
                    className="btn bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors w-full text-center"
                  >
                    Abrir Ferramenta
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <div className="relative h-64 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwZW5naW5lZXJpbmclMjBibHVlcHJpbnQlMjB0b29sc3xlbnwwfHx8fDE3NDYxMzc2NTZ8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800"
              alt="Engineering design work"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
              <div className="text-center">
                <h2 className="text-white text-2xl font-bold mb-2">Ferramentas Profissionais</h2>
                <p className="text-white text-lg">
                  Soluções de engenharia para profissionais
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
 