import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';
import { useAuthForm } from '../hooks/useAuthForm';
import InputField from '../components/InputField';
import './Auth.css';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false); // ✅ loader state
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, handleChange, validate, setErrors } = useAuthForm(isLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    setLoading(true); // start loader
    try {
      const res = isLogin
        ? await auth.login({ email: values.email, password: values.password })
        : await auth.signup({ username: values.username, email: values.email, password: values.password });

      login(res.data.token);
      navigate('/chat');
    } catch (err: any) {
      const message =
        err.response?.status === 429
          ? err.response?.data?.message || 'Too many attempts. Please wait.'
          : err.response?.data?.message || 'Authentication failed';
      setErrors({ general: message });
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <InputField
            label="Username"
            value={values.username}
            onChange={handleChange('username')}
            error={errors.username}
            required={!isLogin}
          />
        )}

        <InputField
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />

        <InputField
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          required
        />

        {errors.general && <p className="error-message">{errors.general}</p>}

        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : isLogin ? 'Login' : 'Signup'}
        </button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <span className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Signup' : 'Login'}
        </span>
      </p>
    </div>
  );
};

export default AuthPage;
