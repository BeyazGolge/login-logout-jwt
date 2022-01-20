"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
var environmentVariables;
(function (environmentVariables) {
    environmentVariables["secret"] = "SECRET";
    environmentVariables["mongoDbUri"] = "MONGODB_URI";
})(environmentVariables || (environmentVariables = {}));
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
const get = function get(env) {
    return config[env] || config.default;
};
exports.get = get;
//# sourceMappingURL=config.js.map