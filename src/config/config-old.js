import dotenv from 'dotenv';
dotenv.config();

export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  server: process.env.SERVER || localhost,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/practice',
  stripe_secret_token: process.env.STRIPE_SECRET_TOKEN
}