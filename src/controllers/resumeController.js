import resumeModel from '../models/resumeModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntries: async (req, res) => {
		const resumes = await resumeModel.getEntries();
		res.status(200).send({ resumes: resumes });
	},
	getSearchResults: async (req, res) => {
		const query = req.params?.query;
		if (!query) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'No Search query provided',
					},
				],
			});
		}
		const resumes = await resumeModel.getSearchResults(query);
		res.status(200).send({ resumes: resumes });
	},
	getEntry: async (req, res) => {
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

		const resume = await resumeModel.getEntry(resumeId);
		if (!resume) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ resume: resume });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.userId = req.user.id;
		data.firstName = req.body.firstName || null;
		data.lastName = req.body.lastName || null;
		data.biography = req.body.biography || null;
		data.gender = req.body.gender || null;
		data.dob = req.body.dob || null;
		data.phone = req.body.phone || null;
		data.religion = req.body.religion || null;
		data.martialStatus = req.body.martialStatus || null;
		data.address_1 = req.body.address_1 || null;
		data.address_2 = req.body.address_2 || null;
		data.city = req.body.city || null;
		data.state = req.body.state || null;
		data.country = req.body.country || null;

		const resume = await resumeModel.createEntry(data);
		return res.status(200).send({ resume: resume, message: 'resume created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

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

		const resume = await resumeModel.getEntry(resumeId);
		if (!resume) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		let updateBody = req.body.body || null;

		let data = {};
		data.firstName = updateBody.firstName || null;
		data.lastName = updateBody.lastName || null;
		data.designation = updateBody.designation || null;
		data.biography = updateBody.biography || null;
		data.gender = updateBody.gender || null;
		data.dob = updateBody.dob || null;
		data.phone = updateBody.phone || null;
		data.religion = updateBody.religion || null;
		data.martialStatus = updateBody.martialStatus || null;
		data.address_1 = updateBody.address_1 || null;
		data.address_2 = updateBody.address_2 || null;
		data.city = updateBody.city || null;
		data.state = updateBody.state || null;
		data.country = updateBody.country || null;
		data.imageId = updateBody.imageId || null;

		const updatedResume = await resumeModel.updateEntry(resumeId, data);
		if (!updatedResume) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ resume: updatedResume, message: 'resume updated' });
	},
	deleteEntry: async (req, res) => {
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

		const resume = await resumeModel.getEntry(resumeId);
		if (!resume) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await resumeModel.deleteEntry(resumeId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ resume: resume, message: 'resume deleted' });
	},
};
export default controller;
