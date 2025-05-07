import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFood = () => {
  const [food, setFood] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const token = localStorage.getItem('token');

    if (!token || isAdmin !== 'true') {
      alert('Access denied: Admins only.');
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('https://foodapp-backend-njc0.onrender.com/api/foods', food, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Reset the form fields after success
      setFood({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
      });

      alert('Food added successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding food');
    }
  };

  return (
    <div className="add-food-container">
      <h2>Add Food</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Food Name"
          value={food.name}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={food.description}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={food.price}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={food.image}
          onChange={handleChange}
        />
        <select name="category" value={food.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Keralafood">Keralafood </option>
          <option value="Beverages">Beverages</option>
          <option value="Burgers">Buggers & Pizza</option>
        </select>

        <button type="submit">Add </button>
      </form>
    </div>
  );
};

export default AddFood;
