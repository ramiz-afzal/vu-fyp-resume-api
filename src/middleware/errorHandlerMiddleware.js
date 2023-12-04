export default (err, req, res, next) => {
	let statusCode = err.status || 500;
	res.status(statusCode).send({ error: { message: err.message } });
};
