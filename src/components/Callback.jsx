import React from "react";
import queryString from "query-string";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

function Callback({ location }) {
  if (location.hash) {
    const accessObject = queryString.parse(location.hash);
    const accessToken = accessObject.access_token;
    auth.saveAccessToken(accessToken);
    window.location = "/";
  } else {
    auth.logout();
    toast.error("Access denied by user");
    return <Redirect to="/login" />;
  }
}

export default Callback;
