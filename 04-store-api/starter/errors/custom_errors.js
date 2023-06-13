class CustomErrorAPI extends Error {

    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomError = (msg, statuscode) => {

    return new CustomErrorAPI(msg, statuscode)

}


module.exports = {createCustomError, CustomErrorAPI}