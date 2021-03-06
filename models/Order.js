const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const orderSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'Place',
      required: true
    },
    products: [
      {
        type: ObjectId,
        ref: 'Product'
      }
    ],
    productsQty: [Number], // TODO: Find a better approach
    total: {
      type: Number,
      default: 0
    },
    payments: [
      {
        type: ObjectId,
        ref: 'Payment'
      }
    ],
    complete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Order', orderSchema);
