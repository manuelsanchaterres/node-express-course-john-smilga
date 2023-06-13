require('dotenv').config()

const connectedDB = require('./db/connections/connect_database_store_api')

const { createCustomError } = require('./errors/custom_errors')

const Product = require('./models/model_product')

const jsonProducts = require('./products.json')

const startDatabase = async (req, res) => { 

    try {
        
        await connectedDB(process.env.MONGODB_URI_DATABASE_STORE_API)

        console.log("connected to database Store Api");

        await Product.deleteMany();


        await Product.create(jsonProducts)

        console.log('Store Api Database populated with default data');

        const products = await Product.find()

        console.log(products);

        process.exit(0)

    } catch (error) {
        
        console.log(error);
        process.exit(1)

    }
}

startDatabase()