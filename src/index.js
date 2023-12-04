import express from 'express';
import v1_routes from './routes/v1/index.js';
import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/api/v1', v1_routes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.listen(PORT, async () => console.log(`Server running on port: http://localhost:${PORT}`));
