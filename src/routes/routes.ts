import express from 'express';
import { handleError } from '../middleware/errorHandler';
import { handleRegisterStart, handleRegisterFinish } from '../controllers/registration';
import { handleLoginStart, handleLoginFinish, handleLogout } from '../controllers/authentication';
import {
  handleGetHistory,
  handleSaveCalculation,
  handleDeleteCalculation,
} from '../controllers/calculations';

const router = express.Router();

router.post('/registerStart', handleRegisterStart);
router.post('/registerFinish', handleRegisterFinish);
router.post('/loginStart', handleLoginStart);
router.post('/loginFinish', handleLoginFinish);
router.post('/saveCalculation', handleSaveCalculation);
router.get('/history', handleGetHistory);
router.delete('/history/:id', handleDeleteCalculation);
router.post('/logout', handleLogout);

router.use(handleError);

export { router };