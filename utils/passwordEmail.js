const nodemailer = require('nodemailer');
require('dotenv').config({path: '.env'});

const SERVIDOR_SMTP = 'smtp.office365.com';
const USUARIO_SMTP = process.env.EMAIL;//'mauricioe.ramirez18@utim.edu.mx';
const PASSWORD_SMTP = process.env.PASSWORD;//'Maurice21$';

exports.passwordEmail = async (name, email, token) => {
  try {
    let transporter = nodemailer.createTransport({
      host: SERVIDOR_SMTP,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: USUARIO_SMTP, // generated ethereal user
        pass: PASSWORD_SMTP, // generated ethereal password
      },
    });

    let mensaje = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Recuperar contraseña</title>
      </head>
      <body>
        <h1>Hola, ${name}</h1>
        <b>Has solicitado restaurar tu contraseña,
        <a href="http://localhost:3000/recover-password/${token}">Haz clic aquí</a> para restaurar tu contraseña</b>
        </br>
        <b> o copia el siguiente enlace en tu navegador:<a href="http://localhost:3000/recover-password/${token}">http://localhost:3000/recover-password/${token}></a></b>
        </br>
        <b>El enlace es válido sólo por una hora desde su envío.</b>
      </body>
    </html>`;

    await transporter.sendMail({
      from: `${process.env.EMAIL_NAME_USER} <${process.env.EMAIL}>`, // sender address
      to: `${name}<${email}>`, // list of receivers: Juan Pérez<juan@algo.com>
      subject: "Recuperación de contraseña", // Subject line
      html: mensaje, // html body
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};