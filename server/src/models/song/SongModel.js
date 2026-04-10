import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    songname: String,
    title: String,
    track_name: String,
    artist: String,
    artist_name: String,
    language: String,
    genre: String,
    emotion: String,
    context: String,
    image_climate: String,
    image: String,
    album_image: String,
    audio_path: String,
    audioData: Buffer,
    duration: String,
    length: String
}, { strict: false, timestamps: true });

const SongModel = mongoose.model('Song', songSchema, 'songs');
export default SongModel;
