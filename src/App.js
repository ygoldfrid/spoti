import React, { Fragment, useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/protectedRoute";
import LoginPage from "./components/LoginPage";
import Logout from "./components/Logout";
import Callback from "./components/Callback";
import NotFound from "./components/NotFound";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import ArtistPage from "./components/ArtistPage";
import AlbumPage from "./components/AlbumPage";
import Profile from "./components/Profile";
import TrackPage from "./components/TrackPage";
import MiniPlayer from "./components/MiniPlayer";
import auth from "./services/authService";
import spoti from "./services/spotiService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      if (auth.isAuthenticated()) {
        const { data: user } = await spoti.getCurrentUser();
        setUser(user);
      }
    }
    getUser();
  }, []);

  return (
    <Fragment>
      <ToastContainer />
      <NavBar user={user} />
      <main role="main" className="container">
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/logout" component={Logout} />
          <Route path="/callback" component={Callback} />
          <ProtectedRoute path="/album/:id" component={AlbumPage} />
          <ProtectedRoute path="/track/:id" component={TrackPage} />
          <ProtectedRoute
            path="/artist/:id"
            render={(props) => <ArtistPage {...props} user={user} />}
          />
          <ProtectedRoute
            path="/profile"
            render={(props) => <Profile {...props} user={user} />}
          />
          <ProtectedRoute
            path="/home"
            render={(props) => <Home {...props} user={user} />}
          />
          <Route path="/not-found" component={NotFound} />
          <Redirect from="/" exact to="/home" />
          <Redirect to="/not-found" />
        </Switch>
      </main>
      {user && <MiniPlayer />}
    </Fragment>
  );
}

export default App;
