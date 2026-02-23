const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Base directory for storage
const STORAGE_DIR = __dirname;

// Folders to exclude from listing
const EXCLUDED = ['.git', 'node_modules', '.DS_Store', 'package.json', 'package-lock.json', 'server.js', 'Dockerfile', '.dockerignore'];

// Get all categories (folders)
app.get('/api/categories', (req, res) => {
  try {
    const items = fs.readdirSync(STORAGE_DIR);
    const categories = items.filter(item => {
      const itemPath = path.join(STORAGE_DIR, item);
      return fs.statSync(itemPath).isDirectory() && !EXCLUDED.includes(item);
    });

    const result = categories.map(cat => ({
      name: cat,
      path: `/api/categories/${encodeURIComponent(cat)}`,
      filesUrl: `/api/categories/${encodeURIComponent(cat)}/files`
    }));

    res.json({ categories: result, count: result.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get files in a category
app.get('/api/categories/:category/files', (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category);
    const categoryPath = path.join(STORAGE_DIR, category);

    if (!fs.existsSync(categoryPath)) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const items = fs.readdirSync(categoryPath);
    const files = items
      .filter(item => !EXCLUDED.includes(item))
      .map(file => {
        const filePath = path.join(categoryPath, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();

        return {
          name: file,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          type: getFileType(ext),
          extension: ext,
          url: `/api/files/${encodeURIComponent(category)}/${encodeURIComponent(file)}`,
          downloadUrl: `/api/download/${encodeURIComponent(category)}/${encodeURIComponent(file)}`
        };
      });

    res.json({
      category,
      files,
      count: files.length,
      totalSize: formatBytes(files.reduce((acc, f) => acc + f.size, 0))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get/stream a file
app.get('/api/files/:category/:filename', (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category);
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(STORAGE_DIR, category, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const ext = path.extname(filename).toLowerCase();
    const contentType = getContentType(ext);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download a file
app.get('/api/download/:category/:filename', (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category);
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(STORAGE_DIR, category, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all files (flat list)
app.get('/api/files', (req, res) => {
  try {
    const items = fs.readdirSync(STORAGE_DIR);
    const allFiles = [];

    items.forEach(item => {
      const itemPath = path.join(STORAGE_DIR, item);
      if (fs.statSync(itemPath).isDirectory() && !EXCLUDED.includes(item)) {
        const files = fs.readdirSync(itemPath);
        files.forEach(file => {
          if (!EXCLUDED.includes(file)) {
            const filePath = path.join(itemPath, file);
            const stats = fs.statSync(filePath);
            const ext = path.extname(file).toLowerCase();

            allFiles.push({
              name: file,
              category: item,
              size: stats.size,
              sizeFormatted: formatBytes(stats.size),
              type: getFileType(ext),
              extension: ext,
              url: `/api/files/${encodeURIComponent(item)}/${encodeURIComponent(file)}`
            });
          }
        });
      }
    });

    res.json({ files: allFiles, count: allFiles.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search files
app.get('/api/search', (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase();
    const type = req.query.type; // 'image' or 'video'

    if (!query && !type) {
      return res.status(400).json({ error: 'Please provide search query (q) or type filter' });
    }

    const items = fs.readdirSync(STORAGE_DIR);
    const results = [];

    items.forEach(item => {
      const itemPath = path.join(STORAGE_DIR, item);
      if (fs.statSync(itemPath).isDirectory() && !EXCLUDED.includes(item)) {
        const files = fs.readdirSync(itemPath);
        files.forEach(file => {
          if (!EXCLUDED.includes(file)) {
            const ext = path.extname(file).toLowerCase();
            const fileType = getFileType(ext);
            const matchesQuery = !query || file.toLowerCase().includes(query) || item.toLowerCase().includes(query);
            const matchesType = !type || fileType === type;

            if (matchesQuery && matchesType) {
              const filePath = path.join(itemPath, file);
              const stats = fs.statSync(filePath);

              results.push({
                name: file,
                category: item,
                size: stats.size,
                sizeFormatted: formatBytes(stats.size),
                type: fileType,
                extension: ext,
                url: `/api/files/${encodeURIComponent(item)}/${encodeURIComponent(file)}`
              });
            }
          }
        });
      }
    });

    res.json({ results, count: results.length, query, type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    name: 'Yafit Storage API',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      allFiles: '/api/files',
      categoryFiles: '/api/categories/:category/files',
      getFile: '/api/files/:category/:filename',
      downloadFile: '/api/download/:category/:filename',
      search: '/api/search?q=query&type=image|video',
      health: '/api/health'
    }
  });
});

// Helper functions
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileType(ext) {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const videoExts = ['.mov', '.mp4', '.avi', '.mkv', '.webm'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  return 'other';
}

function getContentType(ext) {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm'
  };
  return types[ext] || 'application/octet-stream';
}

app.listen(PORT, () => {
  console.log(`Yafit Storage API running on port ${PORT}`);
});
