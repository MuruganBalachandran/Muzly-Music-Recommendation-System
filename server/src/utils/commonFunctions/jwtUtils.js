import jwt from 'jsonwebtoken';
import { envVariables } from '../../config/index.js';

export const generateToken = (payload, expiresIn = '30d') => {
    return jwt.sign(payload, envVariables.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, envVariables.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or Expired JWT Token');
    }
};
