const { spawn } = require('child_process');
const EventEmitter = require('events');
const path = require('path');

class Player extends EventEmitter {
  constructor() {
    super();
    this.currentProcess = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.queue = [];
    this.currentIndex = 0;
    this.volume = 100;
  }

  play(filePath, trackInfo = null) {
    return new Promise((resolve, reject) => {
      // Kill existing process if any
      if (this.currentProcess) {
        this.currentProcess.kill();
      }

      this.currentTrack = trackInfo;
      this.isPlaying = true;

      // Try mpv first, fallback to ffplay
      const command = this.getPlayerCommand();
      
      try {
        this.currentProcess = spawn(command, this.getPlayerArgs(filePath), {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        this.currentProcess.on('close', () => {
          this.isPlaying = false;
          this.emit('track-ended');
          if (this.currentIndex < this.queue.length - 1) {
            this.playNext();
          }
        });

        this.currentProcess.on('error', (error) => {
          this.isPlaying = false;
          reject(new Error(`Player error: ${error.message}`));
        });

        this.emit('playing', trackInfo);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  pause() {
    if (this.currentProcess && this.isPlaying) {
      this.currentProcess.stdin.write('p'); // pause command for mpv
      this.isPlaying = false;
      this.emit('paused');
    }
  }

  resume() {
    if (this.currentProcess && !this.isPlaying) {
      this.currentProcess.stdin.write('p'); // toggle pause
      this.isPlaying = true;
      this.emit('resumed');
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  stop() {
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
    this.isPlaying = false;
    this.currentTrack = null;
    this.emit('stopped');
  }

  setVolume(percent) {
    const volume = Math.min(100, Math.max(0, percent));
    this.volume = volume;

    if (this.currentProcess && this.isPlaying) {
      // MPV volume adjustment (0-100)
      this.currentProcess.stdin.write(`V ${volume}\n`);
      this.emit('volume-changed', volume);
    }
  }

  increaseVolume(amount = 5) {
    this.setVolume(this.volume + amount);
  }

  decreaseVolume(amount = 5) {
    this.setVolume(this.volume - amount);
  }

  setQueue(tracks) {
    this.queue = tracks;
    this.currentIndex = 0;
    this.emit('queue-updated', this.queue);
  }

  addToQueue(track) {
    this.queue.push(track);
    this.emit('queue-updated', this.queue);
  }

  clearQueue() {
    this.queue = [];
    this.currentIndex = 0;
    this.emit('queue-updated', this.queue);
  }

  async playNext() {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      const nextTrack = this.queue[this.currentIndex];
      this.emit('next-track', nextTrack);
      return nextTrack;
    }
  }

  async playPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const prevTrack = this.queue[this.currentIndex];
      this.emit('previous-track', prevTrack);
      return prevTrack;
    }
  }

  getPlayerCommand() {
    // Check for available players
    const { execSync } = require('child_process');
    
    try {
      execSync('which mpv', { stdio: 'ignore' });
      return 'mpv';
    } catch {
      try {
        execSync('which ffplay', { stdio: 'ignore' });
        return 'ffplay';
      } catch {
        try {
          execSync('which play', { stdio: 'ignore' });
          return 'play'; // sox
        } catch {
          throw new Error(
            'No audio player found. Install mpv, ffplay, or sox:\n' +
            '  Ubuntu/Debian: sudo apt-get install mpv\n' +
            '  macOS: brew install mpv\n' +
            '  Fedora: sudo dnf install mpv'
          );
        }
      }
    }
  }

  getPlayerArgs(filePath) {
    const command = this.getPlayerCommand();
    
    switch (command) {
      case 'mpv':
        return [
          '--no-video',
          '--volume=100',
          filePath
        ];
      case 'ffplay':
        return [
          '-nodisp',
          '-autoexit',
          filePath
        ];
      case 'play':
        return [filePath];
      default:
        return [filePath];
    }
  }
}

module.exports = Player;
