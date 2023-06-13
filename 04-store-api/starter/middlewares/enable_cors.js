const enableCORS = (req, res, next) => {

    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace '*' with the desired origin or use a whitelist of allowed origins
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

}

module.exports = enableCORS