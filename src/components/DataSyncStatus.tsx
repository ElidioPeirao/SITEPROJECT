import  { useState, useEffect } from 'react';
import { Database, CloudOff, Check, AlertCircle } from 'lucide-react';

type SyncStatus = 'syncing' | 'success' | 'error' | 'offline';

interface DataSyncStatusProps {
  visible?: boolean;
}

const DataSyncStatus = ({ visible = true }: DataSyncStatusProps) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Subscribe to storage events from the UserContext
    window.addEventListener('data-sync-status', ((event: CustomEvent) => {
      setSyncStatus(event.detail.status);
      setMessage(event.detail.message || '');
      
      // Auto hide success after 3 seconds
      if (event.detail.status === 'success') {
        const timer = setTimeout(() => {
          setSyncStatus('offline');
        }, 3000);
        return () => clearTimeout(timer);
      }
    }) as EventListener);
    
    return () => {
      window.removeEventListener('data-sync-status', (() => {}) as EventListener);
    };
  }, []);
  
  if (!visible || syncStatus === 'offline') {
    return null;
  }
  
  const getStatusStyles = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Database className="h-4 w-4 animate-pulse" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'offline':
        return <CloudOff className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Sincronizando...';
      case 'success':
        return 'Dados sincronizados com sucesso';
      case 'error':
        return message || 'Erro ao sincronizar dados';
      case 'offline':
        return 'Offline';
      default:
        return '';
    }
  };
  
  return (
    <div className={`fixed bottom-4 right-4 py-2 px-4 rounded-md border text-sm flex items-center gap-2 shadow-md ${getStatusStyles()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

export default DataSyncStatus;
 