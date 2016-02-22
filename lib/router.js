Router.configure({
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() {
	    return [
	        Meteor.subscribe("timetables")
	       ];
	}
});
Router.route('/', {
    name: 'timetable',
    onAfterAction: function() {
        setTitle();
    }
});
Router.route('/lewis', {
	name: 'lewis'
});

// constants and helper
var defaultTitle = 'Han\'s Plan';
var setTitle = function(title) {
    document.title = !!title ? defaultTitle + ' | ' + title : defaultTitle;
};
