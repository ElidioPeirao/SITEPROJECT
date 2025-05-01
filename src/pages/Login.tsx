import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bonusCode, setBonusCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const { login, register, loading } = useUser();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRegisterSuccess('');
    
    if (!username || !email || !password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    const success = register(username, email, password, bonusCode);
    if (success) {
      if (bonusCode) {
        setRegisterSuccess('Conta criada com sucesso! Seu código promocional foi aplicado.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Nome de usuário já existe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-secondary">EPROJECTS</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Hero image */}
            <div className="h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwZW5naW5lZXJpbmclMjB0b29scyUyMGJsdWVwcmludHxlbnwwfHx8fDE3NDYxMzc2NTZ8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800"
                alt="Engineering blueprint review"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="flex border-b mb-6">
                <button
                  className={`tab ${activeTab === 'login' ? 'tab-active' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('login')}
                >
                  Entrar
                </button>
                <button
                  className={`tab ${activeTab === 'register' ? 'tab-active' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('register')}
                >
                  Criar conta
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {registerSuccess && (
                <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                  {registerSuccess}
                </div>
              )}

              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">
                      Usuário
                    </label>
                    <div className="relative">
                      <input
                        id="login-username"
                        type="text"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        className="input-field pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {password && password.length < 6 && (
                      <p className="mt-1 text-xs text-red-600">A senha deve ter pelo menos 6 caracteres</p>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary w-full mt-6">
                    Entrar
                  </button>
                  
                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Use as credenciais de administrador:</p>
                    <p>Usuário: <strong>Elidio</strong>, Senha: <strong>762555</strong></p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">
                      Usuário
                    </label>
                    <div className="relative">
                      <input
                        id="reg-username"
                        type="text"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <div className="relative">
                      <input
                        id="reg-email"
                        type="email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {email && !validateEmail(email) && (
                      <p className="mt-1 text-xs text-red-600">Email inválido</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        className="input-field pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {password && password.length < 6 && (
                      <p className="mt-1 text-xs text-red-600">A senha deve ter pelo menos 6 caracteres</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-bonus" className="block text-sm font-medium text-gray-700 mb-1">
                      Código bônus (opcional)
                    </label>
                    <input
                      id="reg-bonus"
                      type="text"
                      className="input-field"
                      value={bonusCode}
                      onChange={(e) => setBonusCode(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Se possuir um código promocional, insira-o para obter benefícios adicionais
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary w-full mt-6">
                    Criar conta
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            EPROJECTS © {new Date().getFullYear()} - Ferramentas de Engenharia Mecânica
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
 