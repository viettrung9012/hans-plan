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
Router.route('/lewis', {
	name: 'lewis'
});

// constants and helper
var defaultTitle = 'Han\'s Plan';
var setTitle = function(title) {
    document.title = !!title ? defaultTitle + ' | ' + title : defaultTitle;
};
