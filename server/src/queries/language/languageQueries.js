//region imports
import LanguageModel from '../../models/language/LanguageModel.js';
//endregion

//region queries

//region getAllLanguagesQuery
/**
 * Retrieves all languages.
 */
export const getAllLanguagesQuery = async () => {
    try {
        return await LanguageModel.find().sort({ name: 1 }).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region createLanguageQuery
/**
 * Creates a new language entry.
 */
export const createLanguageQuery = async (languageData) => {
    try {
        return await LanguageModel.create(languageData);
    } catch (error) {
        throw error;
    }
};
//endregion

//region updateLanguageQuery
/**
 * Updates a language by ID.
 */
export const updateLanguageQuery = async (id, updateData) => {
    try {
        return await LanguageModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//region deleteLanguageQuery
/**
 * Deletes a language by ID.
 */
export const deleteLanguageQuery = async (id) => {
    try {
        return await LanguageModel.findByIdAndDelete(id).lean();
    } catch (error) {
        throw error;
    }
};
//endregion

//endregion
