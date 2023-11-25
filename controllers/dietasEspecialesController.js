const DietasEspeciales = require("../models/DietasEspeciales");
const User = require("../models/User");
const crypto = require('crypto')
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
    bucket: "dietas-especiales-onmodo",

    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, hash);
        const fileName = `${hash.toString('hex')}`;
        cb(null, fileName);
      });
    }
  })
});
const dietasEspecialesController = {

  newDietasEspeciales: async (req, res) => {
    try {
      const { comedor, inputs, date, status, editEnabled, wasEdited, dateLastEdition, motivo, motivoPeticion, motivoRespuesta, whoApproved, rol, nombre, businessName, idUser } = req.body;

      // Cargar archivos de certificado utilizando Multer-S3
      const certificados = [];

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (!input.certificado) {
          throw new Error(`No se proporcionó un archivo válido en el objeto ${i + 1} del array "inputs".`);
        }

        const uploadPromise = new Promise((resolve, reject) => {
          upload.single(`certificado_${i}`)(req, res, (err) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });

        await uploadPromise; // Esperar a que se complete la carga del archivo

        if (!req.file || !req.file.location) {
          throw new Error(`La carga del archivo de certificado en el objeto ${i + 1} del array "inputs" no fue exitosa.`);
        }

        certificados.push({ url: req.file.location });
      }

      // Crear el nuevo objeto DietasEspeciales con los certificados
      const newDietasEspeciales = new DietasEspeciales({
        comedor,
        inputs: certificados, // Agregar los certificados al array "inputs"
        date,
        status,
        editEnabled,
        wasEdited,
        dateLastEdition,
        motivo,
        motivoPeticion,
        motivoRespuesta,
        whoApproved,
        rol,
        nombre,
        businessName,
        idUser,
      });

      await newDietasEspeciales.save(); // Guardar el registro de DietasEspeciales en la base de datos

      var id = newDietasEspeciales._id;
      // await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { registrocapacitacion: id } }, { new: true });

      return res.status(200).send({ message: 'dietas especiales creado exitosamente' });

    } catch (error) {
      console.log(error);
      return res.json({ success: false, error: error.message });
    }
  },

  
}

module.exports = dietasEspecialesController