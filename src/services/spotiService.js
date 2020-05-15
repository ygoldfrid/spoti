import http from "./httpService";

const apiEndpoint = "https://api.spotify.com/v1/";
const artistsEndpoint = apiEndpoint + "artists/";
const albumsEndpoint = apiEndpoint + "albums/";
const tracksEndpoint = apiEndpoint + "tracks/";

const userEndpoint = apiEndpoint + "me/";
const followEndpoint = userEndpoint + "following";
const playerEndpoint = userEndpoint + "player";

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

function getTrackById(trackId) {
  return http.get(`${tracksEndpoint}${trackId}`);
}

function getDeviceId() {
  return localStorage.getItem(deviceKey);
}

async function playTrack(trackId) {
  //Track data
  const { data: track } = await getTrackById(trackId);
  const albumId = track.album.id;
  const trackPosition = track.track_number - 1;

  //Play
  const url = `${playerEndpoint}/play?device_id=${getDeviceId()}`;
  const body = {
    context_uri: `spotify:album:${albumId}`,
    offset: {
      position: trackPosition,
    },
    position_ms: 0,
  };
  return http.put(url, body);
}

function getCurrentlyPlaying() {
  return http.get(`${playerEndpoint}/currently-playing`);
}

function pauseTrack() {
  return http.put(`${playerEndpoint}/pause?device_id=${getDeviceId()}`);
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
  playTrack,
  getCurrentlyPlaying,
  pauseTrack,
  getPlayer,
};
