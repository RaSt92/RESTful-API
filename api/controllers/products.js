const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all =  (req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            products: docs.map(doc=>{
                return{
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
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
};
exports.products_create_products = upload.single('productImage'), (req,res,next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
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
   
};
exports.products_get_product = (req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
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
};
exports.products_update_product = (req,res,next)=>{
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
};
exports.products_delete = (req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'localhost/products should be here',
                data: {name: 'String', price: 'Number'}
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
};