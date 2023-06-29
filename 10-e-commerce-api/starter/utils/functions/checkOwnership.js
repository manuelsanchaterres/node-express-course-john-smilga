const { UnauthenticatedError } = require("../../errors");

const checkOwnership = ({productUser, userId}) => {

    if (productUser != userId) {

        throw new UnauthenticatedError(`You cannot update or delete this product as you are not the owner`)

    }

    return true

}

module.exports = {checkOwnership}