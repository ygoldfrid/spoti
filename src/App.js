import React, { Fragment, useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/protectedRoute";
import LoginPage from "./components/LoginPage";
import Callback from "./components/Callback";
import NavBar from "./components/NavBar";
import Logout from "./components/Logout";
import Search from "./components/Search";
import ArtistPage from "./components/ArtistPage";
import AlbumPage from "./components/AlbumPage";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
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
    document.title = process.env.REACT_APP_NAME;
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
          <ProtectedRoute
            path="/artist/:id"
            render={(props) => <ArtistPage {...props} user={user} />}
          />
          <ProtectedRoute path="/album/:id" component={AlbumPage} />
          <ProtectedRoute
            path="/profile"
            render={(props) => <Profile {...props} user={user} />}
          />
          <ProtectedRoute path="/search" component={Search} />
          <Route path="/not-found" component={NotFound} />
          <Redirect from="/" exact to="/search" />
          <Redirect to="/not-found" />
        </Switch>
      </main>
    </Fragment>
  );
}

export default App;
