const nodemailer= require('nodemailer');

let mailTransporter =
    nodemailer.createTransport(
        {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        }
);


const sendEmail=(subject,message, recievers)=>{
    const mailDetails = {
        from: process.env.EMAIL,
        to: recievers,
        subject: subject,
        text: message
    };

    mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs'+err);
            } else {
                console.log('Email sent successfully');
            }
        });
     
}

module.exports={sendEmail};