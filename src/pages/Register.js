import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', isAdmin: false });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://foodapp-backend-njc0.onrender.com/api/auth/register', form);
      setMsg('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000); // Slight delay before redirecting
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label style={{ display: 'block', margin: '10px 0' }}>
          <input
            type="checkbox"
            name="isAdmin"
            checked={form.isAdmin}
            onChange={handleChange}
          />
          Register as Admin
        </label>
        <button type="submit">Sign up</button>

        <p>Already have an account? <Link to="/login">Log in</Link></p>

      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default Register;
