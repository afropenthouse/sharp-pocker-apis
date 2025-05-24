import nodemailer from "nodemailer"
import fs from "fs"
import handlebars from "handlebars"
import path from "path"



export const SignUpMail = async ({to,name,otp}:{to:string,name:string,otp:string})=>{
    const transporter = nodemailer.createTransport({ 
        host: process.env.EMAIL_HOST  as string,
        service:process.env.EMAIL_SERVICE as string,
        port:587,
        secure: false,
        auth:{
            user:process.env.EMAIL_USER ,
            pass:process.env.EMAIL_PASSWORD
        }
        })
        const sourcePath = path.join(__dirname,"..","templates","signup.html")
        const source = fs.readFileSync(sourcePath).toString()
        const template = handlebars.compile(source)
        const replacement = {
            name:`${name}`,
            otp
        }
        const mailOptions = {
            from: "olamilekan.obisesan1@gmail.com",
            to,
            subject: "Welcome to Sharp Pocket",
            html: template(replacement),
        };
        try {
            const val = await transporter.sendMail(mailOptions);
            console.log(val.response)
            return  val.response
        } catch (error) {
            console.log(error);
            return null
        }
    
}

export const ForgotPasswordMail = async ({to,otp}:{to:string,otp:string})=>{
    const transporter = nodemailer.createTransport({ 
        host: process.env.EMAIL_HOST  as string,
        service:process.env.EMAIL_SERVICE as string,
        port:587,
        secure: false,
        auth:{
            user:process.env.EMAIL_USER ,
            pass:process.env.EMAIL_PASSWORD
        }
        })
        const sourcePath = path.join(__dirname,"..","templates","reset.html")
        const source = fs.readFileSync(sourcePath).toString()
        const template = handlebars.compile(source)
        const replacement = {
            otp
        }
        const mailOptions = {
            from: "olamilekan.obisesan1@gmail.com",
            to,
            subject: "Reset Password Code",
            html: template(replacement),
        };
        try {
            const val = await transporter.sendMail(mailOptions);
            console.log(val.response)
            return  val.response
        } catch (error) {
            console.log(error);
            return null
        }
    
}

export const WelcomeMail = async ({to,name}:{to:string,name:string})=>{
    const transporter = nodemailer.createTransport({ 
        host: process.env.EMAIL_HOST  as string,
        service:process.env.EMAIL_SERVICE as string,
        port:587,
        secure: false,
        auth:{
            user:process.env.EMAIL_USER ,
            pass:process.env.EMAIL_PASSWORD
        }
        })
        const sourcePath = path.join(__dirname,"..","templates","welcome.html")
        const source = fs.readFileSync(sourcePath).toString()
        const template = handlebars.compile(source)
        const replacement = {
            name:`${name}`,
        }
        const mailOptions = {
            from: "olamilekan.obisesan1@gmail.com",
            to,
            subject: "Welcome to Sharp Pocket",
            html: template(replacement),
        };
        try {
            const val = await transporter.sendMail(mailOptions);
            console.log(val.response)
            return  val.response
        } catch (error) {
            console.log(error);
            return null
        }
    
}

