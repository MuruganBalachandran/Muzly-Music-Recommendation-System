//region imports
import {
    getAllArtistsQuery,
    createArtistQuery,
    updateArtistQuery,
    deleteArtistQuery
} from '../../queries/artist/artistQueries.js';
import { catchAsync, sendSuccessResponse, AppError, CONSTANTS } from '../../utils/index.js';
import { logSystemActivity } from '../../utils/commonFunctions/activityLogger.js';
//endregion

//region controllers

//region getAllArtists
/**
 * @route GET /api/v1/artists
 */
export const getAllArtists = catchAsync(async (req, res) => {
    const artists = await getAllArtistsQuery();
    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Artists fetched', artists);
});
//endregion

//region createArtist
/**
 * @route POST /api/v1/artists (ADMIN)
 */
export const createArtist = catchAsync(async (req, res) => {
    const artist = await createArtistQuery(req.body);

    await logSystemActivity({
        user: req.user,
        action: 'Artist Created',
        resource: `Artist: ${artist.name}`,
        details: `Artist created by Admin: ${req.user.name}`,
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.CREATED, 'Artist created', artist);
});
//endregion

//region updateArtist
/**
 * @route PATCH /api/v1/artists/:id (ADMIN)
 */
export const updateArtist = catchAsync(async (req, res, next) => {
    const artist = await updateArtistQuery(req.params.id, req.body);
    if (!artist) return next(new AppError('Artist not found', 404));

    await logSystemActivity({
        user: req.user,
        action: 'Artist Updated',
        resource: `Artist: ${artist.name}`,
        details: `Artist updated by Admin: ${req.user.name}`,
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Artist updated', artist);
});
//endregion

//region deleteArtist
/**
 * @route DELETE /api/v1/artists/:id (ADMIN)
 */
export const deleteArtist = catchAsync(async (req, res, next) => {
    const artist = await deleteArtistQuery(req.params.id);
    if (!artist) return next(new AppError('Artist not found', 404));

    await logSystemActivity({
        user: req.user,
        action: 'Artist Deleted',
        resource: `Artist: ${artist.name}`,
        details: `Artist removed by Admin: ${req.user.name}`,
        status: 'success'
    });

    sendSuccessResponse(res, CONSTANTS.STATUS_CODES.OK, 'Artist deleted', null);
});
//endregion

//endregion
