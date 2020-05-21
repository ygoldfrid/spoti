import React, { Component, Fragment } from "react";
import MiniPlayerMobile from "./MiniPlayerMobile";
import MiniPlayerDesktop from "./MiniPlayerDesktop";

class MiniPlayer extends Component {
  state = {
    currentTrack: {},
    isPlaying: false,
    shuffle: false,
    repeatMode: 0,
    elapsed: 0,
  };

  stateUpdateListener = ({ detail }) => {
    const currentTrack = { ...detail.track_window.current_track };
    const isPlaying = !detail.paused;
    const shuffle = detail.shuffle;
    const repeatMode = detail.repeat_mode;
    const elapsed = detail.position;
    this.setState({ currentTrack, isPlaying, shuffle, repeatMode, elapsed });
  };

  componentDidMount() {
    document.addEventListener("stateUpdate", this.stateUpdateListener);
  }

  componentWillUnmount() {
    document.removeEventListener("stateUpdate", this.stateUpdateListener);
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
            <MiniPlayerDesktop
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              shuffle={shuffle}
              repeatMode={repeatMode}
              elapsed={elapsed}
            />
            <MiniPlayerMobile
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              shuffle={shuffle}
              repeatMode={repeatMode}
              elapsed={elapsed}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default MiniPlayer;
