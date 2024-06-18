const db = require('#src/config/firestore.js');
const mapDocuments = require('#src/utils/mapDocuments.js');

const list = async (request, h) => {
  let catalogs = await db.collection('catalogs').get();
  catalogs = mapDocuments(catalogs);

  const data = await Promise.all(catalogs.map(async (catalog) => {
    let products = await db.collection('catalogs')
      .doc(catalog.id)
      .collection('products')
      .get();

    products = mapDocuments(products)
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

    return {
      ...catalog,
      products,
    };
  }));

  return h.response({
    status: 'success',
    message: 'Showing list of catalogs',
    data: {
      redness: data.find((x) => x.category === 'Redness'),
      acne: data.find((x) => x.category === 'Acne'),
      blackhead: data.find((x) => x.category === 'Blackhead'),
    },
  });
};

module.exports = list;
