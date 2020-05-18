import React from "react";
import { Link } from "react-router-dom";

function MiniPlayerInfo({ currentTrack }) {
  return (
    <div className="col mini-player-info">
      <div className="row p-2">
        <div className="col-2">
          <Link to={`/album/${currentTrack.album.uri.slice(14)}`}>
            <img
              src={currentTrack.album.images[0].url}
              width="64"
              height="64"
              alt="album"
            />
          </Link>
        </div>
        <div className="col">
          <div className="row mini-player-text">
            <div className="col">
              <h5>
                <Link to={`/album/${currentTrack.album.uri.slice(14)}`}>
                  {currentTrack.name}
                </Link>
              </h5>
            </div>
            <div className="w-100"></div>
            <div className="col">
              {currentTrack.artists.map((artist) => (
                <h6>
                  <Link to={`/artist/${artist.uri.slice(15)}`}>
                    {artist.name}
                  </Link>
                </h6>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniPlayerInfo;
