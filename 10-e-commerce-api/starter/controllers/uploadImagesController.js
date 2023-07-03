const { StatusCodes } = require('http-status-codes');
const path = require('path')
const CustomError = require('../errors')
const fs = require('fs').promises
const eventEmitter = require('../events/eventEmitter');
const { log } = require('console');
const cloudinary = require('cloudinary').v2

// Call the separate file where eventEmitter.emit('productCreated') is invoked
require('./productController');

const uploadImageLocal = async (req,res) => {

    if (!req.files) {

        throw new CustomError.BadRequestError(`No File Uploaded`)
    }

    const productImage = req.files.image

    if (!productImage.mimetype.startsWith('image')) {

        throw new CustomError.BadRequestError('Please upload an Image')

    }

    const maxSize = 1024 * 1024
    
    if (productImage.size > maxSize) {

        throw new CustomError.BadRequestError('Please upload image smaller than 1MB')

    }

    const imagePath = path.join(__dirname, '../public/uploads', `${productImage.name}`)

    console.log(imagePath);
    await productImage.mv(imagePath)

    let productCreated = false

    const getProductCreated = () => {

        return productCreated
    }

    eventEmitter.on('ProductCreated', (isProductCreated) => {

        productCreated = isProductCreated

    })


    setTimeout(() => {

        if (getProductCreated() === false) {

            try {
                
                fs.unlink(imagePath)

                console.log('Image removed successfully');

            } catch (error) {
                
                console.error('Error removing image:', error);

            }

        }


    }, 5000)

    res.status(StatusCodes.OK).json({img:{src: `/uploads/${productImage.name}` }})
}

const uploadImageCloudinary = async (req,res) => {

    if (!req.files) {

        throw new CustomError.BadRequestError(`No File Uploaded`)
    }

    const productImage = req.files.image

    if (!productImage.mimetype.startsWith('image')) {

        throw new CustomError.BadRequestError('Please upload an Image')

    }

    const maxSize = 1024 * 1024
    
    if (productImage.size > maxSize) {

        throw new CustomError.BadRequestError('Please upload image smaller than 1MB')

    }

    const tempFilePath = req.files.image.tempFilePath
    
            
    const result = await cloudinary.uploader.upload(tempFilePath, {

        use_filename: true,
        folder: 'ecommerce-api'
    })

    fs.unlink(tempFilePath)

    let productCreated = false

    const getProductCreated = () => {

        return productCreated
    }

    eventEmitter.on('ProductCreated', (isProductCreated) => {

        productCreated = isProductCreated

    })

    setTimeout(() => {

        if (getProductCreated() === false) {

            try {
                
                cloudinary.uploader.destroy(result.public_id)

                console.log('Image removed successfully From Ecommerce-Api folder on Cloudinary');

            } catch (error) {
                
                console.error('Error removing image:', error);

            }

        }


    }, 5000)



    res.status(StatusCodes.OK).json({img:{src: result.secure_url}})

}




module.exports = {uploadImageLocal, uploadImageCloudinary}
