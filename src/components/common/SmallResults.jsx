import React from "react";
import { Fragment } from "react";

function SmallResults({ type, title, results, history }) {
  const getResultId = (result) => {
    if (type === "track" || type === "profile") {
      return `/album/${result.album.id}?track=${result.id}`;
    }
    return `/${type}/${result.id}`;
  };

  const getImageUrl = (result) => {
    if (result.album) return result.album.images[0].url;
    if (result.images.length !== 0) return result.images[0].url;
  };

  const getSubtitle = (result) => {
    if (type === "profile")
      return <Fragment>{result.artists[0].name}</Fragment>;
    if (type === "artist") return <Fragment>Artist</Fragment>;
    if (type === "album")
      return <Fragment>Album &bull; {result.artists[0].name}</Fragment>;
    if (type === "track")
      return <Fragment>Song &bull; {result.artists[0].name}</Fragment>;
  };

  const getSecondSubtitle = (result, playedOn) => {
    if (type === "profile")
      return <Fragment>Played on {playedOn.slice(0, 10)}</Fragment>;
    if (type === "album")
      return <Fragment>{result.total_tracks} songs</Fragment>;
  };

  return (
    <Fragment>
      {results.length !== 0 && (
        <div className="small-results">
          <div className="row small-results-title">
            <h3>{title}</h3>
          </div>
          {results.map((result) => {
            let playedOn = "";
            if (type === "profile") {
              playedOn = result.played_at;
              result = result.track;
            }
            return (
              <div
                key={type === "profile" ? playedOn : result.id}
                id={getResultId(result)}
                className="small-result row"
                onClick={({ currentTarget }) => {
                  history.push(currentTarget.id);
                }}
              >
                <img
                  className="m-2"
                  height="64"
                  width="64"
                  alt="album"
                  src={getImageUrl(result)}
                />
                <div className="small-result-info">
                  <h6>{result.name}</h6>
                  <p>{getSubtitle(result)}</p>
                  <p>{getSecondSubtitle(result, playedOn)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Fragment>
  );
}

export default SmallResults;
