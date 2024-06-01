const Joi = require('joi');

const exampleService = require('#root/src/handlers/Example/exampleService.js');
const login = require('#root/src/handlers/Authentication/login.js');
const profile = require('#root/src/handlers/Authentication/profile.js');
const register = require('#root/src/handlers/Authentication/register.js')

const routes = [{
  path: '/',
  method: 'GET',
  options: {
    auth: false,
  },
  handler: exampleService,
}, {
  path: '/login',
  method: 'POST',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
      }),
    },
  },
  handler: login,
}, {
  path: '/user',
  method: 'GET',
  handler: profile,
}, {
  method: 'POST',
  path: '/register',
  handler: register,
}];

module.exports = routes;
