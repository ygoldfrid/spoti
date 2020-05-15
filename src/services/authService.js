import http from "./httpService";
import queryString from "query-string";

const auth_url = "https://accounts.spotify.com/authorize";

const params = {
  client_id: "14c498f4bd4b4b2d8d7f7d13b67efae8",
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  scope: [
    "streaming",
    "user-read-private",
    "user-read-email",
    "user-follow-read",
    "user-follow-modify",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
  ].join("%20"),
  response_type: "token",
  state: "flakid",
  show_dialog: "true",
};

function login() {
  return queryString.stringifyUrl({ url: auth_url, query: params });
}

function logout() {
  localStorage.removeItem("access_token");
}

function isAuthenticated() {
  return localStorage.getItem("access_token");
}

http.setAccessToken(isAuthenticated());

function saveAccessToken(accessToken) {
  localStorage.setItem("access_token", accessToken);
}

export default {
  login,
  logout,
  isAuthenticated,
  saveAccessToken,
};
