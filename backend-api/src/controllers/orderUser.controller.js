const userService = require("../services/user.service")
const ApiError = require("../api-err")
const JSend = require("../jsend")

async function getUserOrders(req, res, next) {
    const { userId } = req.params
    const { page = 1, limit = 5 } = req.query
    let result = {
        orders: [],
        metadata: {
        totalRecords: 0,
        firstPage: 1,
        lastPage: 1,
        page: 1,
        limit: 5,
        },
    }

    try {
        result = await userService.getUserOrders(userId, page, limit)
    } catch (error) {
        console.log(error)
        return next(new ApiError(500, "An error occurred while retrieving orders"))
    }

    return res.status(200).json(
        JSend.success({
        orders: result.orders,
        metadata: result.metadata,
        })
    )
}

async function createUserOrder(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Name should not be an empty string!"));
    }

    try {
        const order = await userService.createUser({
            ...req.body,
        });
        if (!order) {
            return next(new ApiError(400, "Please enter name, email, ..."));
        }
        return res
            .status(201)
            .json(
                JSend.success({
                    user,
                })
            );
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occured while creating the user")
        );
    }
    
}

async function updateOrderStatus(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"))
    }
    const id = req.params.orderId
    const status = req.body.status
    try {
        const updated = await userService.updateOrderStatus(id, status)
        if (!updated) {
            return next(new ApiError(404, "No order found"))
        }
        return res.status(200).json(JSend.success())
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, `Error updating status of order with id=${id}`)
        )
    }
}

module.exports = {
    getUserOrders,
    updateOrderStatus,
    createUserOrder,

}
