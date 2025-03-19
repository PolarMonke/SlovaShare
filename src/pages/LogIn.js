import React, { useState } from 'react';
import '../styles/LogIn.css';

export default function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isNewAccount, setIsNewAccount] = useState(false);

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    email: '',
    code: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { username: '', password: '', email: '', code: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (isNewAccount && !email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (isNewAccount && !code.trim()) {
      newErrors.code = 'Verification code is required';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    console.log('Logging in with:', { username, password, email, code });

    setUsername('');
    setPassword('');
    setEmail('');
    setCode('');
    setErrors({ username: '', password: '', email: '', code: '' });
  };

  const handleSendCode = () => {
    // Send the code fr fr instead of ts
    console.log('Sending verification code to:', email);
    alert(`Verification code sent to ${email}`);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isNewAccount ? 'Create New Account' : 'Log In'}</h2>

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {/* New Account Fields */}
        {isNewAccount && (
          <>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            {/* Send Code Button */}
            <div className="form-group">
              <button
                type="button"
                onClick={handleSendCode}
                className="login-button"
              >
                Send Code
              </button>
            </div>

            {/* Verification Code Field */}
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="login-input"
              />
              {errors.code && <p className="error">{errors.code}</p>}
            </div>
          </>
        )}

        {/* Submit Button */}
        <button type="submit" className="login-button">
          {isNewAccount ? 'Create Account' : 'Log In'}
        </button>

        {/* Toggle New Account Button */}
        <button
          type="button"
          onClick={() => setIsNewAccount(!isNewAccount)}
          className="login-button toggle-button"
        >
          {isNewAccount ? 'Already have an account? Log In' : 'Create New Account'}
        </button>
      </form>
    </div>
  );
}