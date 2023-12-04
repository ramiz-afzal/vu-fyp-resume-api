export default (req, res, next) => {
	try {
		const roles = req?.user?.UserRole || null;
		if (!roles) {
			return res.status(401).send({ message: 'Unauthorized' });
		}

		let isAdmin = false;
		roles.forEach(function (userRole) {
			if (userRole?.role?.id == 1) {
				isAdmin = true;
			}
		});

		if (isAdmin == false) {
			return res.status(401).send({ message: 'Unauthorized' });
		}

		req.isAdmin = true;
		next();
	} catch (error) {
		return res.status(500).send({ message: 'Something went wrong' });
	}
};
