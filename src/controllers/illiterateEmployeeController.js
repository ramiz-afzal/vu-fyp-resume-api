import illiterateEmployeeModel from '../models/illiterateEmployeeModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntries: async (req, res) => {
		const illiterateEmployees = await illiterateEmployeeModel.getEntries();
		res.status(200).send({ illiterateEmployees: illiterateEmployees });
	},
	getEntry: async (req, res) => {
		const illiterateEmployeeId = req.params?.illiterateEmployeeId;
		if (!illiterateEmployeeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Illiterate Employee ID is required',
					},
				],
			});
		}

		const illiterateEmployee = await illiterateEmployeeModel.getEntry(illiterateEmployeeId);
		if (!illiterateEmployee) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ illiterateEmployee: illiterateEmployee });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.firstName = 'firstName' in req.body ? req.body.firstName : null;
		data.lastName = 'lastName' in req.body ? req.body.lastName : null;
		data.designation = 'designation' in req.body ? req.body.designation : null;
		data.startDate = 'startDate' in req.body ? req.body.startDate : null;
		data.endDate = 'endDate' in req.body ? req.body.endDate : null;

		const illiterateEmployee = await illiterateEmployeeModel.createEntry(data);
		if (!illiterateEmployee) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}
		return res.status(200).send({ illiterateEmployee: illiterateEmployee, message: 'illiterateEmployee created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const illiterateEmployeeId = req.params?.illiterateEmployeeId;
		if (!illiterateEmployeeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Illiterate Employee ID is required',
					},
				],
			});
		}

		const illiterateEmployee = await illiterateEmployeeModel.getEntry(illiterateEmployeeId);
		if (!illiterateEmployee) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		let updateBody = req?.body?.body || null;

		let data = {};
		data.firstName = 'firstName' in updateBody ? updateBody.firstName : null;
		data.lastName = 'lastName' in updateBody ? updateBody.lastName : null;
		data.designation = 'designation' in updateBody ? updateBody.designation : null;
		data.startDate = 'startDate' in updateBody ? updateBody.startDate : null;
		data.endDate = 'endDate' in updateBody ? updateBody.endDate : null;

		const updatedIlliterateEmployee = await illiterateEmployeeModel.updateEntry(illiterateEmployeeId, data);
		if (!updatedIlliterateEmployee) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ illiterateEmployee: updatedIlliterateEmployee, message: 'illiterateEmployee updated' });
	},
	deleteEntry: async (req, res) => {
		const illiterateEmployeeId = req.params?.illiterateEmployeeId;
		if (!illiterateEmployeeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Illiterate Employee ID is required',
					},
				],
			});
		}

		const illiterateEmployee = await illiterateEmployeeModel.getEntry(illiterateEmployeeId);
		if (!illiterateEmployee) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await illiterateEmployeeModel.deleteEntry(illiterateEmployeeId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ illiterateEmployee: illiterateEmployee, message: 'illiterateEmployee deleted' });
	},
};
export default controller;
