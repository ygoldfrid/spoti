import React, { useState, useEffect } from "react";
import spoti from "../services/spotiService";
import queryString from "query-string";

function Tracks({ location, tracks, isArtist = false }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");

  if (isArtist) tracks = tracks.slice(0, 5);

  useEffect(() => {
    async function playQuery() {
      try {
        if (location.search) {
          const queryObject = queryString.parse(location.search);
          const queryTrack = queryObject.track;
          if (queryTrack) {
            await spoti.playTrack(queryTrack);
            setCurrentlyPlaying(queryTrack);
          }
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log("Track does not exist");
        }
      }
    }
    playQuery();
  }, [location]);

  const msToDuration = (ms) => {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleClick = async ({ currentTarget }) => {
    const targetId = currentTarget.id;
    try {
      const { data: currentlyPlaying } = await spoti.getCurrentlyPlaying();
      if (currentlyPlaying) {
        const currentId = currentlyPlaying.item.id;
        const { data: player } = await spoti.getCurrentlyPlaying();
        if (targetId === currentId && player.is_playing) {
          await spoti.pauseTrack(targetId);
          setCurrentlyPlaying("");
          return;
        }
      }
      await spoti.playTrack(targetId);
      setCurrentlyPlaying(targetId);
    } catch (ex) {
      console.log(ex);
    }
  };

  const getIconClasses = (trackId) => {
    return trackId === currentlyPlaying
      ? "fa fa-pause fa-1x m-2 is-playing"
      : "fa fa-play fa-1x m-2";
  };

  const getCurrentlyPlayingClasses = (trackId) => {
    return trackId === currentlyPlaying ? "is-playing" : "";
  };

  return (
    <div className="tracks">
      {tracks.map((track) => (
        <div
          key={track.id}
          id={track.id}
          onClick={handleClick}
          className="row track p-2"
        >
          {isArtist && (
            <img
              className="m-2"
              src={track.album.images[2].url}
              alt={track.name}
            />
          )}
          <i className={getIconClasses(track.id)} aria-hidden="true"></i>
          <p className={getCurrentlyPlayingClasses(track.id)}>
            {track.name} ({msToDuration(track.duration_ms)})
          </p>
        </div>
      ))}
    </div>
  );
}

export default Tracks;
