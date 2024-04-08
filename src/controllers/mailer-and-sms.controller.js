import { ecommerceName, generateResetToken } from '../utils/utils.js';
import { generatePurchaseConfirmationHTML, recoveryPassHTML, welcomeUser, attachmentPath } from '../utils/emailTemplates.js';
import { client as clientTwilio, transport as nodemailerTransport } from '../config/nodemailer-and-twilio.config.js';
import UsersController from '../controllers/users.controller.js';
import UserModel from '../dao/models/user.model.js'


class MailerAndSmsController {
    static async sendPurchaseConfirmationEmail(req, res, next) {
        const { first_name, email } = req.user;

        // Arreglar lo del numero de compra. debo hacerlo con el numero de orden o brindar una id unica de orden.
        const purchaseNumber = '2125151'
        try {
            const emailHTML = generatePurchaseConfirmationHTML({
                userName: first_name,
                purchaseNumber,
            });

            const result = await nodemailerTransport.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: email,
                subject: `Gracias por tu compra! - ${ecommerceName}`,
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
        try {
            const user = await UsersController.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const { resetToken, hash, expires } = generateResetToken();

            await UserModel.findByIdAndUpdate(user._id, {
                resetPasswordToken: hash,
                resetPasswordExpires: expires,
            }, { new: true });

            const resetURL = `${req.protocol}://${req.get('host')}/auth/reset-password?token=${resetToken}`;
            const emailHTML = recoveryPassHTML({
                userName: user.first_name || 'Usuario',
                resetURL,
            });

            const result = await nodemailerTransport.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: user.email,
                subject: `Reset your password - ${ecommerceName}`, // Asegúrate de definir ECOMMERCE_NAME en tus variables de entorno
                html: emailHTML,
                attachments: [{
                    filename: 'banner.png',
                    path: attachmentPath,
                    cid: 'banner'
                }]
            });

            res.status(201).json({ message: 'Password reset email sent successfully.', result });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    static async sendWelcomeEmail({ user }, res, next) {
        const { first_name, email } = user;

        try {
            const emailHTML = welcomeUser({ userName: first_name });

            const result = await nodemailerTransport.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: email,
                subject: `¡Bienvenido a ${ecommerceName}! - ${ecommerceName}`,
                html: emailHTML,
                attachments: [{
                    filename: 'banner.png',
                    path: attachmentPath,
                    cid: 'banner'
                }]
            });

            console.log(result);
        } catch (error) {
            next(error);
        }
    }

    // Envío de notificaciones SMS
    static async sendSMSNotification(req, res, next) {
        try {
            const result = await clientTwilio.messages.create({
                body: `Gracias por tu compra!`,
                from: process.env.TWILIO_SMS_NUMBER,
                to: process.env.TWILIO_SMS_TO_NUMBER
            });

            res.status(201).json({ message: 'SMS sent successfully.', result });
        } catch (error) {
            next(error);
        }
    }

    static async sendInactivityEmail(userEmail, userName) {
        try {
            const emailHTML = `Estimado/a ${userName}, su cuenta ha sido eliminada por inactividad.`;

            const result = await nodemailerTransport.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: userEmail,
                subject: `Cuenta eliminada por inactividad`,
                html: emailHTML,
                attachments: [{
                    filename: 'banner.png',
                    path: attachmentPath,
                    cid: 'banner'
                }]
            });

            console.log(`Correo de inactividad enviado a: ${userEmail}`, result);
        } catch (error) {
            console.error(`Error al enviar correo de inactividad a: ${userEmail}`, error);
        }
    }
}

export default MailerAndSmsController;
