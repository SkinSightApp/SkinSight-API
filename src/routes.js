const Joi = require('joi');

const exampleService = require('#root/src/handlers/Example/exampleService.js');
const login = require('#root/src/handlers/Authentication/login.js');
const getUserProfile = require('#root/src/handlers/Authentication/getUserProfile.js');
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
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(6).required(),
      }),
    },
  },
  handler: login,
}, {
  path: '/user',
  method: 'GET',
  handler: getUserProfile,
}, {
  method: 'POST',
  path: '/register',
  handler: register,
}];

module.exports = routes;
