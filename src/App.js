// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import AddFood from './pages/AddFood';
import EditFood from './pages/EditFood';
import Logout from './pages/LogOut';
import Navbar from './components/Navbar';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/my-orders" element={token ? <MyOrders /> : <Navigate to="/login" />} />
        <Route path="/add-food" element={token ? <AddFood /> : <Navigate to="/login" />} />
        <Route path="/edit-food/:id" element={token ? <EditFood /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
