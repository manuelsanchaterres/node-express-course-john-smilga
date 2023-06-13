const { CustomErrorAPI } = require("../errors/custom_errors");

const errorHandler = async (err, req, res, next) => {

  if (err instanceof CustomErrorAPI) {

    console.log(err);
    return res.status(err.statusCode).json({msg: err.message})

  }

  console.log(err);
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandler
