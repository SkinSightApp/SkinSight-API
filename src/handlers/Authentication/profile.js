const db = require('#src/config/firestore.js');
const translateTimestamp = require('#src/utils/translateTimestamp.js');

const profile = async (request, h) => {
  const { credentials } = await request.auth;

  const collection = await db.collection('users').doc(credentials.user.id).get();
  const user = collection.data();
  const { createdAt, updatedAt } = translateTimestamp(user);

  return h.response({
    status: 'success',
    message: `Hello, ${credentials.user.name}!`,
    data: {
      user: {
        id: credentials.user.id,
        ...user,
        createdAt,
        updatedAt,
      },
    },
  });
};

module.exports = profile;
