import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from '../dao/models/user.model.js';


dotenv.config();

const jwtSecret = process.env.SESSION_SECRET; // Usar la variable de entorno
const jwtExpiration = '1h';

import UserDao from "../dao/user.mongodb.dao.js"

export default class UsersController {

    static async get(filter = {}, opts = {}) {
        const users = await UserDao.get(filter, opts);
        console.log(`Usuarios encontrados: ${users.length}`);
        return users;
    }

    static async getById(uid) {
        const user = await UserDao.getById(uid);
        if (user) {
            console.log(`Se encontro el usuario exitosamente ${JSON.stringify(user)}`);
        }
        return user;
    }

    static async create(data) {
        const user = await UserDao.create(data);
        console.log(`Se creo el usuario exitosamente ${JSON.stringify(user)}`);
        return user;
    }

    static async update(uid, data) {
        const updateResult = await UserDao.updateById(uid, data);
        if (updateResult.modifiedCount === 0) {
            return null;
        }
        const updatedUser = await UserDao.getById(uid);
        return updatedUser;
    }

    static async delete(uid) {
        const deleteResult = await UserDao.deleteById(uid);
        if (deleteResult) {
            console.log(`Usuario eliminado exitosamente.`);
        }
        return deleteResult;
    }

    static async login(req, res) {
        try {

            const { email, password } = req.body;

            try {
                const user = await UserModel.findOne({ email });
                if (!user || !isValidPassword(password, user)) {
                    return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
                }

                const token = generateToken(user);
                res.status(200).json({ access_token: token });
            } catch (error) {
                res.status(500).json({ message: 'Error interno del servidor.' });
            }
        } catch (error) {
            return res.status(500).send('Error al iniciar sesión.');
        }
    }


    static async getCurrentUser(req, res) {
    }

    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) return res.status(500).send('Error al cerrar sesión.');
            res.send('Sesión cerrada con éxito.');
        });

    }


    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link.' });
            }

            // Generate a unique token for password reset
            const resetToken = crypto.randomBytes(20).toString('hex');
            // Set the token's expiration time (e.g., 1 hour)
            const expireAt = Date.now() + 3600000; // 1 hour from now

            // Update the user's record with the reset token and its expiration time
            await UserModel.updateOne({ _id: user._id }, { resetToken, expireAt });

            // Send the password reset email
            const resetLink = `http://yourdomain.com/reset-password/${resetToken}`;
            await sendPasswordResetEmail(user.email, resetLink);

            res.status(200).json({ message: 'Password reset link has been sent if your email is registered.' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }



}