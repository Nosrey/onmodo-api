const ControlAlergenos = require("../models/ControlAlergenos");
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

const controlAlergenosController = {


  newControlAlergenos: async (req, res) => {
    try {
      const { certificados = [], inputs, comedor, verified, date, status, editEnabled, wasEdited, dateLastEdition, motivo, motivoPeticion, motivoRespuesta, whoApproved, businessName, idUser, rol, nombre } = req.body;


      const certificadosUrls = certificados.map(async (base64String, index) => {
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
          return null; // o algún valor por defecto si lo prefieres
        }
      });
      
      const certificadosUrlsArray = (await Promise.all(certificadosUrls)).filter(url => url !== null);
      const newControlAlergenosData = {
        certificados: certificadosUrlsArray,
        inputs,
        comedor,
        verified,
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

      const newControlAlergenos = new ControlAlergenos(newControlAlergenosData);
      var id = newControlAlergenos._id;
      await User.findOneAndUpdate({ _id: idUser }, { $push: { controlalergenos: id } }, { new: true });
      await newControlAlergenos.save();

      return res.status(200).send({ message: 'Control Alergenos created successfully' });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  },
  getFormsByUserIdAndStatus: async (req, res) => {
    try {
      const userId = req.params.userId; // Obtener el ID del usuario desde los parámetros de la solicitud

      // Buscar todos los formularios del usuario con el estado no vacío
      const forms = await ControlAlergenos.find({ idUser: userId, status: { $ne: "" } });

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
      const updatedForm = await ControlAlergenos.findByIdAndUpdate(
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
      const cargaIndex = user.controlalergenos.findIndex((c) => c._id.toString() === formId);
      if (cargaIndex !== -1) {
        if (status !== undefined) {
          user.controlalergenos[cargaIndex].status = status;
        }
        if (motivo !== undefined) {
          user.controlalergenos[cargaIndex].motivo = motivo;
        }
        if (motivoRespuesta !== undefined) {
          user.controlalergenos[cargaIndex].motivoRespuesta = motivoRespuesta;
        }
        if (motivoPeticion !== undefined) {
          user.controlalergenos[cargaIndex].motivoPeticion = motivoPeticion;
        }
        if (typeof editEnabled === 'boolean') {
          user.controlalergenos[cargaIndex].editEnabled = editEnabled;
        }
        if (whoApproved !== undefined) {
          user.controlalergenos[cargaIndex].whoApproved = whoApproved;
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
  
      // Obtener el formulario existente
      const existingForm = await ControlAlergenos.findById(formId);
  
      if (!existingForm) {
        return res.status(404).send({ message: "Form not found" });
      }
  
      // Verificar si editEnabled es true en el formulario existente
      if (!existingForm.editEnabled) {
        return res.status(403).send({ message: "Editing is not allowed for this form" });
      }
  
      // Manejar la edición de archivos si hay cambios en los certificados
      if (formData.certificados && formData.certificados.length > 0) {
        const certificadosUrls = formData.certificados.map(async (base64String, index) => {
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
  
        const certificadosUrlsArray = (await Promise.all(certificadosUrls)).filter(url => url !== null);
        formData.certificados = certificadosUrlsArray;
      }
  
      // Actualizar el formulario utilizando findByIdAndUpdate
      const updatedForm = await ControlAlergenos.findByIdAndUpdate(formId, formData, { new: true });
  
      if (!updatedForm) {
        return res.status(404).send({ message: "Form not found" });
      }
  
      // Actualizar la lista de formularios en el modelo User
      const user = await User.findOne({ _id: updatedForm.idUser });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Buscar el índice del formulario en la lista de formularios del usuario
      const formIndex = user.controlalergenos.indexOf(formId);
  
      // Reemplazar el formulario antiguo con el formulario actualizado
      if (formIndex !== -1) {
        user.controlalergenos.splice(formIndex, 1, updatedForm._id);
        await user.save();
      }
  
      return res.status(200).send({ message: "Form updated successfully", updatedForm });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  deleteForm: async (req, res) => {
    try {
      const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
      const form = await ControlAlergenos.findByIdAndDelete(formId);

      if (!form) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Eliminar el ID de la carga de la lista de cargas del usuario
      await User.findOneAndUpdate(
        { _id: form.idUser },
        { $pull: { controlalergenos: formId } },
        { new: true }
      );

      return res.status(200).send({ message: "Form deleted successfully" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },


}

module.exports = controlAlergenosController