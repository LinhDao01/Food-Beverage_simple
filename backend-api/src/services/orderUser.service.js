const knex = require("../database/knex");
const Paginator = require("./paginator");
const ApiError = require("../api-err");

function orderRepository() {
  return knex("orders");
}
 
function orderItemRepository() {
  return knex("order_items");
}

function readOrder(payload) {
  return {
    id_restaurant: payload.id_restaurant,
    id_user: payload.id_user,
    name_receiver: payload.name_receiver,
    phone_receiver: payload.phone_receiver,
    address_detail: payload.address_detail,
    total: payload.total,
    status: payload.status,
    note: payload.note,
  }
}

function readOrderItems(payload) {
  return {
    id_order: payload.id_order,
    id_dish: payload.id_dish,
    amount: payload.amount
  }
}

//get 1 order of a user
async function getUserOrders(userId) {
  return orderRepository().where("id", userId).select("*")
}

//create a single order
async function createOrder(payload) {
  const order = readOrder(payload)
  const [id] = await orderRepository().insert(order)
  return { id, ...order }
}

module.exports = {
  getUserOrders,
  createOrder,

}