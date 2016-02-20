Router.configure({
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});
Router.route('/', {
    name: 'timetable',
    onAfterAction: function() {
        setTitle();
    }
});

// constants and helper
var defaultTitle = 'Han\'s Plan';
var setTitle = function(title) {
    document.title = !!title ? defaultTitle + ' | ' + title : defaultTitle;
};
