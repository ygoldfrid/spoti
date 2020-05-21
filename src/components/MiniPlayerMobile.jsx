import React, { Fragment } from "react";
import spoti from "../services/spotiService";

function MiniPlayerMobile({ currentTrack, isPlaying }) {
  const handleClick = async () => {
    try {
      if (isPlaying) await spoti.pauseTrack();
      else await spoti.resumePlayback();
    } catch (ex) {
      console.log(ex);
    }
  };
  const getPlayClasses = () => {
    return isPlaying ? "fa fa-pause fa-1x" : "fa fa-play fa-1x";
  };
  return (
    <Fragment>
      <div id="mobile-text-container" className="col-2">
        <div className="row justify-content-center">
          <img
            src={currentTrack.album.images[0].url}
            width="35"
            height="35"
            alt="album"
          />
        </div>
      </div>
      <div id="mobile-text-container" className="col-8">
        <p id="mobile-text">
          {currentTrack.name} &bull;{" "}
          <span id="artist-name">{currentTrack.artists[0].name}</span>
        </p>
      </div>
      <div className="col-2">
        <div className="row justify-content-center">
          <i
            id="play-or-pause"
            onClick={handleClick}
            className={getPlayClasses()}
            aria-hidden="true"
          />
        </div>
      </div>
    </Fragment>
  );
}

export default MiniPlayerMobile;
