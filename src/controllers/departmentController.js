import departmentModel from '../models/departmentModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntries: async (req, res) => {
		const companyId = req.params?.companyId;
		if (!companyId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Company ID is required',
					},
				],
			});
		}
		const departments = await departmentModel.getEntries(companyId);
		res.status(200).send({ departments: departments });
	},
	getEntry: async (req, res) => {
		const departmentId = req.params?.departmentId;
		const companyId = req.params?.companyId;
		if (!departmentId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Department ID is required',
					},
				],
			});
		}
		if (!companyId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Company ID is required',
					},
				],
			});
		}

		const department = await departmentModel.getEntry(departmentId, companyId);
		if (!department) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ department: department });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.companyId = req.params.companyId || null;
		data.title = 'title' in req.body ? req.body.title : null;
		data.description = 'description' in req.body ? req.body.description : null;

		const department = await departmentModel.createEntry(data);
		return res.status(200).send({ department: department, message: 'department created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const departmentId = req.params?.departmentId;
		const companyId = req.params?.companyId;
		if (!departmentId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Department ID is required',
					},
				],
			});
		}
		if (!companyId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Company ID is required',
					},
				],
			});
		}

		const department = await departmentModel.getEntry(departmentId, companyId);
		if (!department) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		let data = {};
		data.companyId = companyId;
		data.title = 'title' in req.body.body ? req.body.body.title : null;
		data.description = 'description' in req.body.body ? req.body.body.description : null;

		const updatedDepartment = await departmentModel.updateEntry(departmentId, data);
		if (!updatedDepartment) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ department: updatedDepartment, message: 'department updated' });
	},
	deleteEntry: async (req, res) => {
		const departmentId = req.params?.departmentId;
		const companyId = req.params?.companyId;
		if (!departmentId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Department ID is required',
					},
				],
			});
		}
		if (!companyId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Company ID is required',
					},
				],
			});
		}

		const department = await departmentModel.getEntry(departmentId, companyId);
		if (!department) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await departmentModel.deleteEntry(departmentId, companyId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ department: department, message: 'department deleted' });
	},
};
export default controller;
