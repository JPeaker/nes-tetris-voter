import React, { useState } from 'react';
import VotePage from './VotePage';
import { BrowserRouter, Switch, Route, Link, useHistory, Redirect } from 'react-router-dom';

function App() {
  const [search, setSearch] = useState<string>('');

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
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
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search by ID"
              value={search}
              onChange={event => setSearch(event.currentTarget.value)}
            />
            <Link to={`/vote?id=${search}`}>
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
                Go
              </button>
            </Link>
          </form>
        </div>
      </nav>
      <Switch>
        <Route path={['/', '/vote']}>
          <VotePage />
        </Route>
        <Route path="/create">
          Create
        </Route>
      </Switch>
    </>
  );
}

export default App;
