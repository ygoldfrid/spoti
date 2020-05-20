import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { toNumberFormat } from "../../utils/converter";

function MainPage({ type, object, onFollowClick, follows }) {
  const getSubtitle = (object) => {
    if (type === "artist")
      return toNumberFormat(object.followers.total) + " followers";
    else if (type === "album")
      return (
        <Fragment>
          Album by{" "}
          <Link to={`/artist/${object.artists[0].id}`}>
            {object.artists[0].name}
          </Link>{" "}
          &bull; {object.total_tracks} songs &bull;{" "}
          {object.release_date.slice(0, 4)}
        </Fragment>
      );
    else if (type === "profile")
      return (
        <Fragment>
          {object.country} &bull; {object.followers.total} followers &bull;{" "}
          {object.email}
        </Fragment>
      );
  };

  return (
    <div className="main-page p-2 mb-4">
      <div className="row justify-content-center">
        <img
          className="m-3"
          height="250"
          width="250"
          alt={object.name}
          src={object.images[0] ? object.images[0].url : ""}
        />
      </div>
      <div className="main-page-info">
        <h1 className="text-center mb-1">
          {type === "profile" ? object.display_name : object.name}
        </h1>
        <p className="text-center">{getSubtitle(object)}</p>
      </div>
      {type === "artist" && (
        <div className="row follow-button justify-content-center">
          <button onClick={onFollowClick} className="btn btn-spoti-clear my-3">
            {follows ? "Following" : "Follow"}
          </button>
        </div>
      )}
    </div>
  );
}

export default MainPage;
