const userService = require("../services/user.service")
const ApiError = require("../api-err")
const JSend = require("../jsend")

async function getUser(req, res, next) {
  const { id } = req.params

  try {
    const user = await userService.getUserByID(id)
    if (!user) {
      return next(new ApiError(404, 'User not found!'))
    }
    return res.json(JSend.success({ user }))
  } catch {
    console.log(error)
    return next(new ApiError(500, `Error retrieving user with id=${id}`))
  }
}


async function createUser(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(new ApiError(400, "Name should not be an empty string!"));
  }

  try {
    const user = await userService.createUser({
      ...req.body,
      avatar: req.file ? `public/img/uploads/${req.file.filename}` : null,
    })
    if (!user) {
      return next(new ApiError(400, "Please enter name, email, ..."))
    }
    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${user.id}`,
      })
      .json(
        JSend.success({
          user,
        })
      )
  } catch(error) {
    console.log(error)
    return next(
      new ApiError(500, 'An error occured while creating the user')
    )
  }
}

async function updatedUserInfo(req, res, next) {
  if (Object.keys(req.body).length === 0 && !req.file) {
    return next(
      new ApiError(400, "You must enter data to update the information!")
    )
    }
    const { id } = req.params

    try {
      const updated = await userService.updateUserInfo(id, {
        ...req.body,
        avatar: req.file ? `/public/img/uploads/${req.file.filename}` : null,
      })
      if (!updated) {
        return next(new ApiError(404, 'User not found!'))
      }
      return res.json(
        JSend.success({ 
          user: {
            message: "Update user info successfully!"
          }, 
        })
      )
    } catch(error) {
      console.log(error)
      return next(new ApiError(500, `Error updating information of user with id=${id}`))
    }
}

async function deleteUser(req, res, next) {
  const { id } = req.params

  try {
    const deleted = await userService.deleteUser(id)
    if (!deleted) {
      return next(new ApiError(404, 'User not found!'))
    }
    return res.json(JSend.success())
  } catch {
    console.log(error)
    return next(new ApiError(500, `Could not delete use with id=${id}`))
  }
}

module.exports = {
  getUser,
  createUser,
  updatedUserInfo,
  deleteUser,

};
