const knex = require("../database/knex");
const Paginator = require("./paginator");
const { unlink } = require("node:fs");
const ApiError = require("../api-err");
const bcrypt = require("bcryptjs");

function userRepository() {
  return knex("users");
}

//doc du lieu duoc truyen vao
function readUser(payload) {
  return {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    pass: payload.pass,
    address_detail: payload.address_detail,
    province: payload.province,
    district: payload.district,
    role: payload.role,
    avatar: payload.avatar,
  };
}

async function createUser(payload) {
  const user = readUser(payload);

  const hashPass = await bcrypt.hash(payload.pass, 10);
  user.pass = hashPass;

  const [id] = await userRepository().insert(user);
  return { id, ...user };
}

async function login(email, password) {
  try {
    const userLogin = await userRepository()
    .where("email", email)
    .first();

    return userLogin;
  } catch (error) {
    new ApiError(500, "An error occured while finding user");
  }
}

// get 1 user by id
async function getUserByID(id) {
  return userRepository().where("id", id).select("*").first();
}

//get user by email and phone to check if they duplicate or not
async function getUser(email, phone) {
  return userRepository()
    .where("email", email)
    .orWhere("phone", phone)
    .first();
}

async function updateUserInfo(id, payload) {
  const updatedUserInfo = await userRepository()
    .where("id", id)
    .select("*")
    .first();

  if (!updatedUserInfo) {
    return null;
  }

  const updatedInfo = readUser(payload);
  if (!updatedInfo.avatar) {
    delete updatedInfo.avatar;
  }

  await userRepository().where("id", id).update(updatedInfo);

  if (
    updatedInfo.avatar &&
    updatedUserInfo.avatar &&
    typeof updatedUserInfo.avatar === "string" &&
    updatedInfo.avatar !== updatedUserInfo.avatar &&
    updatedUserInfo.avatar.startsWith("/public/img/uploads")
  ) {
    unlink(`.${updatedInfo.avatar}`, (err) => {
      if (err) {
        console.error(`Error deleting old avatar: ${err.message}`);
      }
    });
  }

  return { ...updatedUserInfo, ...updatedInfo };
}

async function deleteUser(id) {
  const deletedUser = await userRepository()
    .where("id", id)
    .select("*")
    .first();

  if (!deletedUser) {
    return null;
  }

  await userRepository().where("id", id).del();

  if (
    deletedUser.avatar &&
    deletedUser.avatar.startsWith("/public/img/uploads")
  ) {
    unlink(`.${deletedUser.avatar}`, (err) => {
      if (err) {
        console.error("Error removing avatar file:", err)
      } else {
        console.log("File removed:", deletedUser)
      }
    });
  }
  return deletedUser;
}

// Define
module.exports = {
  createUser,
  login,
  getUser,
  getUserByID,
  updateUserInfo,
  readUser,
  deleteUser,
};