Meteor.methods({
  'searchPlaylist': function (str) {
  	check(str, String);
  	this.unblock();
    var response = apiCall('GET', GoogleAPI.youtubeSearch, {
      params: {
        'part': 'snippet',
        'q': str,
        'type': 'playlist',
        'maxResults': 20,
        'key': GoogleAPI.serverKey
      }
    });
    if (response.items) {
	  	return response.items;
    } else {
      console.log(response);
      return [];
    }
  }
});
