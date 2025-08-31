import User from '../models/User.js';
import process from 'process';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';
import { createExpiringTokenPair, hashToken } from '../utils/token.js';
import emailService from '../services/enhancedEmailService.js';
import websocketService from '../services/websocketService.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const setAuthCookie = (res, token) => {
	if (process.env.USE_HTTP_ONLY_COOKIES === 'true') {
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
	}
};

export const register = async (req, res) => {
	try {
		const { name, email, password, username, country } = req.body; // country expected as ISO code

		// Check if user exists
		const userExists = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (userExists) {
			return res.fail(400, 'User already exists', 'USER_EXISTS');
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Auto-verify users in test or when explicitly allowed
		const autoVerify = process.env.AUTO_VERIFY_USERS === 'true';
		// Create user (unverified by default unless autoVerify)
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			username,
			country: country?.toUpperCase(),
			isVerified: autoVerify,
		});

		// Generate email verification token if not auto verified.
		// If a token was already generated very recently (e.g., duplicate form submit), reuse it to avoid spamming.
		if (!user.isVerified) {
			const reuseWindowMs = 2 * 60 * 1000; // 2 minutes
			const now = Date.now();
			if (
				user.emailVerificationToken &&
				user.emailVerificationExpire &&
				now + reuseWindowMs < user.emailVerificationExpire.getTime()
			) {
				// Reuse existing token; do nothing (email already sent)
			} else {
				const { raw, hashed, expire } = createExpiringTokenPair(
					24 * 60 * 60 * 1000,
				);
				user.emailVerificationToken = hashed;
				user.emailVerificationExpire = new Date(expire);
				await user.save();
				await emailService.sendVerificationEmail(
					{ name: user.name, email: user.email },
					raw,
				);
			}
		}

		// Generate token
		const token = generateToken(user._id);
		setAuthCookie(res, token);

		// Send welcome email in background
		emailService.sendWelcomeEmail({
			name: user.name,
			email: user.email,
			username: user.username,
		});

		// Broadcast new member to community (real-time update)
		websocketService.broadcastNewMember(user);

		res.success(
			{
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					username: user.username,
					avatar: user.avatar,
					isVerified: user.isVerified,
					country: user.country || null,
				},
			},
			{ message: 'User registered successfully' },
			201,
		);
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check for user
		const user = await User.findOne({ email }).select('+password');

		if (!user)
			return res.fail(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

		// Check password
		const isMatch = await comparePassword(password, user.password);

		if (!isMatch)
			return res.fail(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

		// Previously unverified users were blocked with 403. Now we allow login
		// and simply include a flag so the frontend can show a gentle reminder.
		const needsVerification = !user.isVerified;

		// Generate token
		const token = generateToken(user._id);
		setAuthCookie(res, token);

		res.success(
			{
				token,
				needsVerification,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					username: user.username,
					avatar: user.avatar,
					isVerified: user.isVerified,
					isAdmin: user.isAdmin,
				},
			},
			{
				message: needsVerification
					? 'Login successful (email verification pending)'
					: 'Login successful',
			},
		);
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.fail(404, 'User not found', 'NOT_FOUND');
		res.success(
			{
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					username: user.username,
					avatar: user.avatar,
					isVerified: user.isVerified,
					isAdmin: user.isAdmin,
				},
			},
			{ message: 'User profile retrieved' },
		);
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res) => {
	try {
		const fieldsToUpdate = {
			name: req.body.name,
			email: req.body.email,
			username: req.body.username,
			bio: req.body.bio,
			speciality: req.body.speciality,
			location: req.body.location,
		};

		if (req.body.country) {
			fieldsToUpdate.country = req.body.country.toUpperCase();
		}

		const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
			new: true,
			runValidators: true,
		});
		if (!user) return res.fail(404, 'User not found', 'NOT_FOUND');
		res.success({ user }, { message: 'Details updated' });
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('+password');

		// Check current password
		if (!user) return res.fail(404, 'User not found', 'NOT_FOUND');
		const currentOk = await comparePassword(
			req.body.currentPassword,
			user.password,
		);
		if (!currentOk)
			return res.fail(401, 'Password is incorrect', 'PASSWORD_INCORRECT');

		// Hash new password
		user.password = await hashPassword(req.body.newPassword);
		await user.save();

		const token = generateToken(user._id);
		setAuthCookie(res, token);

		res.success({ token }, { message: 'Password updated successfully' });
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.success(null, {
				message: 'If that email exists, a reset link has been sent.',
			});
		const { raw, hashed, expire } = createExpiringTokenPair(60 * 60 * 1000);
		user.resetPasswordToken = hashed;
		user.resetPasswordExpire = new Date(expire);
		await user.save();
		await emailService.sendPasswordResetEmail(
			{ name: user.name, email: user.email },
			raw,
		);
		res.success(null, { message: 'Password reset email sent' });
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Reset password
// @route   POST /api/auth/resetpassword/:token
// @access  Public
export const resetPassword = async (req, res) => {
	try {
		const hashed = hashToken(req.params.token);
		const user = await User.findOne({
			resetPasswordToken: hashed,
			resetPasswordExpire: { $gt: Date.now() },
		}).select('+password');
		if (!user)
			return res.fail(400, 'Invalid or expired token', 'TOKEN_INVALID');
		user.password = await hashPassword(req.body.password);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();
		res.success(null, { message: 'Password reset successful' });
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res) => {
	try {
		const hashed = hashToken(req.params.token);
		const user = await User.findOne({
			emailVerificationToken: hashed,
			emailVerificationExpire: { $gt: Date.now() },
		});
		if (!user)
			return res.fail(
				400,
				'Invalid or expired verification token',
				'TOKEN_INVALID',
			);
		user.isVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpire = undefined;
		await user.save();
		res.success(null, { message: 'Email verified successfully' });
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
	globalThis.__resendAttempts = globalThis.__resendAttempts || [];
	const pushAttempt = (entry) => {
		globalThis.__resendAttempts.unshift(entry);
		if (globalThis.__resendAttempts.length > 300)
			globalThis.__resendAttempts.length = 300;
	};
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.success(null, {
				message:
					'If that email exists, a verification link has been sent.',
			});
		if (user.isVerified)
			return res.success(null, { message: 'Email already verified' });

		const now = Date.now();
		const cooldownMs = 30 * 1000; // 30 seconds between resends (reduced from 60)
		if (
			user._lastVerificationResend &&
			now - user._lastVerificationResend.getTime() < cooldownMs
		) {
			const remainingTime = Math.ceil(
				(cooldownMs - (now - user._lastVerificationResend.getTime())) /
					1000,
			);
			pushAttempt({
				ip: req.ip,
				email: req.body.email,
				status: 'rate_limited',
				remainingTime,
				ts: new Date().toISOString(),
			});
			return res.fail(
				429,
				`Please wait ${remainingTime} seconds before requesting another verification email.`,
				'RATE_LIMIT',
				{ retryAfterSeconds: remainingTime },
			);
		}

		const { raw, hashed, expire } = createExpiringTokenPair(
			24 * 60 * 60 * 1000,
		);
		user.emailVerificationToken = hashed;
		user.emailVerificationExpire = new Date(expire);
		user._lastVerificationResend = new Date(); // transient metadata (not in schema yet but stored)
		await user.save();

		try {
			await emailService.sendVerificationEmail(
				{ name: user.name, email: user.email },
				raw,
			);
			pushAttempt({
				ip: req.ip,
				email: user.email,
				status: 'sent',
				ts: new Date().toISOString(),
			});
			res.success(null, {
				message: 'Verification email sent successfully',
			});
		} catch (emailError) {
			console.error('Email sending failed:', emailError);
			pushAttempt({
				ip: req.ip,
				email: user.email,
				status: 'failed',
				error: emailError.message,
				ts: new Date().toISOString(),
			});
			res.success(null, {
				message:
					'Verification token generated. Please check email service configuration.',
				verifyUrl: `${
					process.env.FRONTEND_URL || 'http://localhost:3000'
				}/verify-email/${raw}`,
			});
		}
	} catch (error) {
		res.fail(500, 'Server error', 'SERVER', { detail: error.message });
	}
};

// @desc    Get recent verification resend attempts (diagnostics)
// @route   GET /api/auth/resend-attempts?email=optional
// @access  Private (admin in production - for now simple token check + isAdmin flag if user loaded upstream)
export const getResendAttempts = async (req, res) => {
	globalThis.__resendAttempts = globalThis.__resendAttempts || [];
	const emailFilter = req.query.email?.toLowerCase();
	let data = globalThis.__resendAttempts;
	if (emailFilter)
		data = data.filter((a) => a.email?.toLowerCase() === emailFilter);
	res.success({ attempts: data.slice(0, 50) }, { count: data.length });
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
export const deleteAccount = async (req, res) => {
	try {
		const { password } = req.body;
		const userId = req.user.id;

		// Get user with password for verification
		const user = await User.findById(userId).select('+password');
		if (!user) return res.fail(404, 'User not found', 'NOT_FOUND');

		// Verify password before deletion
		const isMatch = await comparePassword(password, user.password);
		if (!isMatch)
			return res.fail(
				401,
				'Incorrect password. Account deletion cancelled.',
				'PASSWORD_INCORRECT',
			);

		// Store user data for email before deletion
		const userData = {
			name: user.name,
			email: user.email,
			username: user.username,
		};

		// Delete user's cocktails first (to maintain referential integrity)
		const { default: Cocktail } = await import('../models/Cocktail.js');
		await Cocktail.deleteMany({ createdBy: userId });

		// Delete user's other related data (likes, comments, follows, etc.)
		// Import models dynamically to avoid circular dependencies
		try {
			const { default: Follow } = await import('../models/Follow.js');
			await Follow.deleteMany({
				$or: [{ follower: userId }, { following: userId }],
			});
		} catch (error) {
			console.warn(
				'Follow model not found or error deleting follows:',
				error.message,
			);
		}

		try {
			const { default: Favorite } = await import('../models/Favorite.js');
			await Favorite.deleteMany({ user: userId });
		} catch (error) {
			console.warn(
				'Favorite model not found or error deleting favorites:',
				error.message,
			);
		}

		// Finally delete the user account
		await User.findByIdAndDelete(userId);

		// Send account deletion confirmation email
		try {
			await emailService.sendAccountDeletionEmail(userData);
		} catch (emailError) {
			console.error('Failed to send account deletion email:', emailError);
			// Don't fail the deletion if email fails
		}

		console.log(
			`🗑️ User account deleted: ${userData.email} (${userData.username})`,
		);

		res.success(null, {
			message:
				'Account deleted successfully. A confirmation email has been sent.',
		});
	} catch (error) {
		console.error('Account deletion error:', error);
		res.fail(500, 'Server error during account deletion', 'SERVER', {
			detail: error.message,
		});
	}
};

// @desc    (Debug) Generate and return a fresh verification link (raw token) for a user
// @route   GET /api/auth/debug/verification-link?email=...&key=...
// @access  Protected via shared key (DEBUG_VERIFICATION_KEY)
