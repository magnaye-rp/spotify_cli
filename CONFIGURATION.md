# Spotify CLI - Configuration Guide

## Getting Your Spotify Credentials

### Step 1: Create Spotify Developer Account
1. Visit https://accounts.spotify.com/en/login
2. Log in with your Spotify account (create one if needed)
3. Accept the terms and create your account

### Step 2: Register Your Application
1. Go to https://developer.spotify.com/dashboard
2. Click "Create an App"
3. Accept the terms, enter any app name (e.g., "Spotify CLI")
4. Accept again and confirm

### Step 3: Get Your Credentials
1. In your app's dashboard, you'll see:
   - **Client ID** - Copy this
   - **Client Secret** - Click "Show Client Secret" and copy

### Step 4: Set Redirect URI
1. Click "Edit Settings"
2. Under "Redirect URIs", add: `http://localhost:8888/callback`
3. Click "Add" and save

## Setting Environment Variables

### Option 1: Temporary (For Current Session Only)
```bash
export SPOTIFY_CLIENT_ID="your_client_id_here"
export SPOTIFY_CLIENT_SECRET="your_client_secret_here"
npm start
```

### Option 2: Permanent (Recommended)

**For Bash (~/.bashrc):**
```bash
echo 'export SPOTIFY_CLIENT_ID="your_client_id"' >> ~/.bashrc
echo 'export SPOTIFY_CLIENT_SECRET="your_client_secret"' >> ~/.bashrc
source ~/.bashrc
```

**For Zsh (~/.zshrc):**
```bash
echo 'export SPOTIFY_CLIENT_ID="your_client_id"' >> ~/.zshrc
echo 'export SPOTIFY_CLIENT_SECRET="your_client_secret"' >> ~/.zshrc
source ~/.zshrc
```

**For Fish (~/.config/fish/config.fish):**
```fish
set -Ux SPOTIFY_CLIENT_ID "your_client_id"
set -Ux SPOTIFY_CLIENT_SECRET "your_client_secret"
```

### Option 3: .env File (Alternative)
Create a `.env` file in the spotify-cli directory:
```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Then update `index.js` to load .env:
```javascript
require('dotenv').config();
```

## Verify Your Setup

Check that credentials are set:
```bash
echo $SPOTIFY_CLIENT_ID
echo $SPOTIFY_CLIENT_SECRET
```

Both should output your credentials. If they're empty, the variables weren't set correctly.

## Troubleshooting

### "Missing Spotify credentials" Error
- Make sure you've exported the variables: `export SPOTIFY_CLIENT_ID=...`
- Check they're in your shell config file
- Open a new terminal window for changes to take effect

### Wrong Redirect URI
- Error: "redirect_uri_mismatch"
- Solution: Make sure `http://localhost:8888/callback` is set in your Spotify app settings

### Credentials Not Saving
- Use the setup script: `bash setup.sh`
- Or manually add to ~/.bashrc or ~/.zshrc
- Reload shell config: `source ~/.bashrc` or `source ~/.zshrc`

## Security Notes

⚠️ **Keep Your Credentials Safe:**
- Never commit `.env` or credentials to git
- Don't share your Client Secret with anyone
- The app stores OAuth tokens locally in `~/.spotify-cli/token.json`
- Tokens are only used for API authentication, not stored on Spotify's servers

✓ **Your Data:**
- Search queries don't leave your machine
- Downloaded music stays on your computer
- Only metadata is fetched from Spotify's API
- No analytics or tracking

## Revoking Credentials

If you accidentally share your credentials:
1. Go to https://developer.spotify.com/dashboard
2. Click your app
3. Click "Regenerate Client Secret"
4. Update your credentials

The old credentials become invalid immediately.
