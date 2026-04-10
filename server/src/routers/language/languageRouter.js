//region imports
import express from 'express';
import {
    getAllLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage
} from '../../controllers/language/languageController.js';
import { protect, authorize } from '../../middlewares/auth/auth.js';
import { CONSTANTS } from '../../utils/index.js';
//endregion

const router = express.Router();

//region public routes
router.get('/', getAllLanguages);
//endregion

//region admin routes
router.use(protect);
router.use(authorize(CONSTANTS.USER_ROLES.ADMIN));

router.post('/', createLanguage);
router.patch('/:id', updateLanguage);
router.delete('/:id', deleteLanguage);
//endregion

export default router;
