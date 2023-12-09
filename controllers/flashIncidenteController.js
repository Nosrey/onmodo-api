const FlashIncidente = require("../models/FlashIncidente");
const User = require("../models/User");
const crypto = require('crypto')
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { Buffer } = require('buffer');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "capacitacion-onmodo",

    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, hash);
        const fileName = `${hash.toString('hex')}`;
        cb(null, fileName);
      });
    }
  })
});

const flashIncidenteController = {


  newFlashIncidente: async (req, res) => {
    try {
      const { fotografias= [], idUser, nombre } = req.body;

      console.log(req)
      // const planillaFile = req.file;

      // const fotografiasBuffer = Buffer.from(fotografias.replace(/^data:.+;base64,/, ''), 'base64');

      // const fotografiasFileName = `fotografias_${crypto.randomBytes(16).toString('hex')}.jpeg`;

      // await Promise.all([
      //   s3.putObject({
      //     Bucket: 'capacitacion-onmodo',
      //     Key: fotografiasFileName,
      //     Body: fotografiasBuffer,
      //     ContentEncoding: 'base64',
      //     ContentType: 'image/jpeg'
      //   }).promise(),
      //   // Subir la planilla directamente desde el archivo adjunto
      //   s3.upload({
      //     Bucket: 'capacitacion-onmodo',
      //     Key: planillaFile.originalname,
      //     Body: planillaFile.buffer,
      //     ContentType: planillaFile.mimetype
      //   }).promise()
      // ]);

      // const fotografiasFileUrl = `https://capacitacion-onmodo.s3.amazonaws.com/${fotografiasFileName}`;
      // const planillaFileUrl = `https://capacitacion-onmodo.s3.amazonaws.com/${planillaFile.originalname}`;

      // const newFlashIncidente = new FlashIncidente({
      //   // Incluir los demás campos necesarios para crear un nuevo incidente flash
      //   planilla: planillaFileUrl,
      //   fotografias: fotografiasFileUrl,
      //   idUser,
      //   nombre
      // });

      // const id = newFlashIncidente._id;

      // // Añadir el nuevo incidente flash a la lista de incidentes flash del usuario
      // await User.findOneAndUpdate(
      //   { _id: idUser },
      //   { $push: { flashincidente: id } },
      //   { new: true }
      // );

      // await newFlashIncidente.save();

      return res.status(200).send({ message: 'Incidente Flash creado exitosamente' });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  },

  deleteForm: async (req, res) => {
    try {
      const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
      const form = await FlashIncidente.findByIdAndDelete(formId);

      if (!form) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Eliminar el ID de la carga de la lista de cargas del usuario
      await User.findOneAndUpdate(
        { _id: form.idUser },
        { $pull: { flashincidente: formId } },
        { new: true }
      );

      return res.status(200).send({ message: "Form deleted successfully" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  getFormsByUserIdAndStatus: async (req, res) => {
    try {
      const userId = req.params.userId; // Obtener el ID del usuario desde los parámetros de la solicitud

      // Buscar todos los formularios del usuario con el estado no vacío
      const forms = await FlashIncidente.find({ idUser: userId, status: { $ne: "" } });

      if (!forms || forms.length === 0) {
        return res.status(404).send({ message: "No forms found for this user with non-empty status" });
      }

      return res.status(200).send({ forms });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  editFormProperties: async (req, res) => {
    try {
      const formId = req.params.formId; // Obtener el ID del formulario a editar desde los parámetros de la solicitud
      const { status, motivo, motivoRespuesta, motivoPeticion, editEnabled, whoApproved } = req.body; // Obtener las propiedades a modificar desde el cuerpo de la solicitud

      // Crear un objeto con las propiedades a modificar
      const updatedProperties = {};
      if (status !== undefined) {
        updatedProperties.status = status;
      }
      if (motivo !== undefined) {
        updatedProperties.motivo = motivo;
      }
      if (motivoRespuesta !== undefined) {
        updatedProperties.motivoRespuesta = motivoRespuesta;
      }
      if (motivoPeticion !== undefined) {
        updatedProperties.motivoPeticion = motivoPeticion;
      }
      if (typeof editEnabled === 'boolean') {
        updatedProperties.editEnabled = editEnabled;
      }
      if (whoApproved !== undefined) {
        updatedProperties.whoApproved = whoApproved;
      }

      // Actualizar el formulario utilizando findByIdAndUpdate con $set
      const updatedForm = await FlashIncidente.findByIdAndUpdate(
        formId,
        { $set: updatedProperties },
        { new: true }
      );

      if (!updatedForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Actualizar las propiedades correspondientes en el modelo User
      const user = await User.findOne({ _id: updatedForm.idUser });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Actualizar el formulario dentro de la lista de cargas del usuario
      const cargaIndex = user.flashincidente.findIndex((c) => c._id.toString() === formId);
      if (cargaIndex !== -1) {
        if (status !== undefined) {
          user.flashincidente[cargaIndex].status = status;
        }
        if (motivo !== undefined) {
          user.flashincidente[cargaIndex].motivo = motivo;
        }
        if (motivoRespuesta !== undefined) {
          user.flashincidente[cargaIndex].motivoRespuesta = motivoRespuesta;
        }
        if (motivoPeticion !== undefined) {
          user.flashincidente[cargaIndex].motivoPeticion = motivoPeticion;
        }
        if (typeof editEnabled === 'boolean') {
          user.flashincidente[cargaIndex].editEnabled = editEnabled;
        }
        if (whoApproved !== undefined) {
          user.flashincidente[cargaIndex].whoApproved = whoApproved;
        }

        await user.save();
      }

      return res.status(200).send({ message: "Form properties updated successfully", updatedForm });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  editFormById: async (req, res) => {
    try {
      const formId = req.params.formId; // Obtener el ID del formulario a editar desde los parámetros de la solicitud
      const formData = req.body; // Obtener los datos actualizados desde el cuerpo de la solicitud

      // Obtener el formulario existente
      const existingForm = await FlashIncidente.findById(formId);

      if (!existingForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Verificar si editEnabled es true en el formulario existente
      if (!existingForm.editEnabled) {
        return res.status(403).send({ message: "Editing is not allowed for this form" });
      }

      // Actualizar el formulario utilizando findByIdAndUpdate
      const updatedForm = await FlashIncidente.findByIdAndUpdate(formId, formData, { new: true });

      if (!updatedForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Actualizar la lista de formularios en el modelo User
      const user = await User.findOne({ _id: updatedForm.idUser });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Buscar el índice del formulario en la lista de formularios del usuario
      const formIndex = user.flashincidente.indexOf(formId);

      // Reemplazar el formulario antiguo con el formulario actualizado
      if (formIndex !== -1) {
        user.flashincidente.splice(formIndex, 1, updatedForm._id);
        await user.save();
      }

      return res.status(200).send({ message: "Form updated successfully", updatedForm });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
}

module.exports = flashIncidenteController