import React, { Fragment, useEffect, useState } from "react";
import spoti from "../services/spotiService";
import Tracks from "./Tracks";
import BigResults from "./common/BigResults";
import MainPage from "./common/MainPage";
import Search from "./Search";

function ArtistPage({ match, history, location, user }) {
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [follows, setFollows] = useState([false]);
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);
  const [compilations, setCompilations] = useState([]);
  const [appears_on, setAppears_on] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const id = match.params.id;
        //Getting Artist
        const { data: artist } = await spoti.getArtistById(id);
        setArtist(artist);
        //Getting Following Info
        const { data: follows } = await spoti.getUserFollowsArtist(id);
        setFollows(follows[0]);
        //Getting Top Tracks
        if (user) {
          const { data: topTracks } = await spoti.getArtistTopTracks(
            id,
            user.country
          );
          setTopTracks(topTracks.tracks);
          //Getting Albums
          const { data: albums } = await spoti.getArtistAlbums(
            id,
            "album",
            user.country
          );
          setAlbums(albums.items);
          //Getting Singles
          const { data: singles } = await spoti.getArtistAlbums(
            id,
            "single",
            user.country
          );
          setSingles(singles.items);
          //Getting Compilations
          const { data: compilations } = await spoti.getArtistAlbums(
            id,
            "compilation",
            user.country
          );
          setCompilations(compilations.items);
          //Getting Appears On
          const { data: appearsOn } = await spoti.getArtistAlbums(
            id,
            "appears_on",
            user.country
          );
          setAppears_on(appearsOn.items);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 400)
          history.replace("/not-found");
      }
    }
    getData();
  }, [match.params.id, history, user]);

  const handleFollow = async () => {
    try {
      const id = match.params.id;
      if (follows) {
        await spoti.unfollowArtist(id);
        setFollows(false);
      } else {
        await spoti.followArtist(id);
        setFollows(true);
      }
    } catch (ex) {}
  };

  return (
    <Fragment>
      {artist && (
        <Fragment>
          <Search history={history} />
          <MainPage
            type="artist"
            object={artist}
            onFollowClick={handleFollow}
            follows={follows}
          />
          <Tracks
            title="Popular"
            type="artist"
            id={artist.id}
            tracks={topTracks}
            location={location}
            user={user}
          />
          <BigResults
            title="Albums"
            type="album"
            results={albums.slice(0, 12)}
            history={history}
          />
          <BigResults
            title="Singles"
            type="album"
            results={singles.slice(0, 6)}
            history={history}
          />
          <BigResults
            title="Compilations"
            type="album"
            results={compilations.slice(0, 6)}
            history={history}
          />
          <BigResults
            title="Appeared On"
            type="album"
            results={appears_on.slice(0, 6)}
            history={history}
          />
        </Fragment>
      )}
    </Fragment>
  );
}

export default ArtistPage;
