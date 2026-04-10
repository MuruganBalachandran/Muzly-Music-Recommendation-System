import mongoose from 'mongoose';
import ArtistModel from '../models/artist/ArtistModel.js';
import LanguageModel from '../models/language/LanguageModel.js';
import { connectDB } from '../config/db/dbConfig.js';

const languages = [
    { name: 'English', code: 'en' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Telugu', code: 'te' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' }
];

const artists = [
    // Indian Artists
    { name: 'A.R. Rahman', genre: 'Soundtrack, Film score, Pop', image: 'https://i.scdn.co/image/ab6761610000e5ebb19af0ea736c6228d6eb539c', bio: 'Oscar winning Indian composer, singer, and songwriter.' },
    { name: 'Anirudh Ravichander', genre: 'Tamil Pop, Soundtrack', image: 'https://i.scdn.co/image/ab6761610000e5eb1ba2eb2e82eb00d0f41ab94a', bio: 'Acclaimed Indian music composer and singer primarily working in Tamil cinema.' },
    { name: 'Arijit Singh', genre: 'Bollywood, Pop', image: 'https://i.scdn.co/image/ab6761610000e5eb0261696c5df3be99da6ed3f3', bio: 'One of the most popular and celebrated playback singers in India.' },
    { name: 'Shreya Ghoshal', genre: 'Bollywood, Classical', image: 'https://i.scdn.co/image/ab6761610000e5eb4f4cb38d9f10fde17dcdeb7a', bio: 'Renowned Indian playback singer noted for her wide vocal range and versatility.' },
    { name: 'Sid Sriram', genre: 'R&B, Indian Pop', image: 'https://i.scdn.co/image/ab6761610000e5eb4debc7966952d760b2b8e3ad', bio: 'Indian-American music producer, playback singer, and songwriter.' },
    { name: 'Yuvan Shankar Raja', genre: 'Tamil Pop, Soundtrack', image: 'https://i.scdn.co/image/ab6761610000e5ebbffae863fa93ba0ed5cda7fb', bio: 'Indian film score and soundtrack composer and singer.' },
    { name: 'Harris Jayaraj', genre: 'Tamil Pop, Soundtrack', image: 'https://i.scdn.co/image/ab6761610000e5ebec66bf9befe13253bffa5b70', bio: 'Indian film composer from Chennai, Tamil Nadu.' },
    { name: 'SanThosh Narayanan', genre: 'Soundtrack, Folk Pop', image: 'https://i.scdn.co/image/ab6761610000e5ebc10eeed8aab0a6042db23577', bio: 'Indian music composer and singer in the Tamil film industry.' },
    
    // International Artists
    { name: 'Taylor Swift', genre: 'Pop, Country', image: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0', bio: 'Global pop superstar and prolific songwriter.' },
    { name: 'The Weeknd', genre: 'R&B, Pop', image: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb', bio: 'Canadian singer, songwriter, and record producer known for his sonic versatility and dark lyricism.' },
    { name: 'Ed Sheeran', genre: 'Pop, Folk-pop', image: 'https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6', bio: 'Grammy-winning English singer-songwriter.' },
    { name: 'Drake', genre: 'Hip Hop, R&B', image: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9', bio: 'Influential Canadian rapper, singer, and songwriter.' },
    { name: 'Billie Eilish', genre: 'Alt-pop, Electropop', image: 'https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf', bio: 'American singer and songwriter known for her unique vocal style and alternative pop sound.' },
    { name: 'Justin Bieber', genre: 'Pop, R&B', image: 'https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36', bio: 'Canadian singer recognized for his genre-melding musicianship and global influence in modern popular music.' },
    { name: 'Eminem', genre: 'Hip Hop', image: 'https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b', bio: 'Legendary American rapper, songwriter, and record producer.' },
    { name: 'BTS', genre: 'K-pop, Pop', image: 'https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb', bio: 'Global South Korean boy band phenomenon.' },
    { name: 'Imagine Dragons', genre: 'Pop Rock', image: 'https://i.scdn.co/image/ab6761610000e5eb92099f6563d4845ea1e36e1c', bio: 'American pop rock band from Las Vegas, Nevada.' }
];

const seedData = async () => {
    try {
        console.log('🚀 Starting Data Seeding process...');
        
        await connectDB();
        
        console.log('Dropping existing Artists and Languages collections (optional, skipped for safety)...');
        // Uncomment if you want to reset the collections:
        // await ArtistModel.deleteMany({});
        // await LanguageModel.deleteMany({});

        console.log(`Inserting ${languages.length} languages...`);
        for (const lang of languages) {
            const existing = await LanguageModel.findOne({ name: lang.name });
            if (!existing) {
                await LanguageModel.create(lang);
            }
        }
        console.log('✅ Languages Seeded Successfully!');
        
        console.log(`Inserting ${artists.length} artists...`);
        for (const artist of artists) {
            const existing = await ArtistModel.findOne({ name: artist.name });
            if (!existing) {
                await ArtistModel.create(artist);
            }
        }
        console.log('✅ Artists Seeded Successfully!');
        
        console.log('\n-----------------------------------------');
        console.log('🎉 Seeding Completed!');
        console.log('-----------------------------------------\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed with error:');
        console.error(error);
        process.exit(1);
    }
};

seedData();
