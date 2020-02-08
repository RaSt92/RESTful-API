const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            products: docs.map(doc=>{
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request:{
                        type: 'GET'
                    }
                }
            })
        }
        // if(docs.length >= 0){ 
        res.status(200).json(response)
    // }else{
    //     res.status(404).json({
    //         message: 'No entries found'
    //     })
    // }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
router.post('/', (req,res,next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Handling POST requests to /products',
            createdProduct: {
                name: result.name,
                price:  result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'url should be here' + res.id
                }
            }
        })
    })
    .catch(err => { 
        console.log(err)
        res.status(201).json({error: err})
    });
   
})
router.patch('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json({
                    prduct: doc,
                    request: {
                        type: 'GET',
                        url: 'localhost/products should be here'
                    }
                })
            }else{
                res.status(404).json({message: 'no valid entry found for provided ID'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
});
router.patch('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps}
        .exec()
        .then(res =>{
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'localhost/products should be here' + id
            }
        })
    })
        .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }));
});
router.delete('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
    .then(result =>{
        res.status(200).json(result)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});
module.exports = router;