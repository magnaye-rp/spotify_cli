# Spotify CLI - Local Music Terminal Client

A command-line Spotify client that runs locally on your machine, letting you search, stream, and download music while keeping your data private.

## Features

✨ **Core Features**
- 🔐 OAuth2 authentication (secure SSO login)
- 🔍 Search tracks, artists, and playlists
- ▶️ Local playback with full controls
- ⬇️ Download music directly to `~/Music/spotify`
- ❤️ Manage your saved tracks and playlists
- 🎛️ Full playback control (play, pause, next, previous, volume)
- 🎮 Terminal UI with mouse support

## Privacy

Your authentication is handled locally. The app uses Spotify's official API for searching and streaming metadata. Downloaded music is stored on your machine in `~/Music/spotify`.

## Prerequisites

### System Requirements
- Node.js >= 14.0.0
- npm or yarn
- One of these audio players:
  - **mpv** (recommended)
  - ffplay
  - sox

### Spotify Developer Account
1. Go to https://developer.spotify.com/dashboard
2. Create an app to get `Client ID` and `Client Secret`
3. Set Redirect URI to `http://localhost:8888/callback`

### Download Tools
For the download feature to work, you'll need:
- **yt-dlp** - Audio downloader

## Installation

### Step 1: Clone or Download
```bash
git clone <repo-url> spotify-cli
cd spotify-cli
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Install System Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mpv yt-dlp
```

**macOS (with Homebrew):**
```bash
brew install mpv yt-dlp
```

**Fedora:**
```bash
sudo dnf install mpv yt-dlp
```

**Arch:**
```bash
sudo pacman -S mpv yt-dlp
```

### Step 4: Set Spotify Credentials

Get your credentials from https://developer.spotify.com/dashboard

```bash
export SPOTIFY_CLIENT_ID="your_client_id_here"
export SPOTIFY_CLIENT_SECRET="your_client_secret_here"
```

To make this permanent, add to your `~/.bashrc` or `~/.zshrc`:
```bash
echo 'export SPOTIFY_CLIENT_ID="your_client_id"' >> ~/.bashrc
echo 'export SPOTIFY_CLIENT_SECRET="your_client_secret"' >> ~/.bashrc
source ~/.bashrc
```

### Step 5: First Run
```bash
node index.js
```

The app will:
1. Open your browser for Spotify login
2. Create authentication tokens in `~/.spotify-cli/`
3. Launch the terminal UI

### Optional: Install Globally

```bash
npm install -g .
# Then run anywhere with:
spotify-cli
```

## Usage

### Main Menu
Navigate with `↑` and `↓` arrow keys, select with `Enter`:

| Option | Action |
|--------|--------|
| 🔍 Search Tracks | Find and play songs |
| 🎤 Search Artists | Browse artist profiles |
| 📋 Search Playlists | Find public playlists |
| ❤️ Saved Tracks | View your liked songs |
| 📂 Your Playlists | Access your playlists |
| 🎛️ Now Playing | View current playback & queue |
| ⬇️ Downloads | Manage downloaded music |
| ⚙️ Settings | App settings |

### Keyboard Shortcuts

**Global:**
- `q` - Quit application
- `↑`/`↓` - Navigate menus

**Playback Control:**
- `space` - Play/Pause
- `n` - Next track
- `p` - Previous track
- `+` - Volume up
- `-` - Volume down

**Search Results:**
- `p` - Play selected track
- `d` - Download selected track
- `s` - Save/Unsave track
- `↑`/`↓` - Navigate results

**Downloads:**
- `d` - Download track from search
- `r` - Delete downloaded track
- `↑`/`↓` - Navigate downloads

## File Structure

```
spotify-cli/
├── index.js              # Entry point
├── package.json          # Dependencies
├── src/
│   ├── auth.js          # OAuth2 authentication
│   ├── api.js           # Spotify API wrapper
│   ├── player.js        # Local audio player
│   ├── downloader.js    # Music downloader
│   └── ui.js            # Terminal UI
└── README.md            # This file
```

## Configuration

Configuration is stored in `~/.spotify-cli/`:

```
~/.spotify-cli/
├── config.json          # Spotify API credentials
└── token.json          # OAuth tokens (auto-generated)
```

**Important:** Never share your token.json or credentials!

## How It Works

### Authentication Flow
1. Your app opens Spotify's login page
2. You authenticate with your Spotify account
3. Spotify redirects to `localhost:8888` with an auth code
4. App exchanges code for access tokens
5. Tokens are stored locally, refreshed automatically

### Playback
- Search queries hit Spotify's API
- Track metadata is fetched from Spotify
- Audio preview/streaming uses local player (mpv/ffplay)
- Commands are sent via stdin to the player process

### Downloads
- Downloads use yt-dlp to find and download the song
- Downloaded music is stored in `~/Music/spotify`
- ID3 tags are preserved when available
- Duplicate checks prevent re-downloads

## Troubleshooting

### "No audio player found"
Install one of the supported players:
```bash
# Ubuntu/Debian
sudo apt-get install mpv

# macOS
brew install mpv

# Fedora
sudo dnf install mpv
```

### "Authentication timeout"
Make sure your browser can reach `localhost:8888`. If behind a proxy, update your Spotify app's Redirect URI settings.

### Download fails
- Check that yt-dlp is installed: `which yt-dlp`
- Update yt-dlp: `pip install --upgrade yt-dlp`
- Some songs may be region-restricted

### Playback is quiet or has no sound
- Check system volume: `volume` (depends on OS)
- Adjust app volume with `+` and `-` keys
- Try a different audio player

### Missing credentials error
```bash
export SPOTIFY_CLIENT_ID="your_id"
export SPOTIFY_CLIENT_SECRET="your_secret"
node index.js
```

## Limitations

- **Spotify API Limits:** Search and playback metadata only (official API)
- **Downloads:** Limited by yt-dlp availability and content availability
- **Preview Streaming:** Some tracks may have preview limitations based on region
- **No Web Playback:** This app uses local players only

## Privacy & Terms of Service

⚠️ **Important:** 
- This app respects Spotify's Terms of Service
- Downloads are for personal use only
- Your login credentials are never stored - only access tokens
- All music metadata stays local on your machine
- Downloaded music is for offline listening on devices you own

## Performance Tips

1. **Faster Searches:** More specific queries return faster results
2. **Storage:** Downloads use significant space. Monitor `~/Music/spotify`
3. **Playback:** Lower quality previews play faster than full songs
4. **Updates:** Keep yt-dlp updated for reliable downloads

## Uninstall

```bash
# Remove app files
rm -rf ~/spotify-cli
rm -rf ~/.spotify-cli

# Remove global installation (if installed)
npm uninstall -g spotify-cli
```

## Contributing

Feel free to improve this app! Areas for contribution:
- Better UI/UX in the terminal
- Additional audio player support
- Improved download management
- Playlist creation/editing
- Custom themes

## License

MIT License - Use freely, modify as needed.

## Support

Issues? Check:
1. Node.js version: `node --version` (should be >= 14)
2. Spotify credentials are set
3. System dependencies installed: `which mpv`, `which yt-dlp`
4. Network connectivity to Spotify API

## Version History

### v1.0.0 (Initial Release)
- OAuth2 authentication
- Track/artist/playlist search
- Local playback control
- Download management
- Saved tracks management
- Terminal UI with blessed

---

**🎵 Happy streaming! Keep your music local, keep your privacy intact.**
