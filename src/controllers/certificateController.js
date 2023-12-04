import certificateModel from '../models/certificateModel.js';
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
		const certificates = await certificateModel.getEntries(resumeId);
		res.status(200).send({ certificates: certificates });
	},
	getEntry: async (req, res) => {
		const certificateId = req.params?.certificateId;
		const resumeId = req.params?.resumeId;
		if (!certificateId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Certificate ID is required',
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

		const certificate = await certificateModel.getEntry(certificateId, resumeId);
		if (!certificate) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ certificate: certificate });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.resumeId = req.params.resumeId || null;
		data.title = 'title' in req.body ? req.body.title : null;
		data.institute = 'institute' in req.body ? req.body.institute : null;
		data.description = 'description' in req.body ? req.body.description : null;

		const certificate = await certificateModel.createEntry(data);
		return res.status(200).send({ certificate: certificate, message: 'certificate created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const certificateId = req.params?.certificateId;
		const resumeId = req.params?.resumeId;
		if (!certificateId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Certificate ID is required',
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

		const certificate = await certificateModel.getEntry(certificateId, resumeId);
		if (!certificate) {
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
		data.title = 'title' in req.body.body ? req.body.body.title : null;
		data.institute = 'institute' in req.body.body ? req.body.body.institute : null;
		data.description = 'description' in req.body.body ? req.body.body.description : null;

		const updatedCertificate = await certificateModel.updateEntry(certificateId, data);
		if (!updatedCertificate) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ certificate: updatedCertificate, message: 'certificate updated' });
	},
	deleteEntry: async (req, res) => {
		const certificateId = req.params?.certificateId;
		const resumeId = req.params?.resumeId;
		if (!certificateId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Certificate ID is required',
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

		const certificate = await certificateModel.getEntry(certificateId, resumeId);
		if (!certificate) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await certificateModel.deleteEntry(certificateId, resumeId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ certificate: certificate, message: 'certificate deleted' });
	},
};
export default controller;
