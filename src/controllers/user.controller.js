import userDao from '../dao/user.dao.js';

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await userDao.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).send('Error al obtener usuarios');
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await userDao.getUserById(req.params.id);
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.json(user);
        } catch (error) {
            res.status(500).send('Error al obtener usuario');
        }
    },

    createUser: async (req, res) => {
        try {
            const newUser = await userDao.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).send('Error al crear usuario');
        }
    },

    updateUser: async (req, res) => {
        try {
            const updatedUser = await userDao.updateUser(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.json(updatedUser);
        } catch (error) {
            res.status(500).send('Error al actualizar usuario');
        }
    },

    deleteUser: async (req, res) => {
        try {
            await userDao.deleteUser(req.params.id);
            res.status(200).send('Usuario eliminado');
        } catch (error) {
            res.status(500).send('Error al eliminar usuario');
        }
    }
};

export default userController;
