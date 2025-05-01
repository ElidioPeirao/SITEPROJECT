import  { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Tool, PromoCode } from '../types';
import {
  fetchUsers,
  saveUsers,
  fetchTools,
  saveTools,
  fetchPromoCodes,
  savePromoCodes
} from '../services/googleSheetsService';

interface UserContextType {
  user: User | null;
  users: User[];
  tools: Tool[];
  promoCodes: PromoCode[];
  loading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password: string, bonusCode?: string) => boolean;
  addUser: (user: Omit<User, 'id'>) => void;
  editUser: (id: string, updates: Partial<Omit<User, 'id'>>) => void;
  setUserProDays: (id: string, days: number) => void;
  deleteUser: (id: string) => void;
  addTool: (tool: Omit<Tool, 'id'>) => void;
  deleteTool: (id: string) => void;
  editTool: (id: string, updates: Partial<Omit<Tool, 'id'>>) => void;
  generatePromoCode: (daysValid: number, maxUses: number) => string;
  usePromoCode: (code: string) => { success: boolean; message: string };
  deletePromoCode: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Initial data to use before loading from Google Sheets or if fetching fails
const initialUsers: User[] = [
  {
    id: '1',
    username: 'Elidio',
    email: 'admin@eprojects.com',
    role: 'Admin',
    password: '762555'
  },
  {
    id: '2',
    username: 'TestUser',
    email: 'user@example.com',
    role: 'Basic',
    password: 'password123'
  },
  {
    id: '3',
    username: 'ProUser',
    email: 'pro@example.com',
    role: 'Pro',
    password: 'password123',
    proExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  },
  {
    id: '4',
    username: 'admin',
    email: 'admin@admin.com',
    role: 'Admin',
    password: 'admin123'
  }
];

const initialTools: Tool[] = [
  {
    id: '1',
    name: 'Calculadora de Torque',
    description: 'Calcule torque com base na força e distância',
    category: 'Mecânica',
    type: 'Internal',
    link: '/tool/torque-calculator',
    accessLevel: 'Basic'
  },
  {
    id: '2',
    name: 'Análise de Tensão',
    description: 'Ferramenta para análise de tensão em componentes',
    category: 'Mecânica',
    type: 'Internal',
    link: '/tool/stress-analysis',
    accessLevel: 'Basic'
  },
  {
    id: '3',
    name: 'Dimensionamento de Engrenagens',
    description: 'Calcule parâmetros para engrenagens',
    category: 'Mecânica',
    type: 'Internal',
    link: '/tool/gear-design',
    accessLevel: 'Pro'
  },
  {
    id: '4',
    name: 'Engineering Toolbox',
    description: 'Referência externa para engenheiros',
    category: 'Mecânica',
    type: 'External',
    link: 'https://www.engineeringtoolbox.com/',
    accessLevel: 'Basic'
  },
  {
    id: '5',
    name: 'Calculadora de Circuitos',
    description: 'Calcule corrente, tensão e resistência em circuitos',
    category: 'Elétrica',
    type: 'Internal',
    link: '/tool/electrical-calculator',
    accessLevel: 'Basic'
  },
  {
    id: '6',
    name: 'Dimensionamento de Cabos',
    description: 'Determine a seção adequada para cabos elétricos',
    category: 'Elétrica',
    type: 'Internal',
    link: '/tool/cable-sizing',
    accessLevel: 'Basic'
  },
  {
    id: '7',
    name: 'Análise de Vigas',
    description: 'Calcule esforços e deflexões em vigas',
    category: 'Estrutural',
    type: 'Internal',
    link: '/tool/beam-analysis',
    accessLevel: 'Basic'
  },
  {
    id: '8',
    name: 'Dimensionamento de Colunas',
    description: 'Avalie a capacidade de carga de colunas',
    category: 'Estrutural',
    type: 'Internal',
    link: '/tool/column-design',
    accessLevel: 'Pro'
  }
];

