import React, { Component } from "react";
import spoti from "../services/spotiService";
import { msToDuration } from "./../utils/converter";
import ProgressBar from "./../utils/progressBar";

class MiniPlayerControls extends Component {
  state = {
    elapsed: 0,
  };

  interval = undefined;
  timeBar = new ProgressBar(200);

  componentDidMount = () => {
    const { elapsed } = this.props;
    this.timeBar.renderBar(
      "time-bar",
      elapsed,
      this.props.currentTrack.duration_ms
    );
    this.startTimer();
    this.setState({ elapsed });
  };

  componentDidUpdate(prevProps) {
    const { elapsed, isPlaying } = this.props;
    if (prevProps.elapsed !== elapsed) {
      console.log("in");
      this.setState({ elapsed });
    }
    if (prevProps.isPlaying !== isPlaying) {
      if (!isPlaying) this.pauseTimer();
      else this.startTimer();
    }
  }

  timer = () => {
    const { elapsed } = this.state;
    this.setState({ elapsed: elapsed + 1000 });
    this.timeBar.drawProgress(elapsed, this.props.currentTrack.duration_ms);
  };

  startTimer = () => {
    this.interval = setInterval(this.timer, 1000);
  };

  pauseTimer = () => {
    clearInterval(this.interval);
  };

  handleClickBar = ({ clientX }) => {
    this.timeBar.handleClick(
      clientX,
      spoti.seek,
      this.props.currentTrack.duration_ms
    );
  };

  handleClickIcons = async ({ currentTarget }) => {
    try {
      const targetId = currentTarget.id;
      const { isPlaying, shuffle, repeatMode } = this.props;
      if (targetId === "play-or-pause")
        if (isPlaying) await spoti.pauseTrack();
        else await spoti.resumePlayback();
      if (targetId === "next") await spoti.skipToNextTrack();
      if (targetId === "previous") await spoti.skipToPreviousTrack();
      if (targetId === "shuffle") await spoti.shuffle(!shuffle);
      if (targetId === "repeat") await spoti.repeat((repeatMode + 1) % 3);
    } catch (ex) {
      console.log(ex);
    }
  };

  getPlayClasses = () => {
    return this.props.isPlaying
      ? "fa fa-pause fa-1x mx-3"
      : "fa fa-play fa-1x mx-3";
  };

  getShuffleClasses = () => {
    return this.props.shuffle
      ? "fa fa-random fa-1x mx-3 green"
      : "fa fa-random fa-1x mx-3";
  };

  getRepeatClasses = () => {
    const { repeatMode } = this.props;
    if (repeatMode === 0) return "fa fa-refresh fa-1x mx-3";
    if (repeatMode === 1) return "fa fa-refresh fa-1x mx-3 green";
    if (repeatMode === 2) return "fa fa-retweet fa-1x mx-3 green";
  };

  render() {
    return (
      <div className="col mini-player-controls d-flex flex-column justify-content-center">
        <div className="row mini-player-buttons justify-content-center mb-3">
          <i
            id="shuffle"
            onClick={this.handleClickIcons}
            className={this.getShuffleClasses()}
            aria-hidden="true"
          />
          <i
            id="previous"
            onClick={this.handleClickIcons}
            className="fa fa-step-backward fa-1x mx-3"
            aria-hidden="true"
          />
          <i
            id="play-or-pause"
            onClick={this.handleClickIcons}
            className={this.getPlayClasses()}
            aria-hidden="true"
          />
          <i
            id="next"
            onClick={this.handleClickIcons}
            className="fa fa-step-forward fa-1x mx-3"
            aria-hidden="true"
          />
          <i
            id="repeat"
            onClick={this.handleClickIcons}
            className={this.getRepeatClasses()}
            aria-hidden="true"
          />
        </div>
        <div className="row time-bar justify-content-center align-items-center">
          <p>{msToDuration(this.state.elapsed)}</p>
          <div
            className="row align-items-center m-1"
            id="time-bar"
            onClick={this.handleClickBar}
          ></div>
          <p>{msToDuration(this.props.currentTrack.duration_ms)}</p>
        </div>
      </div>
    );
  }
}

export default MiniPlayerControls;
