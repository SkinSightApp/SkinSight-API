const db = require('#root/src/config/firestore.js');

const profile = async (request, h) => {
  const { credentials } = await request.auth;

  const collection = await db.collection('users').doc(credentials.user.id).get();
  const user = collection.data();

  return h.response({
    status: 'success',
    message: `Hello, ${credentials.user.name}!`,
    data: { user },
  });
};

module.exports = profile;
