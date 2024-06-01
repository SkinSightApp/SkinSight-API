const InputError = require('#src/exceptions/InputError.js');

const onPreResponse = ({ response }, h) => {
  const statusCode = response.statusCode || response.output?.statusCode;
  
  if (statusCode == 415) {
    const newResponse = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
    newResponse.code(statusCode);
    return newResponse;
  }

  if (statusCode == 413) {
    const newResponse = h.response({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
    newResponse.code(statusCode);
    return newResponse;
  }

  if (response instanceof InputError) {
    const newResponse = h.response({
      status: "fail",
      message: response.message,
    });
    newResponse.code(400);
    return newResponse;
  }
  
  return h.continue;
};

module.exports = onPreResponse;
