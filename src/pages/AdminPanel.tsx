import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Trash, Edit, Plus, Settings, ExternalLink, Link as LinkIcon, Tag, Calendar, Users, Clock, Loader } from 'lucide-react';
import { useUser } from '../context/UserContext';

type UserFormMode = 'add' | 'edit';
type ToolFormMode = 'add' | 'edit';
type ActiveTab = 'users' | 'tools' | 'promo';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { 
    user, 
    users, 
    tools, 
    promoCodes,
    loading,
    addUser, 
    editUser,
    setUserProDays,
    deleteUser, 
    addTool, 
    deleteTool, 
    editTool,
    generatePromoCode,
    deletePromoCode
  } = useUser();

  const [activeTab, setActiveTab] = useState<ActiveTab>('tools');
  const [userFormMode, setUserFormMode] = useState<UserFormMode>('add');
  const [toolFormMode, setToolFormMode] = useState<ToolFormMode>('add');
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editToolId, setEditToolId] = useState<string | null>(null);
  
  // User form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Basic' | 'Pro' | 'Admin'>('Basic');
  
  // Pro days form
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [proDays, setProDays] = useState(30);
  
  // Tool form
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [toolCategory, setToolCategory] = useState<'Mecânica' | 'Elétrica' | 'Estrutural'>('Mecânica');
  const [toolType, setToolType] = useState<'Internal' | 'External'>('Internal');
  const [toolLink, setToolLink] = useState('');
  const [toolAccessLevel, setToolAccessLevel] = useState<'Basic' | 'Pro'>('Basic');

  // Promo code form
  const [promoDaysValid, setPromoDaysValid] = useState(30);
  const [promoMaxUses, setPromoMaxUses] = useState(10);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Success message
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Admin')) {
      navigate('/dashboard');
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-700">Carregando dados do administrador...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'Admin') return null;

  const resetUserForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('Basic');
    setUserFormMode('add');
    setEditUserId(null);
  };

  const resetToolForm = () => {
    setToolName('');
    setToolDescription('');
    setToolCategory('Mecânica');
    setToolType('Internal');
    setToolLink('');
    setToolAccessLevel('Basic');
    setToolFormMode('add');
    setEditToolId(null);
  };

  const handleEditUserClick = (userId: string) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setEditUserId(userId);
      setUsername(userToEdit.username);
      setEmail(userToEdit.email);
      setPassword(''); // Don't set password for security
      setRole(userToEdit.role);
      setUserFormMode('edit');
    }
  };

  const handleSetProDaysClick = (userId: string) => {
    setSelectedUserId(userId);
    setProDays(30); // Default to 30 days
  };

  const handleApplyProDays = () => {
    if (selectedUserId && proDays > 0) {
      setUserProDays(selectedUserId, proDays);
      setSuccessMessage(`Acesso Pro concedido por ${proDays} dias`);
      setSelectedUserId(null);
    }
  };

  const handleDeleteUserClick = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(userId);
    }
  };

  const handleEditToolClick = (toolId: string) => {
    const toolToEdit = tools.find(t => t.id === toolId);
    if (toolToEdit) {
      setEditToolId(toolId);
      setToolName(toolToEdit.name);
      setToolDescription(toolToEdit.description);
      setToolCategory(toolToEdit.category);
      setToolType(toolToEdit.type);
      setToolLink(toolToEdit.link);
      setToolAccessLevel(toolToEdit.accessLevel);
      setToolFormMode('edit');
    }
  };

  const handleDeleteToolClick = (toolId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta ferramenta?')) {
      deleteTool(toolId);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userFormMode === 'add') {
      addUser({
        username,
        email,
        role,
        password
      });
      setSuccessMessage('Usuário adicionado com sucesso');
    } else if (userFormMode === 'edit' && editUserId) {
      editUser(editUserId, {
        username,
        email,
        role,
        ...(password ? { password } : {})
      });
      setSuccessMessage('Usuário atualizado com sucesso');
    }
    
    resetUserForm();
  };

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const toolData = {
      name: toolName,
      description: toolDescription,
      category: toolCategory,
      type: toolType,
      link: toolLink,
      accessLevel: toolAccessLevel
    };
    
    if (toolFormMode === 'add') {
      addTool(toolData);
      setSuccessMessage('Ferramenta adicionada com sucesso');
    } else if (toolFormMode === 'edit' && editToolId) {
      editTool(editToolId, toolData);
      setSuccessMessage('Ferramenta atualizada com sucesso');
    }
    
    resetToolForm();
  };

  const handleGeneratePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generatePromoCode(promoDaysValid, promoMaxUses);
    setGeneratedCode(code);
    setSuccessMessage('Código promocional gerado com sucesso');
  };

  const handleDeletePromoCode = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este código promocional?')) {
      deletePromoCode(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">Painel de Administração</h1>
          <p className="text-gray-600 mt-2">
            Gerencie usuários, ferramentas e códigos promocionais do sistema
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Admin Tabs */}
        <div className="mb-8 border-b">
          <div className="flex space-x-4">
            <button 
              className={`pb-4 px-4 font-medium flex items-center ${
                activeTab === 'tools' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('tools')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Ferramentas
            </button>
            <button 
              className={`pb-4 px-4 font-medium flex items-center ${
                activeTab === 'users' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5 mr-2" />
              Usuários
            </button>
            <button 
              className={`pb-4 px-4 font-medium flex items-center ${
                activeTab === 'promo' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('promo')}
            >
              <Tag className="h-5 w-5 mr-2" />
              Códigos Promocionais
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Tool Management Section */}
          {activeTab === 'tools' && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Gerenciamento de Ferramentas</h2>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acesso
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tools.map(tool => (
                      <tr key={tool.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {tool.type === 'External' ? 
                              <ExternalLink className="h-4 w-4 mr-2 text-gray-400" /> : 
                              <LinkIcon className="h-4 w-4 mr-2 text-gray-400" />
                            }
                            {tool.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {tool.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {tool.type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${tool.accessLevel === 'Pro' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {tool.accessLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditToolClick(tool.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteToolClick(tool.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <form onSubmit={handleToolSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {toolFormMode === 'add' ? 'Adicionar Ferramenta' : 'Editar Ferramenta'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="toolName" className="block text-sm font-medium text-gray-700">
                      Nome da Ferramenta
                    </label>
                    <input
                      type="text"
                      id="toolName"
                      className="input-field mt-1"
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="toolCategory" className="block text-sm font-medium text-gray-700">
                      Categoria
                    </label>
                    <select
                      id="toolCategory"
                      className="input-field mt-1"
                      value={toolCategory}
                      onChange={(e) => setToolCategory(e.target.value as 'Mecânica' | 'Elétrica' | 'Estrutural')}
                      required
                    >
                      <option value="Mecânica">Mecânica</option>
                      <option value="Elétrica">Elétrica</option>
                      <option value="Estrutural">Estrutural</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="toolDescription" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="toolDescription"
                    className="input-field mt-1"
                    rows={2}
                    value={toolDescription}
                    onChange={(e) => setToolDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="toolType" className="block text-sm font-medium text-gray-700">
                      Tipo de Ferramenta
                    </label>
                    <select
                      id="toolType"
                      className="input-field mt-1"
                      value={toolType}
                      onChange={(e) => setToolType(e.target.value as 'Internal' | 'External')}
                      required
                    >
                      <option value="Internal">Interna (dentro do sistema)</option>
                      <option value="External">Externa (link para outro site)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="toolAccessLevel" className="block text-sm font-medium text-gray-700">
                      Nível de Acesso
                    </label>
                    <select
                      id="toolAccessLevel"
                      className="input-field mt-1"
                      value={toolAccessLevel}
                      onChange={(e) => setToolAccessLevel(e.target.value as 'Basic' | 'Pro')}
                      required
                    >
                      <option value="Basic">Básico</option>
                      <option value="Pro">Pro</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="toolLink" className="block text-sm font-medium text-gray-700">
                    {toolType === 'External' ? 'URL Externa' : 'Caminho Interno'}
                  </label>
                  <input
                    type="text"
                    id="toolLink"
                    className="input-field mt-1"
                    placeholder={toolType === 'External' ? 'https://...' : '/tool/nome-da-ferramenta'}
                    value={toolLink}
                    onChange={(e) => setToolLink(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {toolType === 'External' 
                      ? 'Insira a URL completa incluindo https://' 
                      : 'Para ferramentas internas, use o formato /tool/nome-da-ferramenta'}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {toolFormMode === 'add' ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {toolFormMode === 'add' ? 'Adicionar Ferramenta' : 'Atualizar Ferramenta'}
                  </button>
                  
                  {toolFormMode === 'edit' && (
                    <button
                      type="button"
                      className="btn border border-gray-300"
                      onClick={resetToolForm}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* User Management Section */}
          {activeTab === 'users' && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Papel
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pro Expira Em
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {u.username}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {u.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                              u.role === 'Pro' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {u.role === 'Pro' && u.proExpiryDate ? (
                            new Date(u.proExpiryDate).toLocaleDateString()
                          ) : (
                            <span className="text-gray-500 text-sm">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          {u.role !== 'Admin' && (
                            <button
                              onClick={() => handleSetProDaysClick(u.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                              title="Definir dias Pro"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditUserClick(u.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {u.username !== 'Elidio' && (
                            <button
                              onClick={() => handleDeleteUserClick(u.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pro Days Form */}
              {selectedUserId && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Definir Acesso Pro
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-grow">
                      <label htmlFor="proDays" className="block text-sm font-medium text-gray-700 mb-1">
                        Dias de acesso Pro
                      </label>
                      <input
                        type="number"
                        id="proDays"
                        className="input-field"
                        value={proDays}
                        onChange={(e) => setProDays(parseInt(e.target.value))}
                        min="1"
                        max="365"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={handleApplyProDays}
                      >
                        Aplicar
                      </button>
                      <button 
                        type="button" 
                        className="btn border border-gray-300"
                        onClick={() => setSelectedUserId(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-blue-600">
                    O usuário terá acesso Pro por {proDays} dias a partir de agora.
                  </p>
                </div>
              )}

              <form onSubmit={handleUserSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {userFormMode === 'add' ? 'Adicionar Usuário' : 'Editar Usuário'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Nome de usuário
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="input-field mt-1"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="input-field mt-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha {userFormMode === 'edit' && '(deixe em branco para manter a atual)'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="input-field mt-1"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={userFormMode === 'add'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Papel
                    </label>
                    <select
                      id="role"
                      className="input-field mt-1"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'Basic' | 'Pro' | 'Admin')}
                      required
                    >
                      <option value="Basic">Basic</option>
                      <option value="Pro">Pro</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {userFormMode === 'add' ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    {userFormMode === 'add' ? 'Adicionar Usuário' : 'Atualizar Usuário'}
                  </button>
                  
                  {userFormMode === 'edit' && (
                    <button
                      type="button"
                      className="btn border border-gray-300"
                      onClick={resetUserForm}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Promo Code Management Section */}
          {activeTab === 'promo' && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Gerenciamento de Códigos Promocionais</h2>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dias de Acesso Pro
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usos Restantes
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Criação
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {promoCodes.map(promo => (
                      <tr key={promo.id}>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {promo.code}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {promo.daysValid} dias
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              promo.usesLeft === 0 
                                ? 'bg-red-100 text-red-800' 
                                : promo.usesLeft < promo.maxUses / 4 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
                            {promo.usesLeft} / {promo.maxUses}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(promo.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeletePromoCode(promo.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {promoCodes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          Nenhum código promocional encontrado. Crie o primeiro abaixo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <form onSubmit={handleGeneratePromoCode} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Gerar Novo Código Promocional
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="promoDays" className="block text-sm font-medium text-gray-700">
                      Dias de Acesso Pro
                    </label>
                    <input
                      type="number"
                      id="promoDays"
                      className="input-field mt-1"
                      value={promoDaysValid}
                      onChange={(e) => setPromoDaysValid(parseInt(e.target.value))}
                      min="1"
                      max="365"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="promoUses" className="block text-sm font-medium text-gray-700">
                      Número Máximo de Usos
                    </label>
                    <input
                      type="number"
                      id="promoUses"
                      className="input-field mt-1"
                      value={promoMaxUses}
                      onChange={(e) => setPromoMaxUses(parseInt(e.target.value))}
                      min="1"
                      max="1000"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  Gerar Código Promocional
                </button>
                
                {generatedCode && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Código Gerado com Sucesso:</h4>
                    <div className="bg-white p-3 border border-green-300 rounded flex items-center justify-between">
                      <span className="font-mono text-lg font-bold">{generatedCode}</span>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCode);
                          alert('Código copiado para a área de transferência!');
                        }}
                      >
                        Copiar
                      </button>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Este código dá acesso Pro por {promoDaysValid} dias e pode ser usado {promoMaxUses} vezes.
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
 