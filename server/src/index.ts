import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/database';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../../client/build')));


connectMongoDB();


app.use('/api/auth', authRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
