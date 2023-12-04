import educationModel from '../models/educationModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntries: async (req, res) => {
		const resumeId = req.params?.resumeId;
		if (!resumeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Resume ID is required',
					},
				],
			});
		}
		const educations = await educationModel.getEntries(resumeId);
		res.status(200).send({ educations: educations });
	},
	getEntry: async (req, res) => {
		const educationId = req.params?.educationId;
		const resumeId = req.params?.resumeId;
		if (!educationId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Education ID is required',
					},
				],
			});
		}
		if (!resumeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Resume ID is required',
					},
				],
			});
		}

		const education = await educationModel.getEntry(educationId, resumeId);
		if (!education) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ education: education });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.resumeId = req.params.resumeId || null;
		data.inProcess = 'inProcess' in req.body ? req.body.inProcess : null;
		data.institute = 'institute' in req.body ? req.body.institute : null;
		data.degree = 'degree' in req.body ? req.body.degree : null;
		data.startDate = 'startDate' in req.body ? req.body.startDate : null;
		data.endDate = 'endDate' in req.body ? req.body.endDate : null;
		data.description = 'description' in req.body ? req.body.description : null;

		const education = await educationModel.createEntry(data);
		return res.status(200).send({ education: education, message: 'education created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const educationId = req.params?.educationId;
		const resumeId = req.params?.resumeId;
		if (!educationId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Education ID is required',
					},
				],
			});
		}
		if (!resumeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Resume ID is required',
					},
				],
			});
		}

		const education = await educationModel.getEntry(educationId, resumeId);
		if (!education) {
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
		data.resumeId = resumeId;
		data.inProcess = 'inProcess' in req.body.body ? req.body.body.inProcess : null;
		data.institute = 'institute' in req.body.body ? req.body.body.institute : null;
		data.degree = 'degree' in req.body.body ? req.body.body.degree : null;
		data.startDate = 'startDate' in req.body.body ? req.body.body.startDate : null;
		data.endDate = 'endDate' in req.body.body ? req.body.body.endDate : null;
		data.description = 'description' in req.body.body ? req.body.body.description : null;

		const updatedEducation = await educationModel.updateEntry(educationId, data);
		if (!updatedEducation) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ education: updatedEducation, message: 'education updated' });
	},
	deleteEntry: async (req, res) => {
		const educationId = req.params?.educationId;
		const resumeId = req.params?.resumeId;
		if (!educationId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Education ID is required',
					},
				],
			});
		}
		if (!resumeId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Resume ID is required',
					},
				],
			});
		}

		const education = await educationModel.getEntry(educationId, resumeId);
		if (!education) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await educationModel.deleteEntry(educationId, resumeId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ education: education, message: 'education deleted' });
	},
};
export default controller;
