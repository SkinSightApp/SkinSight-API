const translateTimestamp = (data) => {
  const createdAt = data.createdAt
    ? data.createdAt.toDate()
    : null;
  const updatedAt = data.updatedAt
    ? data.updatedAt.toDate()
    : null;

  return { createdAt, updatedAt };
};

module.exports = translateTimestamp;
