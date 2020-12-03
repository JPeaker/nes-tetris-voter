import React from 'react';
import VotePage from './VotePage';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/vote">Vote</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create">Create</Link>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search by ID" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
              <span className="oi oi-magnifying-glass" title="search" aria-hidden="true"></span>
            </button>
          </form>
        </div>
      </nav>
      <Switch>
        <Route path="/vote/:id">
          <VotePage />
        </Route>
        <Route path={['/', '/vote']}>
          <VotePage />
        </Route>
        <Route path="/create">
          Create
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
