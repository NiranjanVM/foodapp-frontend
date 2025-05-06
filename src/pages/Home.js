import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get('https://foodapp-backend-njc0.onrender.com/api/foods', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFoods(res.data);
        setLoading(false);
      } catch (err) {
        setMsg('Failed to load food items.');
        setLoading(false);
      }
    };

    fetchFoods();

    const notifyUser = async () => {
      if (!isAdmin && token && !sessionStorage.getItem('notifiedOnce')) {
        try {
          const res = await axios.get('https://foodapp-backend-njc0.onrender.com/api/orders/my-orders', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const readyOrders = res.data.filter(order => order.status === 'Ready');
          readyOrders.forEach(order => {
            const foodNames = order.items
              .map(item => item?.foodId?.name)
              .filter(Boolean)
              .join(', ');
            if (foodNames) {
              alert(`Your order for ${foodNames} is ready! 🍟`);
            }
          });

          sessionStorage.setItem('notifiedOnce', 'true');
        } catch (err) {
          console.error('Failed to fetch user orders');
        }
      }
    };

    notifyUser();
  }, [token, isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;

    try {
      await axios.delete(`https://foodapp-backend-njc0.onrender.com/api/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(foods.filter((food) => food._id !== id));
    } catch (err) {
      alert('Failed to delete food item');
    }
  };

  const handlePlaceOrder = async (food) => {
    const qty = parseInt(prompt('Enter quantity:'), 10);
    if (!qty || qty <= 0) {
      alert('Invalid quantity');
      return;
    }

    try {
      await axios.post(
        'https://foodapp-backend-njc0.onrender.com/api/orders',
        {
          items: [{ foodId: food._id, quantity: qty }],
          totalAmount: food.price * qty,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Order placed successfully!');
    } catch (err) {
      alert('Failed to place order');
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (msg) return <p>{msg}</p>;

  return (
    <div className="home-page">
      <div>
        <h3>{isAdmin ? 'Admin - Food Inventory' : ''}</h3>

        {!isAdmin && (
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="food-list">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onPlaceOrder={handlePlaceOrder}
              />
            ))
          ) : (
            <p>No food items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
