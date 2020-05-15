import React, { Fragment } from "react";

function SearchResults({ results, type, onClick }) {
  const getImageUrl = (result) => {
    if (result.album) return result.album.images[0].url;
    if (result.images.length !== 0) return result.images[0].url;
    return "";
  };

  const getResultId = (result) => {
    if (type === "track") {
      return `/album/${result.album.id}?track=${result.id}`;
    }
    return `/${type}/${result.id}`;
  };

  return (
    <Fragment>
      {results.length !== 0 && (
        <div className="type-results mb-2">
          {type === "artist" && <h3>Artists</h3>}
          {type === "album" && <h3>Albums</h3>}
          {type === "track" && <h3>Songs</h3>}
          {results.map((result) => (
            <div
              key={result.id}
              id={getResultId(result)}
              className="result row"
              onClick={onClick}
            >
              <img
                className="m-2"
                height="64"
                width="64"
                alt={result.type}
                src={getImageUrl(result)}
              />
              <div className="result-info">
                <h6>{result.name}</h6>
                {type === "artist" && (
                  <p>
                    {new Intl.NumberFormat().format(result.followers.total)}{" "}
                    followers
                  </p>
                )}
                {type === "album" && (
                  <Fragment>
                    <p>Album by {result.artists[0].name}</p>
                    <p>{result.total_tracks} songs</p>
                  </Fragment>
                )}
                {type === "track" && <p>Song by {result.artists[0].name}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
}

export default SearchResults;
