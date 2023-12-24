import employeeModel from '../models/employeeModel.js';
import resumeModel from '../models/resumeModel.js';
import illiterateEmployeeModel from '../models/illiterateEmployeeModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntries: async (req, res) => {
		const departmentId = req.params?.departmentId;
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
		const employees = await employeeModel.getEntries(departmentId);
		res.status(200).send({ employees: employees });
	},
	getEntry: async (req, res) => {
		const employeeId = req.params?.employeeId;
		const departmentId = req.params?.departmentId;
		if (!employeeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Employee ID is required',
					},
				],
			});
		}
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

		const employee = await employeeModel.getEntry(employeeId, departmentId);
		if (!employee) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ employee: employee });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.departmentId = req.params.departmentId || null;
		data.type = 'type' in req.body ? req.body.type : null;
		data.resumeId = 'resumeId' in req.body ? req.body.resumeId : null;
		data.employmentType = 'employmentType' in req.body ? req.body.employmentType : null;
		data.employmentPosition = 'employmentPosition' in req.body ? req.body.employmentPosition : null;
		data.illiterateEmployeeId = 'illiterateEmployeeId' in req.body ? req.body.illiterateEmployeeId : null;

		if (data.type == 'educated' && data.resumeId !== null) {
			const resume = await resumeModel.getEntry(data.resumeId);
			if (!resume) {
				return res.status(400).json({
					errors: [
						{
							type: 'doestNotExists',
							msg: 'resource resume does not exists against the provided resumeId',
						},
					],
				});
			}
		} else if (data.type == 'illiterate' && data.illiterateEmployeeId !== null) {
			const illiterateEmployee = await illiterateEmployeeModel.getEntry(data.illiterateEmployeeId);
			if (!illiterateEmployee) {
				return res.status(400).json({
					errors: [
						{
							type: 'doestNotExists',
							msg: 'resource illiterateEmployee does not exists against the provided illiterateEmployeeId',
						},
					],
				});
			}
		}

		const employeeExists = await employeeModel.entryExists(data);
		if (employeeExists) {
			return res.status(400).json({
				errors: [
					{
						type: 'alreadyExists',
						msg: 'Resource already exists',
					},
				],
			});
		}

		const employee = await employeeModel.createEntry(data);
		if (!employee) {
			return res.status(500).send({ message: 'Something went wrong' });
		}
		return res.status(200).send({ employee: employee, message: 'employee created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const employeeId = req.params?.employeeId;
		const departmentId = req.params?.departmentId;
		if (!employeeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Employee ID is required',
					},
				],
			});
		}
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

		const employee = await employeeModel.getEntry(employeeId, departmentId);
		if (!employee) {
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
		data.type = 'type' in req.body.body ? req.body.body.type : null;
		data.resumeId = 'resumeId' in req.body.body ? req.body.body.resumeId : null;
		data.departmentId = departmentId;
		data.employmentType = 'employmentType' in req.body.body ? req.body.body.employmentType : null;
		data.employmentPosition = 'employmentPosition' in req.body.body ? req.body.body.employmentPosition : null;
		data.illiterateEmployeeId = 'illiterateEmployeeId' in req.body.body ? req.body.body.illiterateEmployeeId : null;

		const updatedEmployee = await employeeModel.updateEntry(employeeId, data);
		if (!updatedEmployee) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ employee: updatedEmployee, message: 'employee updated' });
	},
	deleteEntry: async (req, res) => {
		const employeeId = req.params?.employeeId;
		const departmentId = req.params?.departmentId;
		if (!employeeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Employee ID is required',
					},
				],
			});
		}
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

		const employee = await employeeModel.getEntry(employeeId, departmentId);
		if (!employee) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await employeeModel.deleteEntry(employeeId, departmentId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ employee: employee, message: 'employee deleted' });
	},
};
export default controller;
