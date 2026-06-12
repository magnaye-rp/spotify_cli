const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');
const chalk = require('chalk');

class Downloader {
  constructor() {
    this.downloadDir = path.join(process.env.HOME, 'Music', 'spotify');
    this.isDownloading = false;
  }

  async checkDependencies() {
    const dependencies = ['yt-dlp'];
    const missing = [];

    for (const dep of dependencies) {
      try {
        execSync(`which ${dep}`, { stdio: 'ignore' });
      } catch {
        missing.push(dep);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing dependencies: ${missing.join(', ')}\n` +
        'Install with:\n' +
        '  sudo apt-get install yt-dlp  # Ubuntu/Debian\n' +
        '  brew install yt-dlp           # macOS\n' +
        '  sudo dnf install yt-dlp       # Fedora\n'
      );
    }
  }

  async downloadTrack(trackInfo) {
    await this.checkDependencies();

    return new Promise(async (resolve, reject) => {
      this.isDownloading = true;

      // Build search query from track info
      const searchQuery = `${trackInfo.name} ${trackInfo.artists.map(a => a.name).join(' ')}`;
      const safeFilename = this.sanitizeFilename(searchQuery);
      const outputPath = path.join(this.downloadDir, `${safeFilename}.mp3`);

      // Check if already downloaded
      if (fs.existsSync(outputPath)) {
        this.isDownloading = false;
        resolve({
          success: true,
          message: 'Already downloaded',
          path: outputPath
        });
        return;
      }

      try {
        const command = [
          'yt-dlp',
          '-f', 'bestaudio',
          '-x',
          '--audio-format', 'mp3',
          '--audio-quality', '0',
          '-o', outputPath,
          `ytsearch1:${searchQuery}`
        ];

        execSync(command.join(' '), { 
          stdio: 'inherit',
          cwd: this.downloadDir
        });

        this.isDownloading = false;
        resolve({
          success: true,
          message: 'Downloaded successfully',
          path: outputPath
        });
      } catch (error) {
        this.isDownloading = false;
        reject({
          success: false,
          message: `Download failed: ${error.message}`,
          error
        });
      }
    });
  }

  async downloadPlaylist(playlistTracks) {
    const results = {
      succeeded: [],
      failed: []
    };

    for (const track of playlistTracks) {
      try {
        const result = await this.downloadTrack(track);
        results.succeeded.push(result);
      } catch (error) {
        results.failed.push({
          track: track.name,
          error: error.message
        });
      }
    }

    return results;
  }

  sanitizeFilename(filename) {
    return filename
      .replace(/[/\\?%*:|"<>]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100);
  }

  getDownloadedTracks() {
    if (!fs.existsSync(this.downloadDir)) {
      return [];
    }

    return fs.readdirSync(this.downloadDir)
      .filter(file => file.endsWith('.mp3'))
      .map(file => ({
        name: this.unSanitizeFilename(file.replace('.mp3', '')),
        path: path.join(this.downloadDir, file),
        size: fs.statSync(path.join(this.downloadDir, file)).size
      }));
  }

  unSanitizeFilename(filename) {
    return filename.replace(/_/g, ' ');
  }

  deleteDownloadedTrack(filename) {
    const filePath = path.join(this.downloadDir, `${filename}.mp3`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  getDownloadDirSize() {
    let totalSize = 0;
    
    if (!fs.existsSync(this.downloadDir)) {
      return 0;
    }

    const files = fs.readdirSync(this.downloadDir);
    files.forEach(file => {
      const filePath = path.join(this.downloadDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });

    return totalSize;
  }

  formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

module.exports = Downloader;
