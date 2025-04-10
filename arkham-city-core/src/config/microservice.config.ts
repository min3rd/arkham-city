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
  projects: {
    name: 'project',
    patterns: {
      create: 'v1.projects.new-project',
      all: 'v1.projects.all',
      get: 'v1.projects.get',
    },
    apps: {
      name: 'projects.apps',
      patterns: {
        create: 'v1.projects.apps.create',
        all: 'v1.projects.apps.all',
        get: 'v1.projects.apps.get',
        update: 'v1.projects.apps.update',
        delete: 'v1.projects.apps.delete',
        getSecret: 'v1.projects.apps.get-secret',
      },
    },
  },
  websdk: {
    auth: {
      name: 'websdk.auth',
      patterns: {
        authenticate: 'v1.websdk.auth.authenticate',
      },
    },
    firestore: {
      name: 'websdk.firestore',
      patterns: {
        createRecord: 'v1.websdk.firestore.create-record',
        storeSchema: 'v1.websdk.firestore.store-schema',
        querySchema: 'v1.websdk.firestore.query',
        findById: 'v1.websdk.firestore.find-by-id',
        partialUpdate: 'v1.websdk.firestore.partial-update',
        update: 'v1.websdk.firestore.update',
        deleteById: 'v1.websdk.firestore.delete-by-id',
      },
    },
  },
};
