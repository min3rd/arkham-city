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
      create: 'v1.project.new-project',
      all: 'v1.project.all',
      get: 'v1.project.get',
    },
    app: {
      name: 'project.app',
      patterns: {
        create: 'v1.project.app.create',
        all: 'v1.project.app.all',
        get: 'v1.project.app.get',
        update: 'v1.project.app.update',
        delete: 'v1.project.app.delete',
        getSecret: 'v1.project.app.get-secret',
      },
    },
    firestore: {
      name: 'projects.firestore',
      patterns: {
        querySchema: 'v1.project.firestore.query',
        findById: 'v1.project.firestore.find-by-id',
        deleteById: 'v1.project.firestore.delete-by-id',
      },
      rule: {
        name: 'projects.firestore.rule',
        patterns: {
          createRule: 'v1.project.firestore.rule.create',
          updateRule: 'v1.project.firestore.rule.update',
          deleteRule: 'v1.project.firestore.rule.delete',
          getRule: 'v1.project.firestore.rule.get',
          getAllRules: 'v1.project.firestore.rule.all',
        },
      },
    },
  },
  websdk: {
    auth: {
      name: 'websdk.auth',
      patterns: {
        authenticate: 'v1.websdk.auth.authenticate',
        logInByEmailAndPassword: 'v1.websdk.auth.log-in-by-email-and-password',
        registerByEmailAndPassword:
          'v1.websdk.auth.register-by-email-and-password',
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
