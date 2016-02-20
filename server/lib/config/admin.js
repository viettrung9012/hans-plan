if (Meteor.users.find().count() === 0) {
  Accounts.createUser({
    username: 'admin',
    email: 'admin@hans.plan',
    password: 'password',
    profile: {
      name: 'Administrator'
    }
  });
}
Accounts._options.forbidClientAccountCreation = false;
