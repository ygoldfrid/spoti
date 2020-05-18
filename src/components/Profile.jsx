import React, { Fragment, useState, useEffect } from "react";
import spoti from "../services/spotiService";

function Profile({ user, history }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    async function getRecentlyPlayed() {
      try {
        const { data: tracks } = await spoti.getRecentlyPlayed();
        setRecentlyPlayed(tracks.items);
      } catch (ex) {
        console.log(ex.message);
      }
    }
    getRecentlyPlayed();
  }, []);

  const handleClick = ({ currentTarget }) => {
    history.push(currentTarget.id);
  };

  const getResultId = (result) => {
    return `/album/${result.album.id}?track=${result.id}`;
  };

  return (
    <div className="user-profile p-2 mb-4">
      {user && (
        <Fragment>
          <div className="row justify-content-center">
            <img
              className="m-3"
              height="250"
              width="250"
              alt={user.display_name}
              src={user.images[0] ? user.images[0].url : ""}
            />
          </div>
          <div className="user-info">
            <h1 className="text-center mb-1">{user.display_name}</h1>
            <p className="text-center">
              {user.country} &bull; {user.followers.total} followers &bull;{" "}
              {user.email}
            </p>
          </div>
          <div className="row">
            <h3>Play History</h3>
          </div>
          {recentlyPlayed.map((track) => (
            <div
              key={track.played_at}
              className="result row"
              onClick={handleClick}
              id={getResultId(track.track)}
            >
              <img
                className="m-2"
                height="64"
                width="64"
                alt="album"
                src={track.track.album.images[0].url}
              />
              <div className="result-info">
                <h6>{track.track.name}</h6>
                <p>{track.track.artists[0].name}</p>
                <p>Played on {track.played_at.slice(0, 10)}</p>
              </div>
            </div>
          ))}
        </Fragment>
      )}
    </div>
  );
}

export default Profile;
