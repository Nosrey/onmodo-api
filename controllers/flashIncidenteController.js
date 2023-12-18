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
      const {
        fotografias = [],
        fecha,
        hora,
        comedor,
        responsable,
        incidentePotencial,
        tipo,
        descripcion,
        acciones,
        planilla,
        date,
        status,
        editEnabled,
        wasEdited,
        dateLastEdition,
        motivo,
        motivoPeticion,
        motivoRespuesta,
        whoApproved,
        businessName,
        idUser,
        rol,
        nombre
      } = req.body;

      // Si fotografias es un array vacío, asigna un array vacío por defecto
      const fotografiasArray = Array.isArray(fotografias) ? fotografias : [];

      // Si planilla es un string vacío, asigna una cadena vacía por defecto
      const planillaString = typeof planilla === 'string' ? planilla : '';

      // Upload fotografias
      const fotografiasUrls = fotografiasArray.map(async (base64String, index) => {
        if (base64String) {
          const newBuffer = Buffer.from(base64String.replace(/^data:.+;base64,/, ''), 'base64');
          const fileName = `certificado_${index + 1}_${Date.now()}.jpeg`;

          await s3.putObject({
            Bucket: 'capacitacion-onmodo',
            Key: fileName,
            Body: newBuffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
          }).promise();

          const fileUrl = `https://capacitacion-onmodo.s3.amazonaws.com/${fileName}`;
          return fileUrl;
        } else {
          return null;
        }
      });

      // Upload planilla
      let planillaUrl = null;
      if (planillaString) {
        const planillaBuffer = Buffer.from(planillaString.replace(/^data:.+;base64,/, ''), 'base64');
        const planillaFileName = `planilla_${Date.now()}.jpeg`;

        await s3.putObject({
          Bucket: 'capacitacion-onmodo',
          Key: planillaFileName,
          Body: planillaBuffer,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'
        }).promise();

        planillaUrl = `https://capacitacion-onmodo.s3.amazonaws.com/${planillaFileName}`;
      }

      const fotografiasUrlsArray = (await Promise.all(fotografiasUrls)).filter(url => url !== null);

      const newFlashIncidenteData = {
        fotografias: fotografiasUrlsArray,
        planilla: planillaUrl,
        fecha,
        hora,
        responsable,
        incidentePotencial,
        tipo,
        descripcion,
        acciones,
        comedor,
        date,
        status,
        editEnabled,
        wasEdited,
        dateLastEdition,
        motivo,
        motivoPeticion,
        motivoRespuesta,
        whoApproved,
        businessName,
        idUser,
        rol,
        nombre
      };

      const newFlashIncidente = new FlashIncidente(newFlashIncidenteData);
      var id = newFlashIncidente._id;
      await User.findOneAndUpdate({ _id: idUser }, { $push: { flashincidente: id } }, { new: true });
      await newFlashIncidente.save();

      return res.status(200).send({ message: 'Flash Incidente created successfully' });

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
      const formId = req.params.formId;
      const formData = req.body;

      const existingForm = await FlashIncidente.findById(formId);

      if (!existingForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      if (!existingForm.editEnabled) {
        return res.status(403).send({ message: "Editing is not allowed for this form" });
      }

      // Verificar si formData.fotografias está presente y es un array
      if (
        formData.fotografias &&
        Array.isArray(formData.fotografias) &&
        formData.fotografias.length > 0
      ) {
        // Verificar que todas las imágenes en formData.fotografias sean strings base64 válidos
        const areAllBase64 = formData.fotografias.every(
          (base64String) =>
            typeof base64String === "string" && base64String.startsWith("data:image/")
        );

        if (areAllBase64) {
          // Upload de nuevas fotografías solo si todas son strings base64 válidos
          const fotografiasUrls = formData.fotografias.map(async (base64String, index) => {
            const newBuffer = Buffer.from(base64String.replace(/^data:.+;base64,/, ''), 'base64');
            const fileName = `certificado_${index + 1}_${Date.now()}.jpeg`;

            await s3.putObject({
              Bucket: 'capacitacion-onmodo',
              Key: fileName,
              Body: newBuffer,
              ContentEncoding: 'base64',
              ContentType: 'image/jpeg'
            }).promise();

            const fileUrl = `https://capacitacion-onmodo.s3.amazonaws.com/${fileName}`;
            return fileUrl;
          });

          // Esperar a que se completen todas las cargas y filtrar los URLs no nulos
          formData.fotografias = (await Promise.all(fotografiasUrls)).filter(url => url !== null);
        } else {
          // Si no son todas strings base64 válidos, deja el array de fotografías sin cambios
          delete formData.fotografias;
        }
      }

      // Verificar si formData.planilla está presente y es una cadena de base64 válida
      if (
        formData.planilla &&
        typeof formData.planilla === "string" &&
        formData.planilla.startsWith("data:image/")
      ) {
        // Upload de nueva planilla solo si es una cadena de base64 válida
        const planillaBuffer = Buffer.from(formData.planilla.replace(/^data:.+;base64,/, ''), 'base64');
        const planillaFileName = `planilla_${Date.now()}.jpeg`;

        await s3.putObject({
          Bucket: 'capacitacion-onmodo',
          Key: planillaFileName,
          Body: planillaBuffer,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'  // Cambiar el tipo MIME según el tipo de archivo de la planilla
        }).promise();

        formData.planilla = `https://capacitacion-onmodo.s3.amazonaws.com/${planillaFileName}`;
      } else {
        // Si no es una cadena de base64 válida, deja la propiedad planilla sin cambios
        delete formData.planilla;
      }

      // Actualizar el formulario utilizando findByIdAndUpdate
      const updatedForm = await FlashIncidente.findByIdAndUpdate(formId, { $set: formData }, { new: true });

      if (!updatedForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Actualizar la lista de formularios en el modelo User...
      // (el código relacionado con la actualización de la lista de formularios en el modelo User)

      return res.status(200).send({ message: "Form updated successfully", updatedForm });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
}

module.exports = flashIncidenteController