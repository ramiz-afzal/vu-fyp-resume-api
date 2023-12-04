import serviceModel from '../models/serviceModel.js';
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
		const services = await serviceModel.getEntries(companyId);
		res.status(200).send({ services: services });
	},
	getEntry: async (req, res) => {
		const serviceId = req.params?.serviceId;
		const companyId = req.params?.companyId;
		if (!serviceId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Service ID is required',
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

		const service = await serviceModel.getEntry(serviceId, companyId);
		if (!service) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ service: service });
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

		const service = await serviceModel.createEntry(data);
		return res.status(200).send({ service: service, message: 'service created' });
	},
	updateEntry: async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const serviceId = req.params?.serviceId;
		const companyId = req.params?.companyId;
		if (!serviceId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Service ID is required',
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

		const service = await serviceModel.getEntry(serviceId, companyId);
		if (!service) {
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

		const updatedService = await serviceModel.updateEntry(serviceId, data);
		if (!updatedService) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ service: updatedService, message: 'service updated' });
	},
	deleteEntry: async (req, res) => {
		const serviceId = req.params?.serviceId;
		const companyId = req.params?.companyId;
		if (!serviceId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'Service ID is required',
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

		const service = await serviceModel.getEntry(serviceId, companyId);
		if (!service) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		const result = await serviceModel.deleteEntry(serviceId, companyId);
		if (!result) {
			return res.status(500).send({ message: 'Something went wrong' });
		}

		return res.status(200).send({ service: service, message: 'service deleted' });
	},
};
export default controller;
