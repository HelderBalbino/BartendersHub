#!/usr/bin/env node
// SendGrid setup test script
import dotenv from 'dotenv';
import process from 'process';
import emailService from '../src/services/enhancedEmailService.js';

// Load environment variables
dotenv.config();

async function testSendGridSetup() {
    console.log('🧪 Testing SendGrid Email Service Setup...');
    console.log('=======================================');
    
    // Check configuration
    console.log('📋 Configuration Check:');
    console.log('  EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'NOT SET');
    console.log('  SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET (' + process.env.SENDGRID_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
    console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
    console.log('  EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME || 'NOT SET');
    console.log('');
    
    if (!process.env.SENDGRID_API_KEY) {
        console.log('❌ SENDGRID_API_KEY not configured!');
        console.log('📝 Steps to fix:');
        console.log('   1. Go to https://app.sendgrid.com/settings/api_keys');
        console.log('   2. Create a new API key with Mail Send permission');
        console.log('   3. Add SENDGRID_API_KEY=your_api_key to your .env file');
        console.log('   4. Replace REPLACE_WITH_YOUR_SENDGRID_API_KEY in .env');
        return;
    }
    
    // Test email sending
    try {
        console.log('📧 Sending test verification email...');
        await emailService.sendVerificationEmail(
            {
                name: 'Helder Balbino',
                email: 'helderbalbino@googlemail.com'
            },
            'test_verification_token_123'
        );
        console.log('✅ Test email sent successfully!');
        console.log('📬 Check your inbox: helderbalbino@googlemail.com');
        
    } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
        
        if (error.message.includes('The provided authorization grant is invalid')) {
            console.log('🔑 API Key issue - check your SendGrid API key');
        } else if (error.message.includes('domain authentication')) {
            console.log('🏷️ Domain authentication required for production');
        }
    }
    
    console.log('');
    console.log('🔚 Test complete');
}

testSendGridSetup().catch(console.error);