// Initial promo codes
const initialPromoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'WELCOME30',
    daysValid: 30,
    maxUses: 100,
    usesLeft: 95,
    createdAt: new Date().toISOString()
  }
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [loading, setLoading] = useState(true);

  // Load data from Google Sheets on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load users
        const loadedUsers = await fetchUsers();
        if (loadedUsers.length > 0) {
          setUsers(loadedUsers);
        }

        // Load tools
        const loadedTools = await fetchTools();
        if (loadedTools.length > 0) {
          setTools(loadedTools);
        }

        // Load promo codes
        const loadedPromoCodes = await fetchPromoCodes();
        if (loadedPromoCodes.length > 0) {
          setPromoCodes(loadedPromoCodes);
        }
      } catch (error) {
        console.error('Error loading data from Google Sheets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Check for expired Pro users and downgrade them
  useEffect(() => {
    const now = new Date();
    const updatedUsers = users.map(u => {
      if (u.role === 'Pro' && u.proExpiryDate) {
        const expiryDate = new Date(u.proExpiryDate);
        if (expiryDate < now) {
          return {
            ...u,
            role: 'Basic',
            proExpiryDate: undefined
          };
        }
      }
      return u;
    });
    
    if (JSON.stringify(updatedUsers) !== JSON.stringify(users)) {
      setUsers(updatedUsers);
    }
  }, [users]);

  // Save users to Google Sheets whenever they change
  useEffect(() => {
    if (!loading) {
      saveUsers(users).catch(error => {
        console.error('Error saving users to Google Sheets:', error);
      });
    }
  }, [users, loading]);

  // Save tools to Google Sheets whenever they change
  useEffect(() => {
    if (!loading) {
      saveTools(tools).catch(error => {
        console.error('Error saving tools to Google Sheets:', error);
      });
    }
  }, [tools, loading]);

  // Save promo codes to Google Sheets whenever they change
  useEffect(() => {
    if (!loading) {
      savePromoCodes(promoCodes).catch(error => {
        console.error('Error saving promo codes to Google Sheets:', error);
      });
    }
  }, [promoCodes, loading]);

  // Also save data to localStorage as a backup
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('promoCodes', JSON.stringify(promoCodes));
  }, [promoCodes]);

  const login = (username: string, password: string) => {
    // File-based authentication - case insensitive username for better UX
    const foundUser = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string, bonusCode?: string) => {
    // Check if username already exists (case insensitive)
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return false;
    }
    
    // Check for special bonus code for admin
    const adminBonusCode = "ELIDIOFODA";
    let role: 'Basic' | 'Pro' | 'Admin' = 'Basic';
    
    if (bonusCode === adminBonusCode) {
      role = 'Admin';
    } else if (bonusCode) {
      // Check if bonusCode is a valid promo code
      const promoIndex = promoCodes.findIndex(
        promo => promo.code === bonusCode && promo.usesLeft > 0
      );
      
      if (promoIndex !== -1) {
        role = 'Pro';
        
        // Update promo code uses
        const promo = promoCodes[promoIndex];
        const updatedPromoCodes = [...promoCodes];
        updatedPromoCodes[promoIndex] = {
          ...promo,
          usesLeft: promo.usesLeft - 1
        };
        setPromoCodes(updatedPromoCodes);
      }
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role,
      password
    };

    // If user is Pro, set expiry date
    if (role === 'Pro' && bonusCode && bonusCode !== adminBonusCode) {
      const promoCode = promoCodes.find(p => p.code === bonusCode);
      if (promoCode) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + promoCode.daysValid);
        newUser.proExpiryDate = expiryDate.toISOString();
      }
    }
    
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const user = {
      ...newUser,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, user]);
  };

  const editUser = (id: string, updates: Partial<Omit<User, 'id'>>) => {
    setUsers(prev => 
      prev.map(user => user.id === id ? { ...user, ...updates } : user)
    );
    
    // Update current user if it's the same
    if (user && user.id === id) {
      setUser({ ...user, ...updates });
    }
  };

  // Set a user's role to Pro with a specific number of days
  const setUserProDays = (id: string, days: number) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    setUsers(prev => 
      prev.map(user => {
        if (user.id === id) {
          return { 
            ...user, 
            role: 'Pro', 
            proExpiryDate: expiryDate.toISOString() 
          };
        }
        return user;
      })
    );
    
    // Update current user if it's the same
    if (user && user.id === id) {
      setUser({ 
        ...user, 
        role: 'Pro', 
        proExpiryDate: expiryDate.toISOString() 
      });
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addTool = (newTool: Omit<Tool, 'id'>) => {
    const tool = {
      ...newTool,
      id: Date.now().toString()
    };
    setTools(prev => [...prev, tool]);
  };
  
  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  };
  
  const editTool = (id: string, updates: Partial<Omit<Tool, 'id'>>) => {
    setTools(prev => 
      prev.map(tool => tool.id === id ? { ...tool, ...updates } : tool)
    );
  };

  // Generate a random promotional code
  const generateRandomCode = (length: number = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate a new promo code
  const generatePromoCode = (daysValid: number, maxUses: number) => {
    // Generate unique code
    let code = generateRandomCode();
    while (promoCodes.some(promo => promo.code === code)) {
      code = generateRandomCode();
    }

    const newPromoCode: PromoCode = {
      id: Date.now().toString(),
      code,
      daysValid,
      maxUses,
      usesLeft: maxUses,
      createdAt: new Date().toISOString()
    };

    setPromoCodes(prev => [...prev, newPromoCode]);
    return code;
  };

  // Use a promo code to upgrade user to Pro
  const usePromoCode = (code: string) => {
    // Find the promo code
    const promoIndex = promoCodes.findIndex(
      promo => promo.code === code && promo.usesLeft > 0
    );

    if (promoIndex === -1) {
      return { success: false, message: 'Código promocional inválido ou esgotado.' };
    }

    if (!user) {
      return { success: false, message: 'Usuário não autenticado.' };
    }

    if (user.role === 'Admin') {
      return { success: false, message: 'Administradores já possuem acesso a todos os recursos.' };
    }

    // Update promo code uses
    const promo = promoCodes[promoIndex];
    const updatedPromoCodes = [...promoCodes];
    updatedPromoCodes[promoIndex] = {
      ...promo,
      usesLeft: promo.usesLeft - 1
    };
    setPromoCodes(updatedPromoCodes);

    // Calculate Pro expiry date
    const now = new Date();
    let expiryDate: Date;

    if (user.role === 'Pro' && user.proExpiryDate) {
      // If already Pro, extend the period
      const currentExpiry = new Date(user.proExpiryDate);
      if (currentExpiry > now) {
        // Add days to current expiry
        expiryDate = new Date(currentExpiry);
        expiryDate.setDate(expiryDate.getDate() + promo.daysValid);
      } else {
        // Current expiry is in the past, start fresh from now
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + promo.daysValid);
      }
    } else {
      // New Pro user
      expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + promo.daysValid);
    }

    // Update user
    const updatedUser = {
      ...user,
      role: 'Pro' as const,
      proExpiryDate: expiryDate.toISOString()
    };

    setUser(updatedUser);
    
    // Update user in users array
    setUsers(prev => 
      prev.map(u => u.id === user.id ? updatedUser : u)
    );

    return { 
      success: true, 
      message: `Parabéns! Você agora tem acesso Pro por ${promo.daysValid} dias (até ${expiryDate.toLocaleDateString()}).` 
    };
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes(prev => prev.filter(code => code.id !== id));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      users, 
      tools,
      promoCodes,
      loading,
      login, 
      logout,
      register,
      addUser, 
      editUser,
      setUserProDays,
      deleteUser,
      addTool,
      deleteTool,
      editTool,
      generatePromoCode,
      usePromoCode,
      deletePromoCode
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
 