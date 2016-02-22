// Set userid to cookie
if (!Cookie.get('userId')) {
    Cookie.set('userId', uuid.v4(), {days: 30});
}
Meteor.subscribe("timetables", Cookie.get('userId'));
