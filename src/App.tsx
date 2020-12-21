import React, { useRef, useState } from 'react';
import VotePage from './VotePage';
import CreatePage from './CreatePage';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { Button, Container, Form, FormControl, Nav, Navbar, Row } from 'react-bootstrap';

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

  const menuItems = [
    { paths: ['/', '/vote'], name: 'Vote' },
    { paths: ['/create'], name: 'Create New' },
  ]
  return (
    <Container className="p-0" fluid onKeyDown={focusSearch}>
      <Row noGutters xs={1}>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/vote">
            <img src="/logo.png" className="mr-sm-2" style={{ width: '5rem' }} />{' '}
            NES Tetris Voter
          </Navbar.Brand>
          <Navbar.Collapse>
            <Nav className="mr-auto">
            {
                menuItems.map(item => (
                  <Nav.Link key={item.name} href={item.paths.reverse()[0]}>{item.name}</Nav.Link>
                ))
              }
            </Nav>
            <Form inline>
              <FormControl
                type="search"
                placeholder="Search"
                aria-label="Search by ID"
                value={search}
                ref={searchRef}
                onChange={event => setSearch(event.currentTarget.value)}
                className="mr-sm-2"
              />
              <Link to={`/vote?id=${search}`}>
                <Button variant="outline-success" type="submit">Go</Button>
              </Link>
            </Form>
          </Navbar.Collapse>
        </Navbar>
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
