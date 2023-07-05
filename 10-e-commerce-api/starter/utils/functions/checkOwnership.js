const { UnauthenticatedError } = require("../../errors");

const checkOwnership = (requestUser, resourceUserId) => {

    if (requestUser.userId !== resourceUserId.toString()) {

        throw new UnauthenticatedError(`You cannot update or delete this product as you are not the owner`)

    }

    return

}

module.exports = {checkOwnership}