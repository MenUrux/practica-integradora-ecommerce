import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
// passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
//   try {
//     const user = await UserModel.findById(jwt_payload.userId);
//     console.log(`Jwt payload: ${jwt_payload} `)
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   } catch (error) {
//     return done(error, false);
//   }
// }));


export const init = () => {
  const registerOpts = {
    usernameField: 'email',
    passReqToCallback: true,
  };

  passport.use('register', new LocalStrategy(registerOpts, async (req, email, password, done) => {
    console.log(`Login attempt with email: ${email}`);
    const {
      body: {
        first_name,
        last_name,
        age,
      },
    } = req;

    if (
      !first_name ||
      !last_name
    ) {
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
    done(null, newUser);
  }));

  const githubOptions = {
    clientID: 'Iv1.1a4383bb1989dbab',
    clientSecret: '7400e4b0bd201db777cd2427093059e7d2937eae',
    callbackURL: 'http://localhost:8080/api/sessions/github/callback',
  }

  passport.use('github', new GithubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken)
    console.log(profile)
    const email = profile._json.email;
    console.log(email)
    let user = await UserModel.findOne({ email });

    if (user) {
      return done(null, user);
    }
    user = {
      first_name: profile._json.name || 'GitHubUser',
      last_name: '',
      email,
      password: createHash('randomPassword'),
      age: 18,
    }


    try {
      const newUser = await UserModel.create(user);
      console.log(`Login attempt with email: ${user.email}`);
      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));


  const auth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: 'No deberias esatr aca' });
    }
    const payload = await validateToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'No deberias esatr aca' });
    }
    req.user = payload;
    next();
  }



  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await UserModel.findById(uid);
    done(null, user);
  });



} 