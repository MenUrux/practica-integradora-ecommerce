import dotenv from 'dotenv';
import UserModel from '../dao/models/user.model.js';
import MailerAndSmsController from './mailer-and-sms.controller.js';


dotenv.config();

import UserDao from "../dao/user.mongodb.dao.js"

export default class UsersController {

    static async get(filter = {}, opts = {}) {
        const fields = 'first_name last_name email age role last_connection';
        const users = await UserDao.get(filter, { select: fields });
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

    static async findByResetPasswordToken(token) {
        const user = await UserDao.findByResetPasswordToken(token);
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

    static async logout(req, res) {
        const userId = req.user._id;
        console.log(userId)
        req.session.destroy(async (err) => {
            if (err) return res.status(500).send('Error al cerrar sesión.');

            await UserModel.findByIdAndUpdate(userId, { last_connection: new Date() });

            res.send('Sesión cerrada con éxito.');
        });
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

    static async deleteInactiveUsers(req, res) {
        try {
            const thresholdDate = new Date(new Date().getTime() - (30 * 60 * 1000));

            const inactiveUsers = await UserModel.find({
                last_connection: { $lt: thresholdDate },
                role: { $ne: 'admin' }
            });

            const deletionPromises = inactiveUsers.map(async (user) => {
                await MailerAndSmsController.sendInactivityEmail(user.email, user.first_name || user.last_name || 'Usuario');
                return UserModel.deleteOne({ _id: user._id });
            });

            await Promise.all(deletionPromises);

            res.status(200).json({ message: `Se han eliminado ${inactiveUsers.length} usuarios inactivos.` });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}