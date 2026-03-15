const fs = require('fs');
const path = require('path');
const pluginManager = require('../core/pluginManager');

const DATA_PATH = path.join(__dirname, '..', 'data', 'posts.json');

const postController = {
    getAllPosts: (req, res) => {
        try {
            if (!fs.existsSync(DATA_PATH)) return res.json([]);
            const data = fs.readFileSync(DATA_PATH, 'utf-8');
            const posts = JSON.parse(data || '[]');
            const enrichedPosts = posts.map(post => pluginManager.runPlugins(post));
            res.json(enrichedPosts);
        } catch (error) {
            res.status(500).json({ error: "Lỗi đọc dữ liệu" });
        }
    },

    createPost: (req, res) => {
    try {
        const { title, content, author } = req.body;
        console.log("📥 Dữ liệu nhận được:", req.body); // Kiểm tra xem data có tới được đây không

        if (!fs.existsSync(DATA_PATH)) {
            // Nếu chưa có file, tạo mảng mới luôn
            fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
        }

        const fileContent = fs.readFileSync(DATA_PATH, 'utf-8');
        let posts = [];
        
        try {
            posts = JSON.parse(fileContent || '[]');
        } catch (parseError) {
            console.error("❌ File JSON bị hỏng, đang reset lại mảng.");
            posts = [];
        }

        const newPost = {
            id: Date.now(),
            title,
            content,
            author: author || "Nặc danh",
            createdAt: new Date().toLocaleString('vi-VN')
        };

        posts.push(newPost);
        fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2));
        
        console.log("✅ Đã lưu bài viết thành công!");
        res.status(201).json(newPost);
    } catch (error) {
        console.error("❌ Lỗi chi tiết tại Controller:", error);
        res.status(500).json({ message: error.message });
    }
    }};

module.exports = postController;