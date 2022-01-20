"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const nodeEnv = 'NODE_ENV';
const config = (0, config_1.get)(process.env[nodeEnv] === 'production' ? 'production' : 'default');
const salt = 10;
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true,
    },
    password2: {
        type: String,
        require: true,
    },
    token: {
        type: String,
    },
});
exports.userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(salt, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                user.password2 = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
exports.userSchema.method('comparePassword', function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(password, this.password);
    });
});
exports.userSchema.method('generateToken', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign(this._id.toHexString(), config.SECRET);
        this.token = token;
        yield this.save();
    });
});
exports.userSchema.method('deleteToken', function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            this.updateOne({ $unset: { token: 1 } });
        }
        catch (error) {
            throw error;
        }
    });
});
exports.userSchema.static('findByToken', function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, config.SECRET);
            return yield this.findOne({ _id: decodedToken, token });
        }
        catch (error) {
            throw error;
        }
    });
});
exports.User = (0, mongoose_1.model)('User', exports.userSchema);
exports.default = exports.User;
//# sourceMappingURL=user.js.map