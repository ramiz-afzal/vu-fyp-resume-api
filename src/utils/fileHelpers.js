import path from 'path';
export default {
	getExtension(filename) {
		var i = filename.lastIndexOf('.');
		return i < 0 ? '' : filename.substr(i);
	},
	getRootDir() {
		return process.cwd();
	},
	getFilesDir() {
		return '/files/public';
	},
};
