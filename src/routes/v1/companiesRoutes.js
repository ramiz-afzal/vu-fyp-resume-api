import express from 'express';
import companyController from '../../controllers/companyController.js';
import departmentController from '../../controllers/departmentController.js';
import employeeController from '../../controllers/employeeController.js';
import serviceController from '../../controllers/serviceController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import companyValidator from '../../validators/companyValidator.js';
import departmentValidator from '../../validators/departmentValidator.js';
import employeeValidator from '../../validators/employeeValidator.js';
import serviceValidator from '../../validators/serviceValidator.js';

const router = express.Router({ mergeParams: true });
router.get('/', companyController.getEntries);
router.get('/search/:query', companyController.getSearchResults);
router.get('/:companyId', companyController.getEntry);
router.post('/', [authMiddleware, companyValidator.create], companyController.createEntry);
router.patch('/:companyId', [authMiddleware, companyValidator.update], companyController.updateEntry);
router.delete('/:companyId', [authMiddleware], companyController.deleteEntry);

// departments
router.get('/:companyId/department', departmentController.getEntries);
router.get('/:companyId/department/:departmentId', departmentController.getEntry);
router.post('/:companyId/department/', [authMiddleware, departmentValidator.create], departmentController.createEntry);
router.patch('/:companyId/department/:departmentId', [authMiddleware, departmentValidator.update], departmentController.updateEntry);
router.delete('/:companyId/department/:departmentId', [authMiddleware], departmentController.deleteEntry);

// departments/employees
router.get('/:companyId/department/:departmentId/employee/', employeeController.getEntries);
router.get('/:companyId/department/:departmentId/employee/:employeeId', employeeController.getEntry);
router.post('/:companyId/department/:departmentId/employee/', [authMiddleware, employeeValidator.create], employeeController.createEntry);
router.patch('/:companyId/department/:departmentId/employee/:employeeId', [authMiddleware, employeeValidator.update], employeeController.updateEntry);
router.delete('/:companyId/department/:departmentId/employee/:employeeId', [authMiddleware], employeeController.deleteEntry);

// services
router.get('/:companyId/service', serviceController.getEntries);
router.get('/:companyId/service/:serviceId', serviceController.getEntry);
router.post('/:companyId/service/', [authMiddleware, serviceValidator.create], serviceController.createEntry);
router.patch('/:companyId/service/:serviceId', [authMiddleware, serviceValidator.update], serviceController.updateEntry);
router.delete('/:companyId/service/:serviceId', [authMiddleware], serviceController.deleteEntry);

export default router;
