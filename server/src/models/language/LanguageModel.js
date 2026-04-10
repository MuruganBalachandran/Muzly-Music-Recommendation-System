//region imports
import mongoose from 'mongoose';
//endregion

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Language name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    }
}, { timestamps: true });

//region exports
const LanguageModel = mongoose.model('Language', languageSchema);
export default LanguageModel;
//endregion
