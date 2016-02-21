apiCall = function (method, apiUrl, options) {
  try {
    var response = HTTP.call(method, apiUrl, options).data;
    return response;
  } catch (error) {
    var errorCode = 500,
        errorMessage = 'Cannot access the API';
    if (error.response) {
      errorCode = error.response.data.code;
      errorMessage = error.response.data.message;
    }
    var myError = new Meteor.Error(errorCode, errorMessage);
    return myError;
  }
};
