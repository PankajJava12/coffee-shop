const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema({
    itemName: {
        type: String,
        unique: true,
        required: [true, 'itemName is mandatory field']
    },
    price: {
        type: Number,
        min: [1, 'price must at least 1 bucks'],
        required: [true, 'price is mandatory field']
    },
    tax: { 
        type: Number,
        min: [1, 'tax must at least 1%'],
        max: [30, 'tax can not be more than 30%'],  
    },
    discount: { 
        type: Number,
        min: [1, 'discount must at least 1%'], 
        max: [50, 'discount can not be more than 50%'],  
    }
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;