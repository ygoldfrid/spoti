import React, { Fragment, Component } from "react";
import Tracks from "./Tracks";
import BigResults from "./common/BigResults";
import MainPage from "./common/MainPage";
import spoti from "../services/spotiService";
import { toNumberFormat } from "../utils/converter";

class ArtistPage extends Component {
  state = {
    artist: null,
    topTracks: [],
    follows: [false],
    albums: [],
    singles: [],
    compilations: [],
    appears_on: [],
  };

  componentDidMount = async () => {
    const { id } = this.props.match.params;
    this.getArtist(id);
    this.getFollowingInfo(id);
    if (this.props.user) this.getAll(id);
  };

  componentDidUpdate(prevProps) {
    const { id } = this.props.match.params;
    if (prevProps.user !== this.props.user) this.getAll(id);
  }

  getAll = (id) => {
    this.getTopTracks(id);
    this.getAlbums(id, "album");
    this.getAlbums(id, "single");
    this.getAlbums(id, "compilation");
    this.getAlbums(id, "appears_on");
  };

  getArtist = async (id) => {
    try {
      const { data: artist } = await spoti.getArtistById(id);
      this.setState({ artist });
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        this.props.history.replace("/not-found");
    }
  };

  getFollowingInfo = async (id) => {
    const { data: follows } = await spoti.getUserFollowsArtist(id);
    this.setState({ follows: follows[0] });
  };

  getTopTracks = async (id) => {
    const { data: topTracks } = await spoti.getArtistTopTracks(
      id,
      this.props.user.country
    );
    this.setState({ topTracks: topTracks.tracks });
  };

  getAlbums = async (id, group) => {
    const { data: results } = await spoti.getArtistAlbums(
      id,
      group,
      this.props.user.country
    );
    if (group === "album") this.setState({ albums: results.items });
    if (group === "single") this.setState({ singles: results.items });
    if (group === "compilation") this.setState({ compilations: results.items });
    if (group === "appears_on") this.setState({ appears_on: results.items });
  };

  handleFollow = async () => {
    try {
      const { artist, follows } = this.state;
      if (follows) {
        await spoti.unfollowArtist(artist.id);
        this.setState({ follows: false });
      } else {
        await spoti.followArtist(artist.id);
        this.setState({ follows: true });
      }
    } catch (ex) {}
  };

  render() {
    const {
      artist,
      topTracks,
      follows,
      albums: allAlbums,
      singles: allSingles,
      compilations: allCompilations,
      appears_on: allAppears,
    } = this.state;

    const albums = allAlbums.slice(0, 12);
    const singles = allSingles.slice(0, 6);
    const compilations = allCompilations.slice(0, 6);
    const appears_on = allAppears.slice(0, 6);

    return (
      <Fragment>
        {artist && (
          <Fragment>
            <MainPage
              type="artist"
              object={artist}
              subtitle={toNumberFormat(artist.followers.total) + " followers"}
              onFollowClick={this.handleFollow}
              follows={follows}
            />
            <Tracks
              title="Popular"
              type="artist"
              id={artist.id}
              tracks={topTracks}
              {...this.props}
            />
            <BigResults title="Albums" results={albums} {...this.props} />
            <BigResults title="Singles" results={singles} {...this.props} />
            <BigResults
              title="Compilations"
              results={compilations}
              {...this.props}
            />
            <BigResults
              title="Appeared On"
              results={appears_on}
              {...this.props}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default ArtistPage;
