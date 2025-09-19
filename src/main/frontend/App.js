import React, { useState, useEffect } from 'react';
import { User, Shield, LogOut, Home, Settings } from 'lucide-react';

const SpidPlatform = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpidLogin = () => {
    // Redirect to SPID authentication
    window.location.href = '/saml2/authenticate/spid';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/saml2/logout';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user?.authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Accesso con SPID
              </h1>
              
              <p className="text-gray-600 mb-8">
                Accedi alla piattaforma utilizzando la tua identità digitale SPID
              </p>
              
              <button
                onClick={handleSpidLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>Entra con SPID</span>
              </button>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Sistema Pubblico di Identità Digitale</p>
                <p>Secure • Fast • Italian Government Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Benvenuto nella piattaforma</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">I tuoi dati SPID</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nome:</span> {user.spidData?.name || 'N/A'}</p>
                  <p><span className="font-medium">Cognome:</span> {user.spidData?.familyName || 'N/A'}</p>
                  <p><span className="font-medium">Codice Fiscale:</span> {user.spidData?.fiscalCode || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {user.spidData?.email || 'N/A'}</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Stato Account</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Autenticato con SPID
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Identità verificata
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Accesso sicuro attivo
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profilo Utente</h2>
            <div className="max-w-2xl">
              {user.attributes && Object.entries(user.attributes).map(([key, value]) => (
                <div key={key} className="border-b border-gray-200 py-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="text-gray-900">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Impostazioni</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Privacy e Sicurezza</h3>
                <p className="text-gray-600 text-sm mb-3">
                  La tua identità è protetta dal sistema SPID
                </p>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition duration-200">
                  Gestisci Privacy
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Sessione</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Gestisci la tua sessione di accesso
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition duration-200"
                >
                  Termina Sessione
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SPID Platform</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">
                  {user.spidData?.name} {user.spidData?.familyName}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Esci</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-left transition duration-200 ${
                activeTab === 'home'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-left transition duration-200 ${
                activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profilo</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-left transition duration-200 ${
                activeTab === 'settings'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Impostazioni</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpidPlatform;