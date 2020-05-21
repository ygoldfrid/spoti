import React, { Fragment, useState } from "react";
import { Form } from "react-bootstrap";
import spoti from "../services/spotiService";
import SmallResults from "./common/SmallResults";

function Search({ history }) {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [show, setShow] = useState(true);

  const handleSearch = (e) => {
    const searchQuery = e.currentTarget.value;
    if (searchQuery) {
      populateData(searchQuery);
    } else {
      setArtists([]);
      setAlbums([]);
      setTracks([]);
    }
    setShow(true);
  };

  const populateData = async (searchQuery) => {
    const { data: artistsData } = await spoti.search(searchQuery, "artist", 1);
    setArtists(artistsData.artists.items);
    const { data: albumsData } = await spoti.search(searchQuery, "album", 3);
    setAlbums(albumsData.albums.items);
    const { data: tracksData } = await spoti.search(searchQuery, "track", 5);
    setTracks(tracksData.tracks.items);
  };

  const handleSelection = ({ currentTarget }) => {
    history.push(currentTarget.id);
    document.getElementsByTagName("input")[0].value = "";
    setShow(false);
  };

  return (
    <Fragment>
      <Form.Control
        className="form-control"
        onChange={handleSearch}
        placeholder="Search for artists or albums..."
      />
      {(artists.length !== 0 || albums.length !== 0) && show && (
        <div className="results">
          <SmallResults
            type="artist"
            title="Artists"
            results={artists}
            history={history}
            onClick={handleSelection}
          />
          <SmallResults
            type="album"
            title="Albums"
            results={albums}
            history={history}
            onClick={handleSelection}
          />
          <SmallResults
            type="track"
            title="Songs"
            results={tracks}
            history={history}
            onClick={handleSelection}
          />
        </div>
      )}
    </Fragment>
  );
}

export default Search;
