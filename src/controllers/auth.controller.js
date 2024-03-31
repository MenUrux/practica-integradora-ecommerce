import { generateResetToken } from '../utils/utils.js';

import nodemailer from 'nodemailer';

class AuthController {

    static async sendPasswordResetEmail(req, res, next) {
        const { email } = req.body;
        try {
            const user = await UsersController.findByEmail(email); // Busca el usuario mediante el controlador
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const { resetToken, hash, expires } = generateResetToken();

            await UsersController.update(user._id, {
                resetPasswordToken: hash, // Almacena el hash
                resetPasswordExpires: expires,
            });

            const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

            let result = await transport.sendMail({
                from: process.env.EMAIL_NODEEMAILER,
                to: user.email,
                subject: 'Reset your password - Ecommerce',
                html: `¡Hey!, aquí tienes para poder realizar la recuperación de cuenta! <a href="${resetURL}">Restablecer contraseña</a>`
            });

            res.status(201).json({ message: 'Password reset email sent successfully.', result });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
