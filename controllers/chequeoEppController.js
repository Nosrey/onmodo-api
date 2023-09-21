const ChequeoEpp = require("../models/ChequeoEpp");
const User = require("../models/User");


const chequeoEppController = {


  newChequeo: async (req, res) => {
    try {
      const newChequeo = new ChequeoEpp({
        mes: req.body.mes,
        nombreEmpleado: req.body.nombreEmpleado,
        sector: req.body.sector,
        puesto: req.body.puesto,
        ropaTrabajo: req.body.ropaTrabajo,
        calzado: req.body.calzado,
        guantes: req.body.guantes,
        proteccionOcular: req.body.proteccionOcular,
        proteccionFacial: req.body.proteccionFacial,
        proteccionAuditiva: req.body.proteccionAuditiva,
        proteccionRespiratoria: req.body.proteccionRespiratoria,
        proteccionTronco: req.body.proteccionTronco,
        otro: req.body.otro,
        observaciones: req.body.observaciones,
        firma: req.body.firma,
        date: req.body.date,
        status: req.body.status,
        editEnabled: req.body.editEnabled,
        wasEdited: req.body.wasEdited,
        dateLastEdition: req.body.dateLastEdition,
        motivo: req.body.motivo,
        motivoPeticion: req.body.motivoPeticion,
        motivoRespuesta: req.body.motivoRespuesta,
        whoApproved: req.body.whoApproved,
        idUser: req.body.idUser
      });
      var id = newChequeo._id
      await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { chequeoepp: id } }, { new: true })
      await newChequeo.save();
      return res.status(200).send({ message: 'Chequeo created successfully' });

    } catch (error) {
      return res.status(500).send({ error: error.message });
    }

  },

  deleteForm: async (req, res) => {
    try {
      const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
      const form = await ChequeoEpp.findByIdAndDelete(formId);

      if (!form) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Eliminar el ID de la carga de la lista de cargas del usuario
      await User.findOneAndUpdate(
        { _id: form.idUser },
        { $pull: { chequeoepp: formId } },
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
      const forms = await ChequeoEpp.find({ idUser: userId, status: { $ne: "" } });

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
      const updatedForm = await ChequeoEpp.findByIdAndUpdate(
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
      const cargaIndex = user.chequeoepp.findIndex((c) => c._id.toString() === formId);
      if (cargaIndex !== -1) {
        if (status !== undefined) {
          user.chequeoepp[cargaIndex].status = status;
        }
        if (motivo !== undefined) {
          user.chequeoepp[cargaIndex].motivo = motivo;
        }
        if (motivoRespuesta !== undefined) {
          user.chequeoepp[cargaIndex].motivoRespuesta = motivoRespuesta;
        }
        if (motivoPeticion !== undefined) {
          user.chequeoepp[cargaIndex].motivoPeticion = motivoPeticion;
        }
        if (typeof editEnabled === 'boolean') {
          user.chequeoepp[cargaIndex].editEnabled = editEnabled;
        }
        if (whoApproved !== undefined) {
          user.chequeoepp[cargaIndex].whoApproved = whoApproved;
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
      const existingForm = await ChequeoEpp.findById(formId);

      if (!existingForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Verificar si editEnabled es true en el formulario existente
      if (!existingForm.editEnabled) {
        return res.status(403).send({ message: "Editing is not allowed for this form" });
      }

      // Actualizar el formulario utilizando findByIdAndUpdate
      const updatedForm = await ChequeoEpp.findByIdAndUpdate(formId, formData, { new: true });

      if (!updatedForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Actualizar la lista de formularios en el modelo User
      const user = await User.findOne({ _id: updatedForm.idUser });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Buscar el índice del formulario en la lista de formularios del usuario
      const formIndex = user.chequeoepp.indexOf(formId);

      // Reemplazar el formulario antiguo con el formulario actualizado
      if (formIndex !== -1) {
        user.chequeoepp.splice(formIndex, 1, updatedForm._id);
        await user.save();
      }

      return res.status(200).send({ message: "Form updated successfully", updatedForm });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
}

module.exports = chequeoEppController