//region imports
import {
    getAllLanguagesQuery,
    createLanguageQuery,
    updateLanguageQuery,
    deleteLanguageQuery
} from '../../queries/language/languageQueries.js';
import { catchAsync, sendSuccessResponse, AppError, CONSTANTS } from '../../utils/index.js';
import { logSystemActivity } from '../../utils/commonFunctions/activityLogger.js';
//endregion

//region controllers

//region getAllLanguages
/**
 * @route GET /api/v1/languages
 */
export const getAllLanguages = catchAsync(async (req, res) => {
    const languages = await getAllLanguagesQuery();
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Languages fetched', languages);
});
//endregion

//region createLanguage
/**
 * @route POST /api/v1/languages (ADMIN)
 */
export const createLanguage = catchAsync(async (req, res) => {
    const language = await createLanguageQuery(req.body);

    await logSystemActivity({
        user: req.user,
        action: 'Language Created',
        resource: `Language: ${language.name}`,
        details: `Language added by Admin: ${req.user.name}`,
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.CREATED, 'Language created', language);
});
//endregion

//region updateLanguage
/**
 * @route PATCH /api/v1/languages/:id (ADMIN)
 */
export const updateLanguage = catchAsync(async (req, res, next) => {
    const language = await updateLanguageQuery(req.params.id, req.body);
    if (!language) return next(new AppError('Language not found', 404));

    await logSystemActivity({
        user: req.user,
        action: 'Language Updated',
        resource: `Language: ${language.name}`,
        details: `Language updated by Admin: ${req.user.name}`,
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Language updated', language);
});
//endregion

//region deleteLanguage
/**
 * @route DELETE /api/v1/languages/:id (ADMIN)
 */
export const deleteLanguage = catchAsync(async (req, res, next) => {
    const language = await deleteLanguageQuery(req.params.id);
    if (!language) return next(new AppError('Language not found', 404));

    await logSystemActivity({
        user: req.user,
        action: 'Language Deleted',
        resource: `Language: ${language.name}`,
        details: `Language removed by Admin: ${req.user.name}`,
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Language deleted', null);
});
//endregion

//endregion
