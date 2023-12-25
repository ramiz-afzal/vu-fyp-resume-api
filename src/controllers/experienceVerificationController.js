import experienceVerificationModal from '../models/experienceVerificationModal.js';
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
		const experience = await experienceVerificationModal.getEntries(companyId, req.query);
		res.status(200).send({ experience: experience });
	},
	getEntry: async (req, res) => {
		const experienceVerificationId = req.params?.experienceVerificationId;
		const companyId = req.params?.companyId;
		if (!companyId || !experienceVerificationId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Company ID is required',
					},
				],
			});
		}

		const experience = await experienceVerificationModal.getEntry(companyId, experienceVerificationId);
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
	updateEntry: async (req, res) => {
		const experienceVerificationId = req.params?.experienceVerificationId;
		const companyId = req.params?.companyId;
		if (!companyId || !experienceVerificationId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Company ID is required',
					},
				],
			});
		}

		const experience = await experienceVerificationModal.getEntry(companyId, experienceVerificationId);
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

		const updatedExperience = await experienceVerificationModal.updateEntry(companyId, experienceVerificationId);
		if (!updatedExperience) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ experience: updatedExperience, message: 'experience verified' });
	},
};
export default controller;
