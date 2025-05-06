import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BiLogOut } from 'react-icons/bi';


const Navbar = () => {
  const { token, isAdmin } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">Forkit</h1>
      <div className="navbar-links">

        {token && <Link to="/">Home</Link>}

        {token && isAdmin && (
          <>
            <Link to="/orders">Orders</Link>
            <Link to="/add-food">Add Food</Link>
          </>
        )}

        {token && !isAdmin && <Link to="/my-orders">My Orders</Link>}

        {!token && (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </>
        )}

        {token && <Link to="/logout" className="logout-icon">
  <BiLogOut size={24} />
</Link>
}
      </div>
    </nav>
  );
};

export default Navbar;
