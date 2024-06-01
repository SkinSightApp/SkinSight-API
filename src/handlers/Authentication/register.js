const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const { Timestamp } = require('@google-cloud/firestore');

// Inisialisasi Firestore
const db = require('#root/src/config/firestore.js');

// Fungsi untuk menambahkan user ke Firestore
async function addUserToFirestore(user) {
  const usersCollection = db.collection('users');
  const result = await usersCollection.add(user);
  return result.id;
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
    return h.response({ message: 'User registered successfully', userId }).code(201);
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw Boom.internal('Internal Server Error', error);
  }
};

module.exports = register;
