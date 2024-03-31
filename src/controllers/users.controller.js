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

    static async findByEmail(email) {
        const user = await UserDao.findByEmail(email);
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
            const user = await UserModel.findOne({ email });
            if (!user || !isValidPassword(password, user)) {
                return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
            }
            console.log(`userxxxxxxxx: `, user)
            await UserModel.findByIdAndUpdate(user._id, { last_connection: new Date() });

            const token = generateToken(user);
            res.status(200).json({ access_token: token });
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }


    static async getCurrentUser(req, res) {
    }

    static async logout(req, res) {
        const userId = req.user._id;
        console.log(userId)
        req.session.destroy(async (err) => {
            if (err) return res.status(500).send('Error al cerrar sesión.');

            await UserModel.findByIdAndUpdate(userId, { last_connection: new Date() });

            res.send('Sesión cerrada con éxito.');
        });
    }


    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(200).json({ message: 'Si estás registrado, recibiras un correo para recuperar la contraseña..' });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            const expireAt = Date.now() + 3600000;

            await UserModel.updateOne({ _id: user._id }, { resetToken, expireAt });

            const resetLink = `http://yourdomain.com/reset-password/${resetToken}`;
            await sendPasswordResetEmail(user.email, resetLink);

            res.status(200).json({ message: 'Por favor, verifica tu correo electrónico.' });
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }

    static async addDocumentsToUser(uid, userDocuments) {
        const user = await this.getById(uid);

        user.documents.push(...userDocuments);

        await user.save();

        return user;
    }


    static async updateToPremium(uid) {
        const user = await this.getById(uid);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.role === 'admin') {
            throw new Error('No puedes cambiar el rol a un usuario administrador.');
        }

        const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const hasAllDocuments = requiredDocuments.every(docName =>
            user.documents.some(doc => doc.name === docName)
        );
        if (hasAllDocuments) {
            user.role = 'premium';
            await user.save();
            return user;
        } else {
            throw new Error('No se ha terminado de procesar toda la documentación necesaria.');
        }
    }

    static async updateUserAvatar(uid, avatarPath) {
        const user = await UserModel.findByIdAndUpdate(uid, { avatar: avatarPath }, { new: true });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return user;
    }


}