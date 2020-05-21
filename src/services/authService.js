import http from "./httpService";
import queryString from "query-string";

const auth_url = "https://accounts.spotify.com/authorize";
const tokenKey = "access_token";

const params = {
  client_id: "14c498f4bd4b4b2d8d7f7d13b67efae8",
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  scope: [
    "streaming",
    "user-top-read",
    "user-read-private",
    "user-read-email",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-follow-read",
    "user-follow-modify",
  ].join("%20"),
  response_type: "token",
  state: "flakid",
  show_dialog: "true",
};

function login() {
  return queryString.stringifyUrl({ url: auth_url, query: params });
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function isAuthenticated() {
  return localStorage.getItem(tokenKey);
}

http.setAccessToken(isAuthenticated());

function saveAccessToken(accessToken) {
  localStorage.setItem(tokenKey, accessToken);
}

export default {
  login,
  logout,
  isAuthenticated,
  saveAccessToken,
};
