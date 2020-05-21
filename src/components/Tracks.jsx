import React, { Component, Fragment } from "react";
import queryString from "query-string";
import spoti from "../services/spotiService";
import { msToDuration } from "./../utils/converter";

class Tracks extends Component {
  state = {
    currentTrack: "",
    isPlaying: false,
  };

  stateUpdateListener = ({ detail }) => {
    const currentTrack = detail.track_window.current_track.id;
    const isPlaying = !detail.paused;
    this.setState({ currentTrack, isPlaying });
  };

  async componentDidMount() {
    document.addEventListener("stateUpdate", this.stateUpdateListener);
    if (this.props.location.search) this.playQuery();
    else this.checkCurrentlyPlayingTrack();
  }

  componentWillUnmount() {
    document.removeEventListener("stateUpdate", this.stateUpdateListener);
  }

  playQuery = async () => {
    try {
      const { location, id } = this.props;
      const queryObject = queryString.parse(location.search);
      const queryTrack = queryObject.track;
      if (queryTrack) {
        await spoti.playAlbumTrack(queryTrack, id);
        this.setState({
          currentTrack: queryTrack,
          isPlaying: true,
        });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("Track does not exist");
      }
    }
  };

  checkCurrentlyPlayingTrack = async () => {
    const { data: currentlyPlaying } = await spoti.getCurrentlyPlaying();
    if (currentlyPlaying && currentlyPlaying.is_playing) {
      this.setState({
        currentTrack: currentlyPlaying.item.id,
        isPlaying: true,
      });
    }
  };

  handleClick = async ({ currentTarget }) => {
    try {
      const targetId = currentTarget.id;
      const { data: currentlyPlaying } = await spoti.getCurrentlyPlaying();
      const pauseIt =
        currentlyPlaying &&
        currentlyPlaying.is_playing &&
        currentlyPlaying.item.id === targetId;
      if (pauseIt) this.pauseTrack(targetId);
      else this.playTrack(targetId);
    } catch (ex) {
      console.log(ex);
    }
  };

  pauseTrack = async (targetId) => {
    await spoti.pauseTrack(targetId);
    this.setState({ isPlaying: false });
  };

  playTrack = async (targetId) => {
    const { type, id, user } = this.props;
    const { currentTrack } = this.state;
    if (targetId === currentTrack) await spoti.resumePlayback();
    else if (type === "artist")
      await spoti.playArtistTrack(targetId, id, user.country);
    else if (type === "album") await spoti.playAlbumTrack(targetId, id);
    this.setState({
      currentTrack: targetId,
      isPlaying: true,
    });
  };

  handleMouseOver = ({ currentTarget }) => {
    if (currentTarget.id === this.state.currentTrack) {
      const iconElement = currentTarget.getElementsByTagName("i")[0];
      iconElement.classList.remove("fa-volume-up");
      iconElement.classList.add("fa-pause");
    }
  };

  handleMouseOut = ({ currentTarget }) => {
    if (currentTarget.id === this.state.currentTrack) {
      const iconElement = currentTarget.getElementsByTagName("i")[0];
      iconElement.classList.remove("fa-pause");
      iconElement.classList.add("fa-volume-up");
    }
  };

  getIconClasses = (trackId) => {
    if (trackId === this.state.currentTrack) {
      if (this.state.isPlaying) return "fa fa-volume-up fa-1x m-2 green";
      return "fa fa-play fa-1x m-2 green";
    }
    return "fa fa-play fa-1x m-2";
  };

  getTrackNameClasses = (trackId) => {
    return trackId === this.state.currentTrack ? "green" : "";
  };

  render() {
    const { tracks: allTracks, type } = this.props;
    const tracks = type === "artist" ? allTracks.slice(0, 5) : allTracks;
    return (
      <Fragment>
        <div className="row tracks-title">
          <h3>{this.props.title}</h3>
        </div>
        <div className="tracks" id="tracks">
          {tracks.map((track) => (
            <div
              key={track.id}
              id={track.id}
              onClick={this.handleClick}
              onMouseOver={this.handleMouseOver}
              onMouseOut={this.handleMouseOut}
              className="row track p-2"
            >
              {type === "artist" && (
                <img
                  className="m-2"
                  src={track.album.images[2].url}
                  alt={track.name}
                />
              )}
              <i
                className={this.getIconClasses(track.id)}
                aria-hidden="true"
              ></i>
              <p className={this.getTrackNameClasses(track.id)}>
                {track.name} ({msToDuration(track.duration_ms)})
              </p>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default Tracks;
