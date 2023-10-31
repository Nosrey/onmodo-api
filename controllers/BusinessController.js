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



}

module.exports = businessController