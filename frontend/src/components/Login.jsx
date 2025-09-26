import { useState } from 'react';
import { ShoppingBag, User, Lock } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      // Apuntando al puerto del backend
      const res = await fetch(`https://mi-backend.onrender.com/api/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!data.success) {
        if (data.reason === 'not_found') {
          setError('Usuario no encontrado. ¿Quieres registrarte?');
          setIsRegister(true);
        } else {
          setError(data.message || 'Error de autenticación');
        }
        return;
      }

      onLogin({ name: data.user.name, email: data.user.email });
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <ShoppingBag className="logo-icon" />
          <h1>Mi Tienda Online</h1>
          <p>{isRegister ? 'Crea tu cuenta' : 'Inicia sesión para comenzar a comprar'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            {isRegister 
              ? '¿Ya tienes cuenta? ' 
              : '¿No tienes cuenta? '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}>
              {isRegister ? 'Inicia sesión aquí' : 'Regístrate aquí'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
