import React, { Component } from "react";
import spoti from "../services/spotiService";
class MiniPlayerVolume extends Component {
  state = {
    volume: 100,
    silencedVolume: 100,
    canvas: undefined,
    context: undefined,
  };

  componentDidMount = () => {
    this.setProgressBar();
  };

  setProgressBar = () => {
    const canvas = document.createElement("CANVAS");
    const context = canvas.getContext("2d");
    const volumeBar = document.getElementById("volume-bar");
    canvas.width = 100;
    canvas.height = 5;
    volumeBar.appendChild(canvas);
    this.drawProgress(canvas, context);
    this.setState({ canvas, context });
  };

  drawProgress = (canvas, context, volume = 100) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#535353";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#b3b3b3";
    context.fillRect(0, 0, volume, canvas.height);
  };

  handleClickBar = async ({ clientX }) => {
    const { context, canvas } = this.state;
    const volumeBar = document.getElementById("volume-bar");
    const volumePosition = volumeBar.getBoundingClientRect().left;
    const volume = Math.floor(clientX - volumePosition);
    await spoti.setPlayerVolume(volume);
    this.setState({ volume });
    this.drawProgress(canvas, context, volume);
  };

  getIconClasses = () => {
    return this.state.volume === 0
      ? "fa fa-volume-off fa-1x m-3"
      : "fa fa-volume-up fa-1x m-3";
  };

  handleClickIcon = async () => {
    try {
      const { canvas, context, volume, silencedVolume } = this.state;
      if (volume === 0) {
        await spoti.setPlayerVolume(silencedVolume);
        this.setState({ volume: silencedVolume });
        this.drawProgress(canvas, context, silencedVolume);
      } else {
        await spoti.setPlayerVolume(0);
        this.setState({ silencedVolume: volume, volume: 0 });
        this.drawProgress(canvas, context, 0);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    return (
      <div className="col mini-player-volume d-flex justify-content-end">
        <div className="row mini-player-buttons align-items-center m-3">
          <i
            onClick={this.handleClickIcon}
            className={this.getIconClasses()}
            aria-hidden="true"
          />
          <div
            className="row align-items-center m-1"
            id="volume-bar"
            onClick={this.handleClickBar}
          ></div>
        </div>
      </div>
    );
  }
}

export default MiniPlayerVolume;
