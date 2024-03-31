import { Router } from 'express';
import { buildResponsePaginated, siteUrl, upload, __dirname } from '../../utils/utils.js'
import path from 'path';
import fs from 'fs';

const router = Router();
const UPLOADS_DIRECTORY = path.join(__dirname, 'uploads');




router.get('/uploaded-files', (req, res) => {
  fs.readdir(UPLOADS_DIRECTORY, (err, files) => {
    if (err) {
      console.error("No se pudo listar el contenido del directorio.", err);
      res.status(500).send("Error al listar los archivos subidos.");
      return;
    }

    const filteredFiles = files.filter(file => !file.startsWith('.'));
    res.json(filteredFiles);
  });
});
export default router;


