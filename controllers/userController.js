const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. create an error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This router is not for password updates, please use /updateMyPassword",
        400
      )
    );
  }

  // 2. filter out the unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3. update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(5800).json({
    status: "error",
    message: "This router is not defined. Please use /signup instead",
  });
};
exports.getUser = factory.getOne(User);
// do NOT update passwords with them
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
