import companyModel from '../models/companyModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntries: async (req, res) => {
		const companies = await companyModel.getEntries();
		res.status(200).send({ companies: companies });
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
		const companies = await companyModel.getSearchResults(query);
		res.status(200).send({ companies: companies });
	},
	getEntry: async (req, res) => {
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

		const company = await companyModel.getEntry(companyId);
		if (!company) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ company: company });
	},
	createEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let data = {};
		data.userId = req.user.id;
		data.title = 'title' in req.body ? req.body.title : null;
		data.description = 'description' in req.body ? req.body.description : null;

		const company = await companyModel.createEntry(data);
		return res.status(200).send({ company: company, message: 'company created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

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

		const company = await companyModel.getEntry(companyId);
		if (!company) {
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
		data.userId = req.user.id;
		data.title = 'title' in updateBody ? updateBody.title : null;
		data.description = 'description' in updateBody ? updateBody.description : null;
		data.imageId = updateBody.imageId || null;

		const updatedResume = await companyModel.updateEntry(companyId, data);
		if (!updatedResume) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ company: updatedResume, message: 'company updated' });
	},
	deleteEntry: async (req, res) => {
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

		const company = await companyModel.getEntry(companyId);
		if (!company) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await companyModel.deleteEntry(companyId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ company: company, message: 'company deleted' });
	},
};
export default controller;
