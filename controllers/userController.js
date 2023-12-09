const User = require("../models/User")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require("bcryptjs/dist/bcrypt")
const randomstring = require('randomstring');
const bcryptjs = require('bcryptjs');
const enviarMail = require('../handlers/email.js')
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "perfil-onmodo",

    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, hash);
        const fileName = `${hash.toString('hex')}`;
        cb(null, fileName);
      });
    }
  })
});
const userController = {

  register: async (req, res) => {
    const uploadPromise = new Promise((resolve, reject) => {
      upload.single("imgProfile")(req, res, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    try {
      await uploadPromise; // Wait for image upload to complete

      const {
        email,
        business,
        rol,
        fullName,
        number,
        legajo,
        puesto,
        provincia,
        localidad,
        contratoComedor,
        idChief
      } = req.body;

      // Check if the email already exists
      const emailExists = await User.findOne({ legajo: legajo });

      if (emailExists) {
        return res.json({
          success: false,
          errors: ["El usuario ya existe"],
          response: null
        });
      }

      const passRandom = randomstring.generate(8); // Generate a random 8-character password

      const newUser = new User({
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
        idChief,
        imgProfile: req.file ? req.file.location : null // Set the profile image URL from S3 if it exists
      });

      const newUserSaved = await newUser.save();

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
          imgProfile: newUserSaved.imgProfile
        });
      } else {
        // Handle the error if the forgotPassword function fails
        return res.json({
          success: false,
          errors: [forgotPasswordResult.message], // Assuming the message contains the error details
          response: null
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({ success: false, error: error });
    }
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

    User.find({ _id: id }).populate('carga').populate('chequeoepp').populate('controlalergenos').populate('controlcloro').populate('controlequipofrio').populate('controlproceso').populate('controlvidrio').populate('descongelamiento').populate('despachoproduccion').populate('distribucion').populate('entregabidones').populate('entregaropa').populate('flashincidente').populate('informeintaccidente').populate('planillaarmado').populate('recepcion').populate('recuperacionproducto').populate('registrocapacitacion').populate('registrodecomiso').populate('registrosimulacro').populate('reporterechazo').populate('saludmanipuladores').populate('sanitizacion').populate('servicioenlinea').populate('usocambioaceite').populate('verificacionbalanza').populate('verificaciontermometros').populate('recordatorio')
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

  editUser: async (req, res) => {
    try {
      const _id = req.params._id; // Obtener el ID del formulario a editar desde los parámetros de la solicitud

      // Use multer to parse the form data
      upload.single("imgProfile")(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: "Error parsing form data" });
        }

        const formData = req.body; // Obtener los datos actualizados desde el cuerpo de la solicitud

        // Obtener el formulario existente
        const existingForm = await User.findById(_id);

        if (!existingForm) {
          return res.status(404).send({ message: "Form not found" });
        }


        // Verificar si se proporciona una nueva imagen
        if (req.file && req.file.location) {
          // Eliminar la imagen anterior del bucket
          if (existingForm.imgProfile) {
            const oldKey = existingForm.imgProfile.split('/').pop();
            await s3.deleteObject({ Bucket: "perfil-onmodo", Key: oldKey }).promise();
          }

          formData.imgProfile = req.file.location;
        }

        // Actualizar el formulario utilizando findByIdAndUpdate
        const updatedForm = await User.findByIdAndUpdate(_id, formData, { new: true });

        if (!updatedForm) {
          return res.status(404).send({ message: "Form not found" });
        }

        return res.status(200).send({ message: "User updated successfully", updatedForm });
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
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
        const newToken = crypto.randomBytes(20).toString('hex'); // Define newToken here
        emailExists.token = newToken;
        emailExists.expirated = Date.now() + 600;
        await emailExists.save();

        const resetUrl = `https://onmodoapp.com/restablecer-contrasena/${emailExists.token}`;

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

  restablecerPassword: async (req, res) => {
    const { email } = req.body;

    const emailExists = await User.findOne({ email: email });

    if (!emailExists) {
      res.json({ success: false, response: 'Este correo no se encuentra' });
    } else {
      try {
        const newToken = crypto.randomBytes(20).toString('hex'); // Define newToken here
        emailExists.token = newToken;
        emailExists.expirated = Date.now() + 600;

        await emailExists.save();

        const resetUrl = `https://onmodoapp.com/restablecer-contrasena/${newToken}`; // Use newToken here

        await enviarMail.enviar({
          emailExists,
          subject: 'Establece tu contraseña',
          resetUrl,
          newToken,
          archivo: 'restablecer-pass'
        });
        return res.json({ success: true, message: 'Email enviado!' });
      } catch (error) {
        res.json({ success: false, response: error });
        console.log(error);
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

  },

  deleteUserByLegajo: async (req, res) => {
    try {
      const legajo = req.params.legajo; // Obtener el legajo de los parámetros de la solicitud
      const business = req.params.business; // Obtener el negocio de los parámetros de la solicitud

      // Buscar el usuario por legajo y business
      const user = await User.findOne({ legajo: legajo, business: business });

      if (!user) {
        // El usuario no se encontró
        return res.json({ success: false, response: 'Usuario no encontrado' });
      }

      // Eliminar el usuario
      await user.remove();

      return res.json({ success: true, response: 'Usuario eliminado exitosamente' });
    } catch (error) {
      // Manejo de errores
      console.error(error);
      return res.json({ success: false, response: 'Ha ocurrido un error en el servidor' });
    }
  },

  

}

module.exports = userController