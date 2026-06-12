#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const SpotifyAuth = require('./src/auth');
const SpotifyAPI = require('./src/api');
const UIManager = require('./src/ui');
const Player = require('./src/player');
const Downloader = require('./src/downloader');

const CONFIG_DIR = path.join(process.env.HOME, '.spotify-cli');
const TOKEN_FILE = path.join(CONFIG_DIR, 'token.json');

async function initializeApp() {
  // Ensure config directory exists
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  // Ensure Music directory exists
  const musicDir = path.join(process.env.HOME, 'Music', 'spotify');
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
  }

  try {
    // Initialize authentication
    const auth = new SpotifyAuth(CONFIG_DIR);
    let tokens = null;

    // Check if we have existing valid tokens
    if (fs.existsSync(TOKEN_FILE)) {
      const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
      if (!auth.isTokenExpired(tokenData)) {
        tokens = tokenData;
        console.log(chalk.green('✓ Using cached authentication'));
      } else if (tokenData.refresh_token) {
        // Try to refresh the token
        tokens = await auth.refreshToken(tokenData.refresh_token);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
        console.log(chalk.green('✓ Token refreshed'));
      }
    }

    // If no valid tokens, do OAuth flow
    if (!tokens) {
      console.log(chalk.cyan('\n🎵 Spotify CLI - First Time Setup\n'));
      console.log(chalk.yellow('Opening browser for authentication...'));
      tokens = await auth.authenticate();
      fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
      console.log(chalk.green('✓ Authentication successful\n'));
    }

    // Initialize API and other modules
    const spotifyAPI = new SpotifyAPI(tokens.access_token);
    const player = new Player();
    const downloader = new Downloader();
    const ui = new UIManager(spotifyAPI, player, downloader);

    // Get user info
    const userInfo = await spotifyAPI.getCurrentUser();
    console.log(chalk.green(`✓ Logged in as ${userInfo.display_name}\n`));

    // Set up token refresh interval
    const expiresIn = tokens.expires_in || 3600;
    setInterval(async () => {
      if (tokens.refresh_token) {
        tokens = await auth.refreshToken(tokens.refresh_token);
        spotifyAPI.setAccessToken(tokens.access_token);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
      }
    }, (expiresIn - 300) * 1000); // Refresh 5 minutes before expiry

    // Start UI
    await ui.start();

  } catch (error) {
    console.error(chalk.red('✗ Error: ' + error.message));
    if (error.response?.data) {
      console.error(chalk.red(JSON.stringify(error.response.data, null, 2)));
    }
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n\nShutting down...'));
  process.exit(0);
});

initializeApp();
