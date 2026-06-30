const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    const isBinary = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(contentType);

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
            if (isBinary) {
                res.end(content);
            } else {
                res.end(content, 'utf-8');
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 宁波智慧文旅三维地图服务已启动！`);
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`\n功能说明:`);
    console.log(`  • 🌍 滚轮缩放场景`);
    console.log(`  • 🖱️ 左键拖拽平移`);
    console.log(`  • 🔄 右键旋转视角`);
    console.log(`  • 📍 点击景点标记查看详情`);
    console.log(`  • 🖱️ 悬停景点显示介绍`);
    console.log(`  • 🤖 点击右下角按钮打开AI导游`);
    console.log(`\n按 Ctrl+C 停止服务`);
});