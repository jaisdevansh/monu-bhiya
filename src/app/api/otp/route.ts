import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Monu Chai Order Verification Code',
            text: `Your OTP for order verification is: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333 text-align: center;">Verify Your Order</h2>
                        <p style="font-size: 16px; color: #555;">Hi there,</p>
                        <p style="font-size: 16px; color: #555;">Use the following code to verify your Monu Chai order:</p>
                        <div style="background-color: #fce4ec; border: 1px solid #f8bbd0; color: #c2185b; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p style="font-size: 14px; color: #888;">If you didn't request this, please ignore this email.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
