"use strict";
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
exports.logoutUser = exports.getDashboardPage = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newuser = new user_1.default({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2,
    });
    if (newuser.password !== newuser.password2)
        return res.status(400).json({ message: 'password not match' });
    try {
        const user = yield user_1.default.findOne({ email: newuser.email });
        if (user) {
            return res.status(400).json({ auth: false, message: 'email exists' });
        }
        else {
            yield newuser.save();
            return res.status(200).redirect('/');
        }
    }
    catch (error) {
        return res.status(400).json({ auth: false, message: 'an error occured' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth;
    let user = user_1.default.findByToken(token);
    if (user) {
        return res.status(400).json({
            error: true,
            message: 'You are already logged in',
        });
    }
    else {
        user = yield user_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                isAuth: false,
                message: ' Auth failed ,email not found',
            });
        }
        else {
            if (user.comparePassword(req.body.password)) {
                user.generateToken();
                return res.cookie('auth', user.token).redirect('/api/dashboard');
            }
            else {
                return res.json({
                    isAuth: false,
                    message: 'password doesnt match',
                });
            }
        }
    }
});
exports.loginUser = loginUser;
const getDashboardPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find();
    const token = req.cookies.auth;
    const user = user_1.default.findByToken(token);
    res.render('dashboard', {
        name: user.name + ' ' + user.lastname,
        users,
    });
});
exports.getDashboardPage = getDashboardPage;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth;
    const user = user_1.default.findByToken(token);
    user.deleteToken();
    res.status(200).redirect('/');
});
exports.logoutUser = logoutUser;
//# sourceMappingURL=apiController.js.map