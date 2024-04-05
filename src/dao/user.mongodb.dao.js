import UserModel from "./models/user.model.js";
import bcrypt from 'bcrypt';
import { log } from "console";
import crypto from 'crypto';

export default class UserMongoDbDao {
    static async get(criteria = {}, opts = {}) {
        return UserModel.find(criteria, opts);
    }
    static async getById(uid) {
        return UserModel.findById(uid);
    }
    static async create(data) {
        return UserModel.create(data);
    }
    static async updateById(uid, data) {
        const criteria = { _id: uid };
        const operation = { $set: data }
        return UserModel.updateOne(criteria, operation);
    }
    static async deleteById(uid) {
        const criteria = { _id: uid };
        return UserModel.deleteOne(criteria);
    }

    static async deleteByEmail(email) {
        return UserModel.deleteOne({ email: email });
    }

    static async findByEmail(email) {
        return UserModel.findOne({ email });
    }

    /*     static async findByResetPasswordToken(token) {
            return UserModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });
        }
    
        static async updateResetPasswordFields(userId, resetToken, resetExpires) {
            return UserModel.findByIdAndUpdate(userId, {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires,
            }, { new: true }).exec();
        }
     */

    static async resetPassword(token, newPassword) {
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        }).exec();

        if (!user) {
            throw new Error('Token de restablecimiento de contraseña es inválido o ha expirado.');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        return user.save();
    }

    static async validateResetToken(token) {
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await UserModel.findOne({
            resetPasswordToken: hash,
            resetPasswordExpires: { $gt: Date.now() },
        }).exec();

        console.log('User validatereset: ', user);
        if (!user) {
            throw new Error('Token inválido o expirado.');
        }

        const hiddenEmail = user.email.replace(/(.{2}).+(@.+)/, "$1***$2");
        return { userId: user._id, email: hiddenEmail };
    }

}