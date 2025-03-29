export const microserviceConfig = {
  auth: {
    name: 'auth',
    patterns: {
      registerByEmailAndPassword: 'v1.auth.register-by-email-and-password',
      logInByEmailAndPassword: 'v1.auth.log-in-by-email-password',
      logInByRefreshToken: 'v1.auth.log-in-by-refresh-token',
    },
  },
  firestore: {
    name: 'firestore',
    patterns: {
      createRecord: 'v1.firestore.create-record',
    },
  },
  project: {
    name: 'project',
    patterns: {
      create: 'v1.projects.new-project',
      all: 'v1.projects.all',
      get: 'v1.projects.get',
    },
  },
};
