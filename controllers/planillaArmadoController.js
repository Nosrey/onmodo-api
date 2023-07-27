const PlanillaArmado = require("../models/PlanillaArmado");
const User = require("../models/User");


const planillaArmadoController = {

    newPlanillaArmado: async (req, res) => {
        try {
            const newPlanillaArmado = new PlanillaArmado({
                inputs: req.body.inputs,
                verified: req.body.verified,
                date: req.body.date,
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

}

module.exports = planillaArmadoController