import experienceModel from '../models/experienceModel.js';
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
		const experiences = await experienceModel.getEntries(resumeId);
		res.status(200).send({ experiences: experiences });
	},
	getEntry: async (req, res) => {
		const experienceId = req.params?.experienceId;
		const resumeId = req.params?.resumeId;
		if (!experienceId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Experience ID is required',
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

		const experience = await experienceModel.getEntry(experienceId, resumeId);
		if (!experience) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ experience: experience });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.resumeId = req.params.resumeId || null;
		data.stillEmployed = 'stillEmployed' in req.body ? req.body.stillEmployed : null;
		data.companyId = 'companyId' in req.body ? req.body.companyId : null;
		data.designation = 'designation' in req.body ? req.body.designation : null;
		data.startDate = 'startDate' in req.body ? req.body.startDate : null;
		data.endDate = 'endDate' in req.body ? req.body.endDate : null;
		data.description = 'description' in req.body ? req.body.description : null;

		const experience = await experienceModel.createEntry(data);
		return res.status(200).send({ experience: experience, message: 'experience created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const experienceId = req.params?.experienceId;
		const resumeId = req.params?.resumeId;
		if (!experienceId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Experience ID is required',
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

		const experience = await experienceModel.getEntry(experienceId, resumeId);
		if (!experience) {
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
		data.stillEmployed = 'stillEmployed' in req.body.body ? req.body.body.stillEmployed : null;
		data.companyId = 'companyId' in req.body.body ? req.body.body.companyId : null;
		data.designation = 'designation' in req.body.body ? req.body.body.designation : null;
		data.startDate = 'startDate' in req.body.body ? req.body.body.startDate : null;
		data.endDate = 'endDate' in req.body.body ? req.body.body.endDate : null;
		data.description = 'description' in req.body.body ? req.body.body.description : null;

		const updatedExperience = await experienceModel.updateEntry(experienceId, data);
		if (!updatedExperience) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ experience: updatedExperience, message: 'experience updated' });
	},
	deleteEntry: async (req, res) => {
		const experienceId = req.params?.experienceId;
		const resumeId = req.params?.resumeId;
		if (!experienceId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Experience ID is required',
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

		const experience = await experienceModel.getEntry(experienceId, resumeId);
		if (!experience) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await experienceModel.deleteEntry(experienceId, resumeId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ experience: experience, message: 'experience deleted' });
	},
};
export default controller;
