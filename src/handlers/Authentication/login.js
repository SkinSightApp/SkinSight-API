const Bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const { boomify } = require('@hapi/boom');
const { User } = require('#models/index.js');

const { env } = process;

const login = async ({ payload }, h) => {
  try {
    const user = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return h.response({
        status: 'error',
        message: 'Credentials are not correct!',
      }).code(400);
    }

    const isValid = await Bcrypt.compare(payload.password, user?.password);

    if (!isValid) {
      return h.response({
        status: 'error',
        message: 'Credentials are not correct!',
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
      data: { token },
    });
  } catch (error) {
    return boomify(error);
  }
};

module.exports = login;
