import express from 'express';
const router = express.Router();
import {loginLimiter} from '../middleware/loginLimiter.js';
import {login, refresh, logout} from '../controllers/authController.js'

router.route('/')
    //On initial route we are running limiter
    .post(loginLimiter,login)

router.route('/refresh')
    .get(refresh)

router.route('/logout')
    .post(logout)


export default router