const PlanillaArmado = require("../models/PlanillaArmado");
const User = require("../models/User");


const planillaArmadoController = {

  newPlanillaArmado: async (req, res) => {
    try {
      const newPlanillaArmado = new PlanillaArmado({
        inputs: req.body.inputs,
        verified: req.body.verified,
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
      var id = newPlanillaArmado._id
      await User.findOneAndUpdate({ _id: req.body.idUser }, { $push: { planillaarmado: id } }, { new: true })
      await newPlanillaArmado.save();
      return res.status(200).send({ message: 'Planilla Armado created successfully' });

    } catch (error) {
      return res.status(500).send({ error: error.message });
    }

  },
  deleteForm: async (req, res) => {
    try {
      const formId = req.params.id; // Obtener el ID del registro a eliminar desde los parámetros de la solicitud
      const form = await PlanillaArmado.findByIdAndDelete(formId);

      if (!form) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Eliminar el ID de la carga de la lista de cargas del usuario
      await User.findOneAndUpdate(
        { _id: form.idUser },
        { $pull: { planillaarmado: formId } },
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
      const forms = await PlanillaArmado.find({ idUser: userId, status: { $ne: "" } });

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
      const updatedForm = await PlanillaArmado.findByIdAndUpdate(
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
      const cargaIndex = user.planillaarmado.findIndex((c) => c._id.toString() === formId);
      if (cargaIndex !== -1) {
        if (status !== undefined) {
          user.planillaarmado[cargaIndex].status = status;
        }
        if (motivo !== undefined) {
          user.planillaarmado[cargaIndex].motivo = motivo;
        }
        if (motivoRespuesta !== undefined) {
          user.planillaarmado[cargaIndex].motivoRespuesta = motivoRespuesta;
        }
        if (motivoPeticion !== undefined) {
          user.planillaarmado[cargaIndex].motivoPeticion = motivoPeticion;
        }
        if (typeof editEnabled === 'boolean') {
          user.planillaarmado[cargaIndex].editEnabled = editEnabled;
        }
        if (whoApproved !== undefined) {
          user.planillaarmado[cargaIndex].whoApproved = whoApproved;
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
      const existingForm = await PlanillaArmado.findById(formId);

      if (!existingForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Verificar si editEnabled es true en el formulario existente
      if (!existingForm.editEnabled) {
        return res.status(403).send({ message: "Editing is not allowed for this form" });
      }

      // Actualizar el formulario utilizando findByIdAndUpdate
      const updatedForm = await PlanillaArmado.findByIdAndUpdate(formId, formData, { new: true });

      if (!updatedForm) {
        return res.status(404).send({ message: "Form not found" });
      }

      // Actualizar la lista de formularios en el modelo User
      const user = await User.findOne({ _id: updatedForm.idUser });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Buscar el índice del formulario en la lista de formularios del usuario
      const formIndex = user.planillaarmado.indexOf(formId);

      // Reemplazar el formulario antiguo con el formulario actualizado
      if (formIndex !== -1) {
        user.planillaarmado.splice(formIndex, 1, updatedForm._id);
        await user.save();
      }

      return res.status(200).send({ message: "Form updated successfully", updatedForm });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
}

module.exports = planillaArmadoController