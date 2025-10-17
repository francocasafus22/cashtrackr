import { transport } from "../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "CashTrackr <admin@cashtrackr.com>",
      to: user.email,
      subject: "CashTrackr - Confirma tu cuenta",
      html: `
      
      <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Cuenta</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        h1 { color: #333; }
        p { color: #555; margin: 20px 0; }
        .token {
          font-size: 1.5em;
          font-weight: bold;
          color: #1e90ff;
          padding: 10px 15px;
          border: 1px dashed #1e90ff;
          border-radius: 5px;
          display: inline-block;
          user-select: all;
        }
        a {
          margin-top: 30px;
          padding: 10px 20px;
          background-color: #1e90ff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
        }
        button:hover { background-color: #0c6fc0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hola ${user.name}, has creado tu cuenta en CashTrackr</h1>
        <p>Para activar tu cuenta, copia el siguiente token y pégalo en la página de confirmación:</p>
        <div class="token" id="token">${user.token}</div>
        <br>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
      </div>
      
    </body>
    </html>
  
      
      `,
    });

    console.log(`Mensaje enviado ${email.messageId}`);
  };

  static sendPasswordResetToken = async (user: EmailType) => {
    const email = await transport.sendMail({
      from: "CashTrackr <admin@cashtrackr.com>",
      to: user.email,
      subject: "CashTrackr - Restablecer tu Password",
      html: `
      
      <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablecer tu password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        h1 { color: #333; }
        p { color: #555; margin: 20px 0; }
        .token {
          font-size: 1.5em;
          font-weight: bold;
          color: #1e90ff;
          padding: 10px 15px;
          border: 1px dashed #1e90ff;
          border-radius: 5px;
          display: inline-block;
          user-select: all;
        }
        a {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #1e90ff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
        }
        button:hover { background-color: #0c6fc0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hola ${user.name}, has soliticitado restablecer tu constraseña en CashTrackr</h1>
        <p>Para restabelecer la contraseña, copia el siguiente token y pégalo en la página de confirmación:</p>
        <div class="token" id="token">${user.token}</div>
        <br>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Contraseña</a>
      </div>
    </body>
    </html>
  
      
      `,
    });

    console.log(`Mensaje enviado ${email.messageId}`);
  };
}
