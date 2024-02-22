import fs from 'fs/promises';
import path from 'path';

class FileDao {
    constructor(directory) {
        this.directory = directory;
    }

    async readFile(filename) {
        const filePath = path.join(this.directory, filename);
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            throw new Error('Error al leer el archivo');
        }
    }

    async writeFile(filename, content) {
        const filePath = path.join(this.directory, filename);
        try {
            await fs.writeFile(filePath, content, 'utf8');
        } catch (error) {
            throw new Error('Error al escribir en el archivo');
        }
    }

    async updateFile(filename, content) {
        const filePath = path.join(this.directory, filename);
        try {
            await fs.writeFile(filePath, content, 'utf8');
        } catch (error) {
            throw new Error('Error al actualizar el archivo');
        }
    }

    async deleteFile(filename) {
        const filePath = path.join(this.directory, filename);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            throw new Error('Error al eliminar el archivo');
        }
    }
}

export default FileDao;
