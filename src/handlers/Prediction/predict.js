const { Timestamp } = require('@google-cloud/firestore');
const db = require('#src/config/firestore.js');
const predictClassification = require('#src/services/inferenceService.js');
const InputError = require('#src/exceptions/InputError.js');

const predict = async (request, h) => {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label, suggestion } = await predictClassification(model, image);

    const collection = db.collection('predictions');
    const id = crypto.randomUUID();
    const date = new Date();
    const isoString = date.toISOString();
    const timestamp = Timestamp.fromDate(date);

    const data = {
      id,
      result: label,
      suggestion,
    };

    const created = await collection.doc(id).set({
      ...data,
      createdAt: timestamp,
    });

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data: {
        ...data,
        createdAt: isoString,
        created,
      },
    });
    response.code(201);

    return response;
  } catch (error) {
    if (error instanceof InputError) {
      throw new InputError(error.message);
    }
    const response = h.response({
      status: 'fail',
      message: error,
    });
    response.code(500);

    return response;
  }
};

module.exports = predict;
