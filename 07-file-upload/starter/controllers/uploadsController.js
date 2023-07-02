const { StatusCodes } = require('http-status-codes');
const Product = require('../models/Product')
const path = require('path')
const CustomError = require('../errors')
const fs = require('fs').promises
const eventEmitter = require('../events/eventEmitter');
const { error } = require('console');
// Call the separate file where eventEmitter.emit('productCreated') is invoked
require('./productController');

const uploadProductImage = async(req,res) => {

    // check if file uploaded not empty

    if (!req.files) {

        throw new CustomError.BadRequestError('No File Uploaded')
    }

    let productImage = req.files.image;


    // check format

    if (!productImage.mimetype.startsWith('image')) {

        throw new CustomError.BadRequestError('Please Upload Image')
    }


    // check size

    const maxSize = 1024 * 1024

    if (productImage.size > maxSize) {

        throw new CustomError.BadRequestError('Please upload image smaller than 1KB')
    }

    const imagePath = path.join(__dirname,'../public/uploads/'+`${productImage.name}`)
    await productImage.mv(imagePath)

    let isProductCreated = false;

    eventEmitter.on('productCreated', () => {

        return isProductCreated = true

    });
 
    if (!isProductCreated) {

        setTimeout(async() =>{
            
            try {
            await fs.unlink(imagePath);
            console.log('Image removed successfully');
            } catch (error) {
            console.error('Error removing image:', error);
            }

        }, 5000)

    }


        
    return res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})

}

module.exports = {uploadProductImage}