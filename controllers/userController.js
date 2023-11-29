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

  countUsersByBusiness: async (req, res) => {
    try {
      const businessName = req.params.business; // Obtener el nombre del business de los parámetros de la solicitud

      // Obtener todas las provincias únicas para el negocio
      const uniqueProvincias = await User.distinct('provincia', { business: businessName });

      // Utilizar la agregación de MongoDB para contar usuarios por provincia y obtener la cantidad de formularios por usuario
      const usersWithFormCounts = await User.aggregate([
        { $match: { business: businessName } }, // Filtrar por el business
        {
          $project: {
            _id: 1,
            provincia: 1,
            cargaCount: { $size: '$carga' },
            chequeoeppCount: { $size: '$chequeoepp' },
            controlalergenosCount: { $size: '$controlalergenos' },
            controlcloroCount: { $size: '$controlcloro' },
            controlequipofrioCount: { $size: '$controlequipofrio' },
            controlprocesoCount: { $size: '$controlproceso' },
            controlvidrioCount: { $size: '$controlvidrio' },
            descongelamientoCount: { $size: '$descongelamiento' },
            despachoproduccionCount: { $size: '$despachoproduccion' },
            distribucionCount: { $size: '$distribucion' },
            entregabidonesCount: { $size: '$entregabidones' },
            entregaropaCount: { $size: '$entregaropa' },
            flashincidenteCount: { $size: '$flashincidente' },
            informeintaccidenteCount: { $size: '$informeintaccidente' },
            planillaarmadoCount: { $size: '$planillaarmado' },
            recepcionCount: { $size: '$recepcion' },
            recuperacionproductoCount: { $size: '$recuperacionproducto' },
            registrocapacitacionCount: { $size: '$registrocapacitacion' },
            registrodecomisoCount: { $size: '$registrodecomiso' },
            registrosimulacroCount: { $size: '$registrosimulacro' },
            reporterechazoCount: { $size: '$reporterechazo' },
            saludmanipuladoresCount: { $size: '$saludmanipuladores' },
            sanitizacionCount: { $size: '$sanitizacion' },
            servicioenlineaCount: { $size: '$servicioenlinea' },
            usocambioaceiteCount: { $size: '$usocambioaceite' },
            verificacionbalanzaCount: { $size: '$verificacionbalanza' },
            verificaciontermometrosCount: { $size: '$verificaciontermometros' },
            recordatorioCount: { $size: '$recordatorio' },
          },
        },
      ]);

      // Crear un objeto con todas las provincias y establecer la cantidad de usuarios y formularios
      const provinciaCounts = uniqueProvincias.map((provincia) => {
        const usersInProvincia = usersWithFormCounts.filter((user) => user.provincia === provincia);
        return {
          provincia,
          usersCount: usersInProvincia.length,
          formulariosCount: usersInProvincia.reduce((total, user) => total +
            user.cargaCount + user.chequeoeppCount + user.controlalergenosCount +
            user.controlcloroCount + user.controlequipofrioCount + user.controlprocesoCount +
            user.controlvidrioCount + user.descongelamientoCount + user.despachoproduccionCount +
            user.distribucionCount + user.entregabidonesCount + user.entregaropaCount +
            user.flashincidenteCount + user.informeintaccidenteCount + user.planillaarmadoCount +
            user.recepcionCount + user.recuperacionproductoCount + user.registrocapacitacionCount +
            user.registrodecomisoCount + user.registrosimulacroCount + user.reporterechazoCount +
            user.saludmanipuladoresCount + user.sanitizacionCount + user.servicioenlineaCount +
            user.usocambioaceiteCount + user.verificacionbalanzaCount + user.verificaciontermometrosCount +
            user.recordatorioCount, 0),
        };
      });

      // Calcular la cantidad total de usuarios en el negocio y la cantidad total de formularios
      const totalUsers = usersWithFormCounts.length;
      const totalFormularios = usersWithFormCounts.reduce((total, user) => total +
        user.cargaCount + user.chequeoeppCount + user.controlalergenosCount +
        user.controlcloroCount + user.controlequipofrioCount + user.controlprocesoCount +
        user.controlvidrioCount + user.descongelamientoCount + user.despachoproduccionCount +
        user.distribucionCount + user.entregabidonesCount + user.entregaropaCount +
        user.flashincidenteCount + user.informeintaccidenteCount + user.planillaarmadoCount +
        user.recepcionCount + user.recuperacionproductoCount + user.registrocapacitacionCount +
        user.registrodecomisoCount + user.registrosimulacroCount + user.reporterechazoCount +
        user.saludmanipuladoresCount + user.sanitizacionCount + user.servicioenlineaCount +
        user.usocambioaceiteCount + user.verificacionbalanzaCount + user.verificaciontermometrosCount +
        user.recordatorioCount, 0);

      const totalFormCounts = {
        carga: usersWithFormCounts.reduce((total, user) => total + user.cargaCount, 0),
        chequeoepp: usersWithFormCounts.reduce((total, user) => total + user.chequeoeppCount, 0),
        controlalergenos: usersWithFormCounts.reduce((total, user) => total + user.controlalergenosCount, 0),
        controlcloro: usersWithFormCounts.reduce((total, user) => total + user.controlcloroCount, 0),
        controlequipofrio: usersWithFormCounts.reduce((total, user) => total + user.controlequipofrioCount, 0),
        controlproceso: usersWithFormCounts.reduce((total, user) => total + user.controlprocesoCount, 0),
        controlvidrio: usersWithFormCounts.reduce((total, user) => total + user.controlvidrioCount, 0),
        descongelamiento: usersWithFormCounts.reduce((total, user) => total + user.descongelamientoCount, 0),
        despachoproduccion: usersWithFormCounts.reduce((total, user) => total + user.despachoproduccionCount, 0),
        distribucion: usersWithFormCounts.reduce((total, user) => total + user.distribucionCount, 0),
        entregabidones: usersWithFormCounts.reduce((total, user) => total + user.entregabidonesCount, 0),
        entregaropa: usersWithFormCounts.reduce((total, user) => total + user.entregaropaCount, 0),
        flashincidente: usersWithFormCounts.reduce((total, user) => total + user.flashincidenteCount, 0),
        informeintaccidente: usersWithFormCounts.reduce((total, user) => total + user.informeintaccidenteCount, 0),
        planillaarmado: usersWithFormCounts.reduce((total, user) => total + user.planillaarmadoCount, 0),
        recepcion: usersWithFormCounts.reduce((total, user) => total + user.recepcionCount, 0),
        recuperacionproducto: usersWithFormCounts.reduce((total, user) => total + user.recuperacionproductoCount, 0),
        registrocapacitacion: usersWithFormCounts.reduce((total, user) => total + user.registrocapacitacionCount, 0),
        registrodecomiso: usersWithFormCounts.reduce((total, user) => total + user.registrodecomisoCount, 0),
        registrosimulacro: usersWithFormCounts.reduce((total, user) => total + user.registrosimulacroCount, 0),
        reporterechazo: usersWithFormCounts.reduce((total, user) => total + user.reporterechazoCount, 0),
        saludmanipuladores: usersWithFormCounts.reduce((total, user) => total + user.saludmanipuladoresCount, 0),
        sanitizacion: usersWithFormCounts.reduce((total, user) => total + user.sanitizacionCount, 0),
        servicioenlinea: usersWithFormCounts.reduce((total, user) => total + user.servicioenlineaCount, 0),
        usocambioaceite: usersWithFormCounts.reduce((total, user) => total + user.usocambioaceiteCount, 0),
        verificacionbalanza: usersWithFormCounts.reduce((total, user) => total + user.verificacionbalanzaCount, 0),
        verificaciontermometros: usersWithFormCounts.reduce((total, user) => total + user.verificaciontermometrosCount, 0),
        recordatorio: usersWithFormCounts.reduce((total, user) => total + user.recordatorioCount, 0),
      };

      // Ordenar los formularios por la cantidad total en orden descendente
      const sortedForms = Object.keys(totalFormCounts).sort((a, b) => totalFormCounts[b] - totalFormCounts[a]);

      // Tomar los nombres de los 3 formularios más utilizados
      const top3Forms = sortedForms.slice(0, 3);
      return res.json({ success: true, response: { business: businessName, top3Forms, provinciaCounts, totalUsers, totalFormularios } });
    } catch (error) {
      // Manejo de errores
      console.error(error);
      return res.json({ success: false, response: 'Ha ocurrido un error en el servidor' });
    }
  },

}

module.exports = userController