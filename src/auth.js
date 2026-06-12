const axios = require('axios');
const express = require('express');
const open = require('open');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class SpotifyAuth {
  constructor(configDir) {
    this.configDir = configDir;
    this.configFile = path.join(configDir, 'config.json');
    this.loadConfig();
  }

  loadConfig() {
    if (fs.existsSync(this.configFile)) {
      this.config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
    } else {
      // Create default config - user needs to add their own credentials
      this.config = {
        clientId: process.env.SPOTIFY_CLIENT_ID || '',
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
        redirectUri: 'http://localhost:8888/callback'
      };
      
      if (!this.config.clientId || !this.config.clientSecret) {
        throw new Error(
          'Missing Spotify credentials. Please set:\n' +
          '  export SPOTIFY_CLIENT_ID="your_client_id"\n' +
          '  export SPOTIFY_CLIENT_SECRET="your_client_secret"\n\n' +
          'Get them from: https://developer.spotify.com/dashboard'
        );
      }

      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    }
  }

  generateStateString() {
    return crypto.randomBytes(16).toString('hex');
  }

  async authenticate() {
    return new Promise((resolve, reject) => {
      const state = this.generateStateString();
      const app = express();
      
      const authUrl = this.getAuthorizationUrl(state);
      
      app.get('/callback', async (req, res) => {
        const { code, state: returnedState } = req.query;
        
        if (state !== returnedState) {
          res.send('State mismatch. Authentication failed.');
          reject(new Error('State mismatch in OAuth callback'));
          server.close();
          return;
        }

        try {
          const tokens = await this.getAccessToken(code);
          res.send('✓ Authentication successful! You can close this window.');
          resolve(tokens);
          server.close();
        } catch (error) {
          res.send(`✗ Authentication failed: ${error.message}`);
          reject(error);
          server.close();
        }
      });

      const server = app.listen(8888, async () => {
        console.log('Opening browser for authentication...');
        await open(authUrl);
      });

      setTimeout(() => {
        reject(new Error('Authentication timeout'));
        server.close();
      }, 5 * 60 * 1000); // 5 minute timeout
    });
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: [
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state',
        'streaming',
        'user-library-read',
        'user-read-email',
        'playlist-read-private',
        'playlist-read-collaborative'
      ].join(' '),
      state
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUri,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        access_token: response.data.access_token,
        refresh_token: refreshToken,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  isTokenExpired(tokenData) {
    if (!tokenData.timestamp) return true;
    const expiresIn = tokenData.expires_in || 3600;
    const expiresAt = tokenData.timestamp + expiresIn * 1000;
    return Date.now() > expiresAt - 60000; // 1 minute buffer
  }
}

module.exports = SpotifyAuth;
