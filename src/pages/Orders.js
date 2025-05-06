import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to view orders');
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://foodapp-backend-njc0.onrender.com/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please make sure you are logged in and the server is running.');
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleToggleStatus = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `https://foodapp-backend-njc0.onrender.com/api/orders/${orderId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the order's status locally after toggling
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: res.data.status } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  return (
    <div className="orders-container">
      <h3>Orders</h3>
      {error && <p className="error-message">{error}</p>}
      <div>
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p>Status: 
              <span
                style={{
                  color: order.status === 'Ready' ? 'green' : 'red',
                  fontWeight: 'bold',
                }}
              >
                {order.status}
              </span>
            </p>
            <p>Total Amount: ${order.totalAmount}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.foodId ? `${item.foodId.name} - Quantity: ${item.quantity}` : 'Food item not found'}
                </li>
              ))}
            </ul>
            <button onClick={() => handleToggleStatus(order._id)}>
              Toggle Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
