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
    const uploadPromise = new Promise((resolve, reject) => {
      upload.single("certificado")(req, res, (err) => {
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
        comedor,
        inputs,
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
        idUser
      } = req.body;



      if (!req.file || !req.file.location) {
        throw new Error("No se ha proporcionado un archivo válido.");
      }

      const certificado = {}

      const newDietasEspeciales = new DietasEspeciales({
        comedor,
        inputs: [certificado], // Add "certificado" to the "inputs" array
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

      var id = newDietasEspeciales._id
      await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { registrocapacitacion: id } }, { new: true })
      await newRegistroCapacitacion.save();

      return res.status(200).send({ message: 'Registro Capacitacion successfully' });


    } catch (error) {
      console.log(error);
      return res.json({ success: false, error: error });
    }
  },

  
}

module.exports = dietasEspecialesController