import http from "./httpService";

const apiEndpoint = "https://api.spotify.com/v1/";
const artistsEndpoint = apiEndpoint + "artists/";
const albumsEndpoint = apiEndpoint + "albums/";

const userEndpoint = apiEndpoint + "me/";
const followEndpoint = userEndpoint + "following";
const playerEndpoint = userEndpoint + "player/";
const playEndpoint = playerEndpoint + "play";

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

async function playArtistTrack(trackId, artistId) {
  //Top Tracks data
  const { data: topTracks } = await getArtistTopTracks(artistId, "MX");
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

export default {
  getCurrentUser,
  search,
  getArtistById,
  getArtistTopTracks,
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
};
