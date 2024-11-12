const { get } = require("http");
const ApiError = require("../api-error");
const JSend = require("../jsend");
const dishesService = require("../services/dishes.service");
const { query } = require("express");

async function addDish(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(new ApiError(400, "New dish information can not be empty"));
  }
  if (req.body.price <= 0) {
    return next(new ApiError(400, "Price can not be less than 0"));
  }
  try {
    const newDish = await dishesService.addDish({
      ...req.body,
      dishImage: `/public/img/dishes/${req.file.filename}`,
    });
    if (!newDish) {
      return next(new ApiError(400, "Error while adding dish. Make sure you include name, dish image, price of the new dish."));
    }
    return res.status(201).json(JSend.success({ newDish }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(
        500,
        `Unknown error occurred while adding new dish.`
      )
    );
  }
}

async function getDishById(req, res, next) {
  const dishId = req.params.dishId;

  try {
    const dish = await dishesService.getDishById(dishId);
    if (!dish) {
      return next(new ApiError(404, "Dish not found"));
    }
    return res.status(200).json(JSend.success({ dish }));
  } catch (error){
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving dish with dishId=${dishId}`)
    );
  }
}

async function updateDish(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  if (req.body.price <= 0) {
    return next(new ApiError(400, "Price can not be less than 0"));
  }
  const dishId = req.params.dishId;

  try {
    const updated = await dishesService.updateDish(dishId, {
      ...req.body,
      dishImage: req.file ? `/public/img/dishes/${req.file.filename}` : null,
    });
    if (!updated) {
      return next(new ApiError(404, "Dish not found"));
    }
    return res.status(200).json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(
        500,
        `Error updating dish dishId=${dishId}`
      )
    );
  }
}

async function updatePrice(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  const dishId = req.params.dishId;
  const price = req.body.price;

  if (price <= 0) {
    return next(new ApiError(400, "Price can not be less than 0"));
  }

  try {
    const updated = await dishesService.updatePrice(dishId, price);
    if (!updated) {
      return next(new ApiError(404, "No dish price was changed"));
    }
    return res.status(200).json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating price of the dish with id=${dishId}`)
    );
  }
}

async function deleteDish(req, res, next) {
  const dishId = req.params.dishId;
  
  try{
    const deleted = await dishesService.deleteDish(dishId);
    if (!deleted){
      return next(new ApiError(404, 'Dish not found'));
    }
    return res.status(200).json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Could not delete dish with id=${dishId}`)
    );
  }
}

async function getManyDishes(req, res, next) {
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
    result = await dishesService.getDishesByFilter(req.query);
    if (result.length === 0){
      return next(new ApiError(404, "Resources not found"));
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving dishes"));
  }

  return res.status(200).json(
    JSend.success({
      dishes: result.dishes,
      metadata: result.metadata,
    })
  );
}

async function deleteAllDishes(req, res, next) {
  const resId = req.params.restaurantId;
  try { 
    await dishesService.deleteAllDishes(resId);
    return res.status(200).json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while removing all dishes")
    );
  }
}

module.exports = {
    addDish,
    getDishById,
    getManyDishes,
    updateDish,
    updatePrice,
    deleteDish,
    deleteAllDishes,
}
