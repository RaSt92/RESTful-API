const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

const product = require('../routes/models/product');
const Order = require('../models/');
//handle incoming get requests to /orders
router.get('/', (req, res, next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs=>{
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc=> {
                return {
                    _id: doc._id,
                    product: doc.productId,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'localhost 3000 should be here ' + doc._id
                    }
                }
            }),
            request: {
                type: 'GET',
                url: 'localhost 3000 should be here' + doc
            }
        })
    }).catch(err=>{
        res.status(500).json({
            error: err
        });
    });
});
router.post('/', (req, res, next)=>{
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save().exec().then(result=>{
        Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id:mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order
                .save( )
        })
        res.status(201).json({
            message: 'Order stored',
            createdOrder:{
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request:{
                type: 'GET',
                url: 'localhost 3000 should be here ' + doc._id
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
        console.log(result);
    })
});
router.get('/:orderId', (req, res, next)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type:'GET',
                url: 'localhost 3000 should be here'
            }
        })
    }).catch(err=>{
        res.status(500).json({
            error: err
        })
    })
});
router.delete('/:orderID', (req, res, next)=>{
   Order.remove({
       _id: req.params.orderId
   })
   .exec()
   .then(result=>{
       res.status(200).json({
           message:'Order deleted',
           request: {
            type:'GET',
            url: 'localhost 3000 should be here',
            body:{productId: 'ID', quantity: 'Number'}
        }
       })
   })
});
module.exports = router;