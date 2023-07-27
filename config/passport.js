const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')


// Cuando realice un pedido a una ruta protegida
module.exports = passport.use(new jwtStrategy({
  // extrae el token de la peticion que va a venir en la cabecera
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // interpretalo a la luz de mi frase secreta
  secretOrKey: process.env.SECRET_KEY
  // Una vez que ya lo tengas interpretado, decodificado e interpretado en el payload
}, (payload, done) => {
  // buscame el usuario con este id
  User.findById(payload._doc._id)
  .then(user => { 
  // Si no encuentra el usuario 
    if(!user){
      // No tengo error(null), no tengo usuario
      return done(null, false)
    }else{
      // No tengo error, si tengo usuario
      return done(null, user)
    }
  })
  .catch(error => {
  // Error en la promesa => Tengo error y no tengo usuario
    return done(error, false)
  })
}))
