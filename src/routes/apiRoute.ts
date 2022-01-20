import express from 'express';
import * as apiController from '../controllers/apiController';
const router = express.Router();
import auth from '../middlewares/auth';

router.route('/login').post(apiController.loginUser);
router.route('/logout').get(auth, apiController.logoutUser);
router.route('/register').post(apiController.registerUser);
router.route('/dashboard').get(auth, apiController.getDashboardPage);

export default router;
