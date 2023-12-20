const EntregaBidones = require("../models/EntregaBidones");
const User = require("../models/User");
const crypto = require('crypto')
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { Buffer } = require('buffer');
const { v4: uuidv4 } = require('uuid');

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
const entregaBidonesController = {

  newEntregaBidones: async (req, res) => {
    try {
      let {
        certificadoDisposicion = [],
        certificadoTransporte = [],
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
        businessName,
        idUser,
        rol,
        nombre
      } = req.body;
  
      // Comprobación de certificadoDisposicion y certificadoTransporte
      if (!certificadoDisposicion || !Array.isArray(certificadoDisposicion)) {
        certificadoDisposicion = [];
      }
  
      if (!certificadoTransporte || !Array.isArray(certificadoTransporte)) {
        certificadoTransporte = [];
      }
  
      const timestamp = Date.now();
  
      const disposicionPromises = certificadoDisposicion.map(async (base64String, index) => {
        if (base64String) {
          const newBuffer = Buffer.from(base64String.replace(/^data:.+;base64,/, ''), 'base64');
          const fileName = `disposicion_${timestamp}_${index + 1}_${uuidv4()}.jpeg`;
  
          await s3.putObject({
            Bucket: 'capacitacion-onmodo',
            Key: fileName,
            Body: newBuffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
          }).promise();
  
          const fileUrl = `https://capacitacion-onmodo.s3.amazonaws.com/${fileName}`;
          return fileUrl;
        } else {
          return null;
        }
      });
  
      const transportePromises = certificadoTransporte.map(async (base64String, index) => {
        if (base64String) {
          const newBuffer = Buffer.from(base64String.replace(/^data:.+;base64,/, ''), 'base64');
          const fileName = `transporte_${timestamp}_${index + 1}_${uuidv4()}.jpeg`;
  
          await s3.putObject({
            Bucket: 'capacitacion-onmodo',
            Key: fileName,
            Body: newBuffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
          }).promise();
  
          const fileUrl = `https://capacitacion-onmodo.s3.amazonaws.com/${fileName}`;
          return fileUrl;
        } else {
          return null;
        }
      });
  
      const [disposicionUrls, transporteUrls] = await Promise.all([
        Promise.all(disposicionPromises),
        Promise.all(transportePromises),
      ]);
  
      const entregaBidonesData = {
        certificadoDisposicion: disposicionUrls, // No filtrar nulls
        certificadoTransporte: transporteUrls, // No filtrar nulls
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
        businessName,
        idUser,
        rol,
        nombre,
      };
  
      const newEntregaBidones = new EntregaBidones(entregaBidonesData);
      await newEntregaBidones.save();
  
      await User.findOneAndUpdate(
        { _id: newEntregaBidones.idUser },
        { $push: { entregabidones: newEntregaBidones._id } },
        { new: true }
      );
  
      return res.status(200).send({ message: "Formulario de entrega de bidones creado exitosamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  },
  

  // Resto del código sin cambios...
  deleteForm: async (req, res) => {
    try {
      const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
      const form = await EntregaBidones.findByIdAndDelete(formId);

      if (!form) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Eliminar el ID de la carga de la lista de cargas del usuario
      await User.findOneAndUpdate(
        { _id: form.idUser },
        { $pull: { entregabidones: formId } },
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
      const forms = await EntregaBidones.find({ idUser: userId, status: { $ne: "" } });

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
      const updatedForm = await EntregaBidones.findByIdAndUpdate(
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
      const cargaIndex = user.entregabidones.findIndex((c) => c._id.toString() === formId);
      if (cargaIndex !== -1) {
        if (status !== undefined) {
          user.entregabidones[cargaIndex].status = status;
        }
        if (motivo !== undefined) {
          user.entregabidones[cargaIndex].motivo = motivo;
        }
        if (motivoRespuesta !== undefined) {
          user.entregabidones[cargaIndex].motivoRespuesta = motivoRespuesta;
        }
        if (motivoPeticion !== undefined) {
          user.entregabidones[cargaIndex].motivoPeticion = motivoPeticion;
        }
        if (typeof editEnabled === 'boolean') {
          user.entregabidones[cargaIndex].editEnabled = editEnabled;
        }
        if (whoApproved !== undefined) {
          user.entregabidones[cargaIndex].whoApproved = whoApproved;
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
      const existingForm = await EntregaBidones.findById(formId);
  
      if (!existingForm) {
        return res.status(404).send({ message: "Form not found" });
      }
  
      // Verificar si editEnabled es true en el formulario existente
      if (!existingForm.editEnabled) {
        return res.status(403).send({ message: "Editing is not allowed for this form" });
      }
      
  
      // Manejar la edición de archivos si hay cambios en los certificados de disposición
      if (
        formData.certificadoDisposicion &&
        Array.isArray(formData.certificadoDisposicion) &&
        formData.certificadoDisposicion.length > 0
      ) {
        // Verificar que todas las imágenes en formData.certificadoDisposicion sean strings base64 válidos
        const areAllBase64 = formData.certificadoDisposicion.every(
          (base64String) =>
            typeof base64String === "string" && base64String.startsWith("data:image/")
        );

        if (areAllBase64) {
          // Upload de nuevas fotografías solo si todas son strings base64 válidos
          const certificadoDisposicionUrls = formData.certificadoDisposicion.map(async (base64String, index) => {
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
          formData.certificadoDisposicion = (await Promise.all(certificadoDisposicionUrls)).filter(url => url !== null);
        } else {
          // Si no son todas strings base64 válidos, deja el array de fotografías sin cambios
          delete formData.certificadoDisposicion;
        }
      }
  
      // Manejar la edición de archivos si hay cambios en los certificados de transporte
      if (
        formData.certificadoTransporte &&
        Array.isArray(formData.certificadoTransporte) &&
        formData.certificadoTransporte.length > 0
      ) {
        // Verificar que todas las imágenes en formData.certificadoTransporte sean strings base64 válidos
        const areAllBase64 = formData.certificadoTransporte.every(
          (base64String) =>
            typeof base64String === "string" && base64String.startsWith("data:image/")
        );

        if (areAllBase64) {
          // Upload de nuevas fotografías solo si todas son strings base64 válidos
          const certificadoTransporteUrls = formData.certificadoTransporte.map(async (base64String, index) => {
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
          formData.certificadoTransporte = (await Promise.all(certificadoTransporteUrls)).filter(url => url !== null);
        } else {
          // Si no son todas strings base64 válidos, deja el array de fotografías sin cambios
          delete formData.certificadoTransporte;
        }
      }
      // Actualizar el formulario utilizando findByIdAndUpdate
      const updatedForm = await EntregaBidones.findByIdAndUpdate(formId, formData, { new: true });
  
      if (!updatedForm) {
        return res.status(404).send({ message: "Form not found" });
      }
  
      // Actualizar la lista de formularios en el modelo User
      const user = await User.findOne({ _id: updatedForm.idUser });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Buscar el índice del formulario en la lista de formularios del usuario
      const formIndex = user.entregabidones.indexOf(formId);
  
      // Reemplazar el formulario antiguo con el formulario actualizado
      if (formIndex !== -1) {
        user.entregabidones.splice(formIndex, 1, updatedForm._id);
        await user.save();
      }
  
      return res.status(200).send({ message: "Form updated successfully", updatedForm });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
}

module.exports = entregaBidonesController