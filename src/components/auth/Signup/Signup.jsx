import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Signup.css';

const Signup = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return requirements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordReqs = validatePassword(formData.password);
    if (!Object.values(passwordReqs).every(req => req)) {
      setError('Password does not meet requirements');
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const result = await register(formData.email, formData.password, fullName);
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          // Redirect will happen automatically via AuthContext
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  const passwordReqs = validatePassword(formData.password);

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Join Smart Traffic Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter first name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
              placeholder="Create a password"
            />
            
            {formData.password && (
              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li className={passwordReqs.length ? 'requirement-met' : ''}>
                    At least 8 characters
                  </li>
                  <li className={passwordReqs.uppercase ? 'requirement-met' : ''}>
                    One uppercase letter
                  </li>
                  <li className={passwordReqs.lowercase ? 'requirement-met' : ''}>
                    One lowercase letter
                  </li>
                  <li className={passwordReqs.number ? 'requirement-met' : ''}>
                    One number
                  </li>
                  <li className={passwordReqs.special ? 'requirement-met' : ''}>
                    One special character
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="signup-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;