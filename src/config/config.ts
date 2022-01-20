enum environmentVariables {
  secret = 'SECRET',
  mongoDbUri = 'MONGODB_URI',
}
const config = {
  production: {
    SECRET: process.env[environmentVariables.secret] || '',
    DATABASE: process.env[environmentVariables.mongoDbUri] || '',
  },
  default: {
    SECRET: 'mysecretkey',
    DATABASE: 'mongodb://localhost:27017/basicJWT',
  },
};

const get = function get(env: 'production' | 'default') {
  return config[env] || config.default;
};

export { get };
