const knex = require("../database/knex");
const { unlink } = require("node:fs");
const Paginator = require("./paginator");
const ApiError = require("../api-error");

function dishesRepository() {
  return knex("dishes");
}

function readDishes(payload) {
  return {
    name: payload.name,
    image: payload.dishImage,
    price: payload.price,
    note: payload.note,
    id_restaurant: payload.restaurantId,
  };
}

async function addDish(payload) {
  const newDish = readDishes(payload);
  const { name, image, price, id_restaurant } = newDish;
  if (!name || !image || !price || !id_restaurant) {
    return null;
  }
  if (!newDish.note) {
    delete newDish.note;
  }
  try {
    await dishesRepository().insert(newDish);
    return { newDish }; 
  } catch (error) {
    console.log("Error inserting dish:", error.message);
  }
}

async function getDishById(id) {
  return dishesRepository().where("id", id).select("*").first();
}

async function updateDish(id, payload) {
  const updatedDish = await dishesRepository()
    .where("id", id)
    .select("*")
    .first();
  if (!updatedDish) {
    return null;
  }
  const update = readDishes(payload);
  if (!update.name) {
    delete update.name;
  }
  if (!update.price) {
    delete update.price;
  }
  if (!update.note) {
    delete update.note;
  }
  if (!update.id_restaurant) {
    delete update.id_restaurant;
  }
  if (!update.image || update.image == null) {
    delete update.image;
  }
  await dishesRepository().where("id", id).update(update);
  if (
    update.image &&
    updatedDish.image &&
    update.image !== updatedDish.image &&
    updatedDish.image.startsWith("/public/img/dishes")
  ) {
    unlink(`.${updatedDish.image}`, (err) => {
      if (err) {
        console.error("Error removing file:", err);
      } else {
        console.log("File removed:", updatedDish.image);
      }
    });
  }
  return { ...updatedDish, ...update };
}

async function updatePrice(id, price) {
  const updatedDish= await dishesRepository()
    .where("id", id)
    .select("*")
    .first();
  if (!updatedDish) {
    return null;
  }
  await dishesRepository().where("id", id).update({ price: price });

  return { id: id, price: price };
}

async function deleteDish(id) {
  const deletedDish = await dishesRepository()
    .where("id", id)
    .select("*")
    .first();
  if (!deletedDish) {
    return null;
  }
  await dishesRepository().where("id", id).del();
  if (
    deletedDish.image &&
    deletedDish.image.startsWith("/public/img/dishes")
  ) {
    unlink(`.${deletedDish.image}`, (err) => {
      if (err) {
        console.error("Error removing file:", err);
      } else {
        console.log("File removed:", deletedDish.image);
      }
    });
  }
  return deletedDish;
}

async function deleteAllDishes(resId) {
  const dishes = await dishesRepository().select("image").where("id_restaurant", resId);
  await dishesRepository().del().where("id_restaurant", resId);
  dishes.forEach((dish) => {
    if (dish.image && dish.image.startsWith("/public/img/dishes")) {
      unlink(`.${dish.image}`, (err) => {
      if (err) {
        console.error("Error removing file:", err);
      } else {
        console.log("File removed:", dish.image);
      }
    });
    }
  });
  return { message: "All dishes deleted successfully." };
}

async function getDishesByFilter(query) {
  const { restaurantId, name, minPrice, maxPrice, page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);
  
  let results = await dishesRepository().where((builder) => {
    if (name){
      builder.whereRaw("name COLLATE utf8mb4_0900_ai_ci LIKE ?", [`%${name}%`]);
    }
    if (minPrice) {
      builder.where("price", ">=", minPrice);
    }
    if(maxPrice){
      builder.where("price", "<=", maxPrice);
    }
  })
  .select(
    knex.raw("count(id) OVER() AS recordCount"),
    "id",
    "name",
    "image",
    "price",
    "note",
    "id_restaurant",
  )
  .where("id_restaurant", restaurantId)
  .limit(paginator.limit)
  .offset(paginator.offset);
  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });
  return {
    metadata: paginator.getMetadata(totalRecords),
    dishes: results,
  };
}


module.exports = {
  addDish,
  getDishById,
  getDishesByFilter,
  updateDish,
  updatePrice,
  deleteDish,
  deleteAllDishes,
};
