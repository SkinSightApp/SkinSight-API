const mapDocuments = (collection) => {
  if (!collection.empty) {
    const documents = collection.docs.map((doc) => {
      const document = doc.data();
      const createdAt = document.createdAt
        ? document.createdAt.toDate()
        : null;
      const updatedAt = document.updatedAt
        ? document.updatedAt.toDate()
        : null;
      return {
        id: doc.id,
        ...document,
        createdAt,
        updatedAt,
      };
    });
    return documents;
  }
  return [];
};

module.exports = mapDocuments;
