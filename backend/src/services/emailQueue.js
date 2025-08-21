import Bull from 'bull';
import process from 'process';
import nodemailer from 'nodemailer';

// Initialize email queue (only if Redis is available)
let emailQueue = null;

// Check if Redis URL is provided
const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
	try {
		emailQueue = new Bull('email queue', redisUrl, {
			redis: {
				maxRetriesPerRequest: 1,
				retryDelayOnFailover: 1000,
				enableReadyCheck: false,
				lazyConnect: true,
			},
		});

		// Test connection
		emailQueue.client
			.ping()
			.then(() => {
				console.log('✅ Email queue initialized with Redis');
			})
			.catch((error) => {
				console.warn(
					'⚠️ Redis connection failed, email queue disabled:',
					error.message,
				);
				emailQueue = null;
			});
	} catch (error) {
		console.warn(
			'⚠️ Email queue disabled - Redis not available:',
			error.message,
		);
		emailQueue = null;
	}
} else {
	console.log(
		'✅ Email queue initialized (Redis optional - will process emails directly)',
	);
}

// Email transporter
let transporter = null;


// Configure transporter (typo fix: createTransport)
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
	transporter = nodemailer.createTransport({
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
		verifyEmail: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h1 style="color: #d4af37; text-align: center;">📧 Verify Your Email</h1>
				<p>Hi ${data.name},</p>
				<p>Thanks for signing up! Please confirm your email address by clicking the button below:</p>
				<div style="text-align: center; margin: 30px 0;">
					<a href="${data.verifyUrl}" style="background-color: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Verify Email</a>
				</div>
				<p>This link will expire in 24 hours.</p>
				<p>If you did not create an account, you can ignore this email.</p>
				<p>Cheers!<br>The BartendersHub Team</p>
			</div>
		`,
	};

	return templates[template] || '<p>Email template not found</p>';
};

// Email sending functions
// Direct email sending function (when Redis is not available)
const sendEmailDirect = async (to, subject, template, data) => {
	if (!transporter) {
		console.warn('⚠️ Email transporter not configured - skipping email');
		return;
	}

	try {
		const emailContent = generateEmailContent(template, data);

		await transporter.sendMail({
			from: `"BartendersHub" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			html: emailContent,
		});

		console.log(`📧 Email sent directly to: ${to}`);
	} catch (error) {
		console.error('Direct email sending failed:', error.message);
	}
};

export const sendWelcomeEmail = async (userData) => {
	if (emailQueue) {
		// Use queue if Redis is available
		emailQueue.add(
			'welcome',
			{
				to: userData.email,
				subject: 'Welcome to BartendersHub! 🥃',
				template: 'welcome',
				data: userData,
			},
			{
				delay: 1000,
				attempts: 3,
				backoff: 'exponential',
			},
		);
	} else {
		// Send directly if no Redis
		await sendEmailDirect(
			userData.email,
			'Welcome to BartendersHub! 🥃',
			'welcome',
			userData,
		);
	}
};

export const sendPasswordResetEmail = async (userData, resetToken) => {
	const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

	if (emailQueue) {
		// Use queue if Redis is available
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
	} else {
		// Send directly if no Redis
		await sendEmailDirect(
			userData.email,
			'Password Reset Request - BartendersHub',
			'passwordReset',
			{
				...userData,
				resetUrl,
			},
		);
	}
};

export const sendNewFollowerNotification = async (userData, followerData) => {
	if (emailQueue) {
		// Use queue if Redis is available
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
				delay: 5000,
				attempts: 2,
			},
		);
	} else {
		// Send directly if no Redis
		await sendEmailDirect(
			userData.email,
			`${followerData.name} is now following you! - BartendersHub`,
			'newFollower',
			{
				name: userData.name,
				followerName: followerData.name,
				followerUsername: followerData.username,
			},
		);
	}
};

export const sendVerificationEmail = async (userData, verifyToken) => {
	const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
	const payload = {
		to: userData.email,
		subject: 'Verify your email - BartendersHub',
		template: 'verifyEmail',
		data: { ...userData, verifyUrl },
	};
	if (emailQueue) {
		emailQueue.add('verifyEmail', payload, {
			attempts: 3,
			backoff: 'exponential',
		});
	} else {
		await sendEmailDirect(
			payload.to,
			payload.subject,
			payload.template,
			payload.data,
		);
	}
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
