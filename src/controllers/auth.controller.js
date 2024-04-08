import { generateResetToken } from '../utils/utils.js';
import UserMongoDbDao from '../dao/user.mongodb.dao.js';
import UsersController from '../controllers/users.controller.js';
import bcrypt from 'bcrypt';


class AuthController {

    static async resetPassword(req, res, next) {
        const { token, newPassword } = req.body;
        try {
            const result = await UserMongoDbDao.validateResetToken(token);
            if (!result || !result.userId) {
                return res.status(400).json({ time: Date.now(), message: 'Invalid or expired token.' });
            }

            const userId = result.userId;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await UsersController.update(userId, {
                password: hashedPassword,
                resetPasswordToken: "",
                resetPasswordExpires: new Date(0),
            });

            res.json({ message: 'Password has been updated successfully.' });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
