const { createCustomError } = require("../errors/custom_errors")
const { async_wrapper} = require("../middlewares")
const Product = require("../models/model_product")

const getProducts = async_wrapper (async(req,res,next) => {

    const {featured, company, name, sort, fields, numericFilters} = req.query

    let queryObject = {}
    // let sortObject = {};
    // let resultsperPage = limit
    let sortList=  ""
    let fieldsList=  ""

    if (featured) {

        queryObject.featured = featured === 'true' ? true: false

    }
    
    if (company) {

        queryObject.company = company

    }
    
    if (name) {

        queryObject.name = {$regex: name, $options: 'i'}

    }

    if (sort) {

        // passing object as argument to sort()

        // const itemNames = sort.slice().split(",");
        
        // itemNames.forEach((itemName) => {
        
        //   const firstCharacter = itemName.charAt(0);

        //   let propertyName = itemName.substring(1)


        //   let propertyValue

        //   if (firstCharacter === '-') {

        //     propertyValue = 'desc'
        //     propertyName = itemName.substring(1)

        //   } else {

        //     propertyValue = 'asc'
        //     propertyName = itemName
        //   }
        
        //   sortObject[propertyName] = propertyValue;

        // })

        sortList = sort.split(',').join(" ")
        
    } else {

        sortList = "createdAt"
    }

    if (fields) {

        fieldsList = fields.split(',').join(' ')

    }

    if (numericFilters) {

        const operatorMap = {

            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }

        const regEx =/\b(<|>|>=|<=|=)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

        console.log(filters);
        const options =['price', 'rating']

        filters = filters.split(',')

        filters.forEach(item => {
            
            const [field, operator, value] = item.split('-')
            
            if (options.includes(field)) {

                // queryObject[field] = {[operator]: value}
                queryObject[field] ={...queryObject[field], [operator]: value}
            }

        });

    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const products = await Product.find(queryObject).sort(sortList).select(fieldsList).limit(limit).skip(skip)

   const numberOfPages = Math.ceil(products.length /limit)

    // if (products.length < 1) {

    //     return next(createCustomError(`no products found`, 404))

    // }

    res.status(201).json({success: true, data : {numberProducts: products.length, numberOfPages,page, products }})

})

const getProduct = async_wrapper (async(req,res,next) => {

    const {id: productId} = req.params

    const product = await Product.findOne({_id: productId})
    
    if (!product) {

        return next(createCustomError(`no product with id ${productId} found`, 404))

    }

    res.status(201).json({success: true, data : product})

})

const createProduct = async_wrapper (async(req,res,next) => {

    const {name} = req.body
    const createdProduct = await Product.create(req.body)

    if (!name) {

        return next(createCustomError(`name field cannot be empty`, 404))

    }

    res.status(201).json({success: true, data : createdProduct})

})

const updateProduct = async_wrapper (async(req,res,next) => {

    const {id: productId} = req.params
    const {name, inStock} = req.body

    const updatedProduct = await Product.findOneAndUpdate({_id: productId}, {name, inStock}, {new: true, runValidators: true})
    
    if (!updatedProduct) {

        return next(createCustomError(`no product with id ${productId} found`, 404))

    }

    res.status(201).json({success: true, data : updatedProduct})

})

const deleteProduct = async_wrapper (async(req,res,next) => {

    const {id: productId} = req.params
    const deletedProduct = await Product.findOneAndDelete({_id: productId})
    
    if (!deletedProduct) {

        return next(createCustomError(`no product with id ${productId} found to be deleted`, 404))

    }

    res.status(201).json({success: true, data : deletedProduct})

})



module.exports = {createProduct, getProducts, getProduct, updateProduct, deleteProduct}