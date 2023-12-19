import express from 'express';
import v1_routes from './routes/v1/index.js';
import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(express.json());
app.use('/files', express.static(path.join(__dirname, '/files')));
app.use('/api/v1', v1_routes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.listen(PORT, async () => console.log(`Server running on port: http://localhost:${PORT}`));
