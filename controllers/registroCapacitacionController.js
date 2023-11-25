const RegistroCapacitacion = require("../models/RegistroCapacitacion");
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
const registroCapacitacionController = {

  newRegistroCapacitacion: async (req, res) => {
    const uploadPromise = new Promise((resolve, reject) => {
      upload.single("firma")(req, res, (err) => {
        console.log(req)

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
        fecha,
        tiempoDuracion,
        checkboxes,
        temas,
        materialEntregado,
        materialExpuesto,
        asistentes,
        observaciones,
        instructor,
        cargo,
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


      const newRegistroCapacitacion = new RegistroCapacitacion({
        fecha,
        tiempoDuracion,
        checkboxes,
        temas,
        materialEntregado,
        materialExpuesto,
        asistentes,
        observaciones,
        instructor,
        cargo,
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
        firma: req.file.location // Set the profile image URL from S3
      });
      var id = newRegistroCapacitacion._id
      await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { registrocapacitacion: id } }, { new: true })
      await newRegistroCapacitacion.save();

      return res.status(200).send({ message: 'Registro Capacitacion successfully' });


    } catch (error) {
      console.log(error);
      return res.json({ success: false, error: error });
    }
  },


  deleteForm: async (req, res) => {
    try {
      const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
      const form = await RegistroCapacitacion.findByIdAndDelete(formId);

      if (!form) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Eliminar el ID de la carga de la lista de cargas del usuario
      await User.findOneAndUpdate(
        { _id: form.idUser },
        { $pull: { registrocapacitacion: formId } },
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
      const forms = await RegistroCapacitacion.find({ idUser: userId, status: { $ne: "" } });

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
      const updatedForm = await RegistroCapacitacion.findByIdAndUpdate(
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
      const cargaIndex = user.registrocapacitacion.findIndex((c) => c._id.toString() === formId);
      if (cargaIndex !== -1) {
        if (status !== undefined) {
          user.registrocapacitacion[cargaIndex].status = status;
        }
        if (motivo !== undefined) {
          user.registrocapacitacion[cargaIndex].motivo = motivo;
        }
        if (motivoRespuesta !== undefined) {
          user.registrocapacitacion[cargaIndex].motivoRespuesta = motivoRespuesta;
        }
        if (motivoPeticion !== undefined) {
          user.registrocapacitacion[cargaIndex].motivoPeticion = motivoPeticion;
        }
        if (typeof editEnabled === 'boolean') {
          user.registrocapacitacion[cargaIndex].editEnabled = editEnabled;
        }
        if (whoApproved !== undefined) {
          user.registrocapacitacion[cargaIndex].whoApproved = whoApproved;
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
      upload.single("firma")(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(400).send({ error: "Error parsing form data" });
        }

        const formData = req.body; // Obtener los datos actualizados desde el cuerpo de la solicitud

        // Obtener el formulario existente
        const existingForm = await RegistroCapacitacion.findById(formId);

        if (!existingForm) {
          return res.status(404).send({ message: "Form not found" });
        }

        // Verificar si editEnabled es true en el formulario existente
        if (!existingForm.editEnabled) {
          return res.status(403).send({ message: "Editing is not allowed for this form" });
        }

        // Verificar si se proporciona una nueva imagen
        if (req.file && req.file.location) {
          // Eliminar la imagen anterior del bucket
          if (existingForm.firma) {
            const oldKey = existingForm.firma.split('/').pop();
            await s3.deleteObject({ Bucket: "capacitacion-onmodo", Key: oldKey }).promise();
          }

          // Actualizar la firma con la nueva URL de la imagen en S3
          formData.firma = req.file.location;
        }

        // Actualizar el formulario utilizando findByIdAndUpdate
        const updatedForm = await RegistroCapacitacion.findByIdAndUpdate(formId, formData, { new: true });

        if (!updatedForm) {
          return res.status(404).send({ message: "Form not found" });
        }

        // Actualizar la lista de formularios en el modelo User
        const user = await User.findOne({ _id: updatedForm.idUser });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        // Buscar el índice del formulario en la lista de formularios del usuario
        const formIndex = user.registrocapacitacion.indexOf(formId);

        // Reemplazar el formulario antiguo con el formulario actualizado
        if (formIndex !== -1) {
          user.registrocapacitacion.splice(formIndex, 1, updatedForm._id);
          await user.save();
        }

        return res.status(200).send({ message: "Form updated successfully", updatedForm });
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },


}

module.exports = registroCapacitacionController