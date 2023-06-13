
const mongoose = require('mongoose')

const connectDBStoreApi = (connectionString) => {

    return mongoose.connect(connectionString,{ maxPoolSize: 10 })
}

module.exports = connectDBStoreApi