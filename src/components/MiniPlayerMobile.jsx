import React from "react";
import { withRouter } from "react-router-dom";
import spoti from "../services/spotiService";

function MiniPlayerMobile({
  currentTrack,
  isPlaying,
  shuffle,
  repeatMode,
  elapsed,
  history,
}) {
  const handleClickPlay = async () => {
    try {
      if (isPlaying) await spoti.pauseTrack();
      else await spoti.resumePlayback();
    } catch (ex) {
      console.log(ex);
    }
  };
  const handleClick = () => {
    history.push(`/track/${currentTrack.id}`, {
      currentTrack: currentTrack,
      isPlaying: isPlaying,
      shuffle: shuffle,
      repeatMode: repeatMode,
      elapsed: elapsed,
      duration: currentTrack.duration_ms,
    });
  };

  const getPlayClasses = () => {
    return isPlaying ? "fa fa-pause fa-1x" : "fa fa-play fa-1x";
  };
  return (
    <div
      id="mini-player-mobile"
      className="row justify-content-center align-items-center"
    >
      <div id="mobile-image-container" className="col-2" onClick={handleClick}>
        <div className="row justify-content-center">
          <img
            src={currentTrack.album.images[0].url}
            width="35"
            height="35"
            alt="album"
          />
        </div>
      </div>
      <div id="mobile-text-container" className="col-8" onClick={handleClick}>
        <p id="mobile-text">
          {currentTrack.name} &bull;{" "}
          <span id="artist-name">{currentTrack.artists[0].name}</span>
        </p>
      </div>
      <div className="col-2">
        <div className="row justify-content-center">
          <i
            id="play-or-pause"
            onClick={handleClickPlay}
            className={getPlayClasses()}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default withRouter(MiniPlayerMobile);
