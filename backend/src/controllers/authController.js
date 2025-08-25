import User from '../models/User.js';
import process from 'process';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';
import { createExpiringTokenPair, hashToken } from '../utils/token.js';
import {
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendVerificationEmail,
} from '../services/emailQueue.js';
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
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
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
				await sendVerificationEmail(
					{ name: user.name, email: user.email },
					raw,
				);
			}
		}

		// Generate token
		const token = generateToken(user._id);
		setAuthCookie(res, token);

		// Send welcome email in background
		sendWelcomeEmail({
			name: user.name,
			email: user.email,
			username: user.username,
		});

		// Broadcast new member to community (real-time update)
		websocketService.broadcastNewMember(user);

		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				username: user.username,
				avatar: user.avatar,
				isVerified: user.isVerified,
				country: user.country || null, // ISO code
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
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

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials',
			});
		}

		// Check password
		const isMatch = await comparePassword(password, user.password);

		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials',
			});
		}

		if (!user.isVerified) {
			return res.status(403).json({
				success: false,
				message:
					'Email not verified. Please verify your email to continue.',
				needVerification: true,
			});
		}

		// Generate token
		const token = generateToken(user._id);
		setAuthCookie(res, token);

		res.status(200).json({
			success: true,
			message: 'Login successful',
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				username: user.username,
				avatar: user.avatar,
				isVerified: user.isVerified,
				isAdmin: user.isAdmin,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				username: user.username,
				avatar: user.avatar,
				isVerified: user.isVerified,
				isAdmin: user.isAdmin,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
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

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('+password');

		// Check current password
		if (!(await comparePassword(req.body.currentPassword, user.password))) {
			return res.status(401).json({
				success: false,
				message: 'Password is incorrect',
			});
		}

		// Hash new password
		user.password = await hashPassword(req.body.newPassword);
		await user.save();

		const token = generateToken(user._id);
		setAuthCookie(res, token);

		res.status(200).json({
			success: true,
			message: 'Password updated successfully',
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(200).json({
				success: true,
				message: 'If that email exists, a reset link has been sent.',
			});
		}
		const { raw, hashed, expire } = createExpiringTokenPair(60 * 60 * 1000);
		user.resetPasswordToken = hashed;
		user.resetPasswordExpire = new Date(expire);
		await user.save();
		sendPasswordResetEmail({ name: user.name, email: user.email }, raw);
		res.status(200).json({
			success: true,
			message: 'Password reset email sent',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
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
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid or expired token' });
		}
		user.password = await hashPassword(req.body.password);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();
		res.status(200).json({
			success: true,
			message: 'Password reset successful',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
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
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid or expired verification token',
			});
		}
		user.isVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpire = undefined;
		await user.save();
		res.status(200).json({
			success: true,
			message: 'Email verified successfully',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(200).json({
				success: true,
				message:
					'If that email exists, a verification link has been sent.',
			});
		if (user.isVerified)
			return res
				.status(200)
				.json({ success: true, message: 'Email already verified' });

		const now = Date.now();
		const cooldownMs = 60 * 1000; // 1 minute between resends
		if (
			user._lastVerificationResend &&
			now - user._lastVerificationResend.getTime() < cooldownMs
		) {
			return res.status(429).json({
				success: false,
				message:
					'Please wait before requesting another verification email.',
				retryAfterSeconds: Math.ceil(
					(cooldownMs -
						(now - user._lastVerificationResend.getTime())) /
						1000,
				),
			});
		}

		const { raw, hashed, expire } = createExpiringTokenPair(
			24 * 60 * 60 * 1000,
		);
		user.emailVerificationToken = hashed;
		user.emailVerificationExpire = new Date(expire);
		user._lastVerificationResend = new Date(); // transient metadata (not in schema yet but stored)
		await user.save();
		await sendVerificationEmail({ name: user.name, email: user.email }, raw);
		res.status(200).json({
			success: true,
			message: 'Verification email resent',
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};
