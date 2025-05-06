import React from 'react';
import { Link } from 'react-router-dom';

const FoodCard = ({ food, isAdmin, onDelete, onPlaceOrder }) => {
  return (
    <div className="food-card">
      <img src={food.image} alt={food.name} />
      <h3>{food.name}</h3>
      <p>{food.description}</p>
      <p>Price: ${food.price}</p>

      {isAdmin && (
  <div className="admin-buttons">
    <Link to={`/edit-food/${food._id}`} className="edit-btn">Edit</Link>
    <button className="delete-btn" onClick={() => onDelete(food._id)}>Delete</button>
  </div>
)}


      {/* Show "Place Order" button only for non-admin users */}
      {!isAdmin && (
        <button className="order-btn" onClick={() => onPlaceOrder(food)}>
          Place Order
        </button>
      )}
    </div>
  );
};

export default FoodCard;
