//region imports
import SongModel from '../../models/song/SongModel.js';
import mongoose from 'mongoose';
//endregion

//region exports

//region createSongQuery
/**
 * Creates a new song entry in the database.
 * @param {Object} songData - The song data to persist.
 * @returns {Promise<Object>} The created song document.
 */
export const createSongQuery = async (songData) => {
    // initialize song document
    try {
        return await SongModel.create(songData);
    } catch (error) {
        throw error;
    }
};
//endregion

//region getSongByIdQuery
/**
 * Retrieves a single song by ID using aggregation to exclude buffer.
 * @param {string} id - Song ID.
 */
export const getSongByIdQuery = async (id) => {
    // fetch song by id but project out audioData
    try {
        const results = await SongModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { audioData: 0 } }
        ]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};
//endregion

//region updateSongQuery
/**
 * Updates an existing song using findOneAndUpdate then aggregation for return.
 * @param {string} id - Song ID.
 * @param {Object} updateData - Data to update.
 */
export const updateSongQuery = async (id, updateData) => {
    // perform update
    try {
        await SongModel.findByIdAndUpdate(id, updateData, {
            runValidators: true
        });
        
        // return updated document without buffer using aggregation
        return await getSongByIdQuery(id);
    } catch (error) {
        throw error;
    }
};
//endregion

//region deleteSongQuery
/**
 * Deletes a song from the database.
 * @param {string} id - Song ID.
 */
export const deleteSongQuery = async (id) => {
    // remove document
    try {
        return await SongModel.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
};
//endregion

//region getPaginatedSongsQuery
/**
 * HIGH-PERFORMANCE PAGINATION & SEARCH
 * Uses MongoDB Aggregation ($facet) for single hit metadata + data.
 * No population or select used.
 */
export const getPaginatedSongsQuery = async (search = '', filters = {}, limit = 10, skip = 0) => {
    // prepare matching filters
    try {
        let matchStage = { ...filters };
        
        // apply regex search if provided
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            matchStage.$or = [
                { songname: searchRegex },
                { track_name: searchRegex },
                { title: searchRegex },
                { artist: searchRegex },
                { artist_name: searchRegex },
                { language: searchRegex },
                { genre: searchRegex }
            ];
        }

        // execute dual-stage aggregation
        const result = await SongModel.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { audioData: 0 } }
                    ]
                }
            }
        ]);

        // extract total count and array data
        const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
        const data = result[0].data;

        return { total, data };
    } catch (error) {
        throw error;
    }
};
//endregion

//region incrementSongPlaysQuery
/**
 * Increments song play count using atomic update.
 * @param {string} id - Song ID.
 */
export const incrementSongPlaysQuery = async (id) => {
    // atomic increment
    try {
        await SongModel.findByIdAndUpdate(id, { $inc: { plays: 1 } });
        return await getSongByIdQuery(id);
    } catch (error) {
        throw error;
    }
};
//endregion

//endregion
