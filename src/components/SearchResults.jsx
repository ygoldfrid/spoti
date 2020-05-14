import React, { Fragment } from "react";

function ArtistResults({ results, type, onClick }) {
  return (
    <div className="results">
      {results.length !== 0 && (
        <h3>{type === "artist" ? "Artists" : "Albums"}</h3>
      )}
      {results.map((result) => (
        <div
          key={result.id}
          id={`/${type}/${result.id}`}
          className="result row"
          onClick={onClick}
        >
          <img
            className="m-2"
            height="100"
            width="100"
            alt={result.name}
            src={result.images[2] ? result.images[2].url : ""}
          />
          <div className="result-info">
            <h6>{result.name}</h6>
            {type === "artist" && (
              <Fragment>
                <p>
                  Followers:{" "}
                  {new Intl.NumberFormat().format(result.followers.total)}
                </p>
                <p>Genres: {result.genres.slice(0, 3).join(", ")}</p>
              </Fragment>
            )}
            {type === "album" && (
              <Fragment>
                <p>Album by {result.artists[0].name}</p>
                <p>{result.total_tracks} songs</p>
                <p>Release Date: {result.release_date}</p>
              </Fragment>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArtistResults;
