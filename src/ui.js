const blessed = require('blessed');
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');

class UIManager {
  constructor(spotifyAPI, player, downloader) {
    this.api = spotifyAPI;
    this.player = player;
    this.downloader = downloader;
    
    this.screen = null;
    this.mainMenu = null;
    this.currentView = 'main';
    this.searchResults = [];
    this.currentPlaylist = null;
    this.savedTracks = [];
    
    this.setupScreen();
  }

  setupScreen() {
    this.screen = blessed.screen({
      mouse: true,
      title: 'Spotify CLI'
    });

    // Handle exit
    this.screen.key(['escape', 'q'], () => {
      this.player.stop();
      process.exit(0);
    });

    // Create main layout
    this.headerBox = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      style: {
        bg: 'blue',
        fg: 'white'
      },
      content: ' 🎵  Spotify CLI  (q to quit)'
    });

    this.mainMenu = blessed.list({
      parent: this.screen,
      top: 3,
      left: 0,
      width: 30,
      height: '100%-7',
      style: {
        selected: {
          bg: 'cyan',
          fg: 'black'
        },
        item: {
          fg: 'white'
        }
      },
      mouse: true,
      keys: true,
      vi: true
    });

    this.contentBox = blessed.box({
      parent: this.screen,
      top: 3,
      left: 30,
      width: 'calc(100%-30)',
      height: '100%-7',
      style: {
        fg: 'white'
      },
      scrollable: true,
      keys: true,
      vi: true,
      mouse: true
    });

    this.statusBar = blessed.box({
      parent: this.screen,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 4,
      style: {
        bg: 'black',
        fg: 'green'
      },
      content: 'Ready'
    });

    this.setupMainMenu();
    this.updateStatus('Initializing...');
  }

  setupMainMenu() {
    this.mainMenu.setItems([
      '🔍 Search Tracks',
      '🎤 Search Artists',
      '📋 Search Playlists',
      '❤️  Saved Tracks',
      '📂 Your Playlists',
      '🎛️  Now Playing',
      '⬇️  Downloads',
      '⚙️  Settings',
      'ℹ️  About'
    ]);

    this.mainMenu.on('select', (item, index) => {
      this.handleMenuSelect(index);
    });
  }

  async handleMenuSelect(index) {
    switch (index) {
      case 0:
        await this.showSearchTracks();
        break;
      case 1:
        await this.showSearchArtists();
        break;
      case 2:
        await this.showSearchPlaylists();
        break;
      case 3:
        await this.showSavedTracks();
        break;
      case 4:
        await this.showYourPlaylists();
        break;
      case 5:
        await this.showNowPlaying();
        break;
      case 6:
        await this.showDownloads();
        break;
      case 7:
        await this.showSettings();
        break;
      case 8:
        this.showAbout();
        break;
    }
  }

  async showSearchTracks() {
    const input = await this.getInput('Search for a track: ');
    if (!input) return;

    this.updateStatus('Searching...');
    try {
      const tracks = await this.api.searchTracks(input, 20);
      await this.displayTrackList(tracks, 'Search Results');
    } catch (error) {
      this.showError(`Search failed: ${error.message}`);
    }
  }

  async showSearchArtists() {
    const input = await this.getInput('Search for an artist: ');
    if (!input) return;

    this.updateStatus('Searching...');
    try {
      const artists = await this.api.searchArtists(input, 20);
      await this.displayArtistList(artists);
    } catch (error) {
      this.showError(`Search failed: ${error.message}`);
    }
  }

  async showSearchPlaylists() {
    const input = await this.getInput('Search for a playlist: ');
    if (!input) return;

    this.updateStatus('Searching...');
    try {
      const playlists = await this.api.searchPlaylists(input, 20);
      await this.displayPlaylistList(playlists);
    } catch (error) {
      this.showError(`Search failed: ${error.message}`);
    }
  }

  async showSavedTracks() {
    this.updateStatus('Loading saved tracks...');
    try {
      const response = await this.api.getSavedTracks(50);
      const tracks = response.items.map(item => item.track);
      this.savedTracks = tracks;
      await this.displayTrackList(tracks, 'Your Saved Tracks');
    } catch (error) {
      this.showError(`Failed to load saved tracks: ${error.message}`);
    }
  }

  async showYourPlaylists() {
    this.updateStatus('Loading playlists...');
    try {
      const response = await this.api.getCurrentUserPlaylists(50);
      const playlists = response.items;
      await this.displayPlaylistList(playlists);
    } catch (error) {
      this.showError(`Failed to load playlists: ${error.message}`);
    }
  }

  async displayTrackList(tracks, title) {
    this.contentBox.setContent('');
    let content = `\n{bold}${title}{/bold}\n`;
    content += '─'.repeat(60) + '\n\n';

    tracks.forEach((track, index) => {
      const artists = track.artists.map(a => a.name).join(', ');
      const duration = this.formatDuration(track.duration_ms);
      content += `{cyan}${index + 1}.{/} {bold}${track.name}{/bold}\n`;
      content += `   ${artists} • ${duration}\n\n`;
    });

    content += '\n{yellow}Keyboard:' +
      '\n  p - Play selected' +
      '\n  d - Download' +
      '\n  s - Save/Unsave' +
      '\n  ↑/↓ - Navigate' +
      '\n  q - Back{/}\n';

    this.contentBox.setContent(content);

    this.searchResults = tracks;
    this.screen.render();
  }

  async displayArtistList(artists) {
    this.contentBox.setContent('');
    let content = '\n{bold}Artist Results{/bold}\n';
    content += '─'.repeat(60) + '\n\n';

    artists.forEach((artist, index) => {
      const followers = artist.followers?.total?.toLocaleString() || 'N/A';
      content += `{cyan}${index + 1}.{/} {bold}${artist.name}{/bold}\n`;
      content += `   ${artist.genres.slice(0, 3).join(', ') || 'No genre info'} • ${followers} followers\n\n`;
    });

    content += '\n{yellow}Keyboard:' +
      '\n  t - View top tracks' +
      '\n  ↑/↓ - Navigate' +
      '\n  q - Back{/}\n';

    this.contentBox.setContent(content);
    this.searchResults = artists;
    this.screen.render();
  }

  async displayPlaylistList(playlists) {
    this.contentBox.setContent('');
    let content = '\n{bold}Playlists{/bold}\n';
    content += '─'.repeat(60) + '\n\n';

    playlists.forEach((playlist, index) => {
      content += `{cyan}${index + 1}.{/} {bold}${playlist.name}{/bold}\n`;
      content += `   ${playlist.tracks?.total || 0} tracks • By {blue}${playlist.owner.display_name}{/blue}\n\n`;
    });

    content += '\n{yellow}Keyboard:' +
      '\n  p - Play playlist' +
      '\n  ↑/↓ - Navigate' +
      '\n  q - Back{/}\n';

    this.contentBox.setContent(content);
    this.searchResults = playlists;
    this.screen.render();
  }

  async showNowPlaying() {
    let content = '\n{bold}Now Playing{/bold}\n';
    content += '─'.repeat(60) + '\n\n';

    if (this.player.currentTrack) {
      content += `{bold}${this.player.currentTrack.name}{/bold}\n`;
      content += `${this.player.currentTrack.artists.map(a => a.name).join(', ')}\n`;
      content += `Album: ${this.player.currentTrack.album}\n`;
      content += `Duration: ${this.formatDuration(this.player.currentTrack.duration_ms)}\n`;
      content += `Status: ${this.player.isPlaying ? '{green}Playing{/}' : '{red}Paused{/}'}\n`;
    } else {
      content += 'No track currently playing\n';
    }

    content += '\n\nQueue:\n';
    if (this.player.queue.length > 0) {
      this.player.queue.slice(0, 10).forEach((track, index) => {
        const isCurrent = index === this.player.currentIndex;
        content += `${isCurrent ? '► ' : '  '}${index + 1}. ${track.name}\n`;
      });
    } else {
      content += 'Queue is empty\n';
    }

    content += '\n\n{yellow}Keyboard:' +
      '\n  space - Play/Pause' +
      '\n  n - Next' +
      '\n  p - Previous' +
      '\n  + - Volume up' +
      '\n  - - Volume down' +
      '\n  c - Clear queue' +
      '\n  q - Back{/}\n';

    this.contentBox.setContent(content);
    this.screen.render();
  }

  async showDownloads() {
    let content = '\n{bold}Downloaded Tracks{/bold}\n';
    content += '─'.repeat(60) + '\n\n';

    const downloads = this.downloader.getDownloadedTracks();
    const totalSize = this.downloader.getDownloadDirSize();

    if (downloads.length > 0) {
      downloads.slice(0, 20).forEach((track, index) => {
        const size = this.downloader.formatBytes(track.size);
        content += `{cyan}${index + 1}.{/} ${track.name}\n`;
        content += `   Size: ${size}\n\n`;
      });
      content += `\n{green}Total: ${downloads.length} tracks${/} • ${this.downloader.formatBytes(totalSize)}\n`;
    } else {
      content += 'No downloaded tracks yet\n';
    }

    content += '\n\n{yellow}Keyboard:' +
      '\n  d - Download track from search' +
      '\n  r - Delete selected' +
      '\n  ↑/↓ - Navigate' +
      '\n  q - Back{/}\n';

    this.contentBox.setContent(content);
    this.screen.render();
  }

  async showSettings() {
    let content = '\n{bold}Settings{/bold}\n';
    content += '─'.repeat(60) + '\n\n';

    content += '{yellow}Volume:{/} ' + this.player.volume + '%\n';
    content += `{yellow}Download Directory:{/} ~/Music/spotify\n`;
    content += `{yellow}Downloaded Tracks:{/} ${this.downloader.getDownloadedTracks().length}\n`;

    content += '\n\n{yellow}Keyboard:' +
      '\n  c - Clear downloads' +
      '\n  l - Change local player' +
      '\n  q - Back{/}\n';

    this.contentBox.setContent(content);
    this.screen.render();
  }

  showAbout() {
    let content = '\n{bold}Spotify CLI v1.0.0{/bold}\n';
    content += '─'.repeat(60) + '\n\n';

    content += 'A command-line Spotify client for your local machine.\n\n';
    content += '{yellow}Features:{/}\n';
    content += '  • Search tracks, artists, and playlists\n';
    content += '  • Stream music locally\n';
    content += '  • Manage saved tracks\n';
    content += '  • Download music to ~/Music/spotify\n';
    content += '  • Full playback control\n\n';

    content += '{yellow}Keyboard Shortcuts:{/}\n';
    content += '  q - Quit application\n';
    content += '  space - Play/Pause\n';
    content += '  n - Next track\n';
    content += '  p - Previous track\n';
    content += '  ↑/↓ - Navigate menus\n\n';

    content += '{cyan}Created with ❤️ for local music streaming{/}\n';

    this.contentBox.setContent(content);
    this.screen.render();
  }

  async getInput(prompt) {
    return new Promise((resolve) => {
      const inputBox = blessed.textbox({
        parent: this.screen,
        top: 'center',
        left: 'center',
        width: 50,
        height: 5,
        style: {
          bg: 'blue',
          fg: 'white'
        },
        border: 'line',
        label: prompt
      });

      inputBox.focus();
      inputBox.key(['escape'], () => {
        inputBox.destroy();
        this.screen.render();
        resolve(null);
      });

      inputBox.key(['enter'], () => {
        const value = inputBox.getValue();
        inputBox.destroy();
        this.screen.render();
        resolve(value);
      });

      this.screen.render();
    });
  }

  updateStatus(message) {
    this.statusBar.setContent(` ${message}`);
    this.screen.render();
  }

  showError(message) {
    const errorBox = blessed.box({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: 60,
      height: 10,
      border: 'line',
      style: {
        border: { fg: 'red' },
        fg: 'red',
        bg: 'black'
      }
    });

    errorBox.setContent(`\n  Error:\n  ${message}\n\n  Press any key to continue...`);
    errorBox.focus();

    this.screen.key(['q', 'space', 'enter'], () => {
      errorBox.destroy();
      this.screen.render();
    });

    this.screen.render();
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  async start() {
    this.screen.render();
    this.updateStatus('Ready. Use arrow keys to navigate. Press q to quit.');
  }
}

module.exports = UIManager;
