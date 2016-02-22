if (!Cookie.get('userId')) {
    Cookie.set('userId', uuid.v4(), {days: 30});
}
