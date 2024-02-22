export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  server: `${process.env.SERVER}` || localhost,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
}