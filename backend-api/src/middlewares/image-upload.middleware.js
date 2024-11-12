const multer = require("multer");
const path = require("path");
const ApiError = require("../api-error");

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/avatar/");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

const dishStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/dishes/");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

function avatarUpload(req, res, next) {
  const upload = multer({ storage: avatarStorage }).single("avatarFile");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return next(
        new ApiError(
          400,
          "An error occurred while uploading the avatar with multer"
        )
      );
    } else if (err) {
      console.log(err);
      return next(
        new ApiError(
          500,
          "An unknown error occurred while uploading the avatar"
        )
      );
    }
    next();
  });
}

function dishImageUpload(req, res, next) {
  const upload = multer({ storage: dishStorage }).single("dishImage");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return next(
        new ApiError(
          400,
          "An error occurred while uploading the dish image with multer"
        )
      );
    } else if (err) {
      console.log(err);
      return next(
        new ApiError(
          500,
          "An unknown error occurred while uploading the dish image"
        )
      );
    }
    next();
  });
}

module.exports = {
  avatarUpload,
  dishImageUpload
};
