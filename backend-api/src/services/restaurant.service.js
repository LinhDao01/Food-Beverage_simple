const knex = require("../database/knex");
const { unlink } = require("node:fs");
const Paginator = require("./paginator");

function restaurantRepository() {
  return knex("restaurant");
}

function readRestaurant(payload) {
  return {
    name: payload.name,
    address: payload.address,
    phone: payload.phone,
    note: payload.note,
    avatar: payload.avatar,
  };
}

async function getRestaurant(userId) {
  return restaurantRepository().where("id_user", userId).select("*").first();
}

async function updateRestaurant(userId, payload) {
  const updatedRestaurant = await restaurantRepository()
    .where("id_user", userId)
    .select("*")
    .first();
  if (!updatedRestaurant) {
    return null;
  }
  const update = readRestaurant(payload);
  if (!update.avatar) {
    delete update.avatar;
  }
  await restaurantRepository().where("id_user", userId).update(update);
  if (
    update.avatar &&
    updatedRestaurant.avatar &&
    update.avatar !== updatedRestaurant.avatar &&
    updatedRestaurant.avatar.startsWith("/public/img/avatar")
  ) {
    unlink(`.${updatedRestaurant.avatar}`, (err) => {
      if (err) {
        console.error("Error removing file:", err);
      } else {
        console.log("File removed:", updatedRestaurant.avatar);
      }
    });
  }
  return { ...updatedRestaurant, ...update };
}

async function updateOrderStatus(orderId, status) {
  const updatedOrder = await knex("orders")
    .where("id", orderId)
    .select("*")
    .first();
  if (!updatedOrder) {
    return null;
  }
  await knex("orders").where("id", orderId).update({ status: status });

  return { orderId: orderId, status: status };
}

async function getRestaurantOrders(resId, page, limit) {
  page = page ? page : 1;
  limit = limit ? limit : 5;

  const paginator = new Paginator(page, limit);

  let results = await knex("orders")
    .where("id_restaurant", resId)
    .whereNot("status", "finish")
    .select(
      knex.raw("count(id) OVER() AS recordCount"),
      "id",
      "name_receiver",
      "phone_receiver",
      "address_detail",
      "total",
      "paid",
      "status",
      "create_at"
    )
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
    orders: results,
  };
}
module.exports = {
  getRestaurant,
  updateRestaurant,
  updateOrderStatus,
  getRestaurantOrders,
};
