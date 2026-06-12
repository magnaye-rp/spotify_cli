# 🎵 Spotify CLI - Project Complete

Your local Spotify terminal client is ready!

## What You're Getting

A **fully functional CLI Spotify application** with:

✨ **Features**

- OAuth2 login (browser-based, secure)
- Search tracks, artists, and playlists
- Local playback with full control
- Download music to ~/Music/spotify
- Save/manage liked tracks
- Terminal UI with mouse support
- Full privacy - runs on your machine only

## 📁 Project Files

```
spotify-cli/
├── index.js                    # Main entry point (run this!)
├── package.json               # Node dependencies
├── setup.sh                   # Automated setup script ⭐
├── README.md                  # Full documentation
├── QUICKSTART.md              # 5-minute setup guide ⭐
├── CONFIGURATION.md           # Detailed config help
├── .gitignore                 # Git security
└── src/
    ├── auth.js               # Spotify OAuth2
    ├── api.js                # Spotify API wrapper
    ├── player.js             # Local audio playback
    ├── downloader.js         # Music downloader
    └── ui.js                 # Terminal UI
```

## 🚀 Quick Start (Fastest Way)

### 1. Get Spotify Credentials (2 min)

- Go to https://developer.spotify.com/dashboard
- Log in with Spotify
- Click "Create an App"
- Copy your **Client ID** and **Client Secret**
- Add Redirect URI: `http://127.0.0.1:8888/callback`

### 2. Setup (3 min)

```bash
cd spotify-cli
chmod +x setup.sh
./setup.sh
```

The script will:

- Install Node packages
- Install system dependencies (mpv, yt-dlp)
- Ask for your Spotify credentials
- Start the app automatically

### 3. Done! 🎉

- Browser opens for Spotify login
- You're in!

## 💻 Manual Setup (Alternative)

If setup.sh doesn't work for you:

```bash
# 1. Install Node dependencies
npm install

# 2. Install system dependencies
# Ubuntu/Debian
sudo apt-get install mpv yt-dlp

# macOS
brew install mpv yt-dlp

# Fedora
sudo dnf install mpv yt-dlp

# 3. Set your Spotify credentials
export SPOTIFY_CLIENT_ID="your_id"
export SPOTIFY_CLIENT_SECRET="your_secret"

# 4. Start the app
npm start
```

## 🎮 How to Use

### Main Menu Navigation

- **↑ ↓** - Navigate options
- **Enter** - Select
- **q** - Quit

### Core Functions

**Search Tracks**

- Find and play any song
- `d` to download
- `s` to save to your library

**Search Artists**

- Browse artist info
- View top tracks

**Search Playlists**

- Find playlists
- Add all to queue

**Your Library**

- Saved tracks
- Your playlists

### Playback Controls

| Key   | Action      |
| ----- | ----------- |
| space | Play/Pause  |
| n     | Next track  |
| p     | Previous    |
| +     | Volume up   |
| -     | Volume down |
| d     | Download    |

## 🎵 Features Explained

### Authentication

- Secure OAuth2 with Spotify
- One-time browser login
- Tokens stored locally in ~/.spotify-cli/
- Auto-refresh before expiry

### Search

- Real-time Spotify API search
- Results include metadata
- Save tracks to your Spotify library

### Playback

- Local playback using mpv
- Stream metadata from Spotify
- Full playback control
- Queue management

### Downloads

- Uses yt-dlp for downloads
- Saves to ~/Music/spotify
- ID3 tags preserved
- Duplicate prevention

## 🔒 Privacy & Security

✓ **Your data stays yours**

- App runs on your machine
- Only metadata fetched from Spotify
- Downloaded music stored locally
- OAuth tokens never shared
- No tracking or analytics

## 📊 System Requirements

**Minimum:**

- Node.js 14+
- npm or yarn
- 500MB free space
- Linux, macOS, or WSL

**Recommended:**

- Node.js 16+
- 2GB RAM
- 5GB for music downloads
- Good internet (for streaming)

## 📦 Dependencies

**npm packages:**

- axios - HTTP requests
- blessed - Terminal UI
- chalk - Colors
- express - OAuth callback server
- open - Browser launcher

**System tools:**

- mpv - Audio player
- yt-dlp - Downloader

## 🛠 Troubleshooting

### Can't find Node.js

```bash
# Install from https://nodejs.org/
node --version  # Should be 14+
```

### Missing system dependencies

```bash
# Ubuntu/Debian
sudo apt-get install mpv yt-dlp

# macOS
brew install mpv yt-dlp
```

### Spotify credentials error

- Re-check credentials at https://developer.spotify.com/dashboard
- Make sure Redirect URI is exactly: `http://localhost:8888/callback`
- Restart the app: `npm start`

### Download not working

```bash
# Update yt-dlp
pip install --upgrade yt-dlp
```

### App won't start

```bash
# Clear old tokens
rm ~/.spotify-cli/token.json

# Check credentials are set
echo $SPOTIFY_CLIENT_ID

# Try again
npm start
```

## 📚 Documentation

- **QUICKSTART.md** - 5-minute setup guide
- **README.md** - Full feature documentation
- **CONFIGURATION.md** - Detailed config options
- **This file** - Project overview

## 🔗 Important Links

- Spotify API: https://developer.spotify.com
- mpv Player: https://mpv.io
- yt-dlp: https://github.com/yt-dlp/yt-dlp
- Node.js: https://nodejs.org

## 💡 Tips & Tricks

**Pro Tips:**

1. Create playlists in Spotify web, import here
2. Downloaded songs are in ~/Music/spotify
3. Use `+` and `-` to control volume
4. Scroll in any menu with arrow keys
5. Search results are sorted by popularity

**Performance:**

- Specific searches are faster
- First download takes longer (yt-dlp setup)
- Volume changes are instant

## 📝 Notes

- This app respects Spotify's Terms of Service
- Downloaded content is for personal use only
- Some tracks may be region-restricted
- Free Spotify works perfectly

## 🎯 Next Steps

1. **Read QUICKSTART.md** - Get running in 5 minutes
2. **Run setup.sh** - Automatic full setup
3. **Log in** - Browser opens automatically
4. **Start using** - Search, play, download!

## 🤝 Support

**Having issues?**

1. Check QUICKSTART.md for common problems
2. Read README.md for detailed docs
3. Check CONFIGURATION.md for setup help
4. Verify system dependencies are installed

## 📄 License

MIT - Use freely, modify as needed

---

## Ready to Start?

```bash
cd spotify-cli
chmod +x setup.sh
./setup.sh
```

**Happy listening! 🎵**
