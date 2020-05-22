import React, { Component, Fragment } from "react";
import MiniPlayerMobile from "./MiniPlayerMobile";
import MiniPlayerDesktop from "./MiniPlayerDesktop";
import Media from "react-media";

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
          <div className="mini-player p-2" id="mini-player">
            <Media
              queries={{
                mobile: "(max-width: 599px)",
                desktop: "(min-width: 600px)",
              }}
            >
              {(matches) => (
                <Fragment>
                  {matches.mobile && (
                    <MiniPlayerMobile
                      currentTrack={currentTrack}
                      isPlaying={isPlaying}
                      shuffle={shuffle}
                      repeatMode={repeatMode}
                      elapsed={elapsed}
                    />
                  )}
                  {matches.desktop && (
                    <MiniPlayerDesktop
                      currentTrack={currentTrack}
                      isPlaying={isPlaying}
                      shuffle={shuffle}
                      repeatMode={repeatMode}
                      elapsed={elapsed}
                    />
                  )}
                </Fragment>
              )}
            </Media>
          </div>
        )}
      </Fragment>
    );
  }
}

export default MiniPlayer;
