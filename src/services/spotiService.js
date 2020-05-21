import http from "./httpService";

const apiEndpoint = "https://api.spotify.com/v1/";
const artistsEndpoint = apiEndpoint + "artists/";
const albumsEndpoint = apiEndpoint + "albums/";
const browseEndpoint = apiEndpoint + "browse/";

const userEndpoint = apiEndpoint + "me/";
const topEndpoint = userEndpoint + "top/";
const followEndpoint = userEndpoint + "following";

const playerEndpoint = userEndpoint + "player/";
const playEndpoint = playerEndpoint + "play";
const volumeEndpoint = playerEndpoint + "volume";
const seekEndpoint = playerEndpoint + "seek";

const deviceKey = "_spharmony_device_id";

function getCurrentUser() {
  return http.get(userEndpoint);
}

function search(query, type, limit = 5) {
  return http.get(
    `${apiEndpoint}search?q=${query}&type=${type}&limit=${limit}`
  );
}

function getArtistById(artistId) {
  return http.get(artistsEndpoint + artistId);
}

function getArtistTopTracks(artistId, country) {
  return http.get(
    `${artistsEndpoint}${artistId}/top-tracks?country=${country}`
  );
}

function getArtistAlbums(artistId, group, country) {
  return http.get(
    `${artistsEndpoint}${artistId}/albums?include_groups=${group}&market=${country}`
  );
}

function getAlbumById(albumId) {
  return http.get(albumsEndpoint + albumId);
}

function getAlbumTracks(albumId) {
  return http.get(`${albumsEndpoint}${albumId}/tracks?limit=50`);
}

function getUserFollowsArtist(artistId) {
  return http.get(`${followEndpoint}/contains?type=artist&ids=${artistId}`);
}

function followArtist(artistId) {
  return http.put(`${followEndpoint}?type=artist&ids=${artistId}`);
}

function unfollowArtist(artistId) {
  return http.delete(`${followEndpoint}?type=artist&ids=${artistId}`);
}

function getDeviceId() {
  return localStorage.getItem(deviceKey);
}

function playSingleTrack(trackId) {
  const url = `${playEndpoint}?device_id=${getDeviceId()}`;
  const body = { uris: [`spotify:track:${trackId}`] };
  return http.put(url, body);
}

async function playArtistTrack(trackId, artistId, country) {
  //Top Tracks data
  const { data: topTracks } = await getArtistTopTracks(artistId, country);
  const topTracksList = topTracks.tracks.map(
    (track) => `spotify:track:${track.id}`
  );

  //Play
  const url = `${playEndpoint}?device_id=${getDeviceId()}`;
  const body = {
    uris: topTracksList,
    offset: { uri: `spotify:track:${trackId}` },
  };
  return http.put(url, body);
}

async function playAlbumTrack(trackId, albumId) {
  const url = `${playEndpoint}?device_id=${getDeviceId()}`;
  const body = {
    context_uri: `spotify:album:${albumId}`,
    offset: { uri: `spotify:track:${trackId}` },
  };
  return http.put(url, body);
}

function getCurrentlyPlaying() {
  return http.get(`${playerEndpoint}currently-playing`);
}

function pauseTrack() {
  return http.put(`${playerEndpoint}pause?device_id=${getDeviceId()}`);
}

function resumePlayback() {
  return http.put(playEndpoint);
}

function getPlayer() {
  return http.get(`${playerEndpoint}`);
}

function skipToNextTrack() {
  return http.post(`${playerEndpoint}next`);
}

function skipToPreviousTrack() {
  return http.post(`${playerEndpoint}previous`);
}

function shuffle(state) {
  return http.put(`${playerEndpoint}shuffle?state=${state}`);
}

function repeat(repeatMode) {
  const context = repeatModetoContext(repeatMode);
  return http.put(`${playerEndpoint}repeat?state=${context}`);
}

function repeatModetoContext(repeatMode) {
  if (repeatMode === 0) return "off";
  if (repeatMode === 1) return "context";
  if (repeatMode === 2) return "track";
}

function setPlayerVolume(volume) {
  return http.put(`${volumeEndpoint}?volume_percent=${volume}`);
}

function seek(position_ms) {
  return http.put(`${seekEndpoint}?position_ms=${position_ms}`);
}

function getRecentlyPlayed() {
  return http.get(`${playerEndpoint}recently-played`);
}

function getTopArtists() {
  return http.get(`${topEndpoint}artists`);
}

function getTopTracks() {
  return http.get(`${topEndpoint}tracks`);
}

function getNewReleases(country) {
  return http.get(`${browseEndpoint}new-releases?country=${country}`);
}

export default {
  getCurrentUser,
  search,
  getArtistById,
  getArtistTopTracks,
  getArtistAlbums,
  getAlbumById,
  getAlbumTracks,
  getUserFollowsArtist,
  followArtist,
  unfollowArtist,
  playSingleTrack,
  playArtistTrack,
  playAlbumTrack,
  getCurrentlyPlaying,
  pauseTrack,
  resumePlayback,
  getPlayer,
  skipToNextTrack,
  skipToPreviousTrack,
  shuffle,
  repeat,
  setPlayerVolume,
  seek,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  getNewReleases,
};
