import { Router } from 'express';
import NotificationsController from '../../controllers/mailer-and-sms.controller.js';

const router = Router();

router.post('/mail', NotificationsController.sendPurchaseConfirmationEmail);
router.post('/sms', NotificationsController.sendSMSNotification);


export default router;