import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditFood = () => {
  const [food, setFood] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFood = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Access denied');
        navigate('/');
      }

      try {
        const res = await axios.get(`https://foodapp-backend-njc0.onrender.com/api/foods/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFood(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch food details');
      }
    };
    fetchFood();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`https://foodapp-backend-njc0.onrender.com/api/foods/${id}`, food, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Food item updated');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to update food item');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-food-container">
      <h2>Edit Food Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={food.name}
          onChange={handleChange}
          placeholder="Food Name"
        />
        <input
          type="text"
          name="description"
          value={food.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={food.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          type="text"
          name="image"
          value={food.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <input
          type="text"
          name="category"
          value={food.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <button type="submit">Update Food Item</button>
      </form>
    </div>
  );
};

export default EditFood;
