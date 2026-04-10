//region imports
import { 
    getPaginatedSongsQuery, 
    createSongQuery, 
    updateSongQuery, 
    deleteSongQuery,
    getSongByIdQuery
} from '../../queries/song/songQueries.js';
import { catchAsync, sendSuccessResponse, AppError } from '../../utils/index.js';
import { logSystemActivity } from '../../utils/commonFunctions/activityLogger.js';
import SongModel from '../../models/song/SongModel.js';
import ArtistModel from '../../models/artist/ArtistModel.js';
import LanguageModel from '../../models/language/LanguageModel.js';
//endregion

//region exports

//region getSongs
/**
 * @route   GET /api/v1/songs
 * @desc    Get paginated songs with optional search.
 */
export const getSongs = catchAsync(async (req, res, next) => {
    // extract query params
    const limit = parseInt(req.query.limit) || 10; 
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const artist = req.query.artist;
    const language = req.query.language;

    // build filter object for exact matches
    const filters = {};
    if (artist) filters.artist = artist;
    if (language) filters.language = language;

    // execute optimized pagination query with aggregation
    const { total, data: songs } = await getPaginatedSongsQuery(search, filters, limit, skip);

    sendSuccessResponse(res, 200, 'Songs retrieved successfully', {
        count: songs.length,
        total,
        page,
        data: songs
    });
});
//endregion

//region playSong
/**
 * @route   GET /api/v1/songs/play/:id
 * @desc    Streams binary audio data from MongoDB.
 */
export const playSong = catchAsync(async (req, res, next) => {
    // identify song by id
    const { id } = req.params;
    const song = await SongModel.findById(id);

    if (!song || !song.audioData) {
        return next(new AppError('Song not found or audio data missing', 404));
    }

    const audioBuffer = song.audioData;
    const totalSize = audioBuffer.length;
    const range = req.headers.range;

    // handle range requests for seeking
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

        if (start >= totalSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + totalSize);
            return;
        }

        const chunksize = (end - start) + 1;
        const head = {
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg',
        };

        res.writeHead(206, head);
        res.end(audioBuffer.slice(start, end + 1));
    } else {
        const head = {
            'Content-Length': totalSize,
            'Content-Type': 'audio/mpeg',
            'Accept-Ranges': 'bytes',
        };
        res.writeHead(200, head);
        res.end(audioBuffer);
    }
});
//endregion

//region Admin CRUD Operations

//region createSong
/**
 * @route   POST /api/v1/songs
 * @desc    Admin: Add a new song to the database.
 */
export const createSong = catchAsync(async (req, res, next) => {
    // 1. Prepare song data from body
    const songData = { ...req.body };
    
    // 2. Handle audio file if present
    if (req.file) {
        songData.audioData = req.file.buffer;
        songData.audio_path = 'internal://buffer'; // indicator
    }

    // 3. Ensure Artist and Language exist
    const artistName = songData.artist || songData.artist_name;
    const langName = songData.language;

    if (artistName) {
        await ArtistModel.findOneAndUpdate(
            { name: artistName },
            { $setOnInsert: { name: artistName } },
            { upsert: true, new: true }
        );
    }

    if (langName) {
        await LanguageModel.findOneAndUpdate(
            { name: langName },
            { $setOnInsert: { name: langName } },
            { upsert: true, new: true }
        );
    }

    // 4. Create track
    const newSong = await createSongQuery(songData);
    
    await logSystemActivity({
        user: req.user,
        action: 'Song Created',
        resource: `Song: ${newSong.songname || newSong.title || 'New Song'}`,
        details: `Song added by Admin: ${req.user.name}`,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || 'Unknown'
    });

    sendSuccessResponse(res, 201, 'Song created successfully', newSong);
});
//endregion

//region updateSong
/**
 * @route   PATCH /api/v1/songs/:id
 * @desc    Admin: Edit an existing song.
 */
export const updateSong = catchAsync(async (req, res, next) => {
    const updatedSong = await updateSongQuery(req.params.id, req.body);
    
    if (!updatedSong) {
        return next(new AppError('No song found with that ID', 404));
    }

    await logSystemActivity({
        user: req.user,
        action: 'Song Updated',
        resource: `Song: ${updatedSong.songname || updatedSong.title || 'Existing Song'}`,
        details: `Song updated by Admin: ${req.user.name}`,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || 'Unknown'
    });

    sendSuccessResponse(res, 200, 'Song updated successfully', updatedSong);
});
//endregion

//region deleteSong
/**
 * @route   DELETE /api/v1/songs/:id
 * @desc    Admin: Delete a song from the database.
 */
export const deleteSong = catchAsync(async (req, res, next) => {
    const targetSong = await getSongByIdQuery(req.params.id);
    const song = await deleteSongQuery(req.params.id);

    if (!song) {
        return next(new AppError('No song found with that ID', 404));
    }

    await logSystemActivity({
        user: req.user,
        action: 'Song Deleted',
        resource: `Song: ${targetSong?.songname || targetSong?.title || 'Deleted Song'}`,
        details: `Song removed by Admin: ${req.user.name}`,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || 'Unknown'
    });

    sendSuccessResponse(res, 200, 'Song deleted successfully', null);
});
//endregion

//endregion

//endregion
