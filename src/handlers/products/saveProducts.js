const { Timestamp } = require('@google-cloud/firestore');

const db = require('#src/config/firestore.js');
const mapDocuments = require('#src/utils/mapDocuments.js');

const getCategory = async (value) => {
  if (value) {
    let catalogs = await db.collection('catalogs').where('category', '==', value).get();

    if (catalogs.empty) {
      await db.collection('catalogs').add({
        category: value,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      catalogs = await db.collection('catalogs').where('category', '==', value).get();
    }

    return mapDocuments(catalogs)[0];
  }
  return null;
};

const saveProducts = async (request, h) => {
  const { products } = request.payload;

  const failures = [];
  const sortedProducts = products
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

  try {
    sortedProducts.forEach(async (product, index) => {
      if (index < 10) {
        const category = await getCategory(product.category);

        if (category?.id) {
          const existedProduct = await db.collection('catalogs')
            .doc(category.id)
            .collection('products')
            .where('url', '==', product.url)
            .get();

          if (existedProduct.empty) {
            const creation = await db.collection('catalogs')
              .doc(category.id)
              .collection('products')
              .add({
                name: product.name,
                brand: product.brand,
                price: product.price,
                rating: product.rating,
                reviews: product.reviews,
                url: product.url,
                image_url: product.image_url,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
              });

            if (!creation?.id) {
              failures.push({
                name: product.name,
                price: product.price,
                category: product.category,
              });
            }
          }
        }
      }
    });

    if (sortedProducts.length > failures.length) {
      return h.response({
        status: 'success',
        message: 'Products saved successfully',
        data: {
          failures_count: failures.length,
          failures,
        },
      }).code(200);
    }
    return h.response({
      status: 'fail',
      message: 'Save products failed',
      data: {
        failures_count: failures.length,
        failures,
      },
    }).code(400);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error,
    }).code(500);
  }
};

module.exports = saveProducts;
