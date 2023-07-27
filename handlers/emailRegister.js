const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util')
const emailConfig = require('../config/emailConfig');

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'joa12386@gmail.com',
      pass: 'hawmjzvbizlubsur',
    },
});

const htmlGenerate = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/${archivo}.pug`, opciones);
    return juice(html)
}

exports.enviar = async (opciones) => {
    const html = htmlGenerate(opciones.archivo, opciones)
    const text = htmlToText.htmlToText(html)

    var mailOptions = {
        from: 'OnMODO <no-reply@onmodo.com>',
        to: opciones.emailExists,
        subject: opciones.subject,
        text,
        html 
    }

    const enviarMail = util.promisify(transport.sendMail, transport)
    return enviarMail.call(transport, mailOptions)


}

