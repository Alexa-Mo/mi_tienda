import { useState } from 'react';
import Login from './components/Login';
import Store from './components/Store';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Store user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
