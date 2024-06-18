const Joi = require('joi');

const exampleService = require('#src/handlers/Example/exampleService.js');
const login = require('#src/handlers/Authentication/login.js');
const profile = require('#src/handlers/Authentication/profile.js');
const register = require('#src/handlers/Authentication/register.js');
const storeCatalogs = require('#src/handlers/Catalogs/store.js');
const listCatalogs = require('#src/handlers/Catalogs/list.js');

const routes = [{
  path: '/',
  method: 'GET',
  options: {
    auth: false,
  },
  handler: exampleService,
}, {
  method: 'POST',
  path: '/register',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(6).required(),
      }),
    },
  },
  handler: register,
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
  path: '/catalogs',
  method: 'POST',
  handler: storeCatalogs,
}, {
  path: '/catalogs',
  method: 'GET',
  handler: listCatalogs,
}];

module.exports = routes;
