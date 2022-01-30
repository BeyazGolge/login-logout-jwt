enum environmentVariables {
  secret = 'SECRET',
  mongoDbUri = 'MONGODB_URI',
}

// Config file is used to seperate the local test credentials with deployment credentials
const config = {
  production: {
    SECRET: process.env[environmentVariables.secret] || '',
    DATABASE: process.env[environmentVariables.mongoDbUri] || '',
  },
  default: {
    SECRET: 'mysecretkey',
    DATABASE: 'mongodb://localhost:3306',
  },
};

const get = function get(env: 'production' | 'default') {
  return config[env] || config.default;
};

export { get };
