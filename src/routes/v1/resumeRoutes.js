import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import resumeController from '../../controllers/resumeController.js';
import experienceController from '../../controllers/experienceController.js';
import educationController from '../../controllers/educationController.js';
import certificateController from '../../controllers/certificateController.js';
import resumeValidator from '../../validators/resumeValidator.js';
import experienceValidator from '../../validators/experienceValidator.js';
import educationValidator from '../../validators/educationValidator.js';
import certificateValidator from '../../validators/certificateValidator.js';

const router = express.Router({ mergeParams: true });
router.get('/', authMiddleware, resumeController.getEntries);
router.get('/:resumeId', authMiddleware, resumeController.getEntry);
router.post('/', [authMiddleware, resumeValidator.create], resumeController.createEntry);
router.patch('/:resumeId', [authMiddleware, resumeValidator.update], resumeController.updateEntry);
router.delete('/:resumeId', [authMiddleware], resumeController.deleteEntry);

// experience
router.get('/:resumeId/experience', authMiddleware, experienceController.getEntries);
router.get('/:resumeId/experience/:experienceId', authMiddleware, experienceController.getEntry);
router.post('/:resumeId/experience/', [authMiddleware, experienceValidator.create], experienceController.createEntry);
router.patch('/:resumeId/experience/:experienceId', [authMiddleware, experienceValidator.update], experienceController.updateEntry);
router.delete('/:resumeId/experience/:experienceId', [authMiddleware], experienceController.deleteEntry);

// education
router.get('/:resumeId/education', authMiddleware, educationController.getEntries);
router.get('/:resumeId/education/:educationId', authMiddleware, educationController.getEntry);
router.post('/:resumeId/education/', [authMiddleware, educationValidator.create], educationController.createEntry);
router.patch('/:resumeId/education/:educationId', [authMiddleware, educationValidator.update], educationController.updateEntry);
router.delete('/:resumeId/education/:educationId', [authMiddleware], educationController.deleteEntry);

// certificate
router.get('/:resumeId/certificate', authMiddleware, certificateController.getEntries);
router.get('/:resumeId/certificate/:certificateId', authMiddleware, certificateController.getEntry);
router.post('/:resumeId/certificate/', [authMiddleware, certificateValidator.create], certificateController.createEntry);
router.patch('/:resumeId/certificate/:certificateId', [authMiddleware, certificateValidator.update], certificateController.updateEntry);
router.delete('/:resumeId/certificate/:certificateId', [authMiddleware], certificateController.deleteEntry);

export default router;
