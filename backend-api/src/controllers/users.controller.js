const userService = require("../services/user.service");
const ApiError = require("../api-err");
const JSend = require("../jsend");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const { email, phone, ...details } = req.body;
    // check if email and phone num are exist in db
    const existUser = await userService.getUser(email, phone);
    if (existUser) {
      if (existUser.email === email) {
        return next(new ApiError(400, "Email đã được sử dụng. Vui lòng chọn email khác."));
      }
      if (existUser.phone === phone) {
        return next(new ApiError( 400, "Số điện thoại đã được sử dụng. Vui lòng chọn số khác."));
      }
    }
    //add into db
    const user = await userService.createUser({
      email,
      phone,
      avatar: req.file ? `public/img/uploads/${req.file.filename}` : null,
      ...details,
    });

    if (!user) {
      return next(new ApiError(400, "Please enter name, email, and other required fields"));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    //select thông tin cá nhân ra => lưu vào response

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // sameSite: "strict",
    });

    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${user.id}`,
      })
      .json(
        JSend.success({
          user: {
            role: user.role,
            token: token,
            email: user.email,
            message: "Create account successfully!",
          },
          token,
        })
      );
  } catch(error) {
    console.log(error)
    return next(
      new ApiError(500, 'An error occured while creating the user')
    )
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);
  

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required!'));
  }

  try {
    //check if user exist in database
    const user = await userService.login(email, password);

    if (!user) {
      return next(new ApiError(404, 'Email not exist!'));
    }

    const isPass = await bcrypt.compare(password, user.pass);
    if (!isPass) {
      return next(new ApiError(404, 'Password is incorrect!'));
    }

    //create token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    //select thông tin cá nhân => lưu vào response

    res.cookie("token", token, {
      httpOnly: true, // Ngăn chặn truy cập từ JavaScript
      // secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS nếu đang ở môi trường production
      // maxAge: 3600000, // Thời gian hết hạn của cookie (1 giờ ở đây)
      // sameSite: "strict", // Bảo vệ CSRF, chỉ cho phép cookie cùng site gửi yêu cầu
    });

    return res.json(
      JSend.success({ 
        user: {
          role: user.role,
          id: user.id,
          token: user.token,
          message: "Login successfully!, Hello " + user.name,
        }, 
        token
      })
    )
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "Something went wrong while login!")
    );
  }
}

async function logout(req, res, next) {
  try {
    // Xóa cookie chứa JWT
    res.clearCookie("token");

    return res.json(
      JSend.success({
        message: "Logout successfully!"
      })
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Something went wrong during logout!"));
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
  login, 
  logout,
  updatedUserInfo,
  deleteUser,
};
