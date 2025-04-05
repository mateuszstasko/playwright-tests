export const config = {
    // Environment URLs
    baseUrl: 'https://mailsubdomeny1.ast-stage-wobble.axence.net/',
    apiUrl: 'https://api.ast-stage-wobble.axence.net/',  // if there's an API

    // Test Users
    credentials: {
        admin: {
            username: process.env.ADMIN_USERNAME || '',
            password: process.env.ADMIN_PASSWORD || ''
        },
        enduser: {
            username: process.env.USER_USERNAME || '',
            password: process.env.USER_PASSWORD || ''
        },
        invalid: {
            validEmailInvalidPass: {
                username: process.env.ADMIN_USERNAME || '',  // Using same email as admin
                password: process.env.INVALID_PASSWORD || ''
            },
            invalidEmail: {
                username: process.env.INVALID_EMAIL || '',
                password: process.env.RANDOM_PASSWORD || ''
            }
        }
    },

    // Timeouts (in milliseconds)
    timeouts: {
        short: 5000,      // For quick operations like clicks
        medium: 10000,    // For regular operations like page loads
        long: 30000,      // For slow operations like file uploads
        maxTimeout: 60000 // Maximum wait time for any operation
    },

    // Test Data
    testData: {
        validEmails: ['test@example.com', 'user@domain.com'],
        invalidEmails: ['invalid@', '@domain.com', 'plaintext'],
    },




}; 