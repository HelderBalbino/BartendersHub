import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import process from 'process';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

class EmailService {
	constructor() {
		// Allow disabling emails in tests or via flag
		if (
			process.env.NODE_ENV === 'test' ||
			process.env.EMAIL_DISABLE === 'true' ||
			process.env.EMAIL_SERVICE === 'none'
		) {
			this.service = 'disabled';
			console.warn('Email disabled in test or by configuration');
		} else {
			this.service = process.env.EMAIL_SERVICE || 'smtp';
			this.initializeService();
		}
	}

	initializeService() {
		switch (this.service) {
			case 'sendgrid':
				if (process.env.SENDGRID_API_KEY) {
					sgMail.setApiKey(process.env.SENDGRID_API_KEY);
					console.log('✅ SendGrid email service initialized');
				} else {
					console.warn('⚠️ SENDGRID_API_KEY not configured');
					this.fallbackToSMTP();
				}
				break;

			case 'smtp':
			default:
				this.fallbackToSMTP();
				break;
		}
	}

	fallbackToSMTP() {
		this.service = 'smtp';
		if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
			// Correct nodemailer API
			this.transporter = nodemailer.createTransport({
				host: process.env.EMAIL_HOST || 'smtp.gmail.com',
				port: parseInt(process.env.EMAIL_PORT) || 587,
				secure: false,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
				logger: process.env.EMAIL_DEBUG === 'true',
				debug: process.env.EMAIL_DEBUG === 'true',
			});
			console.log('✅ SMTP email service initialized');
		} else {
			console.warn('⚠️ Email service not configured');
		}
	}

	async sendEmail({ to, subject, html, text }) {
		const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
		const fromName = process.env.EMAIL_FROM_NAME || 'BartendersHub';

		try {
			if (this.service === 'disabled') {
				// No-op in test or when disabled by config
				if (process.env.EMAIL_DEBUG === 'true') {
					console.warn(
						`[email:disabled] to=${to} subject=${subject?.slice(0, 60)}`,
					);
				}
				return;
			}
			switch (this.service) {
				case 'sendgrid':
					await sgMail.send({
						to,
						from: {
							email: from,
							name: fromName,
						},
						subject,
						html,
						text: text || this.stripHtml(html),
					});
					console.log(`📧 Email sent via SendGrid to: ${to}`);
					break;

				case 'smtp':
					if (!this.transporter) {
						throw new Error('SMTP transporter not configured');
					}
					await this.transporter.sendMail({
						from: `"${fromName}" <${from}>`,
						to,
						subject,
						html,
						text: text || this.stripHtml(html),
					});
					console.log(`📧 Email sent via SMTP to: ${to}`);
					break;

				default:
					throw new Error(
						`Unsupported email service: ${this.service}`,
					);
			}
		} catch (error) {
			console.error(`❌ Failed to send email to ${to}:`, error.message);
			throw error;
		}
	}

	stripHtml(html) {
		return html.replace(/<[^>]*>/g, '');
	}

	async sendVerificationEmail(userData, verifyToken) {
		const frontendBase = this.getFrontendUrl();
		const verifyUrl = `${frontendBase}/verify-email/${verifyToken}`;

		const html = this.generateVerificationEmailTemplate(
			userData,
			verifyUrl,
		);

		await this.sendEmail({
			to: userData.email,
			subject: 'Verify your email - BartendersHub',
			html,
		});

		console.log(`🔐 Verification email sent to ${userData.email}`);
	}

	async sendWelcomeEmail(userData) {
		const html = this.generateWelcomeEmailTemplate(userData);

		await this.sendEmail({
			to: userData.email,
			subject: 'Welcome to BartendersHub! 🥃',
			html,
		});

		console.log(`👋 Welcome email sent to ${userData.email}`);
	}

	async sendPasswordResetEmail(userData, resetToken) {
		const frontendBase = this.getFrontendUrl();
		const resetUrl = `${frontendBase}/reset-password/${resetToken}`;
		const html = this.generatePasswordResetEmailTemplate(
			userData,
			resetUrl,
		);

		await this.sendEmail({
			to: userData.email,
			subject: 'Password Reset Request - BartendersHub',
			html,
		});

		console.log(`🔑 Password reset email sent to ${userData.email}`);
	}

	async sendAccountDeletionEmail(userData) {
		const html = this.generateAccountDeletionEmailTemplate(userData);

		await this.sendEmail({
			to: userData.email,
			subject: 'Account Deleted - BartendersHub',
			html,
		});

		console.log(
			`🗑️ Account deletion confirmation sent to ${userData.email}`,
		);
	}

	getFrontendUrl() {
		if (process.env.NODE_ENV === 'production') {
			return (
				process.env.FRONTEND_URL_PROD ||
				process.env.FRONTEND_URL ||
				'https://bartendershub.onrender.com'
			);
		}
		return process.env.FRONTEND_URL || 'http://localhost:3000';
	}

	generateVerificationEmailTemplate(userData, verifyUrl) {
		return `
			<div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: #f3f4f6; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
				<div style="border: 2px solid #fbbf24; padding: 30px; text-align: center;">
					<h1 style="color: #fbbf24; font-size: 28px; margin-bottom: 20px; letter-spacing: 2px;">🥃 BARTENDERSHUB</h1>
					<h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Verify Your Email</h2>
					<p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
						Welcome to BartendersHub, ${userData.name}! Click the button below to verify your email and start crafting liquid poetry.
					</p>
					<a href="${verifyUrl}" style="background: #fbbf24; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 16px; border: none; cursor: pointer; letter-spacing: 1px; display: inline-block; margin-bottom: 30px;">
						VERIFY EMAIL
					</a>
					<p style="color: #9ca3af; font-size: 14px; line-height: 1.4;">
						If the button doesn't work, copy and paste this link in your browser:<br>
						<span style="color: #fbbf24; word-break: break-all;">${verifyUrl}</span>
					</p>
					<p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
						This link will expire in 24 hours for security reasons.
					</p>
				</div>
			</div>
		`;
	}

	generateWelcomeEmailTemplate(userData) {
		return `
			<div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: #f3f4f6; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
				<div style="border: 2px solid #fbbf24; padding: 30px; text-align: center;">
					<h1 style="color: #fbbf24; font-size: 28px; margin-bottom: 20px; letter-spacing: 2px;">🥃 BARTENDERSHUB</h1>
					<h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Welcome to the Club!</h2>
					<p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
						Hello ${userData.name},<br><br>
						Welcome to BartendersHub - where sophistication meets artistry. You're now part of an exclusive community of master mixologists and cocktail enthusiasts.
					</p>
					<div style="background: rgba(251, 191, 36, 0.1); border: 1px solid #fbbf24; padding: 20px; margin: 20px 0;">
						<h3 style="color: #fbbf24; margin-bottom: 15px;">What's Next?</h3>
						<ul style="color: #d1d5db; text-align: left; line-height: 1.8;">
							<li>🍹 Browse our curated cocktail collection</li>
							<li>👥 Connect with fellow bartenders</li>
							<li>📝 Share your signature recipes</li>
							<li>⭐ Rate and review cocktails</li>
						</ul>
					</div>
					<p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
						Cheers to the beginning of your mixology journey!
					</p>
				</div>
			</div>
		`;
	}

	generatePasswordResetEmailTemplate(userData, resetUrl) {
		return `
			<div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: #f3f4f6; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
				<div style="border: 2px solid #fbbf24; padding: 30px; text-align: center;">
					<h1 style="color: #fbbf24; font-size: 28px; margin-bottom: 20px; letter-spacing: 2px;">🥃 BARTENDERSHUB</h1>
					<h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Password Reset Request</h2>
					<p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
						Hello ${userData.name},<br><br>
						We received a request to reset your password for your BartendersHub account. Click the button below to create a new password.
					</p>
					<a href="${resetUrl}" style="background: #fbbf24; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 16px; border: none; cursor: pointer; letter-spacing: 1px; display: inline-block; margin-bottom: 30px;">
						RESET PASSWORD
					</a>
					<p style="color: #9ca3af; font-size: 14px; line-height: 1.4;">
						If the button doesn't work, copy and paste this link in your browser:<br>
						<span style="color: #fbbf24; word-break: break-all;">${resetUrl}</span>
					</p>
					<p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
						This link will expire in 1 hour for security reasons.<br>
						If you didn't request this password reset, please ignore this email.
					</p>
				</div>
			</div>
		`;
	}

	generateAccountDeletionEmailTemplate(userData) {
		const currentDate = new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

		return `
			<div style="background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: #f3f4f6; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
				<div style="border: 2px solid #fbbf24; padding: 30px; text-align: center;">
					<h1 style="color: #fbbf24; font-size: 28px; margin-bottom: 20px; letter-spacing: 2px;">🥃 BARTENDERSHUB</h1>
					<h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Account Deleted</h2>
					<p style="color: #d1d5db; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
						Hello ${userData.name},<br><br>
						Your BartendersHub account has been successfully deleted as requested on ${currentDate}.
					</p>
					<div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; margin: 20px 0;">
						<h3 style="color: #ef4444; margin-bottom: 15px;">⚠️ What This Means</h3>
						<ul style="color: #d1d5db; text-align: left; line-height: 1.8; margin: 0; padding-left: 20px;">
							<li>Your account and all associated data have been permanently removed</li>
							<li>All your cocktail recipes and posts have been deleted</li>
							<li>Your profile and activity history are no longer accessible</li>
							<li>This action cannot be undone</li>
						</ul>
					</div>
					<div style="background: rgba(251, 191, 36, 0.1); border: 1px solid #fbbf24; padding: 20px; margin: 20px 0;">
						<h3 style="color: #fbbf24; margin-bottom: 15px;">💡 Want to Return?</h3>
						<p style="color: #d1d5db; text-align: left; line-height: 1.6; margin: 0;">
							You're always welcome back! Simply create a new account at any time to rejoin our community of master mixologists.
						</p>
					</div>
					<p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
						Thank you for being part of the BartendersHub community. We're sorry to see you go, and we hope to welcome you back someday.
					</p>
					<p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
						If you believe this deletion was done in error, please contact our support team immediately.
					</p>
				</div>
			</div>
		`;
	}
}

export default new EmailService();
