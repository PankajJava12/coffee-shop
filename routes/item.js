const express = require('express');
const router = express.Router();
const itemServie = require('../services/itemService');

const handleErrorAsync = func => async (req, res, next) => {
   try {
       await func(req, res, next);
   } catch (error) {
       next(error);
   }
};

router.get('/items', handleErrorAsync(async function (req, res) {
      const items = await itemServie.getItems();
      return res.json(items);
}));

router.post('/item', handleErrorAsync(async function (req, res) {
      const item = await itemServie.saveItem(req.body);
      res.send(item);
}));

router.post('/orderItems', handleErrorAsync(async function (req, res) {
   const orderDetails = await itemServie.orderItems(req.body);
   res.send(orderDetails);
}));

module.exports = router;