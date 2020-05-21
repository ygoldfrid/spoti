import React, { Component } from "react";
import spoti from "../services/spotiService";
import { msToDuration } from "./../utils/converter";

class MiniPlayerControls extends Component {
  state = {
    canvas: undefined,
    context: undefined,
    elapsed: 0,
  };

  interval = undefined;

  componentDidMount = () => {
    this.setProgressBar();
    this.startTimer();
  };

  componentDidUpdate(prevProps) {
    const { elapsed, isPlaying } = this.props;
    if (prevProps.elapsed !== elapsed) {
      this.setState({ elapsed });
    }
    if (prevProps.isPlaying !== isPlaying)
      if (!isPlaying) this.pauseTimer();
      else this.startTimer();
  }

  timer = () => {
    const { canvas, context, elapsed } = this.state;
    this.setState({ elapsed: elapsed + 1000 });
    this.drawProgress(canvas, context, elapsed);
  };

  startTimer = () => {
    this.interval = setInterval(this.timer, 1000);
  };

  pauseTimer = () => {
    clearInterval(this.interval);
  };

  setProgressBar = () => {
    const canvas = document.createElement("CANVAS");
    const context = canvas.getContext("2d");
    const timeBar = document.getElementById("time-bar");
    canvas.width = 200;
    canvas.height = 5;
    timeBar.appendChild(canvas);
    this.drawProgress(canvas, context);
    this.setState({ canvas, context });
  };

  drawProgress = (canvas, context, seek = 0) => {
    const drawSeek =
      (seek * canvas.width) / this.props.currentTrack.duration_ms;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#535353";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#b3b3b3";
    context.fillRect(0, 0, drawSeek, canvas.height);
  };

  handleClickBar = async ({ clientX }) => {
    const { context, canvas } = this.state;
    const timeBar = document.getElementById("time-bar");
    const timePosition = timeBar.getBoundingClientRect().left;
    const drawSeek = clientX - timePosition;
    const seek = Math.floor(
      (drawSeek * this.props.currentTrack.duration_ms) / this.state.canvas.width
    );
    await spoti.seek(seek);
    this.drawProgress(canvas, context, seek);
  };

  handleClick = async ({ currentTarget }) => {
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
            onClick={this.handleClick}
            className={this.getShuffleClasses()}
            aria-hidden="true"
          />
          <i
            id="previous"
            onClick={this.handleClick}
            className="fa fa-step-backward fa-1x mx-3"
            aria-hidden="true"
          />
          <i
            id="play-or-pause"
            onClick={this.handleClick}
            className={this.getPlayClasses()}
            aria-hidden="true"
          />
          <i
            id="next"
            onClick={this.handleClick}
            className="fa fa-step-forward fa-1x mx-3"
            aria-hidden="true"
          />
          <i
            id="repeat"
            onClick={this.handleClick}
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
