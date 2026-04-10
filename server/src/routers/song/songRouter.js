//region imports
import express from 'express';
import { 
    getSongs, 
    playSong, 
    createSong, 
    updateSong, 
    deleteSong 
} from '../../controllers/song/songController.js';
import { protect, authorize } from '../../middlewares/index.js';
import { CONSTANTS } from '../../utils/index.js';
//endregion

import multer from 'multer';

const router = express.Router();

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) cb(null, true);
        else cb(new Error('Only audio files allowed!'), false);
    }
});

//region Public Routes
/**
 * Public enumeration and streaming.
 */
router.get('/', getSongs);
router.get('/play/:id', playSong);
//endregion

//region Admin Routes
/**
 * Protected routes for song management.
 */
router.use(protect);
router.use(authorize(CONSTANTS.USER_ROLES.ADMIN));

router.post('/', upload.single('audio'), createSong);
router.patch('/:id', updateSong);
router.delete('/:id', deleteSong);
//endregion

//region exports
export default router;
//endregion
