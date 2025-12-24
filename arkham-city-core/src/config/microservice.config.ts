export const microserviceConfig = {
  auth: {
    name: 'auth',
    patterns: {
      registerByEmailAndPassword: 'v1.auth.register-by-email-and-password',
      logInByEmailAndPassword: 'v1.auth.log-in-by-email-password',
      logInByRefreshToken: 'v1.auth.log-in-by-refresh-token',
    },
  },
  role: {
    name: 'role',
    patterns: {
      create: 'v1.role.create',
      update: 'v1.role.update',
      list: 'v1.role.list',
      delete: 'v1.role.delete',
      createAssignment: 'v1.role.assignment.create',
      updateAssignment: 'v1.role.assignment.update',
      listAssignments: 'v1.role.assignment.list',
      deleteAssignment: 'v1.role.assignment.delete',
      effectivePermissions: 'v1.role.effective-permissions',
    },
  },
  user: {
    name: 'user',
    patterns: {
      create: 'v1.user.create',
      update: 'v1.user.update',
      delete: 'v1.user.delete',
      get: 'v1.user.get',
      list: 'v1.user.list',
      setStatus: 'v1.user.set-status',
      assignRoles: 'v1.user.assign-roles',
    },
  },
  firestore: {
    name: 'firestore',
    patterns: {
      createRecord: 'v1.firestore.create-record',
      getAllRuleTypes: 'v1.firestore.get-all-rule-types',
      getAllRuleConditionTypes: 'v1.firestore.get-all-rule-condition-types',
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
      name: 'project.firestore',
      patterns: {
        querySchema: 'v1.project.firestore.query',
        findById: 'v1.project.firestore.find-by-id',
        deleteById: 'v1.project.firestore.delete-by-id',
      },
      rule: {
        name: 'project.firestore.rule',
        patterns: {
          createRule: 'v1.project.firestore.rule.create',
          updateRule: 'v1.project.firestore.rule.update',
          deleteRule: 'v1.project.firestore.rule.delete',
          getRule: 'v1.project.firestore.rule.get',
          getAllRules: 'v1.project.firestore.rule.all',
        },
      },
      schema: {
        name: 'project.firestore.schema',
        patterns: {
          query: 'v1.project.firestore.schema.query',
        },
      },
      record: {
        name: 'project.firestore.record',
        patterns: {
          createRecord: 'v1.project.firestore.record.create-record',
          updateRecord: 'v1.project.firestore.record.update-record',
          deleteRecord: 'v1.project.firestore.record.delete-record',
          findById: 'v1.project.firestore.record.find-by-id',
          queryRecord: 'v1.project.firestore.record.query-record',
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
  storage: {
    name: 'storage',
    patterns: {
      upload: 'v1.storage.upload',
      getFile: 'v1.storage.get-file',
      download: 'v1.storage.download',
      delete: 'v1.storage.delete',
      list: 'v1.storage.list',
      generateSignedUrl: 'v1.storage.generate-signed-url',
      downloadBySignedUrl: 'v1.storage.download-by-signed-url',
    },
  },
};

export const getMicroserviceConfigNames = () => {
  const flattenedConfig: string[] = [];
  Object.keys(microserviceConfig).forEach((key) => {
    flattenedConfig.push(...getMicroserviceConfigName(microserviceConfig[key]));
  });
  return flattenedConfig;
};

export const getMicroserviceConfigName = (config: any): string[] => {
  const result: string[] = [];

  Object.keys(config).forEach((key) => {
    if (key === 'name') {
      result.push(config[key] as string);
    }
    if (typeof config[key] === 'object') {
      const nestedResult = getMicroserviceConfigName(config[key]);
      result.push(...nestedResult);
    }
  });

  return result;
};
