import React, { useState } from "react";
import spoti from "../services/spotiService";

function Tracks({ tracks, isArtist = false }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");

  if (isArtist) tracks = tracks.slice(0, 5);

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
      console.log(ex.message);
    }
  };

  const getPlayClasses = (trackId) => {
    return trackId === currentlyPlaying
      ? "fa fa-pause-circle fa-2x m-2"
      : "fa fa-play-circle fa-2x m-2";
  };

  return (
    <div className="tracks">
      {tracks.map((track) => (
        <div
          key={track.id}
          id={track.id}
          onClick={handleClick}
          className="row track"
        >
          {isArtist && (
            <img
              className="m-2"
              src={track.album.images[2].url}
              alt={track.name}
            />
          )}
          <i className={getPlayClasses(track.id)} aria-hidden="true"></i>
          <p>
            {track.name} ({msToDuration(track.duration_ms)})
          </p>
        </div>
      ))}
    </div>
  );
}

export default Tracks;
