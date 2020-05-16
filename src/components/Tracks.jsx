import React, { Component } from "react";
import spoti from "../services/spotiService";
import queryString from "query-string";

class Tracks extends Component {
  state = {
    currentTrack: "",
    isPlaying: false,
    progress: 0,
  };

  async componentDidMount() {
    this.addStateUpdateListener();
    if (this.props.location.search) this.playQuery();
    const { data: currentlyPlaying } = await spoti.getCurrentlyPlaying();
    if (currentlyPlaying) {
      const currentId = currentlyPlaying.item.id;
      if (currentlyPlaying && currentlyPlaying.is_playing) {
        this.setState({
          currentTrack: currentId,
          isPlaying: true,
        });
      }
    }
  }

  addStateUpdateListener = () => {
    document.addEventListener("stateUpdate", (e) => {
      const { currentTrack } = this.state;
      const updatedTrack = e.detail.current_track.id;
      if (currentTrack && currentTrack !== updatedTrack) {
        this.setState({
          currentTrack: updatedTrack,
          isPlaying: true,
        });
      }
    });
  };

  playQuery = async () => {
    try {
      const queryObject = queryString.parse(this.props.location.search);
      const queryTrack = queryObject.track;
      if (queryTrack) {
        await spoti.playAlbumTrack(queryTrack);
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

  handleClick = async ({ currentTarget }) => {
    const targetId = currentTarget.id;
    try {
      const { data: currentlyPlaying } = await spoti.getCurrentlyPlaying();
      if (currentlyPlaying) {
        const currentId = currentlyPlaying.item.id;
        //If we clicked the song that is being played, we pause it
        if (targetId === currentId && currentlyPlaying.is_playing) {
          await spoti.pauseTrack(targetId);
          const { data: player } = await spoti.getPlayer();
          this.setState({
            progress: player.progress_ms,
            isPlaying: false,
          });
          return;
        }
      }
      //We play the clicked song
      //If it is the one that is in the player (paused) we start from the saved progress
      //If it is not the one in the player, we start from 0
      const playProgress =
        targetId === this.state.currentTrack ? this.state.progress : 0;
      await spoti.playAlbumTrack(targetId, playProgress);
      this.setState({
        currentTrack: targetId,
        isPlaying: true,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  msToDuration = (ms) => {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  getIconClasses = (trackId) => {
    if (trackId === this.state.currentTrack) {
      if (this.state.isPlaying) return "fa fa-volume-up fa-1x m-2 in-player";
      return "fa fa-play fa-1x m-2 in-player";
    }
    return "fa fa-play fa-1x m-2";
  };

  getTrackNameClasses = (trackId) => {
    return trackId === this.state.currentTrack ? "in-player" : "";
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

  render() {
    const { tracks: allTracks, isArtist } = this.props;
    const tracks = isArtist ? allTracks.slice(0, 5) : allTracks;
    return (
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
            {isArtist && (
              <img
                className="m-2"
                src={track.album.images[2].url}
                alt={track.name}
              />
            )}
            <i className={this.getIconClasses(track.id)} aria-hidden="true"></i>
            <p className={this.getTrackNameClasses(track.id)}>
              {track.name} ({this.msToDuration(track.duration_ms)})
            </p>
          </div>
        ))}
      </div>
    );
  }
}

export default Tracks;
