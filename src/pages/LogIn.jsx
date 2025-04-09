import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LogIn.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LogIn() {
    const { t } = useTranslation();
    const { login, loadUser } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isNewAccount, setIsNewAccount] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        email: '',
        code: '',
    });
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (isNewAccount) {
                await handleRegister();
            } 
            else {
                await handleLogin();
            }
        }
        catch (err) {
            setApiError(err.response?.data?.message || 'Operation failed');
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        console.log("Submitting:", { username, email, password, code });
      
        if (!username.trim() || !email.trim() || !password.trim()) {
            setApiError(t('register.allFieldsRequired'));
            return;
        }
    
        if (!isCodeSent) {
            await handleSendCode();
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5076/users/register', 
                {
                    login: username,
                    email: email,
                    password: password,
                    verificationCode: code
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
    
            console.log('Registration successful:', response.data);
            alert(t('register.success'));
            resetForm();
            setIsNewAccount(false);
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response?.data) {
                const errorData = error.response.data;
    
                if (errorData.field === 'password') {
                    setApiError(t("Password In Use"));
                    const newErrors = { username: '', password: '', email: '', code: '' }; 
                    newErrors.password = t('Password In Use By User', { login: errorData.login })
                    setErrors(newErrors);
                } else if (errorData.field === 'email') {
                    setApiError(t('register.emailInUse'));
                } else if (errorData.message) {
                    setApiError(errorData.message);
                } else {
                    setApiError(t('General Error'));
                }
            } else {
                setApiError(t('General Error'));
            }
        }
    };

    const handleLogin = async () => {
        try {
            const userData = await login({ 
                login: username, 
                password: password 
            });
            // const userData = await login(credentials);

            console.log('Login successful:', userData);
            await loadUser();
            navigate(`/account/${userData.id}`);
        } catch (err) {
            let errorMessage = 'Login failed';
            
            if (err.response) {
                console.error('Login error response:', err.response.data);
                errorMessage = err.response.data?.message || errorMessage;
                
                if (err.response.status === 401) {
                    errorMessage = 'Invalid username or password';
                }
            } else if (err.request) {
                console.error('Login request error:', err.request);
                errorMessage = 'No response from server';
            } else {
                console.error('Login setup error:', err.message);
                errorMessage = 'Request setup failed';
            }
            
            setApiError(errorMessage);
        }
    };

    const handleSendCode = async () => {
        // Mock implementation - replace with actual API call
        const mockCode = Math.floor(1000 + Math.random() * 9000);
        setCode(mockCode.toString());
        alert(`Verification code sent to ${email}\nDemo code: ${mockCode}`);
        setIsCodeSent(true);
        
        // In production:
        // await axios.post('https://your-api.com/users/send-verification', { email });
    };

    const validateForm = () => {
        const newErrors = { username: '', password: '', email: '', code: '' };
        let isValid = true;

        if (!username.trim()) {
            newErrors.username = t('Username is required');
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = t('Password is required');
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = t('Password must be at least 8 characters');
            isValid = false;
        }

        if (isNewAccount) {
            if (!email.trim()) {
                newErrors.email = t('Email is required');
                isValid = false;
            }
            else if (!/^\S+@\S+\.\S+$/.test(email)) {
                newErrors.email = t('Invalid email format');
                isValid = false;
            }

            if (isCodeSent && !code.trim()) {
                newErrors.code = t('Verification code is required');
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setCode('');
        setErrors({ username: '', password: '', email: '', code: '' });
        setIsCodeSent(false);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>{isNewAccount ? t('Create Account') : t('Log In')}</h2>
                
                {apiError && <div className="error">{apiError}</div>}

                <div className="form-group">
                    <label>{t("Username")}</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="login-input"
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>

                <div className="form-group">
                    <label>{t("Password")}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input"
                      minLength={8}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>

                {isNewAccount && (
                    <>
                      <div className="form-group">
                          <label>{t("Email")}</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            disabled={isCodeSent}
                          />
                          {errors.email && <div className="error">{errors.email}</div>}
                      </div>

                      {isCodeSent && (
                          <div className="form-group">
                              <label>{t('Verification Code')}</label>
                              <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="login-input"
                              />
                              {errors.code && <div className="error">{errors.code}</div>}
                          </div>
                      )}

                      <button
                          type="button"
                          onClick={isCodeSent ? handleSubmit : handleSendCode}
                          className="login-button"
                          disabled={isLoading}
                      >
                        {isLoading ? t('Processing...') : 
                        isCodeSent ? t('Complete Registration') : t('Send Verification Code')}
                      </button>
                  </>
                )}

                {!isNewAccount && (
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? t('Logging in...') : t('Log In')}
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => {
                      setIsNewAccount(!isNewAccount);
                      resetForm();
                    }}
                    className="login-button toggle-button"
                >
                    {isNewAccount ? t('Already have an account? Log In') : 'Create New Account'}
                </button>
            </form>
        </div>
    );
}