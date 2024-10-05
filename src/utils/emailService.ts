
const nodemailer = require("nodemailer");
export class EmailService {

  private constructor() {}

  // public async emailSending(email: string, otp: string) {
  //   let transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //       user: "", // generated ethereal user
  //       pass: "", // generated ethereal password
  //   },
  //   });
    
  //   let information = {
  //   from: '', // sender address
  //   to: email, // list of receivers
  //   subject: "Token Verification", // Subject line
  //   text: otp, // plain text body
  //   };
    
      
  //   let info = await transporter.sendMail(information);

  //   console.log("Message sent: %s", info.messageId);
  //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //   // Preview only available when sending through an Ethereal account
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
  // }

}
