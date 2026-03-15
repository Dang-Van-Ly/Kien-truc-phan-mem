module.exports = {
    execute: (post) => {
        const count = post.content ? post.content.split(/\s+/).length : 0;
        return { ...post, wordCount: count };
    }
};