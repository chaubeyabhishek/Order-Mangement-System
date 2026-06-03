const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: mongoose.Schema.Types.Decimal128, required: true },
  unit: { type: String },
  price: { type: mongoose.Schema.Types.Decimal128, default: null },
  status: { type: String, enum: ['pending', 'priced', 'approved', 'cancelled'], default: 'pending' },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      if (ret.quantity != null) ret.quantity = ret.quantity.toString();
      if (ret.price != null) ret.price = ret.price.toString();
      return ret;
    },
  },
});

module.exports = mongoose.model('Order', orderSchema);
