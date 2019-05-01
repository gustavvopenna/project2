const express = require('express');
const mongoose = require('mongoose');

const Order = require('../../models/Order');

const { ObjectId } = mongoose.Types;
const router = express.Router();

// Create
router.post('/', (req, res, next) => {
  const { user } = req.body;

  Order.create({
    owner: ObjectId(user)
  })
    .then(order => res.send(order))
    .catch(err => console.log(err));
});

// Read
router.get('/', (req, res, next) => {
  Order.find()
    .populate('products')
    .then(orders => res.send(orders))
    .catch(err => console.log(err));
});
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Order.findById(id)
    .populate('products')
    .then(order => res.send(order))
    .catch(err => console.log(err));
});

// Update
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { product, quantity, price } = req.body;

  Order.findById(id)
    .populate('products')
    .then(order => {
      const { products, productsQty: productsQuantity } = order;
      const productsIds = [...products.map(product => ObjectId(product._id)), ObjectId(product)];
      const productsQty = [...productsQuantity, quantity];

      const total = [...products, { price }].reduce((acc, product, index) => {
        return acc + product.price * productsQty[index];
      }, 0);

      Order.findByIdAndUpdate(id, { products: productsIds, productsQty, total }, { new: true })
        .populate('products')
        .then(order => res.send(order));
    })
    .catch(err => console.log(err));
});
router.patch('/:id', (req, res, next) => {
  const { id } = req.params;
  const { product, quantity } = req.body;

  Order.findById(id)
    .then(order => {
      const { products, productsQty } = order;
      const productIndex = order.products.indexOf(product);

      if (quantity <= 0) {
        products.splice(productIndex, 1);
        productsQty.splice(productIndex, 1);
      } else {
        productsQty[productIndex] = quantity;
      }

      Order.findByIdAndUpdate(id, { products, productsQty }, { new: true })
        .populate('products')
        .then(order => res.send(order));
    })
    .catch(err => console.log(err));
});

// Delete
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Order.findByIdAndDelete(id)
    .populate('products')
    .then(order => res.send(order))
    .catch(err => console.log(err));
});

module.exports = router;
