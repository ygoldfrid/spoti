import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tracks from "./Tracks";
import MainPage from "./common/MainPage";
import spoti from "../services/spotiService";

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

  const getSubtitle = () => {
    return (
      <Fragment>
        Album by{" "}
        <Link to={`/artist/${album.artists[0].id}`}>
          {album.artists[0].name}
        </Link>{" "}
        &bull; {album.total_tracks} songs &bull;{" "}
        {album.release_date.slice(0, 4)}
      </Fragment>
    );
  };

  return (
    <Fragment>
      {album && (
        <Fragment>
          <MainPage object={album} subtitle={getSubtitle()} />
          <Tracks
            title="Tracks"
            type="album"
            id={album.id}
            tracks={tracks}
            location={location}
          />
        </Fragment>
      )}
    </Fragment>
  );
}

export default AlbumPage;
