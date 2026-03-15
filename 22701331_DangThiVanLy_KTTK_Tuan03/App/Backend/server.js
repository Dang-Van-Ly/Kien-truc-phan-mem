const express = require('express');
const cors = require('cors');
const pluginManager = require('./core/pluginManager');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = 3000;

app.use(cors()); // Cho phép Frontend truy cập
app.use(express.json());

// 1. Nạp Plugin trước
pluginManager.loadPlugins();

// 2. Cấu hình Routes
app.use('/api/posts', postRoutes);

// Route cho root
app.get('/', (req, res) => {
    res.send('Backend API is running. Use /api/posts for posts.');
});

app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});