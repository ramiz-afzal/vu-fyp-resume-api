import userModel from '../models/userModel.js';
import resumeModel from '../models/resumeModel.js';
import companyModel from '../models/companyModel.js';
import { validationResult } from 'express-validator';
const controller = {
	getEntries: async (req, res) => {
		try {
			const users = await userModel.getEntries();
			res.status(200).send({ users: users });
		} catch (error) {
			res.status(500).send({ message: 'Something went wrong' });
		}
	},
	getEntry: async (req, res) => {
		const userId = req.params?.id;
		if (!userId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'User ID is required',
					},
				],
			});
		}

		const user = await userModel.getEntryBy(userId);
		if (!user) {
			return res.status(404).json({
				errors: [
					{
						type: 'notFound',
						msg: 'Resource does not exists',
					},
				],
			});
		}

		return res.status(200).send({ user: user });
	},
	getResume: async (req, res) => {
		const userId = req.params?.id;
		if (!userId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'User ID is required',
					},
				],
			});
		}

		const resume = await resumeModel.getUserResume(userId);
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
	getCompany: async (req, res) => {
		const userId = req.params?.id;
		if (!userId) {
			return res.status(400).json({
				errors: [
					{
						type: 'missingParam',
						msg: 'User ID is required',
					},
				],
			});
		}

		const company = await companyModel.getUserCompany(userId);
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
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			let data = {};
			data.email = req.body.email;
			data.password = req.body.password;
			data.firstName = req.body.firstName;
			data.lastName = req.body.lastName;
			data.gender = req.body.gender;
			data.dob = req.body.dob;
			data.accountType = req.body.accountType;

			if (req.body.middleName) {
				data.middleName = req.body.middleName;
			}

			const result = await userModel.getEntryBy(data.email, 'email');
			if (result) {
				return res.status(422).json({
					errors: [
						{
							type: 'emailAlreadyExists',
							msg: 'This emails is already in use',
						},
					],
				});
			}

			const user = await userModel.createUser(data);
			if (!user) {
				return res.status(500).send({ message: 'Something went wrong' });
			}

			return res.status(200).send({ user: user, message: 'user created' });
		} catch (error) {
			res.status(500).send({ message: 'Something went wrong' });
		}
	},
	updateEntry: async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const userId = req.params?.id;
			if (!userId) {
				return res.status(400).json({
					errors: [
						{
							type: 'missingParam',
							msg: 'User ID is required',
						},
					],
				});
			}

			const user = await userModel.getEntryBy(userId);
			if (!user) {
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
			data.firstName = req.body.firstName;
			data.lastName = req.body.lastName;
			data.gender = req.body.gender;
			data.dob = req.body.dob;

			if (req.body.middleName) {
				data.middleName = req.body.middleName;
			}

			const updatedUser = await userModel.updateEntry(userId, data);
			if (!updatedUser) {
				return res.status(500).send({ message: 'Something went wrong' });
			}

			return res.status(200).send({ user: updatedUser, message: 'user updated' });
		} catch (error) {
			res.status(500).send({ message: 'Something went wrong' });
		}
	},
	deleteEntry: async (req, res) => {
		try {
			const userId = req.params?.id;
			if (!userId) {
				return res.status(400).json({
					errors: [
						{
							type: 'missingParam',
							msg: 'User ID is required',
						},
					],
				});
			}

			const user = await userModel.getEntryBy(userId);
			if (!user) {
				return res.status(404).json({
					errors: [
						{
							type: 'notFound',
							msg: 'Resource does not exists',
						},
					],
				});
			}

			const result = await userModel.deleteEntry(userId);
			if (!result) {
				return res.status(500).send({ message: 'Something went wrong' });
			}

			return res.status(200).send({ user: user, message: 'user deleted' });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: 'Something went wrong' });
		}
	},
};
export default controller;
