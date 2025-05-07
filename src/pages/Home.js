import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';


const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const filteredFoods = foods
    .filter(food => !selectedCategory || food.category === selectedCategory)
    .filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const categoryImages = {
    Indian: 'https://media.istockphoto.com/id/1250567402/photo/table-top-view-of-indian-food.webp?a=1&b=1&s=612x612&w=0&k=20&c=B0Rjj7SmL3PJhPBB23UTbJpBui19DgzIpYLbX4PzwM0=',
    Chinese: 'https://media.istockphoto.com/id/1038065454/photo/bowls-with-chow-mein.webp?a=1&b=1&s=612x612&w=0&k=20&c=ik0GmOcoXuZU1B966_Nv-zUSi772G7DEJaiFTuCn3nA=',
    Burgers: 'https://media.istockphoto.com/id/495204032/photo/fresh-tasty-burger.webp?a=1&b=1&s=612x612&w=0&k=20&c=qJnewgOMl_nubyOpEbiMq4ygka_ZRYTH2nC7N3KFGB4=',
    Beverages: 'https://media.istockphoto.com/id/479079920/photo/watermelon-mojito.webp?a=1&b=1&s=612x612&w=0&k=20&c=KoVXPbsY2YBib29Z6oeU8vRzLag8Pukp_Li451exXco=',
    Keralafood: 'https://images.unsplash.com/photo-1723388800779-5699cc142f18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXV0aGVudGljJTIwa2VyYWxhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
    // Add more mappings
  };

  const uniqueCategories = [...new Set(foods.map(food => food.category))];

  if (loading) return <p>Loading...</p>;
  if (msg) return <p>{msg}</p>;

  return (
    <div className="home-page">
      {selectedCategory ? (
        <>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder={`Search in ${selectedCategory}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={() => setSelectedCategory(null)} className="back-button">
              ⬅ Back to Categories
            </button>
          </div>
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
              <p>No food items found in {selectedCategory}.</p>
            )}
          </div>
        </>
      ) : (
        <div className="category-list">
          {uniqueCategories.map((cat) => (
            <div
              key={cat}
              className="category-card"
              style={{
                backgroundImage: `url(${categoryImages[cat] || 'https://via.placeholder.com/300'})`,
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              <div className="category-overlay">{cat}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
