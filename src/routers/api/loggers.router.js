import { Router } from 'express';
import { addLogger } from '../../utils/logger.js';

const router = Router();


/* const loggerMessage = `${req.method} - route: ${req.url} - ${new Date().toLocaleTimeString()}` */

router.get('/', addLogger, (req, res) => {
  const time = new Date().toLocaleTimeString();
  const date = new Date().toDateString();
  const loggerMessage = `${date} ${time} - ${req.method} - route: ${req.url}`

  req.logger.fatal(loggerMessage)
  req.logger.error(loggerMessage)
  req.logger.warning(loggerMessage)
  req.logger.info(loggerMessage)
  req.logger.http(loggerMessage)
  req.logger.debug(loggerMessage)
  res.send('Prueba de logger realizada')
  console.log('------------')
});

export default router;
