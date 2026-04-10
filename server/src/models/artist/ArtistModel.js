//region imports
import mongoose from 'mongoose';
//endregion

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Artist name is required'],
        unique: true,
        trim: true
    },
    image: String,
    genre: String,
    bio: String
}, { timestamps: true });

//region exports
const ArtistModel = mongoose.model('Artist', artistSchema);
export default ArtistModel;
//endregion
