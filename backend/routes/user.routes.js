import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getPublicProfile, getSuggestedConnections, updateProfile } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/suggestions',protectedRoute,getSuggestedConnections)
router.get('/:userName',protectedRoute,getPublicProfile)

router.put('/profile',protectedRoute,updateProfile)



export default router;