const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { 
      rejectUnauthorized: false,
    },
  });
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   host: 'smtp.gmail.com',
  //   auth: {
  //     user: 'muhammadnoumanhayat@gmail.com',
  //     pass: 'uojhtiobbnzyarfz' // naturally, replace both with your real credentials or an application-specific password
  //   }
  // });

  // 2) Define the email options
  const mailOptions = {
    from: "fitnessio@irfan-shahid.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  // const result = await transporter.sendMail(mailOptions);

  // console.log(result);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
};

module.exports = sendEmail;
