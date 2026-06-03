import { useEffect, useState } from 'react';
import {
  createOrder,
  fetchUserOrders,
  fetchAllOrders,
  confirmOrder,
  updateOrderStatus,
  deleteOrder,
} from '../services/api';

const formatINR = (value) => {
  if (value == null || value === '') return '-';
  const str = String(value).trim();
  const negative = str.startsWith('-');
  const abs = negative ? str.slice(1) : str;
  const [integerPart, fractionPart = ''] = abs.split('.');
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}₹${formattedInt}${fractionPart ? `.${fractionPart}` : ''}`;
};

const multiplyDecimalStrings = (a, b) => {
  const normalize = (value) => value.toString().trim().replace(/^\+/, '');
  a = normalize(a);
  b = normalize(b);
  const sign = (a.startsWith('-') ? -1 : 1) * (b.startsWith('-') ? -1 : 1);
  a = a.replace(/^-/, '');
  b = b.replace(/^-/, '');
  const [aInt, aFrac = ''] = a.split('.');
  const [bInt, bFrac = ''] = b.split('.');
  const aDigits = (aInt + aFrac).replace(/^0+(?!$)/, '') || '0';
  const bDigits = (bInt + bFrac).replace(/^0+(?!$)/, '') || '0';
  if (aDigits === '0' || bDigits === '0') return '0';
  const result = Array(aDigits.length + bDigits.length).fill(0);
  for (let i = aDigits.length - 1; i >= 0; i -= 1) {
    for (let j = bDigits.length - 1; j >= 0; j -= 1) {
      result[i + j + 1] += Number(aDigits[i]) * Number(bDigits[j]);
    }
  }
  for (let k = result.length - 1; k > 0; k -= 1) {
    const carry = Math.floor(result[k] / 10);
    result[k] %= 10;
    result[k - 1] += carry;
  }
  let value = result.join('').replace(/^0+(?!$)/, '');
  const decimals = aFrac.length + bFrac.length;
  if (decimals) {
    while (value.length <= decimals) value = `0${value}`;
    const pos = value.length - decimals;
    value = `${value.slice(0, pos)}.${value.slice(pos)}`;
    value = value.replace(/\.0+$/, '').replace(/\.?0+$/, '');
  }
  if (!value) value = '0';
  return sign < 0 && value !== '0' ? `-${value}` : value;
};

const Orders = ({ user, token, products }) => {
  const [myOrders, setMyOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [productId, setProductId] = useState(products?.[0]?._id || '');
  const [quantity, setQuantity] = useState('1');
  const [message, setMessage] = useState('');

  const selectedProduct = products?.find((p) => p._id === productId);
  const quantityString = quantity || '1';
  const quantityNumber = Number(quantityString);
  const selectedTotal = selectedProduct?.price != null
    ? `${formatINR(multiplyDecimalStrings(selectedProduct.price, quantityString))} (${quantityString} x ${formatINR(selectedProduct.price)})`
    : null;

  const load = async () => {
    try {
      const [mine, all] = await Promise.all([fetchUserOrders(token), user?.role === 'admin' ? fetchAllOrders(token) : Promise.resolve([])]);
      setMyOrders(mine || []);
      setAllOrders(all || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    setProductId(products?.[0]?._id || '');
  }, [token, products]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await createOrder(token, { productId, quantity: quantityString });
      setMessage('Order request created');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Create order failed');
    }
  };

  const handleConfirm = async (id) => {
    try {
      await confirmOrder(token, id);
      setMessage('Order confirmed');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Confirm failed');
    }
  };

  const handleAdminStatus = async (id, status) => {
    try {
      await updateOrderStatus(token, id, { status });
      setMessage('Status updated');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    const confirm_delete = confirm('Delete this order? This cannot be undone.');
    if (!confirm_delete) return;
    setMessage('');
    try {
      await deleteOrder(token, id);
      setMessage('Order deleted');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      {message && <div className="alert">{message}</div>}

      {user?.role !== 'admin' && (
        <div className="section card" style={{ padding: '18px' }}>
          <h3>Request Order</h3>
          <form onSubmit={handleCreate} className="grid">
            <select className="select" value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.unit}) - {p.price != null ? `${p.price} per ${p.unit}` : 'Price: TBA'}</option>
              ))}
            </select>
            <div style={{ padding: 6, fontSize: 14 }}>
              {selectedProduct ? (
                <div>
                  <div>Current price: {selectedProduct.price != null ? `${formatINR(selectedProduct.price)} per ${selectedProduct.unit}` : 'Not set yet'}</div>
                  {selectedTotal != null && (
                    <div>Total for {quantityString}: {selectedTotal}</div>
                  )}
                </div>
              ) : null}
            </div>
            <input className="input" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
            <button className="btn" type="submit">Request Order</button>
          </form>
        </div>
      )}

      <div className="section">
        <h3>My Orders</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((o) => (
              <tr key={o._id}>
                <td>{o.product?.name}</td>
                <td>{o.quantity}</td>
                <td>{o.unit}</td>
                <td>
                  {o.price != null ? (
                    o.product?.price != null ? `${formatINR(o.price)} (${o.quantity} x ${formatINR(o.product.price)})` : formatINR(o.price)
                  ) : '-'}
                </td>
                <td>{o.status}</td>
                <td>
                  {o.price != null && o.status === 'priced' && (
                    <button className="btn" onClick={() => handleConfirm(o._id)}>Confirm</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.role === 'admin' && (
        <div className="section">
          <h3>All Orders</h3>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.user?.name} ({o.user?.email})</td>
                  <td>{o.product?.name}</td>
                  <td>{o.quantity}</td>
                  <td>{o.unit}</td>
                  <td>
                    {o.price != null ? (
                      o.product?.price != null ? `${formatINR(o.price)} (${o.quantity} x ${formatINR(o.product.price)})` : formatINR(o.price)
                    ) : '-'}
                  </td>
                  <td>{o.status}</td>
                  <td>
                    <button className="btn" onClick={() => handleAdminStatus(o._id, 'approved')}>Approve</button>
                    <button className="btn secondary" onClick={() => handleAdminStatus(o._id, 'cancelled')}>Disapprove</button>
                    <button className="btn secondary" onClick={() => handleDelete(o._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
