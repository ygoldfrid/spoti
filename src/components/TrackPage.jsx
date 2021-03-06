import React, { Component, Fragment } from "react";
import spoti from "../services/spotiService";
import MiniPlayerControls from "./MiniPlayerControls";

class TrackPage extends Component {
  state = {
    currentTrack: {},
    isPlaying: true,
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

  async componentDidMount() {
    document.addEventListener("stateUpdate", this.stateUpdateListener);
    this.getTrackData();
    this.hideMiniPlayer();
  }

  componentWillUnmount() {
    document.removeEventListener("stateUpdate", this.stateUpdateListener);
    this.showMiniPlayer();
  }

  getTrackData = async () => {
    //Get Track
    const { data: currentTrack } = await spoti.getTrackById(
      this.props.match.params.id
    );
    //Get isPlaying
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

    if (!elapsed) this.props.history.replace(`/album/${currentTrack.album.id}`);

    this.setState({ currentTrack, isPlaying, shuffle, repeatMode, elapsed });
  };

  hideMiniPlayer = () => {
    const mini = document.getElementById("mini-player");
    if (mini) mini.style.display = "none";
  };

  showMiniPlayer = () => {
    const mini = document.getElementById("mini-player");
    if (mini) mini.style.display = "block";
  };

  handleBackClick = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      currentTrack,
      elapsed,
      isPlaying,
      shuffle,
      repeatMode,
    } = this.state;
    return (
      <div className="track-page px-4">
        <div className="row back">
          <i
            id="back"
            onClick={this.handleBackClick}
            className="fa fa-chevron-down fa-2x"
            aria-hidden="true"
          />
        </div>
        {currentTrack.id && (
          <Fragment>
            <div className="row justify-content-center my-3">
              <img
                height="250"
                width="250"
                src={currentTrack.album.images[0].url}
                alt="album"
              />
            </div>
            <div className="track-info mb-4">
              <div
                id="track-name-container"
                className="row justify-content-center"
              >
                <h4 id="track-name" className="text-center">
                  {currentTrack.name}
                </h4>
              </div>
              <div className="row justify-content-center">
                <h5 id="artist-name" className="text-center">
                  {currentTrack.artists[0].name}
                </h5>
              </div>
            </div>
            <MiniPlayerControls
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              shuffle={shuffle}
              repeatMode={repeatMode}
              elapsed={elapsed}
              size="large"
            />
          </Fragment>
        )}
      </div>
    );
  }
}

export default TrackPage;
