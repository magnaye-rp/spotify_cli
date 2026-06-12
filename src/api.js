const axios = require('axios');

class SpotifyAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.spotify.com/v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  setAccessToken(token) {
    this.accessToken = token;
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.client.get('/me');
    return response.data;
  }

  // Search endpoints
  async search(query, type = ['track', 'artist', 'playlist'], limit = 50) {
    const response = await this.client.get('/search', {
      params: {
        q: query,
        type: type.join(','),
        limit
      }
    });
    return response.data;
  }

  async searchTracks(query, limit = 20) {
    const response = await this.search(query, ['track'], limit);
    return response.tracks.items;
  }

  async searchArtists(query, limit = 20) {
    const response = await this.search(query, ['artist'], limit);
    return response.artists.items;
  }

  async searchPlaylists(query, limit = 20) {
    const response = await this.search(query, ['playlist'], limit);
    return response.playlists.items;
  }

  // Track endpoints
  async getTrack(trackId) {
    const response = await this.client.get(`/tracks/${trackId}`);
    return response.data;
  }

  async getTracks(trackIds) {
    const response = await this.client.get('/tracks', {
      params: {
        ids: trackIds.join(',')
      }
    });
    return response.data.tracks;
  }

  async getAudioFeatures(trackId) {
    const response = await this.client.get(`/audio-features/${trackId}`);
    return response.data;
  }

  // Playlist endpoints
  async getPlaylist(playlistId) {
    const response = await this.client.get(`/playlists/${playlistId}`);
    return response.data;
  }

  async getPlaylistTracks(playlistId, limit = 50, offset = 0) {
    const response = await this.client.get(`/playlists/${playlistId}/tracks`, {
      params: { limit, offset }
    });
    return response.data;
  }

  async getCurrentUserPlaylists(limit = 50, offset = 0) {
    const response = await this.client.get('/me/playlists', {
      params: { limit, offset }
    });
    return response.data;
  }

  // Library endpoints
  async getSavedTracks(limit = 50, offset = 0) {
    const response = await this.client.get('/me/tracks', {
      params: { limit, offset }
    });
    return response.data;
  }

  async isSavedTrack(trackId) {
    const response = await this.client.get('/me/tracks/contains', {
      params: { ids: trackId }
    });
    return response.data[0];
  }

  async saveTrack(trackId) {
    await this.client.put('/me/tracks', {
      ids: [trackId]
    });
  }

  async removeSavedTrack(trackId) {
    await this.client.delete('/me/tracks', {
      params: { ids: trackId }
    });
  }

  // Artist endpoints
  async getArtist(artistId) {
    const response = await this.client.get(`/artists/${artistId}`);
    return response.data;
  }

  async getArtistTopTracks(artistId, country = 'US') {
    const response = await this.client.get(`/artists/${artistId}/top-tracks`, {
      params: { country }
    });
    return response.data.tracks;
  }

  async getArtistAlbums(artistId, limit = 50, offset = 0) {
    const response = await this.client.get(`/artists/${artistId}/albums`, {
      params: { limit, offset }
    });
    return response.data;
  }

  // Playback endpoints
  async getPlaybackState() {
    try {
      const response = await this.client.get('/me/player');
      return response.data;
    } catch (error) {
      // No active device
      return null;
    }
  }

  async startPlayback(deviceId, uris = [], contextUri = null) {
    const payload = {
      device_id: deviceId
    };

    if (contextUri) {
      payload.context_uri = contextUri;
    } else if (uris && uris.length > 0) {
      payload.uris = uris;
    }

    await this.client.put('/me/player/play', payload);
  }

  async pausePlayback(deviceId) {
    await this.client.put('/me/player/pause', {}, {
      params: { device_id: deviceId }
    });
  }

  async nextTrack(deviceId) {
    await this.client.post('/me/player/next', {}, {
      params: { device_id: deviceId }
    });
  }

  async previousTrack(deviceId) {
    await this.client.post('/me/player/previous', {}, {
      params: { device_id: deviceId }
    });
  }

  async seek(deviceId, positionMs) {
    await this.client.put('/me/player/seek', {}, {
      params: {
        device_id: deviceId,
        position_ms: positionMs
      }
    });
  }

  async setVolume(deviceId, volumePercent) {
    await this.client.put('/me/player/volume', {}, {
      params: {
        device_id: deviceId,
        volume_percent: Math.min(100, Math.max(0, volumePercent))
      }
    });
  }

  // Get available devices
  async getAvailableDevices() {
    const response = await this.client.get('/me/player/devices');
    return response.data.devices;
  }

  // Categories
  async getCategories(limit = 50, offset = 0) {
    const response = await this.client.get('/browse/categories', {
      params: { limit, offset }
    });
    return response.data.categories.items;
  }

  async getFeaturedPlaylists(limit = 50, offset = 0) {
    const response = await this.client.get('/browse/featured-playlists', {
      params: { limit, offset }
    });
    return response.data.playlists.items;
  }

  async getNewReleases(limit = 50, offset = 0) {
    const response = await this.client.get('/browse/new-releases', {
      params: { limit, offset }
    });
    return response.data.albums.items;
  }

  // Error handling wrapper
  async handleRequest(method, endpoint, data = null, params = null) {
    try {
      const config = {
        params
      };

      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await this.client.get(endpoint, config);
          break;
        case 'post':
          response = await this.client.post(endpoint, data, config);
          break;
        case 'put':
          response = await this.client.put(endpoint, data, config);
          break;
        case 'delete':
          response = await this.client.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unknown method: ${method}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Spotify API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = SpotifyAPI;
