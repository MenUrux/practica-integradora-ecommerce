import { generateResetToken } from '../utils/utils.js';
import { generatePurchaseConfirmationHTML, recoveryPassHTML, attachmentPath } from '../utils/emailTemplates.js';
import { client as clientTwilio, transport as nodemailerTransport } from '../config/nodemailer-and-twilio.config.js';
import UsersController from '../controllers/users.controller.js';


class MailerAndSmsController {
    static async sendPurchaseConfirmationEmail(req, res, next) {
        const { first_name, email } = req.user;

        // Arreglar lo del numero de compra.
        const purchaseNumber = '2125151'
        try {
            const emailHTML = generatePurchaseConfirmationHTML({
                userName: first_name,
                purchaseNumber,
            });

            const result = await nodemailerTransport.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: email,
                subject: 'Click n Shop - Gracias por tu compra!',
                html: emailHTML,
                attachments: [{
                    filename: 'banner.png',
                    path: attachmentPath,
                    cid: 'banner'
                }]
            });

            console.log(result);
            res.status(201).json({ message: 'Confirmación enviada correctamente.', result });
        } catch (error) {
            next(error);
        }
    }

    static async sendPasswordResetEmail(req, res, next) {
        const { email } = req.body;
        console.log(req.body);
        try {
            const user = await UsersController({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const { resetToken } = generateResetToken();
            user.passwordResetToken = resetToken;
            user.passwordResetExpires = Date.now() + 3600000; // 1 hora en milisegundos
            await user.save();

            const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
            const emailHTML = recoveryPassHTML({
                userName: user.first_name || 'User', // Ajustado para un campo hipotético 'firstName'
                resetURL,
                siteUrl
            });

            const result = await nodemailerTransport.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: user.email,
                subject: 'Reset your password - Ecommerce',
                html: emailHTML,
                attachments: [{
                    filename: 'banner.png',
                    path: attachmentPath,
                    cid: 'banner'
                }]
            });

            res.status(201).json({ message: 'Password reset email sent successfully.', result });
        } catch (error) {
            next(error);
        }
    }

    // Envío de notificaciones SMS
    static async sendSMSNotification(req, res, next) {
        try {
            const result = await clientTwilio.messages.create({
                body: `Thank you for your purchase, we will be in touch soon!`,
                from: process.env.TWILIO_SMS_NUMBER,
                to: process.env.TWILIO_SMS_TO_NUMBER
            });

            res.status(201).json({ message: 'SMS sent successfully.', result });
        } catch (error) {
            next(error);
        }
    }
}

export default MailerAndSmsController;
