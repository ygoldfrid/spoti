import React, { Fragment, useEffect, useState } from "react";
import spoti from "../services/spotiService";
import Tracks from "./Tracks";
import { Link } from "react-router-dom";

function AlbumPage({ match, history, location }) {
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function getAlbum() {
      try {
        const { data: album } = await spoti.getAlbumById(match.params.id);
        setAlbum(album);
        const { data: tracks } = await spoti.getAlbumTracks(match.params.id);
        setTracks(tracks.items);
      } catch (ex) {
        if (ex.response && ex.response.status === 400)
          history.replace("/not-found");
      }
    }
    getAlbum();
  }, [match.params.id, history]);

  return (
    <Fragment>
      {album && (
        <Fragment>
          <div className="row album p-2 mb-4">
            <img
              className="m-3"
              height="250"
              width="250"
              alt={album.name}
              src={album.images[0] ? album.images[0].url : ""}
            />
            <div className="album-info mt-3">
              <h1 className="text-center mb-1">{album.name}</h1>
              <p className="text-center">
                Album by{" "}
                <Link to={`/artist/${album.artists[0].id}`}>
                  {album.artists[0].name}
                </Link>{" "}
                &bull; {album.total_tracks} songs &bull;{" "}
                {album.release_date.slice(0, 4)}
              </p>
            </div>
          </div>
          <div className="row">
            <h3>Tracks</h3>
          </div>
          <Tracks tracks={tracks} location={location} />
        </Fragment>
      )}
    </Fragment>
  );
}

export default AlbumPage;
