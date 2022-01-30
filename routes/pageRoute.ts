import express from 'express';
const router = express.Router();
import * as pageController from '../controllers/pageController';

router.route('/').get(pageController.getIndexPage);
export default router;
