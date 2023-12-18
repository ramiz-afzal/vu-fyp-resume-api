import fileModel from '../models/fileModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntry: async (req, res) => {
		const fileId = req.params?.id;
		if (!fileId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'File ID is required',
					},
				],
			});
		}

		const file = await fileModel.getEntry(fileId);
		if (!file) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ file: file });
	},
	createEntry: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			if (!req.file || !req.file.buffer) {
				return res.status(422).json({
					errors: [
						{
							type: 'fileMissing',
							msg: 'No file provided',
						},
					],
				});
			}

			const file = await fileModel.createEntry(req.file);
			if (!file) {
				return res.status(500).send({ message: 'Something went wrong' });
			}

			return res.status(200).send({ file: file, message: 'file created' });
		} catch (error) {
			res.status(500).send({ message: 'Something went wrong' });
		}
	},
	deleteEntry: async (req, res) => {
		try {
			const fileId = req.params?.id;
			if (!fileId) {
				return res.status(400).json({
					errors: [
						{
							type: 'missingParam',
							msg: 'File ID is required',
						},
					],
				});
			}

			const file = await fileModel.getEntry(fileId);
			if (!file) {
				return res.status(404).json({
					errors: [
						{
							type: 'notFound',
							msg: 'Resource does not exists',
						},
					],
				});
			}

			const result = await fileModel.deleteEntry(fileId);
			if (!result) {
				return res.status(500).send({ message: 'Something went wrong' });
			}

			return res.status(200).send({ file: file, message: 'file deleted' });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: 'Something went wrong' });
		}
	},
};
export default controller;
