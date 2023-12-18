import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

export default (req, res, next) => {
	try {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				console.log(err);
				return res.status(500).send({ message: 'Something went wrong' });
			} else if (err) {
				console.log(err);
				return res.status(500).send({ message: 'Something went wrong' });
			}
			next();
		});
	} catch (error) {
		return res.status(500).send({ message: 'Something went wrong' });
	}
};
