const httpStatus = require('http-status');
const wrapper = require('../utils/wrapper');
const { authService, userService, tokenService } = require('../services');

const register = wrapper(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.generateToken(user.id);
  res.status(httpStatus.CREATED).json({ user, token });
});

const login = wrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateToken(user.id);
  res.json({ user, tokens });
});

const loggedInUser = wrapper(async (req, res) => {
  res.json({ user: res.locals.user });
});

module.exports = {
  register,
  login,
  loggedInUser,
};
