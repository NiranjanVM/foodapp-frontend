import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://foodapp-backend-njc0.onrender.com/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setMsg('Failed to load orders.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`https://foodapp-backend-njc0.onrender.com/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err.response?.data || err.message);
      alert('Failed to delete the order');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (msg) return <p>{msg}</p>;

  return (
    <div className="orders-list">
      <h3>My Orders</h3>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>
            <p>
              Status: 
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
                item?.foodId ? (
                  <li key={item.foodId._id || index}>
                    {item.foodId.name} - Quantity: {item.quantity}
                  </li>
                ) : (
                  <li key={index}>Unknown item</li>
                )
              ))}
            </ul>
            <button onClick={() => handleDeleteOrder(order._id)}>Cancel Order</button>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
