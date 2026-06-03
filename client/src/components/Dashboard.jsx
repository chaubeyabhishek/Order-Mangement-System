import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import Products from './Products';
import Orders from './Orders';

const Dashboard = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const load = async () => {
      try {
        const productList = await fetchProducts(token);
        setProducts(productList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  // Dark mode toggle
  useEffect(() => {
    const t = localStorage.getItem('theme');
    if (t === 'dark') document.body.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    if (document.body.classList.contains('dark')) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="card">
      <div className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Dashboard</h1>
            <p>Role: {user?.role}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="toggle" onClick={toggleTheme}>🌙</button>
            <button className="btn secondary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div>
          <div className="grid grid-2">
            <div className="section">
              <Products products={products} user={user} token={token} onProductsUpdate={setProducts} />
            </div>
            <div className="section">
              <div style={{ padding: 18 }}>
                <h3>Products Overview</h3>
                <p>Manage inventory with units, high-precision pricing, and INR price display.</p>
              </div>
            </div>
          </div>
          <div className="section" style={{ marginTop: 20 }}>
            <Orders user={user} token={token} products={products} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
