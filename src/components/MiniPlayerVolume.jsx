import React, { Component } from "react";
import spoti from "../services/spotiService";
import ProgressBar from "./../utils/progressBar";
class MiniPlayerVolume extends Component {
  state = {
    volume: 100,
    silencedVolume: 100,
  };

  maxVolume = 100;
  volumeBar = new ProgressBar(100);

  componentDidMount = () => {
    this.volumeBar.renderBar("volume-bar", this.maxVolume, this.maxVolume);
  };

  handleClickBar = async ({ clientX }) => {
    const volume = await this.volumeBar.handleClick(
      clientX,
      spoti.setPlayerVolume,
      this.maxVolume
    );
    console.log(volume);
    this.setState({ volume });
  };

  handleClickIcon = async () => {
    try {
      const { volume, silencedVolume } = this.state;
      if (volume === 0) {
        await spoti.setPlayerVolume(silencedVolume);
        this.volumeBar.drawProgress(silencedVolume, this.maxVolume);
        this.setState({ volume: silencedVolume });
      } else {
        await spoti.setPlayerVolume(0);
        this.volumeBar.drawProgress(0, this.maxVolume);
        this.setState({ silencedVolume: volume, volume: 0 });
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  getIconClasses = () => {
    return this.state.volume === 0
      ? "fa fa-volume-off fa-1x m-3"
      : "fa fa-volume-up fa-1x m-3";
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
