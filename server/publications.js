Meteor.publish("timetables", function () {
  return Timetables.find({});
});
