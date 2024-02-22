import messageDao from '../dao/message.dao.js';

const messageController = {
    getAllMessages: async (req, res) => {
        try {
            const messages = await messageDao.getAllMessages();
            res.json(messages);
        } catch (error) {
            res.status(500).send('Error al obtener mensajes');
        }
    },

    getMessageById: async (req, res) => {
        try {
            const message = await messageDao.getMessageById(req.params.id);
            if (!message) {
                return res.status(404).send('Mensaje no encontrado');
            }
            res.json(message);
        } catch (error) {
            res.status(500).send('Error al obtener mensaje');
        }
    },

    createMessage: async (req, res) => {
        try {
            const newMessage = await messageDao.createMessage(req.body);
            res.status(201).json(newMessage);
        } catch (error) {
            res.status(500).send('Error al crear mensaje');
        }
    },

    updateMessage: async (req, res) => {
        try {
            const updatedMessage = await messageDao.updateMessage(req.params.id, req.body);
            if (!updatedMessage) {
                return res.status(404).send('Mensaje no encontrado');
            }
            res.json(updatedMessage);
        } catch (error) {
            res.status(500).send('Error al actualizar mensaje');
        }
    },

    deleteMessage: async (req, res) => {
        try {
            await messageDao.deleteMessage(req.params.id);
            res.status(200).send('Mensaje eliminado');
        } catch (error) {
            res.status(500).send('Error al eliminar mensaje');
        }
    }
};

export default messageController;
