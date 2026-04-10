//region imports
import ArtistModel from '../../models/artist/ArtistModel.js';
//endregion

//region queries

//region getAllArtistsQuery
/**
 * Retrieves all artists from the collection.
 */
export const getAllArtistsQuery = async () => {
    try {
        return await ArtistModel.find().sort({ name: 1 }).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region createArtistQuery
/**
 * Creates a new artist entry.
 */
export const createArtistQuery = async (artistData) => {
    try {
        return await ArtistModel.create(artistData);
    } catch (error) {
        throw error;
    }
};
//endregion

//region updateArtistQuery
/**
 * Updates an artist by ID.
 */
export const updateArtistQuery = async (id, updateData) => {
    try {
        return await ArtistModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region deleteArtistQuery
/**
 * Deletes an artist by ID.
 */
export const deleteArtistQuery = async (id) => {
    try {
        return await ArtistModel.findByIdAndDelete(id).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//endregion
