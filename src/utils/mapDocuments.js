const mapDocuments = (collections) => {
  if (!collections.empty) {
    const documents = collections.docs.map((doc) => {
      const collection = doc.data();
      const createdAt = collection.createdAt
        ? collection.createdAt.toDate()
        : null;
      const updatedAt = collection.updatedAt
        ? collection.updatedAt.toDate()
        : null;
      return {
        ...collection,
        createdAt,
        updatedAt,
      };
    });
    return documents;
  }
  return [];
};

module.exports = mapDocuments;
