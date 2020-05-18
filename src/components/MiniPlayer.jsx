import React, { Component, Fragment } from "react";
import MiniPlayerInfo from "./MiniPlayerInfo";
import MiniPlayerControls from "./MiniPlayerControls";
import MiniPlayerVolume from "./MiniPlayerVolume";

class MiniPlayer extends Component {
  state = {
    currentTrack: {},
    isPlaying: false,
    shuffle: false,
    repeatMode: 0,
  };

  addStateUpdateListener = () => {
    document.addEventListener("stateUpdate", ({ detail }) => {
      const currentTrack = { ...detail.track_window.current_track };
      const isPlaying = !detail.paused;
      const shuffle = detail.shuffle;
      const repeatMode = detail.repeat_mode;
      this.setState({ currentTrack, isPlaying, shuffle, repeatMode });
    });
  };

  async componentDidMount() {
    this.addStateUpdateListener();
  }

  render() {
    const { currentTrack, isPlaying, shuffle, repeatMode } = this.state;
    return (
      <Fragment>
        {currentTrack.id && (
          <div className="mini-player p-2">
            <div className="row align-items-center">
              <MiniPlayerInfo currentTrack={currentTrack} />
              <MiniPlayerControls
                isPlaying={isPlaying}
                shuffle={shuffle}
                repeatMode={repeatMode}
              />
              <MiniPlayerVolume />
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default MiniPlayer;
