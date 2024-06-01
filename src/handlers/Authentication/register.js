const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const { Timestamp } = require('@google-cloud/firestore');
const InputError = require('#src/exceptions/InputError.js');

// Inisialisasi Firestore
const db = require('#src/config/firestore.js');

// Fungsi untuk menambahkan user ke Firestore
async function addUserToFirestore(user) {
  const usersCollection = db.collection('users');
  const existedUser = await usersCollection.where('email', '=', user.email).get();

  if (existedUser.empty) {
    const result = await usersCollection.add(user);
    return result.id;
  }
  throw new InputError('User is existed');
}

// Handler untuk rute registrasi
const register = async (request, h) => {
  const { name, email, password } = request.payload;

  // Validasi input (tambahkan validasi sesuai kebutuhan)
  if (!name || !email || !password) {
    throw Boom.badRequest('Name, email, and password are required');
  }

  // Hash password sebelum menyimpan ke Firestore
  const hashedPassword = await Bcrypt.hash(password, 10);

  // Initialize timestamp
  const timestamp = Timestamp.fromDate(new Date());

  // Buat objek user
  const user = {
    name,
    email,
    password: hashedPassword,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    // Simpan user ke Firestore
    const userId = await addUserToFirestore(user);
    return h.response({
      status: 'success',
      message: 'User registered successfully',
      userId,
    }).code(201);
  } catch (error) {
    throw Boom.badRequest(error);
  }
};

module.exports = register;
