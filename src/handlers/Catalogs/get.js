const db = require('#src/config/firestore.js');
const mapDocuments = require('#src/utils/mapDocuments.js');

const getProducts = async (request, h) => {
  const { category } = request.query;

  if (!category) {
    return h.response({
      status: 'fail',
      message: 'Category is required',
    }).code(400);
  }

  try {
    const categorySnapshot = await db.collection('catalogs').where('category', '==', category).get();

    if (categorySnapshot.empty) {
      return h.response({
        status: 'fail',
        message: 'Category not found',
      }).code(404);
    }

    const categoryDoc = categorySnapshot.docs[0];
    const productsSnapshot = await db.collection('catalogs')
      .doc(categoryDoc.id)
      .collection('products')
      .get();

    if (productsSnapshot.empty) {
      return h.response({
        status: 'success',
        message: 'No products found for this category',
        data: {
          products: [],
        },
      }).code(200);
    }

    const products = mapDocuments(productsSnapshot);

    return h.response({
      status: 'success',
      message: 'Products retrieved successfully',
      data: {
        products,
      },
    }).code(200);

  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(500);
  }
};

module.exports = getProducts;
