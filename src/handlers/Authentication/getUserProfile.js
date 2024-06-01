const Jwt = require('@hapi/jwt');

const getUserProfile = async (request, h) => {
  const { credentials, isAuthenticated } = await request.auth;

  if (!isAuthenticated) {
    return h.response({
      status: 'error',
      message: 'Unauthenticated',
    });
  }
  return h.response({
    status: 'success',
    message: `Hello, ${credentials.user.name}!`,
    data: {
      credentials,
    },
  });
};

module.exports = getUserProfile;
