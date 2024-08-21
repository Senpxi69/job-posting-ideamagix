const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const jobRoutes = require('./routes/jobRoutes')
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect("mongodb://localhost:27017/job-posting", {
}).then(() => {
    console.log("DB connection succesfull");
}).catch(error => {
    console.log(error)
})

app.use('/auth', userRoutes);
app.use('/candidate', candidateRoutes);
app.use('/admin', jobRoutes)
app.use('/application', applicationRoutes)

app.listen(port, () => {
    console.log(`the app is running on port ${port}`)
})