const express = require('express');
const mongoose = require('mongoose');
 const cors = require('cors');
 require('dotenv').config();
 const app = express();
 // Middleware
 app.use(cors());
 app.use(express.json());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => {
	console.log('Connected to MongoDB');
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
})
.catch((error) => {
	console.error('Failed to connect to MongoDB:', error);
	process.exit(1);
});

// Basic route
app.get('/', (req, res) => {
	res.json({ message: 'Social Media AI Platform API' });
});