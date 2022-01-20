"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const auth = (req, res, next) => {
    const token = req.cookies.auth;
    const user = user_1.default.findByToken(token);
    if (!user) {
        res.send('You must login or register first');
    }
    else {
        next();
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map