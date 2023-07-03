const { StatusCodes } = require('http-status-codes');
const path = require('path')
const CustomError = require('../errors')
const fs = require('fs').promises
const eventEmitter = require('../events/eventEmitter');
const cloudinary = require('cloudinary').v2
// Call the separate file where eventEmitter.emit('productCreated') is invoked
require('./productController');

const uploadProductImageLocal = async(req,res) => {

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

    let productCreated = false

    const getProductCreated = () => {

        return productCreated;
    }

    eventEmitter.on('ProductCreated', (isproductCreated) => {
        productCreated = isproductCreated
    })


    setTimeout(async() =>{
        
        if (getProductCreated() === false) {

            try {

                /* if after 5 seconds no product is created the uploaded image 
                to uploads directory imagePath 
                as argument built infs module unlink method*/

                fs.unlink(imagePath);
                console.log('Image removed successfully');
                
            } catch (error) {
            console.error('Error removing image:', error);
            }
        }

    }, 5000)


    return res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})

}

const uploadProductImage = async(req,res) => {

    let productCreated = false

    const getProductCreated = () => {

        return productCreated;
    }

    eventEmitter.on('ProductCreated', (isproductCreated) => {
        productCreated = isproductCreated
    })

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {

        use_filename: true,
        folder: 'file-upload'
    })

    fs.unlink(req.files.image.tempFilePath)

    /* if after 5 seconds no product is created the uploaded image 
    to cloudinary will be removed by passing its generated public_id 
    as argument to cloudinary API destroy method*/

    setTimeout(async() =>{
        
        if (getProductCreated() === false ) {

            await cloudinary.uploader.destroy(result.public_id)

        }

    }, 5000)


    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}})



}



module.exports = {uploadProductImageLocal, uploadProductImage}