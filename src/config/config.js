import dotenv from 'dotenv';
dotenv.config();

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 8080,
  server: process.env.SERVER,
  mongodbUri: process.env.MONGODB_URI,
  stripe_secret_token: process.env.STRIPE_SECRET_TOKEN
}