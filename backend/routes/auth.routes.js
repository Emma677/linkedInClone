import express from 'express';
import { getCurrentUser, logIn, logOut, signUp } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signUp',signUp)
router.post('/logIn',logIn) 
router.post('/logOut',logOut) 

router.get('/currentUser',protectedRoute, getCurrentUser);

export default router;