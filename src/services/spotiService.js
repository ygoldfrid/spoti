import http from "./httpService";

const apiEndpoint = "https://api.spotify.com/v1/";
const artistsEndpoint = apiEndpoint + "artists/";
const albumsEndpoint = apiEndpoint + "albums/";
const userEndpoint = apiEndpoint + "me/";
const followEndpoint = userEndpoint + "following";
const playerEndpoint = userEndpoint + "player";

function getCurrentUser() {
  return http.get(userEndpoint);
}

function getCurrentlyPlaying() {
  return http.get(`${playerEndpoint}/currently-playing`);
}

function search(query, type, limit = 5) {
  return http.get(
    `${apiEndpoint}search?q=${query}&type=${type}&limit=${limit}`
  );
}

function getArtistById(id) {
  return http.get(artistsEndpoint + id);
}

function getArtistTopTracks(id, country) {
  return http.get(`${artistsEndpoint}${id}/top-tracks?country=${country}`);
}

function getAlbumById(id) {
  return http.get(albumsEndpoint + id);
}

function getAlbumTracks(id) {
  return http.get(`${albumsEndpoint}${id}/tracks`);
}

function getUserFollowsArtist(id) {
  return http.get(`${followEndpoint}/contains?type=artist&ids=${id}`);
}

function followArtist(id) {
  return http.put(`${followEndpoint}?type=artist&ids=${id}`);
}

function unfollowArtist(id) {
  return http.delete(`${followEndpoint}?type=artist&ids=${id}`);
}

export default {
  getCurrentUser,
  getCurrentlyPlaying,
  search,
  getArtistById,
  getArtistTopTracks,
  getAlbumById,
  getAlbumTracks,
  getUserFollowsArtist,
  followArtist,
  unfollowArtist,
};
