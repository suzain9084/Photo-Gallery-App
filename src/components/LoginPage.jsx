import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/UserContext';
import './LoginPage.css';

const LoginPage = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.status === 200) {
        const user_data = await res.json();
        setUser(user_data);
        navigate('/'); 
      } else if (res.status === 500) {
        const error = await res.json();
        setError('password', { type: 'server', message: error.error });
      } else if (res.status === 404) {
        setError('password', { type: 'server', message: 'Username not found or incorrect password' });
      } else {
        setError('password', { type: 'server', message: 'An unexpected error occurred' });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError('password', { type: 'server', message: 'Network error, please try again later' });
    }
  };

  return (
    <>
    <div className='header'>Login form</div>
    <div className='container'>
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...register('user_name', { 
            required: 'Username is required',
            minLength: { value: 4, message: 'Username must be at least 4 characters long' }
          })}
        />
        {errors.user_name && <p className="error-message">{errors.user_name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { 
            required: 'Password is required', 
            minLength: { value: 6, message: 'Password must be at least 6 characters long' },
            maxLength: { value: 20, message: 'Password must be no more than 20 characters' }
          })}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}
      </div>

      <button 
        type="submit" 
        className="login-button" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Login'}
      </button>
    </form>
    </div>
    </>
  );
};

export default LoginPage;
