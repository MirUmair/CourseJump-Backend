require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);
dotenv.config();
connectDB();
const path = require('path');

const app = express();
app.use(cors());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'controllers')));

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
 
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
