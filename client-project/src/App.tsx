import React, { useRef, useState } from 'react';
import VotePage from './VotePage';
import CreatePage from './CreatePage';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';

function App() {
  const [search, setSearch] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  const focusSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '/' && searchRef.current) {
      searchRef.current.focus();
      event.preventDefault();
    }
  };
  console.log(history.location.pathname);
  const menuItems = [
    { paths: ['/', '/vote'], name: 'Vote' },
    { paths: ['/create'], name: 'Create' },
  ]
  return (
    <Container className="p-0" fluid onKeyDown={focusSearch}>
      <Row noGutters xs={1}>
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
              {
                menuItems.map(item => (
                  <li className={`nav-item ${item.paths.includes(history.location.pathname) ? 'active' : ''}`}>
                    <Link className="nav-link" to={item.paths.reverse()[0]}>{ item.name }</Link>
                  </li>
                ))
              }
            </ul>
            <form className="form-inline my-2 my-lg-0">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search by ID"
                value={search}
                ref={searchRef}
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
      </Row>
      <Row noGutters xs={1} className="p-0">
        <Switch>
          <Route path="/create">
            <CreatePage />
          </Route>
          <Route path={['/', '/vote']}>
            <VotePage />
          </Route>
        </Switch>
      </Row>
    </Container>
  );
}

export default App;
