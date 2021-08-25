import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Profile from "./views/Profile";
import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";
import Main from "./views/Main";
import Public from "./views/Public";
import Data from "./views/Data";
import Archive from "./views/Archive";

// styles
import "./App.css";
import "./addUserModal.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { loading, isAuthenticated } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            {isAuthenticated && (
              <PrivateRoute path="/" exact component={Main} />
            )}
            {!isAuthenticated && (
              <Route path="/" exact component={Public} />
            )}
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/data" component={Data} />
            <PrivateRoute path="/archive" component={Archive} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
