import React from "react";

function Tracks({ tracks, isArtist = false }) {
  if (isArtist) tracks = tracks.slice(0, 5);

  const msToDuration = (ms) => {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleClick = ({ currentTarget }) => {
    // console.log(currentTarget.id);
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
          <i className="fa fa-play-circle fa-2x m-2" aria-hidden="true"></i>
          <p>
            {track.name} ({msToDuration(track.duration_ms)})
          </p>
        </div>
      ))}
    </div>
  );
}

export default Tracks;
