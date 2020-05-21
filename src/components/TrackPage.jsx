import React, { Component, Fragment } from "react";
import spoti from "../services/spotiService";
import { msToDuration } from "./../utils/converter";

class TrackPage extends Component {
  state = {
    currentTrack: {},
    isPlaying: false,
    shuffle: false,
    repeatMode: 0,
    elapsed: 0,
    canvas: undefined,
    context: undefined,
  };

  interval = undefined;

  stateUpdateListener = ({ detail }) => {
    const currentTrack = { ...detail.track_window.current_track };
    const isPlaying = !detail.paused;
    const shuffle = detail.shuffle;
    const repeatMode = detail.repeat_mode;
    const elapsed = detail.position;
    this.setState({ currentTrack, isPlaying, shuffle, repeatMode, elapsed });
  };

  async componentDidMount() {
    document.addEventListener("stateUpdate", this.stateUpdateListener);
    this.getTrackData();
    this.setProgressBar();
    this.startTimer();
  }

  componentWillUnmount() {
    document.removeEventListener("stateUpdate", this.stateUpdateListener);
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

  getTrackData = async () => {
    //Get Track
    const { data: currentTrack } = await spoti.getTrackById(
      this.props.match.params.id
    );

    //Get Player
    const { data: player } = await spoti.getPlayer();
    const {
      is_playing: isPlaying,
      shuffle_state: shuffle,
      repeat_state,
      progress_ms: elapsed,
    } = player;
    let repeatMode;
    if (repeat_state === "off") repeatMode = 0;
    if (repeat_state === "context") repeatMode = 1;
    if (repeat_state === "track") repeatMode = 2;

    if (!isPlaying)
      this.props.history.replace(
        `/album/${currentTrack.album.id}?track=${currentTrack.id}`
      );

    this.setState({
      currentTrack,
      isPlaying,
      shuffle,
      repeatMode,
      elapsed,
    });
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
      (seek * canvas.width) / this.state.currentTrack.duration_ms;
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
      (drawSeek * this.state.currentTrack.duration_ms) / this.state.canvas.width
    );
    await spoti.seek(seek);
    this.drawProgress(canvas, context, seek);
  };

  handleClick = async ({ currentTarget }) => {
    try {
      const targetId = currentTarget.id;
      const { isPlaying, shuffle, repeatMode } = this.state;
      if (targetId === "play-or-pause")
        if (isPlaying) await spoti.pauseTrack();
        else await spoti.resumePlayback();
      if (targetId === "shuffle") await spoti.shuffle(!shuffle);
      if (targetId === "repeat") await spoti.repeat((repeatMode + 1) % 3);
      if (targetId === "next") await spoti.skipToNextTrack();
      if (targetId === "previous") await spoti.skipToPreviousTrack();
    } catch (ex) {
      console.log(ex);
    }
  };

  handleBackClick = () => {
    this.props.history.replace(
      `/artist/${this.state.currentTrack.artists[0].id}`
    );
  };
  getPlayClasses = () => {
    return this.state.isPlaying
      ? "fa fa-pause fa-2x mx-3"
      : "fa fa-play fa-2x mx-3";
  };

  getShuffleClasses = () => {
    return this.state.shuffle
      ? "fa fa-random fa-2x mx-3 green"
      : "fa fa-random fa-2x mx-3";
  };

  getRepeatClasses = () => {
    const { repeatMode } = this.state;
    if (repeatMode === 0) return "fa fa-refresh fa-2x mx-3";
    if (repeatMode === 1) return "fa fa-refresh fa-2x mx-3 green";
    if (repeatMode === 2) return "fa fa-retweet fa-2x mx-3 green";
  };

  render() {
    const { currentTrack, elapsed } = this.state;
    return (
      <div className="track-page">
        <div className="row back"></div>
        {currentTrack.id && (
          <Fragment>
            <div className="row justify-content-center m-3">
              <div className="col-2">
                <i
                  id="back"
                  onClick={this.handleBackClick}
                  className="fa fa-arrow-left fa-2x m-3"
                  aria-hidden="true"
                />
              </div>
              <div className="col-8">
                <img
                  height="250"
                  width="250"
                  src={currentTrack.album.images[0].url}
                  alt="album"
                />
              </div>
              <div className="col-2" />
            </div>
            <div className="row justify-content-center">
              <h3 className="text-center">{currentTrack.name}</h3>
            </div>
            <div className="row justify-content-center">
              <h5 className="text-center">{currentTrack.artists[0].name}</h5>
            </div>
          </Fragment>
        )}
        <div className="row mini-player-buttons justify-content-center m-4">
          <i
            id="shuffle"
            onClick={this.handleClick}
            className={this.getShuffleClasses()}
            aria-hidden="true"
          />
          <i
            id="previous"
            onClick={this.handleClick}
            className="fa fa-step-backward fa-2x mx-3"
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
            className="fa fa-step-forward fa-2x mx-3"
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
          <p>{msToDuration(elapsed)}</p>
          <div
            className="row align-items-center m-1"
            id="time-bar"
            onClick={this.handleClickBar}
          ></div>
          <p>{msToDuration(currentTrack.duration_ms)}</p>
        </div>
      </div>
    );
  }
}

export default TrackPage;
