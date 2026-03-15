module.exports = {
    execute: (post) => {
        return { 
            ...post, 
            createdAt: post.createdAt || new Date().toLocaleString('vi-VN') 
        };
    }
};