import React, { Fragment } from "react";

function BigResults({ title, type, results, history }) {
  const getResultId = (result) => {
    if (type === "artist") return `/artist/${result.id}`;
    if (type === "album") return `/album/${result.id}`;
    if (type === "track") return `/album/${result.album.id}?track=${result.id}`;
  };

  return (
    <Fragment>
      {((title === "Albums" && results.length > 0) || results.length > 2) && (
        <Fragment>
          <div className="row big-results-title my-3">
            <h3>{title}</h3>
          </div>
          <div className="row big-results">
            {results.map((result) => (
              <div
                key={result.id}
                id={getResultId(result)}
                onClick={({ currentTarget }) => {
                  history.push(currentTarget.id);
                }}
                className="col-6 col-sm-4 col-md-3 col-lg-2 big-result justify-content-center py-3"
              >
                <div className="row justify-content-center">
                  <img
                    height="150"
                    width="150"
                    alt={result.name}
                    src={
                      result.images
                        ? result.images[0].url
                        : result.album.images[0].url
                    }
                  />
                </div>
                <p className="text-center">{result.name}</p>
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default BigResults;
