import { __dirname } from '../utils/utils.js';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: "Documentacion de Ecommerce",
      description: "API de ecommerce."
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}