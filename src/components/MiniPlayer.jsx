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
    elapsed: 0,
  };

  addStateUpdateListener = () => {
    document.addEventListener("stateUpdate", ({ detail }) => {
      const currentTrack = { ...detail.track_window.current_track };
      const isPlaying = !detail.paused;
      const shuffle = detail.shuffle;
      const repeatMode = detail.repeat_mode;
      const elapsed = detail.position;
      this.setState({ currentTrack, isPlaying, shuffle, repeatMode, elapsed });
    });
  };

  async componentDidMount() {
    this.addStateUpdateListener();
  }

  render() {
    const {
      currentTrack,
      isPlaying,
      shuffle,
      repeatMode,
      elapsed,
    } = this.state;
    return (
      <Fragment>
        {currentTrack.id && (
          <div className="mini-player p-2">
            <div className="row align-items-center">
              <MiniPlayerInfo currentTrack={currentTrack} />
              <MiniPlayerControls
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                shuffle={shuffle}
                repeatMode={repeatMode}
                elapsed={elapsed}
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
