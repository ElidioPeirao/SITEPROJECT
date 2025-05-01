import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Settings } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-secondary flex items-center">
          <Settings className="h-6 w-6 mr-2 text-primary" />
          EPROJECTS
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6 text-secondary" />
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-gray-700 hover:text-primary flex items-center">
            <Settings className="h-5 w-5 mr-1" />
            Ferramentas
          </Link>
          {user?.role === 'Admin' && (
            <Link to="/admin" className="text-gray-700 hover:text-primary flex items-center">
              <Settings className="h-5 w-5 mr-1" />
              Administrador
            </Link>
          )}
          <div className="flex items-center gap-2">
            <span className="text-gray-700">{user?.username}</span>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-primary"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 pb-4">
          <Link 
            to="/dashboard" 
            className="block text-gray-700 hover:text-primary py-2 flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Settings className="h-5 w-5 mr-2" />
            Ferramentas
          </Link>
          {user?.role === 'Admin' && (
            <Link 
              to="/admin" 
              className="block text-gray-700 hover:text-primary py-2 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5 mr-2" />
              Administrador
            </Link>
          )}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center">
              <span className="text-gray-700">{user?.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-primary"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
 