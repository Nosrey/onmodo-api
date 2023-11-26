const User = require("../models/User")
const crypto = require('crypto')
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const Business = require("../models/Business");

aws.config.update({
    accessKeyId: "AKIAV7USSIUL37JS7UEK",
    secretAccessKey: "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"
});

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "businessinfo-onmodo",

        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err, hash);
                const fileName = `${hash.toString('hex')}`;
                cb(null, fileName);
            });
        }
    })
});
const businessController = {

    newBusiness: async (req, res) => {
        const uploadPromise = new Promise((resolve, reject) => {
            upload.single("logo")(req, res, (err) => {
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
                name,
                linkDocumentacion
            } = req.body;

            // Check if the email already exists
            const nameExists = await Business.findOne({ name: name });

            if (nameExists) {
                return res.json({
                    success: false,
                    errors: ["La empresa ya existe"],
                    response: null
                });
            }

            if (!req.file || !req.file.location) {
                throw new Error("No se ha proporcionado una imagen válida.");
            }


            const newUser = new Business({
                name,
                linkDocumentacion,
                logo: req.file.location // Set the profile image URL from S3
            });

            const newUserSaved = await newUser.save();

            return res.json({ success: true, response: newUserSaved });


        } catch (error) {
            console.log(error);
            return res.json({ success: false, error: error });
        }
    },

    editBusiness: async (req, res) => {
        try {
            const _id = req.params._id; // Obtener el ID del formulario a editar desde los parámetros de la solicitud

            // Use multer to parse the form data
            upload.single("logo")(req, res, async (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ error: "Error parsing form data" });
                }

                const formData = req.body; // Obtener los datos actualizados desde el cuerpo de la solicitud

                // Obtener el formulario existente
                const existingForm = await Business.findById(_id);

                if (!existingForm) {
                    return res.status(404).send({ message: "Form not found" });
                }


                // Verificar si se proporciona una nueva imagen
                if (req.file && req.file.location) {
                    // Eliminar la imagen anterior del bucket
                    if (existingForm.logo) {
                        const oldKey = existingForm.logo.split('/').pop();
                        await s3.deleteObject({ Bucket: "businessinfo-onmodo", Key: oldKey }).promise();
                    }

                    formData.logo = req.file.location;
                }

                // Actualizar el formulario utilizando findByIdAndUpdate
                const updatedForm = await Business.findByIdAndUpdate(_id, formData, { new: true });

                if (!updatedForm) {
                    return res.status(404).send({ message: "Form not found" });
                }

                return res.status(200).send({ message: "Form updated successfully", updatedForm });
            });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    },


    getBusinessByName: async (req, res) => {
        try {
            const { name } = req.params;
            console.log(name)

            // Find the business by name
            const business = await Business.findOne({ name });

            if (!business) {
                return res.json({
                    success: false,
                    errors: ["Empresa no encontrada"],
                    response: null
                });
            }

            return res.json({ success: true, response: business });

        } catch (error) {
            console.log(error);
            return res.json({ success: false, error: error.message });
        }
    }

}

module.exports = businessController