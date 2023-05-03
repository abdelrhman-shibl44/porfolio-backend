const nodemailer = require("nodemailer");
const hbs= require("nodemailer-express-handlebars");
require("dotenv").config();
exports.email = async(req,res) => {
  try {
    const {name,email,message}  = req.body
    console.log(name,email,message)
    // Create a transporter to send the email
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.Email,
        pass:process.env.Pass,
      }
    });
    // use template by handlebars
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".hbs",
          partialsDir: "./views/partials",
          layoutsDir: "./views/layouts",
          defaultLayout: "",
        },
        viewPath: "./views",
        extName: ".hbs",
      })
    );

    // send the email 
    let info = await transporter.sendMail({
      // from:email,
      sender: `${name} <${email}>`,
      to:"abdulrhman.mahmoud44@gmail.com",
      subject:`(Portfolio)New messgae from ${name}`,

      // html:html,
      template:"email",
      context: {
        name: name,
        email:email,
        message: message,
      },
      replyTo: email,
      // template:"home"
    });
    console.log("Message sent: %s",info.messageId)
    res.status(200).json({ status: "success", message: "Email sent successfully!" });

  }catch(err){
    console.log(err)
    res.status(500).json({ status: "error", message: "Error sending email" });
  }
}
