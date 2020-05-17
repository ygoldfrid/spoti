import React, { Component, Fragment } from "react";
import spoti from "../services/spotiService";

class MiniPlayer extends Component {
  state = {
    currentTrack: "",
    isPlaying: false,
    shuffle: false,
    repeatMode: 0,
  };

  addStateUpdateListener = () => {
    document.addEventListener("stateUpdate", ({ detail }) => {
      const currentTrack = detail.track_window.current_track.id;
      const isPlaying = !detail.paused;
      const shuffle = detail.shuffle;
      const repeatMode = detail.repeat_mode;
      this.setState({ currentTrack, isPlaying, shuffle, repeatMode });
    });
  };

  async componentDidMount() {
    this.addStateUpdateListener();
  }

  handleClick = async ({ currentTarget }) => {
    try {
      const targetId = currentTarget.id;
      if (targetId === "play-or-pause")
        if (this.state.isPlaying) await spoti.pauseTrack(targetId);
        else await spoti.resumePlayback();
      if (targetId === "next") await spoti.skipToNextTrack();
      if (targetId === "previous") await spoti.skipToPreviousTrack();
      if (targetId === "shuffle") await spoti.shuffle(!this.state.shuffle);
      if (targetId === "repeat")
        await spoti.repeat((this.state.repeatMode + 1) % 3);
    } catch (ex) {
      console.log(ex);
    }
  };

  getPlayClasses = () => {
    return this.state.isPlaying
      ? "fa fa-pause fa-2x m-3"
      : "fa fa-play fa-2x m-3";
  };

  getShuffleClasses = () => {
    return this.state.shuffle
      ? "fa fa-random fa-2x m-3 green"
      : "fa fa-random fa-2x m-3";
  };

  getRepeatClasses = () => {
    const repeatMode = this.state.repeatMode;
    if (repeatMode === 0) return "fa fa-refresh fa-2x m-3";
    if (repeatMode === 1) return "fa fa-refresh fa-2x m-3 green";
    if (repeatMode === 2) return "fa fa-retweet fa-2x m-3 green";
  };

  render() {
    return (
      <Fragment>
        {this.state.currentTrack && (
          <div className="mini-player p-3">
            <div className="row justify-content-center">
              <i
                id="shuffle"
                onClick={this.handleClick}
                className={this.getShuffleClasses()}
                aria-hidden="true"
              ></i>
              <i
                id="previous"
                onClick={this.handleClick}
                className="fa fa-step-backward fa-2x m-3"
                aria-hidden="true"
              ></i>
              <i
                id="play-or-pause"
                onClick={this.handleClick}
                className={this.getPlayClasses()}
                aria-hidden="true"
              ></i>
              <i
                id="next"
                onClick={this.handleClick}
                className="fa fa-step-forward fa-2x m-3"
                aria-hidden="true"
              ></i>
              <i
                id="repeat"
                onClick={this.handleClick}
                className={this.getRepeatClasses()}
                aria-hidden="true"
              ></i>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default MiniPlayer;
