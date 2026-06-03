import { useState } from 'react';
import { createProduct, deleteProduct, updateProduct } from '../services/api';

const units = ['g', 'kg', 'L', 'mL', 'unit'];
const formatINR = (value) => {
  if (value == null || value === '') return '-';
  const str = String(value).trim();
  const negative = str.startsWith('-');
  const abs = negative ? str.slice(1) : str;
  const [integerPart, fractionPart = ''] = abs.split('.');
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return ` ${negative ? '-' : ''}₹${formattedInt}${fractionPart ? `.${fractionPart}` : ''}`.trim();
};

const Products = ({ products, user, token, onProductsUpdate }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('General');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const product = await createProduct(token, {
        name,
        sku,
        category,
        quantity,
        unit,
        price: price ? price : null,
        description,
      });
      onProductsUpdate([product, ...products]);
      setName('');
      setSku('');
      setCategory('General');
      setQuantity('');
      setPrice('');
      setDescription('');
      setMessage('Product created successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to create product');
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      {message && <div className="alert">{message}</div>}
      {user?.role === 'admin' && (
        <div className="section card" style={{ padding: '18px' }}>
          <h3>Create Product</h3>
          <form onSubmit={handleCreate} className="grid">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" required />
            <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU (optional)" />
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />
            <input className="input" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity in stock" required />
            <select className="select" value={unit} onChange={(e) => setUnit(e.target.value)}>
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input className="input" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per unit (INR)" />
            <button className="btn" type="submit">Add Product</button>
          </form>
        </div>
      )}
      <div className="section">
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div>
                <div className="product-title">{product.name}</div>
                <div className="product-meta">
                  {product.category}
                  {product.sku ? ` • ${product.sku}` : ''}
                  {' • '}
                  {product.quantity} {product.unit}
                </div>
                <div className="product-price">
                  {product.price != null ? `${formatINR(product.price)} / ${product.unit}` : 'Price: Not set'}
                </div>
                {product.description && <div className="product-description">{product.description}</div>}
              </div>
              <div className="product-actions">
                {user?.role === 'admin' && (
                  <>
                    <button className="btn small secondary" onClick={async () => {
                      const ok = confirm('Delete this product?'); if (!ok) return;
                      setMessage('');
                      try {
                        await deleteProduct(token, product._id);
                        onProductsUpdate(products.filter((p) => p._id !== product._id));
                        setMessage('Product deleted successfully');
                      } catch (err) {
                        setMessage(err.response?.data?.message || 'Delete failed');
                      }
                    }}>Delete</button>
                    <button className="btn small" onClick={async () => {
                      const p = prompt('Set product price (numeric)', product.price != null ? String(product.price) : '');
                      if (p === null) return;
                      if (!p.trim() || Number.isNaN(Number(p))) return alert('Invalid number');
                      try {
                        const updated = await updateProduct(token, product._id, { price: p });
                        onProductsUpdate(products.map((x) => x._id === updated._id ? updated : x));
                        setMessage('Price updated');
                      } catch (err) {
                        setMessage(err.response?.data?.message || 'Update failed');
                      }
                    }}>Set Price</button>
                  </>
                )}
                {user?.role !== 'admin' && (
                  <div style={{ marginLeft: 'auto', color: 'var(--muted)' }}>Qty: {product.quantity}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
