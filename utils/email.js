const nodemailer = require('nodemailer');

/**This is using the free version */
exports.sendEmail = async options => {
  // /**Create a transporter */
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
  // /**Define the email address */
  // const mailOptions = {
  //   from: 'Erick Waltson <erick@dev.io',
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  // };
  // /**Actually send the email */
  // await transporter.sendMail(mailOptions);
};

/**This is when using an actual domain */
exports.sendRealEmail = async function (emailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: 'Natours <info@easyconnectfaiba.co.ke>',
      to: emailOptions.email,
      subject: emailOptions.subject,
      html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Client Inquiry</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #24303F;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                background: #55c57a;
                color: white;
                padding: 15px;
                border-radius: 8px 8px 0 0;
                font-size: 20px;
                font-weight: bold;
              }
              .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
                line-height: 1.5;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #666;
                padding: 15px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                color: white;
                background: #3C50E0;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                Natours communication
              </div>
              <div class="content">
                <p><strong>Message:</strong> ${emailOptions.message}</p> <br>
                <p>If you are no longer a user at natoursor did not request a password reset  please ignore this message.</p>
              </div>
              <div class="footer">
                &copy; 2025 Natours
              </div>
            </div>
          </body>
          </html>
        `,
    });
  } catch (err) {
    console.log(err);
  }
};
