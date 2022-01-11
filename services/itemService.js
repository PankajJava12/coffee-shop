const Item = require('../models/item');
let orderCounter = 1;

async function saveItem(itemData) {
    const item = new Item(itemData);
    await item.save(itemData);
    return { message: 'Item saved successfully' };
}

async function getItems() {
    return Item.find({}, { _id: 0, __v: 0 });
}

async function orderItems(orderRequest) {
    const finalOrder = { orderNumber: orderCounter, grandTotal: 0, breakup: [] };
    const orderedItemNames = orderRequest.map(o => o.itemName);

    const items = await Item.find({ itemName: { $in: orderedItemNames } });
    const itemNames = items.map(i => i.itemName);

    if (orderedItemNames.length !== itemNames.length) {
        const itemsNotFound = orderedItemNames.filter(o => !itemNames.includes(o));
        throw new Error(`item does not exist: ${itemsNotFound.join(',')}`);
    }

    orderRequest.forEach((order) => {
        const item = items.find(t => t.itemName === order.itemName);
        const itemPrice = item?.price;
        let totalPrice = itemPrice * order.quantity;
        let taxPrice = 0;
        let discountPrice = 0;

        if (item.tax) taxPrice = (totalPrice * item.tax) / 100;
        if (item.discount) discountPrice = (totalPrice * item.discount) / 100;
        
        totalPrice = totalPrice + taxPrice - discountPrice;

        const orderDetails = {
            itemName: order.itemName,
            itemPrice,
            quantity: order.quantity,
            ...(item.tax && { taxPercentage: `${item.tax}%`, taxPrice }),
            ...(item.discount && { discountPercentage: `${item.discount}%`, discountPrice }),
            totalPrice
        }

        finalOrder.breakup.push(orderDetails);
        finalOrder.grandTotal += totalPrice;
    });

    // Notify once the order is ready
    // For instane, lets say 1 order takes 3 seconds
    const orderPreparationTime = 3000 * orderRequest.length;
    setTimeout((oc) => {
        console.log(`~~~ Order #${oc} is ready ~~~`);
    }, orderPreparationTime, orderCounter);

    orderCounter += 1;

    return finalOrder;
}

module.exports = {
    saveItem,
    getItems,
    orderItems
}