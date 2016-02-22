Meteor.publish("timetables", function (userId) {
  if (Timetables.find({owner: userId}).count() === 0) {
    Timetables.insert({
      owner: userId,
      items: []
    });
  }
  return Timetables.find({owner: userId});
});
