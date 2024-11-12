const ApiError = require("../api-error");
const JSend = require("../jsend");
const restaurantService = require("../services/restaurant.service");

async function getRestaurant(req, res, next) {
  const { userId } = req.params;

  try {
    const restaurant = await restaurantService.getRestaurant(userId);
    if (!restaurant) {
      return next(new ApiError(404, "Restaurant not found"));
    }
    return res.status(200).json(JSend.success({ restaurant }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving restaurant with user id=${userId}`)
    );
  }
}

async function updateOrderStatus(req, res, next) {
  if (Object.keys(req.body).length === 0) {
      return next(new ApiError(400, "Data to update can not be empty"));
  }
  const id = req.params.orderId;
  const status = req.body.status;
  try {
    const updated = await restaurantService.updateOrderStatus(id, status);
    if (!updated) {
      return next(new ApiError(404, "No order found"));
    }
    return res.status(200).json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating status of order with id=${id}`)
    );
  }
}

async function updateRestaurant(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  const { userId } = req.params;

  try {
    const updated = await restaurantService.updateRestaurant(userId, {
      ...req.body,
      avatar: req.file ? `/public/img/avatar/${req.file.filename}` : null,
    });
    if (!updated) {
      return next(new ApiError(404, "Restaurant not found"));
    }
    return res.status(200).json(JSend.success({ restaurant: updated }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(
        500,
        `Error updating restaurant of user with userId=${userId}`
      )
    );
  }
}

async function getRestaurantOrders(req, res, next) {
  const { restaurantId } = req.params;
  const { page = 1, limit = 5 } = req.query;
  let result = {
    orders: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };

  try {
    result = await restaurantService.getRestaurantOrders(restaurantId, page, limit);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving orders"));
  }

  return res.status(200).json(
    JSend.success({
      orders: result.orders,
      metadata: result.metadata,
    })
  );
}

module.exports = {
  getRestaurant,
  updateRestaurant,
  updateOrderStatus,
  getRestaurantOrders,
};
