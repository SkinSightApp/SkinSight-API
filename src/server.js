require('dotenv').config();

const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const routes = require('#src/routes.js');
const onPreResponse = require("#src/utils/onPreResponse.js");

const { env } = process;

const init = async () => {
  const server = Hapi.server({
    port: env.PORT,
    host: env.NODE_ENV === 'local'
      ? 'localhost'
      : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
    debug: { request: ['error'] },
  });

  await server.register(Jwt);

  server.auth.strategy('auth_jwt', 'jwt', {
    keys: env.JWT_KEY,
    verify: {
      aud: 'urn:audience:test',
      iss: 'urn:issuer:test',
      sub: false,
      nbf: true,
      exp: true,
      timeSkewSec: 15,
    },
    validate: (artifacts, request, h) => ({
      isValid: true,
      credentials: { user: artifacts.decoded.payload.user },
    }),
  });
  server.auth.default('auth_jwt');

  server.route(routes);
  server.ext("onPreResponse", (request, h) => onPreResponse(request, h));

  await server.start();
  console.log(`Server is started at ${server.info.uri}`);
};

init();
