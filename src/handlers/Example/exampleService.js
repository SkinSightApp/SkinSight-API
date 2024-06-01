const exampleService = (request, h) => h.response({
  status: 'success',
  data: {
    request: request.query,
    text: 'This is an example page.',
  },
});

module.exports = exampleService;
