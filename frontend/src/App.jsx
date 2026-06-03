import { useState } from 'react';
import Admin from './assets/components/AdminPage.jsx';
import Login from './assets/components/LoginPage.jsx';
import Users from './assets/components/StudentPage.jsx';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [message, setMessage] = useState(null);

  const triggerAlert = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLoginSuccess = (userToken, userRole) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('role', userRole);
    setToken(userToken);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    triggerAlert('Logged out successfully!');
  };

  return (
    <>
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} triggerAlert={triggerAlert} />
      ) : role === 'admin' ? (
        <Admin token={token} onLogout={handleLogout} triggerAlert={triggerAlert} />
      ) : (
        <Users token={token} onLogout={handleLogout} triggerAlert={triggerAlert} />
      )}

      {message && (
        <div className="alert">
          {message}
          <div className="load" />
        </div>
      )}
    </>
  );
}

export default App;
