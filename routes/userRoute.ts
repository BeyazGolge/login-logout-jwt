import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth';
import * as userController from '../controllers/userController';

router.route('/login').post(userController.loginUser);
router.route('/logout').get(auth, userController.logoutUser);
router.route('/register').post(userController.registerUser);
router.route('/dashboard').get(auth, userController.getDashboardPage);
export default router;
