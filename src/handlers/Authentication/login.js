const Bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const { boomify } = require('@hapi/boom');

const db = require('#src/config/firestore.js');
const mapDocuments = require('#src/utils/mapDocuments.js');

const { env } = process;

const login = async ({ payload }, h) => {
  try {
    const collection = await db.collection('users').where('email', '=', payload.email).get();
    const user = mapDocuments(collection)[0];

    if (!user) {
      return h.response({
        status: 'fail',
        message: 'Credentials are incorrect!',
      }).code(400);
    }

    const isValid = await Bcrypt.compare(payload.password, user?.password);

    if (!isValid) {
      return h.response({
        status: 'fail',
        message: 'Credentials are incorrect!',
      }).code(400);
    }

    const token = Jwt.token.generate(
      {
        aud: 'urn:audience:test',
        iss: 'urn:issuer:test',
        user: {
          id: user.id,
          name: user.name,
        },
      },
      {
        key: env.JWT_KEY,
        algorithm: 'HS512',
      },
    );

    return h.response({
      status: 'success',
      message: 'You have logged in successfully!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return boomify(error);
  }
};

module.exports = login;
