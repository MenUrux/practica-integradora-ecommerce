// passport.config.js
import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../dao/models/user.model.js'; // Ajusta la ruta según tu estructura
import { createHash, isValidPassword } from '../utils/utils.js'; // Ajusta la ruta según tu estructura

const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
  }, async (req, email, password, done) => {
    try {
      const { body: { first_name, last_name, age } } = req;
      if (!first_name || !last_name) {
        return done(new Error('Todos los campos son requeridos.'));
      }
      const user = await UserModel.findOne({ email });
      if (user) {
        return done(new Error(`Ya existe un usuario con el correo ${email} en el sistema.`));
      }
      const newUser = await UserModel.create({
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
      });
      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user || !isValidPassword(password, user)) {
        return done(new Error('Correo o contraseña invalidos.'));
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));


  passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          first_name: profile.displayName || 'GitHubUser',
          last_name: '',
          email,
          password: createHash('randomPassword'), // Considera un método más seguro para generar contraseñas
          age: 18, // Ajusta según sea necesario
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
