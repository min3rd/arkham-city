export const microserviceConfig = {
  auth: {
    name: 'auth',
    patterns: {
      registerByEmailAndPassword: 'v1.auth.register-by-email-and-password',
      logInByEmailAndPassword: 'v1.auth.log-in-by-email-password',
    },
  },
  user: {
    name: 'user',
    patterns: {},
  },
};
