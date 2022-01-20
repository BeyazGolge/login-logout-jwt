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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const apiRoute_1 = __importDefault(require("./routes/apiRoute"));
const user_1 = __importDefault(require("./models/user"));
const nodeEnv = 'NODE_ENV';
const config_1 = require("./config/config");
const config = (0, config_1.get)(process.env[nodeEnv] === 'production' ? 'production' : 'default');
// const pageRoute = require("./routes/pageRoute");
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static('public'));
// Database connection
mongoose_1.default
    .connect(config.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
})
    .then(() => {
    // tslint:disable-next-line:no-console
    console.log('connected to db succesfully');
})
    .catch((err) => {
    // tslint:disable-next-line:no-console
    console.log(err);
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.cookies.auth
        ? yield user_1.default.findOne({ token: req.cookies.auth })
        : null;
    res.status(200).render('index', {
        userIN: !!user,
    });
}));
app.use('/api', apiRoute_1.default);
app.listen(process.env.PORT || 3000, () => {
    // tslint:disable-next-line:no-console
    console.log('App is live');
    // console.log(process.env.NODE_ENV);
    // console.log(process.env.SECRET);
    // console.log(process.env.DATABASE);
});
//# sourceMappingURL=app.js.map