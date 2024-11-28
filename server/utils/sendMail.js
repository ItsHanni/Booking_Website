import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Khởi tạo dotenv
dotenv.config();

// Khởi tạo transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: '"LunaHotel" <no-reply@bookingluna.email>',
        to,
        subject : "Thông báo xác nhận đặt phòng",
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

// // Test email function (có thể để trong đây nếu cần kiểm tra)
// const testEmail = async () => {
//     const mailOptions = {
//         from: process.env.EMAIL_NAME,
//         to: 'han_2051220136@dau.edu.vn', // Địa chỉ email của bạn
//         subject: 'Test Email',
//         text: 'This is a test email from Node.js!',
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.error('Error sending email:', error);
//         }
//         console.log('Email sent:', info.response);
//     });
// };

// Uncomment dòng dưới đây để kiểm tra gửi email
// testEmail();



// import nodemailer from 'nodemailer'; 
// import asyncHandler from 'express-async-handler'; 

// const sendMail = asyncHandler(async ({ email, html }) => {
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_NAME,
//             pass: process.env.EMAIL_APP_PASSWORD,
//         },
//     });

//     let info = await transporter.sendMail({
//         from: '"LunaHotel" <no-reply@bookingluna.email>', 
//         to: email, 
//         subject: "Forgot password", 
//         html: html,
//     });

//     return info;
// });

// export default sendMail; 
// utils/sendMail.js
