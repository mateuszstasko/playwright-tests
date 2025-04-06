import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate that environment variables are loaded
const requiredEnvVars = [
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'INVALID_PASSWORD',
    'INVALID_EMAIL',
    'RANDOM_PASSWORD'
] as const;

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}\nPlease set these variables in your .env file.`);
}

interface Credentials {
    username: string;
    password: string;
}

interface TestConfig {
    baseUrl: string;
    apiUrl: string;
    credentials: {
        admin: Credentials;
        invalid: {
            validEmailInvalidPass: Credentials;
            invalidEmail: Credentials;
        };
    };
    timeouts: {
        short: number;
        medium: number;
        long: number;
        maxTimeout: number;
    };
}

// Type-safe environment variables
const env = {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    INVALID_PASSWORD: process.env.INVALID_PASSWORD!,
    INVALID_EMAIL: process.env.INVALID_EMAIL!,
    RANDOM_PASSWORD: process.env.RANDOM_PASSWORD!,
};

// Log environment variables for debugging (excluding sensitive data)
console.log('Environment variables loaded:', {
    ADMIN_USERNAME: env.ADMIN_USERNAME,
    INVALID_EMAIL: env.INVALID_EMAIL,
    // Not logging passwords for security
});

export const config: TestConfig = {
    // Environment URLs
    baseUrl: 'https://mailsubdomeny1.ast-stage-wobble.axence.net/',
    apiUrl: 'https://api.ast-stage-wobble.axence.net/',

    // Test Users
    credentials: {
        admin: {
            username: env.ADMIN_USERNAME,
            password: env.ADMIN_PASSWORD
        },
        invalid: {
            validEmailInvalidPass: {
                username: env.ADMIN_USERNAME,  // Using same email as admin
                password: env.INVALID_PASSWORD
            },
            invalidEmail: {
                username: env.INVALID_EMAIL,
                password: env.RANDOM_PASSWORD
            }
        }
    },

    // Timeouts (in milliseconds)
    timeouts: {
        short: 5000,      // For quick operations like clicks
        medium: 10000,    // For regular operations like page loads
        long: 30000,      // For slow operations like file uploads
        maxTimeout: 60000 // Maximum wait time for any operation
    }
}; 