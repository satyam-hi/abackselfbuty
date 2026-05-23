



// =======================================

import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // e.g., 'smtp.mailersend.net'
        port: 587, // e.g., 587 or 2525 //465 for true 
        secure: false, 
        auth: {
            user: "satyco2111@gmail.com",
            pass: "afnn mapu gfai pyzk", // App password
        },
    });

    await transporter.sendMail({
        from: "satyco2111@gmail.com",
        to,
        subject,
        text,
    });

    return true;
};



// finaly working code by riplit api ====================================

// import nodemailer from "nodemailer";

// export const sendEmail = async (to, subject, text) => {

//     const resp = await fetch('https://mynodeweb--satyco2111.replit.app/api/send-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             receiver_email: to,
//             text: text,
//             subject: subject
//         })
//     })
//     const data = await resp.json();

//     if (data.success) { return true; } else {

//         return false;
//     }
// };







// export const sendEmail = async (to, subject, text) => {
//   try {
//     const resp = await fetch(
//       "https://4c6e2aa4-9801-4d3d-aad1-dfd3d3d5f705-00-n9ysph1wwdzg.sisko.replit.dev/api/send-email",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           receiver_email: to,
//           subject,
//           text
//         })
//       }
//     );

//     if (!resp.ok) return false;

//     const data = await resp.json();
//     return data.success === true;
//   } catch (error) {
//     console.error("Email error:", error);
//     return false;
//   }
// };
