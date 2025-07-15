import Bull from 'bull';
import process from 'process';
import nodemailer from 'nodemailer';

// Initialize email queue (will work without Redis in development)
let emailQueue = null;

try {
	emailQueue = new Bull(
		'email queue',
		process.env.REDIS_URL || 'redis://localhost:6379',
	);
	console.log('✅ Email queue initialized');
} catch (error) {
	console.warn(
		'⚠️ Email queue disabled - Redis not available:',
		error.message,
	);
}

// Email transporter
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
	transporter = nodemailer.createTransporter({
		host: process.env.EMAIL_HOST || 'smtp.gmail.com',
		port: parseInt(process.env.EMAIL_PORT) || 587,
		secure: false,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	console.log('✅ Email transporter configured');
} else {
	console.warn(
		'⚠️ Email disabled - EMAIL_USER and EMAIL_PASSWORD not configured',
	);
}

// Process email jobs
if (emailQueue && transporter) {
	emailQueue.process(async (job) => {
		const { to, subject, template, data } = job.data;

		try {
			const emailContent = generateEmailContent(template, data);

			await transporter.sendMail({
				from: `"BartendersHub" <${process.env.EMAIL_USER}>`,
				to,
				subject,
				html: emailContent,
			});

			console.log(`📧 Email sent to: ${to}`);
		} catch (error) {
			console.error('Email sending failed:', error);
			throw error;
		}
	});
}

// Email template generator
const generateEmailContent = (template, data) => {
	const templates = {
		welcome: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #d4af37; text-align: center;">🥃 Welcome to BartendersHub!</h1>
				<p>Hi ${data.name},</p>
				<p>Welcome to BartendersHub - the premier platform for cocktail enthusiasts!</p>
				<p>Your account has been successfully created with username: <strong>${data.username}</strong></p>
				<p>Start exploring amazing cocktail recipes and connect with fellow mixologists.</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.FRONTEND_URL}"
					   style="background-color: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
						Explore Cocktails
					</a>
				</div>
				<p>Cheers!<br>The BartendersHub Team</p>
			</div>
		`,
		passwordReset: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #d4af37; text-align: center;">🔐 Password Reset</h1>
				<p>Hi ${data.name},</p>
				<p>You requested a password reset for your BartendersHub account.</p>
				<p>Click the button below to reset your password:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${data.resetUrl}"
					   style="background-color: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
						Reset Password
					</a>
				</div>
				<p>This link will expire in 1 hour.</p>
				<p>If you didn't request this, please ignore this email.</p>
				<p>Cheers!<br>The BartendersHub Team</p>
			</div>
		`,
		newFollower: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #d4af37; text-align: center;">👥 New Follower!</h1>
				<p>Hi ${data.name},</p>
				<p><strong>${data.followerName}</strong> is now following you on BartendersHub!</p>
				<p>Check out their profile and cocktail creations.</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${process.env.FRONTEND_URL}/users/${data.followerUsername}"
					   style="background-color: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
						View Profile
					</a>
				</div>
				<p>Cheers!<br>The BartendersHub Team</p>
			</div>
		`,
	};

	return templates[template] || '<p>Email template not found</p>';
};

// Email sending functions
export const sendWelcomeEmail = (userData) => {
	if (!emailQueue) {
		console.warn('Email queue not available - skipping welcome email');
		return;
	}

	emailQueue.add(
		'welcome',
		{
			to: userData.email,
			subject: 'Welcome to BartendersHub! 🥃',
			template: 'welcome',
			data: userData,
		},
		{
			delay: 1000, // Send after 1 second
			attempts: 3,
			backoff: 'exponential',
		},
	);
};

export const sendPasswordResetEmail = (userData, resetToken) => {
	if (!emailQueue) {
		console.warn(
			'Email queue not available - skipping password reset email',
		);
		return;
	}

	const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

	emailQueue.add(
		'passwordReset',
		{
			to: userData.email,
			subject: 'Password Reset Request - BartendersHub',
			template: 'passwordReset',
			data: {
				...userData,
				resetUrl,
			},
		},
		{
			attempts: 3,
			backoff: 'exponential',
		},
	);
};

export const sendNewFollowerNotification = (userData, followerData) => {
	if (!emailQueue) {
		console.warn(
			'Email queue not available - skipping follower notification',
		);
		return;
	}

	emailQueue.add(
		'newFollower',
		{
			to: userData.email,
			subject: `${followerData.name} is now following you! - BartendersHub`,
			template: 'newFollower',
			data: {
				name: userData.name,
				followerName: followerData.name,
				followerUsername: followerData.username,
			},
		},
		{
			delay: 5000, // Send after 5 seconds
			attempts: 2,
		},
	);
};

// Queue monitoring (optional)
if (emailQueue) {
	emailQueue.on('completed', (job) => {
		console.log(`✅ Email job ${job.id} completed`);
	});

	emailQueue.on('failed', (job, err) => {
		console.error(`❌ Email job ${job.id} failed:`, err.message);
	});
}

export default emailQueue;
