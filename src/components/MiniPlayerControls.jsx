import React from "react";
import spoti from "../services/spotiService";

function MiniPlayerControls({ isPlaying, shuffle, repeatMode }) {
  const handleClick = async ({ currentTarget }) => {
    try {
      const targetId = currentTarget.id;
      if (targetId === "play-or-pause")
        if (isPlaying) await spoti.pauseTrack(targetId);
        else await spoti.resumePlayback();
      if (targetId === "next") await spoti.skipToNextTrack();
      if (targetId === "previous") await spoti.skipToPreviousTrack();
      if (targetId === "shuffle") await spoti.shuffle(!shuffle);
      if (targetId === "repeat") await spoti.repeat((repeatMode + 1) % 3);
    } catch (ex) {
      console.log(ex);
    }
  };

  const getPlayClasses = () => {
    return isPlaying ? "fa fa-pause fa-1x mx-3" : "fa fa-play fa-1x mx-3";
  };

  const getShuffleClasses = () => {
    return shuffle
      ? "fa fa-random fa-1x mx-3 green"
      : "fa fa-random fa-1x mx-3";
  };

  const getRepeatClasses = () => {
    if (repeatMode === 0) return "fa fa-refresh fa-1x mx-3";
    if (repeatMode === 1) return "fa fa-refresh fa-1x mx-3 green";
    if (repeatMode === 2) return "fa fa-retweet fa-1x mx-3 green";
  };

  const handleDragClick = (e) => {
    // const element = e.currentTarget.getBoundingClientRect();
    const timeline = e.currentTarget;
    const handle = timeline.firstElementChild;
    console.log(handle.getBoundingClientRect());
    console.log(e.clientX);
    handle.style.left = "0%";
  };

  return (
    <div className="col d-flex flex-column justify-content-center">
      <div className="row justify-content-center mb-3">
        <i
          id="shuffle"
          onClick={handleClick}
          className={getShuffleClasses()}
          aria-hidden="true"
        />
        <i
          id="previous"
          onClick={handleClick}
          className="fa fa-step-backward fa-1x mx-3"
          aria-hidden="true"
        />
        <i
          id="play-or-pause"
          onClick={handleClick}
          className={getPlayClasses()}
          aria-hidden="true"
        />
        <i
          id="next"
          onClick={handleClick}
          className="fa fa-step-forward fa-1x mx-3"
          aria-hidden="true"
        />
        <i
          id="repeat"
          onClick={handleClick}
          className={getRepeatClasses()}
          aria-hidden="true"
        />
      </div>
      <div className="row justify-content-center align-items-center">
        <p>0</p>
        <div id="timeline" onClick={handleDragClick}>
          <div id="handle" />
        </div>
        <p>100</p>
      </div>
    </div>
  );
}

export default MiniPlayerControls;
