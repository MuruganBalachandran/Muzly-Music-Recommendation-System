import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password using bcryptjs
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        throw new Error('Error hashing password');
    }
};

/**
 * Verifies a plain text password against a hashed password using bcryptjs
 * @param {string} password - The plain text password to check
 * @param {string} hash - The securely hashed password
 * @returns {Promise<boolean>} - True if they match, false otherwise
 */
export const verifyPassword = async (password, hash) => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (err) {
        throw new Error('Error verifying password');
    }
};
