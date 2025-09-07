import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const MONGODB_URI =
	'mongodb+srv://helderbalbino:9YkUUH15OkZqGIII@bartendershub-cluster.54rchc8.mongodb.net/bartendershub?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		username: String,
		password: String,
		isVerified: { type: Boolean, default: false },
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

const User = mongoose.model('User', userSchema);

async function createAdmin() {
	console.log('Connecting to database...');
	await mongoose.connect(MONGODB_URI);

	const email = 'helderbalbino@googlemail.com';
	const password = 'H3lder06!';

	console.log('Checking for existing user...');
	let user = await User.findOne({ email });

	if (user) {
		console.log('User exists, promoting to admin...');
		user.isAdmin = true;
		user.isVerified = true;
		if (password) user.password = await bcryptjs.hash(password, 12);
		await user.save();
		console.log('✅ Promoted to admin:', email);
	} else {
		console.log('Creating new admin user...');
		user = await User.create({
			name: 'Helder Balbino',
			email: email,
			username: 'helderbalbino',
			password: await bcryptjs.hash(password, 12),
			isVerified: true,
			isAdmin: true,
		});
		console.log('✅ Created admin user:', email);
	}

	await mongoose.disconnect();
	console.log('Done!');
}

createAdmin().catch(console.error);
