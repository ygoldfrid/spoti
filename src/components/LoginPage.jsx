import React, { Fragment } from "react";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

function LoginPage() {
  if (auth.isAuthenticated()) return <Redirect to="/" />;
  return (
    <Fragment>
      <div className="row justify-content-center">
        <h3>
          Welcome to Spoti App, a Web Client powered by the{" "}
          <a
            href="https://developer.spotify.com/documentation/web-api/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-spotify fa-1x mr-2" aria-hidden="true"></i>
            Spotify API
          </a>
        </h3>
      </div>
      <div className="row justify-content-center mt-3">
        <p>In order to continue please log in</p>
      </div>
      <div className="row justify-content-center">
        <a className="btn btn-lg btn-spoti m-3" href={auth.login()}>
          Login with Spotify
        </a>
      </div>
      <div className="row justify-content-center">
        <p>
          Check the source code{" "}
          <a
            href="https://github.com/ygoldfrid"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
        </p>
      </div>
    </Fragment>
  );
}

export default LoginPage;