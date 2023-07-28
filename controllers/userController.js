const User = require("../models/User")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require("bcryptjs/dist/bcrypt")
const randomstring = require('randomstring');
const bcryptjs = require('bcryptjs');
const enviarMail = require('../handlers/email.js')


const userController = {
    register: async (req, res) => {
        var errors = [];
        const { email, business, rol, fullName, number, legajo, puesto, provincia, localidad, contratoComedor, idChief } = req.body;
        const emailExists = await User.findOne({ email: email });

        if (emailExists) {
            errors.push("El usuario ya existe");
        }

        if (errors.length === 0) {
            const passRandom = randomstring.generate(8); // Generar una contraseña aleatoria de 8 caracteres

            var newUser = new User({
                email,
                password: passRandom,
                business,
                puesto,
                rol,
                fullName,
                number,
                legajo,
                provincia,
                localidad,
                contratoComedor,
                idChief
            });

            var newUserSaved = await newUser.save();

            // Call the forgotPassword function and handle the response
            const forgotPasswordResult = await userController.forgotPassword(req, res);
            if (forgotPasswordResult.success) {
                return res.json({
                    success: true,
                    password: passRandom,
                    provincia: newUserSaved.provincia,
                    localidad: newUserSaved.localidad,
                    rol: newUserSaved.rol,
                    fullName: newUserSaved.fullName,
                    number: newUserSaved.number,
                    legajo: newUserSaved.legajo,
                    email: newUserSaved.email,
                    business: newUserSaved.business,
                    puesto: newUserSaved.puesto,
                });
            } else {
                // Handle the error if forgotPassword function fails
                return res.json({
                    success: false,
                    errors: [forgotPasswordResult.message], // Assuming the message contains the error details
                    response: null
                });
            }
        }

        return res.json({
            success: false,
            errors: errors,
            response: null
        });
    },
    login: async (req, res) => {
        try {
            const { legajo, password } = req.body

            const userExists = await User.findOne({ legajo: legajo })
            if (!userExists) {
                return res.json({ success: false, response: 'La contraseña o el legajo es incorrecto' })
            }

            let passwordMatches = false
            if (userExists.password.startsWith('$2')) {
                // Si el campo password comienza con "$2", asumimos que ya está hasheada
                passwordMatches = bcryptjs.compareSync(password, userExists.password)
            } else {
                // Si no está hasheada, comparamos la contraseña sin hashear con el campo password
                passwordMatches = password === userExists.password
            }

            if (!passwordMatches) {
                return res.json({ success: false, response: 'La contraseña o el legajo es incorrecto' })
            }

            var token = jwt.sign({ ...userExists }, process.env.SECRET_KEY, {})
            return res.json({ success: true, response: { idChief: userExists.idChief, business: userExists.business, fullName: userExists.fullName, number: userExists.number, localidad: userExists.localidad, provincia: userExists.provincia, legajo: userExists.legajo, email: userExists.email, token, id: userExists._id, rol: userExists.rol, contratoComedor: userExists.contratoComedor, puesto: userExists.puesto } })
        } catch (error) {
            // Manejo de errores
            console.error(error)
            return res.json({ success: false, response: 'Ha ocurrido un error en el servidor' })
        }
    },

    eachUser: (req, res) => {
        const id = req.params.id

        User.find({ _id: id }).populate('carga').populate('chequeoepp').populate('controlalergenos').populate('controlcloro').populate('controlequipofrio').populate('controlproceso').populate('controlvidrio').populate('descongelamiento').populate('despachoproduccion').populate('distribucion').populate('entregabidones').populate('entregaropa').populate('flashincidente').populate('informeintaccidente').populate('planillaarmado').populate('recepcion').populate('recuperacionproducto').populate('registrocapacitacion').populate('registrodecomiso').populate('registrosimulacro').populate('reporterechazo').populate('saludmanipuladores').populate('sanitizacion').populate('servicioenlinea').populate('usocambioaceite').populate('verificacionbalanza').populate('verificaciontermometros')
            .then(data => {
                // Si se encontraron datos, se devuelve una respuesta exitosa con los datos
                if (data.length > 0) {
                    return res.json({ success: true, response: data });
                } else {
                    // Si no se encontraron datos, se devuelve una respuesta con éxito falso
                    return res.json({ success: false });
                }
            })
            .catch(error => {
                return res.json({ success: false, error: error })
            })
    },


    allUsers: (req, res) => {
        User.find()
            .then(data => {
                return res.json({ success: true, response: data })
            })
            .catch(error => {
                return res.json({ success: false, error: error })
            })
    },

    logFromLStorage: async (req, res) => {
        res.json({ success: true, response: { token: req.body.token, business: req.user.business, id: req.user._id } })
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body;

        const emailExists = await User.findOne({ email: email });

        if (!emailExists) {
            return { success: false, message: 'Este correo no se encuentra' };
        } else {
            try {
                emailExists.token = crypto.randomBytes(20).toString('hex');
                emailExists.expirated = Date.now() + 600;

                await emailExists.save();

                const resetUrl = `http://localhost:3000/restablecer-contrasena/${emailExists.token}`;
                const newToken = emailExists.token

                await enviarMail.enviar({
                    emailExists,
                    subject: 'Establece tu contraseña',
                    resetUrl,
                    newToken,
                    archivo: 'restablecer-pass'
                });

                return { success: true, message: 'Email enviado!' };
            } catch (error) {
                console.error(error);
                return { success: false, message: error.message };
            }
        }
    },


    actualizarPassword: async (req, res) => {
        const usuario = await User.findOne({ token: req.params.token })

        try {
            usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
            usuario.token = null;
            usuario.expirated = null;

            await usuario.save()
            return res.json({ success: true, message: 'La contraseña se cambio, exitosamente.' })
        } catch (error) {
            res.json({ success: false, response: 'Este token es invalido' })
        }

    }

}

module.exports = userController