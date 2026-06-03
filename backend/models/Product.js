const mongoose = require('mongoose');

const allowedUnits = ['g', 'kg', 'L', 'mL', 'unit'];

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, trim: true },
  category: { type: String, required: true },
  quantity: { type: mongoose.Schema.Types.Decimal128, required: true },
  unit: { type: String, required: true, enum: allowedUnits },
  price: { type: mongoose.Schema.Types.Decimal128, default: null },
  description: { type: String },
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

module.exports = mongoose.model('Product', productSchema);
