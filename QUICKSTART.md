# Quick Start Guide - Spotify CLI

Get up and running in 5 minutes!

## The TL;DR Version

```bash
# 1. Clone and enter directory
git clone <repo> spotify-cli && cd spotify-cli

# 2. Run setup (installs everything)
chmod +x setup.sh
./setup.sh

# 3. Follow the prompts for Spotify credentials
# (Get them from https://developer.spotify.com/dashboard)

# 4. Done! App will start automatically
```

## Step-by-Step

### 1️⃣ Prerequisites Check

Make sure you have:

- Node.js 14+: `node --version`
- npm: `npm --version`
- A Spotify account (free or premium)

**On macOS?** Install Homebrew first from https://brew.sh

### 2️⃣ Get Spotify Credentials (2 minutes)

1. Go to https://developer.spotify.com/dashboard
2. Log in with Spotify (create free account if needed)
3. Click "Create an App"
4. Fill in: App name: "Spotify CLI", accept terms
5. You'll see your **Client ID** and **Client Secret**
6. Click "Edit Settings" and add Redirect URI: `http://127.0.0.1:8888/callback`

**Keep these open in your browser!** You'll paste them during setup.

### 3️⃣ Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/spotify-cli.git
cd spotify-cli

# Make setup script executable
chmod +x setup.sh

# Run automatic setup
./setup.sh
```

The script will:

- ✅ Check for Node.js
- ✅ Install npm packages
- ✅ Install system dependencies (mpv, yt-dlp)
- ✅ Create config directories
- ✅ Ask for your Spotify credentials
- ✅ Start the app

### 4️⃣ First Login

When the app starts:

1. Your browser will open Spotify's login page
2. Log in with your Spotify account
3. Click "Agree" to give permissions
4. You'll be redirected back to the app
5. **Done!** You're logged in

The app remembers your login, so you won't need to do this again.

## That's It! 🎉

You now have a fully functional Spotify terminal client!

### Quick Keyboard Shortcuts

| Key   | Action           |
| ----- | ---------------- |
| ↑↓    | Navigate menus   |
| Enter | Select menu item |
| space | Play/Pause       |
| n     | Next song        |
| p     | Previous song    |
| d     | Download song    |
| q     | Quit             |
| + / - | Volume up/down   |

## Troubleshooting Your Setup

### "Node not found"

Install Node.js from https://nodejs.org/

### Setup script won't run

```bash
chmod +x setup.sh
./setup.sh
```

### Missing system dependencies

```bash
# macOS
brew install mpv yt-dlp

# Ubuntu/Debian
sudo apt-get install mpv yt-dlp

# Fedora
sudo dnf install mpv yt-dlp
```

### Credentials not working

1. Double-check Client ID and Secret from https://developer.spotify.com/dashboard
2. Make sure Redirect URI is exactly: `http://localhost:8888/callback`
3. Try again: `npm start`

### App won't start

```bash
# Make sure you're in the right directory
cd spotify-cli

# Clear any cached files
rm -rf ~/.spotify-cli/token.json

# Try again
npm start
```

## Running Later

After first setup, start the app anytime with:

```bash
cd spotify-cli
npm start
```

Or install globally:

```bash
npm install -g .
spotify-cli
```

## Next Steps

- Read the full [README.md](README.md) for all features
- Check [CONFIGURATION.md](CONFIGURATION.md) for advanced setup
- Explore the terminal UI with arrow keys and Enter

## Common Questions

**Q: Is my data safe?**
A: Yes! Everything runs locally. Only metadata comes from Spotify API.

**Q: Can I use it offline?**
A: Not for searching/streaming, but downloaded songs work offline.

**Q: Do I need Spotify Premium?**
A: No! Free accounts work perfectly.

**Q: Can I use this on my phone?**
A: This is a terminal app. Works on Linux, macOS, WSL.

**Q: How much storage do downloads use?**
A: ~4-5 MB per song. Check with: `ls -lh ~/Music/spotify`

## Need Help?

1. Check [README.md](README.md) for full documentation
2. Look at [CONFIGURATION.md](CONFIGURATION.md) for detailed setup
3. Check Spotify Developer docs: https://developer.spotify.com/documentation/

---

**Enjoy your music! 🎵**
