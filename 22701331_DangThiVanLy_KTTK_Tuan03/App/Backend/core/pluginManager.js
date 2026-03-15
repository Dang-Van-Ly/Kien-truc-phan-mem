const fs = require('fs');
const path = require('path');

class PluginManager {
    constructor() { this.plugins = []; }
    loadPlugins() {
        const pluginsDir = path.join(__dirname, '../plugins');
        if (fs.existsSync(pluginsDir)) {
            const files = fs.readdirSync(pluginsDir);
            this.plugins = files
                .filter(file => file.endsWith('.js'))
                .map(file => require(path.join(pluginsDir, file)));
            console.log(`🔌 Đã nạp ${this.plugins.length} plugins`);
        }
    }
    runPlugins(post) {
        let processedPost = { ...post };
        this.plugins.forEach(plugin => {
            if (plugin && typeof plugin.execute === 'function') {
                processedPost = plugin.execute(processedPost);
            }
        });
        return processedPost;
    }
}
module.exports = new PluginManager();