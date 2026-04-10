//region imports
import express from 'express';
import {
    getAllArtists,
    createArtist,
    updateArtist,
    deleteArtist
} from '../../controllers/artist/artistController.js';
import { protect, authorize } from '../../middlewares/auth/auth.js';
import { CONSTANTS } from '../../utils/index.js';
//endregion

const router = express.Router();

//region public routes
router.get('/', getAllArtists);
//endregion

//region admin routes
router.use(protect);
router.use(authorize(CONSTANTS.USER_ROLES.ADMIN));

router.post('/', createArtist);
router.patch('/:id', updateArtist);
router.delete('/:id', deleteArtist);
//endregion

export default router;
