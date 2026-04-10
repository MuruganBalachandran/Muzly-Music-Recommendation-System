import { AppError } from '../../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true, stripUnknown: true });
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new AppError(errorMessage, 400));
    }
    next();
};
