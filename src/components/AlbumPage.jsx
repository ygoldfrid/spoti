import React, { Fragment, useEffect, useState } from "react";
import Tracks from "./Tracks";
import Search from "./Search";
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

  return (
    <Fragment>
      {album && (
        <Fragment>
          <Search history={history} />
          <MainPage type="album" object={album} />
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
