import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import './SignupPage.css'; 
import userContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const { user, setUser } = useContext(userContext);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate()


  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('gender', data.gender);
    formData.append('age', data.age);
    formData.append('user_name', data.user_name);
    formData.append('password', data.password);
    formData.append('profile_photo', data.profile_photo[0]);
  
    try {
      let res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) { 
        const result = await res.json();
        setUser(result);
        navigate('/');
      } else if (res.status === 409) {
        setError('user_name', { type: 'manual', message: "This username already exists" });
      } else {
        const result = await res.json();
        setGeneralError(result.message || 'An error occurred. Please try again.'); 
      }
    } catch (error) {
      console.error('Error:', error);
      setGeneralError('An unexpected error occurred. Please try again.');
    }
  };
  

  return (
    <>
    <div className='header'>Sign Up</div>
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
      {generalError && <p className="error-message">{generalError}</p>}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters long' } })}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select id="gender" {...register('gender', { required: 'Gender is required' })}>
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="error-message">{errors.gender.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age', { required: 'Age is required', min: { value: 18, message: 'You must be at least 18 years old' }, max: { value: 100, message: 'Age must be under 100' } })}
        />
        {errors.age && <p className="error-message">{errors.age.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...register('user_name', { required: 'Username is required', minLength: { value: 4, message: 'Username must be at least 4 characters long' }, maxLength: { value: 15, message: 'Username must be no more than 15 characters' } })}
        />
        {errors.user_name && <p className="error-message">{errors.user_name.message}</p>} {/* Fixed here */}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' }, maxLength: { value: 20, message: 'Password must be no more than 20 characters' } })}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="profile_photo">Profile Photo</label>
        <input
          id="profile_photo"
          type="file"
          {...register('profile_photo', { required: 'Profile photo is required' })}
        />
        {errors.profile_photo && <p className="error-message">{errors.profile_photo.message}</p>}
      </div>

      <button type="submit" className="signup-button" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Sign Up'}
      </button>
    </form>
    </>
  );
};

export default SignupPage;
