import { generateResetToken } from '../utils/tokenService.js';
import UserModel from "./models/user.model.js";

import nodemailer from 'nodemailer';

class AuthController {

    static async sendPasswordResetEmail(req, res, next) {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Utiliza el TokenService para generar el token
            const { resetToken, expires } = generateResetToken();
            user.passwordResetToken = resetToken; // Aquí estamos guardando el token directamente
            user.passwordResetExpires = expires;
            await user.save();

            const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

            let result = await transporter.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: user.email,
                subject: 'Reset your password - Ecommerce',
                html: recoveryPassHTML
            });

            res.status(201).json({ message: 'Password reset email sent successfully.', result });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
