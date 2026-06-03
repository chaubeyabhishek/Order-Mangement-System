const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const multiplyDecimalStrings = (a, b) => {
  const normalize = (value) => value.toString().trim();
  a = normalize(a);
  b = normalize(b);
  const sign = (a.startsWith('-') ? -1 : 1) * (b.startsWith('-') ? -1 : 1);
  a = a.replace(/^-/, '');
  b = b.replace(/^-/, '');
  const [aInt, aFrac = ''] = a.split('.');
  const [bInt, bFrac = ''] = b.split('.');
  const aDigits = (aInt + aFrac).replace(/^0+(?!$)/, '');
  const bDigits = (bInt + bFrac).replace(/^0+(?!$)/, '');
  if (!aDigits || !bDigits) return '0';
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

exports.createOrder = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const quantityString = String(quantity);
    const orderData = {
      user: req.user._id,
      product: product._id,
      quantity: mongoose.Types.Decimal128.fromString(quantityString),
      unit: product.unit,
    };

    if (product.price != null) {
      const total = multiplyDecimalStrings(product.price.toString(), quantityString);
      orderData.price = mongoose.Types.Decimal128.fromString(total);
      orderData.status = 'priced';
    }

    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('product');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('product').populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.setPrice = async (req, res, next) => {
  try {
    const { price } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.price = price;
    order.status = 'priced';
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });
    if (order.price === null) return res.status(400).json({ message: 'Price not set yet' });
    order.status = 'approved';
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};
