const InformeIntAccidente = require("../models/InformeIntAccidente");
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
    bucket: "informe-accidente-onmodo",

    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, hash);
        const fileName = `${hash.toString('hex')}`;
        cb(null, fileName);
      });
    }
  })
});

const InformeIntAccidenteController = {

  newInformeAccidente: async (req, res) => {
    const uploadPromise = new Promise((resolve, reject) => {
      upload.fields([{ name: 'denuncia' }, { name: 'firma' }])(req, res, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    try {
      await uploadPromise; // Esperar a que la carga de las imágenes se complete

      const {
        comedor,
        fecha,
        tipo,
        checkboxes,
        nombreapellido,
        cuil,
        fechaIngreso,
        puesto,
        hora,
        lugar,
        descripcion,
        checkboxesAccidente,
        lugarLesion,
        medidas,
        razon,
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
      } = req.body;

      let denunciaLocation = null;
      let firmaLocation = null;

      // Verificar si se proporcionaron archivos y obtener sus ubicaciones
      if (req.files['denuncia'] && req.files['denuncia'][0]) {
        denunciaLocation = req.files['denuncia'][0].location;
      }

      if (req.files['firma'] && req.files['firma'][0]) {
        firmaLocation = req.files['firma'][0].location;
      }

      // Crear un nuevo informe accidente con o sin ubicaciones de archivos
      const newInformeAccidente = new InformeIntAccidente({
        comedor,
        fecha,
        tipo,
        checkboxes,
        nombreapellido,
        cuil,
        fechaIngreso,
        puesto,
        hora,
        lugar,
        descripcion,
        checkboxesAccidente,
        lugarLesion,
        medidas,
        razon,
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
        denuncia: denunciaLocation,
        firma: firmaLocation,
      });

      const savedInformeAccidente = await newInformeAccidente.save();

      // Actualizar el usuario con el nuevo informe creado
      await User.findOneAndUpdate({ _id: idUser }, { $push: { informeintaccidente: savedInformeAccidente._id } }, { new: true });

      return res.status(200).send({ message: 'Informe de accidente creado exitosamente' });
    } catch (error) {
      console.log(error);
      return res.json({ success: false, error: error.message });
    }

  },

  deleteForm: async (req, res) => {
    try {
      const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
      const form = await InformeIntAccidente.findByIdAndDelete(formId);

      if (!form) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Eliminar el ID de la carga de la lista de cargas del usuario
      await User.findOneAndUpdate(
        { _id: form.idUser },
        { $pull: { informeintaccidente: formId } },
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
      const forms = await InformeIntAccidente.find({ idUser: userId, status: { $ne: "" } });

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
      const updatedForm = await InformeIntAccidente.findByIdAndUpdate(
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
      const cargaIndex = user.informeintaccidente.findIndex((c) => c._id.toString() === formId);
      if (cargaIndex !== -1) {
        if (status !== undefined) {
          user.informeintaccidente[cargaIndex].status = status;
        }
        if (motivo !== undefined) {
          user.informeintaccidente[cargaIndex].motivo = motivo;
        }
        if (motivoRespuesta !== undefined) {
          user.informeintaccidente[cargaIndex].motivoRespuesta = motivoRespuesta;
        }
        if (motivoPeticion !== undefined) {
          user.informeintaccidente[cargaIndex].motivoPeticion = motivoPeticion;
        }
        if (typeof editEnabled === 'boolean') {
          user.informeintaccidente[cargaIndex].editEnabled = editEnabled;
        }
        if (whoApproved !== undefined) {
          user.informeintaccidente[cargaIndex].whoApproved = whoApproved;
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

      // Use multer to parse the form data
      upload.fields([{ name: 'denuncia' }, { name: 'firma' }])(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: "Error parsing form data" });
        }

        const formData = req.body; // Obtener los datos actualizados desde el cuerpo de la solicitud

        // Obtener el formulario existente
        const existingForm = await InformeIntAccidente.findById(formId);

        if (!existingForm) {
          return res.status(404).send({ message: "Form not found" });
        }

        // Verificar si editEnabled es true en el formulario existente
        if (!existingForm.editEnabled) {
          return res.status(403).send({ message: "Editing is not allowed for this form" });
        }

        // Verificar si se proporcionaron archivos y obtener sus ubicaciones
        let denunciaLocation = existingForm.denuncia;
        let firmaLocation = existingForm.firma;

        if (req.files['denuncia'] && req.files['denuncia'][0]) {
          // Eliminar la imagen anterior de la denuncia del bucket
          if (existingForm.denuncia) {
            const oldDenunciaKey = existingForm.denuncia.split('/').pop();
            await s3.deleteObject({ Bucket: "informe-accidente-onmodo", Key: oldDenunciaKey }).promise();
          }
          denunciaLocation = req.files['denuncia'][0].location;
        }

        if (req.files['firma'] && req.files['firma'][0]) {
          // Eliminar la imagen anterior de la firma del bucket
          if (existingForm.firma) {
            const oldFirmaKey = existingForm.firma.split('/').pop();
            await s3.deleteObject({ Bucket: "informe-accidente-onmodo", Key: oldFirmaKey }).promise();
          }
          firmaLocation = req.files['firma'][0].location;
        }

        // Actualizar las ubicaciones de las imágenes en el formulario con las nuevas ubicaciones o las antiguas si no se proporcionaron nuevas imágenes
        formData.denuncia = denunciaLocation;
        formData.firma = firmaLocation;

        // Actualizar el formulario utilizando findByIdAndUpdate
        const updatedForm = await InformeIntAccidente.findByIdAndUpdate(formId, formData, { new: true });

        if (!updatedForm) {
          return res.status(404).send({ message: "Form not found" });
        }

        // Actualizar la lista de formularios en el modelo User
        const user = await User.findOne({ _id: updatedForm.idUser });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        // Buscar el índice del formulario en la lista de formularios del usuario
        const formIndex = user.informeintaccidente.indexOf(formId);

        // Reemplazar el formulario antiguo con el formulario actualizado
        if (formIndex !== -1) {
          user.informeintaccidente.splice(formIndex, 1, updatedForm._id);
          await user.save();
        }

        return res.status(200).send({ message: "Form updated successfully", updatedForm });
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
}

module.exports = InformeIntAccidenteController