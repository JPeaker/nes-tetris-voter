import React, { useRef, useState } from 'react';
import VotePage from './VotePage';
import CreatePage from './CreatePage';
import { Switch, Route, Link } from 'react-router-dom';
import { Button, Container, Form, FormControl, Nav, Navbar, Row } from 'react-bootstrap';
import { SearchIcon } from '@primer/octicons-react';
import './App.css';

function App() {
  const [search, setSearch] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const focusSearch = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '/' && searchRef.current) {
      searchRef.current.focus();
      event.preventDefault();
    }
  };

  const menuItems = [
    { paths: ['/', '/vote'], name: 'Random Vote' },
    { paths: ['/create'], name: 'Create' },
  ]
  return (
    <Container className="p-0" fluid onKeyDown={focusSearch}>
        <Navbar bg="dark" variant="dark" expand="md">
          <Navbar.Brand href="/vote">
            <img src="/logo.png" className="mr-sm-2 logo" />{' '}
            NES Tetris Voter
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse>
            <Nav className="mr-auto">
            {
                menuItems.map((item, index) => (
                  <Nav.Link key={item.name} href={item.paths.reverse()[0]} className={`navigation-link ${index === 0 ? 'first' : ''}`}>{item.name}</Nav.Link>
                ))
              }
            </Nav>
            <Form inline>
              <FormControl
                type="search"
                placeholder="Search by ID"
                aria-label="Search by ID"
                value={search}
                ref={searchRef}
                onChange={event => setSearch(event.currentTarget.value)}
                className="mr-sm-2"
              />
              <Link to={`/vote?id=${search}`}>
                <Button variant="outline-primary" type="submit"><SearchIcon size={20} /></Button>
              </Link>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route path="/create">
            <CreatePage />
          </Route>
          <Route path={['/', '/vote']}>
            <VotePage />
          </Route>
        </Switch>
    </Container>
  );
}

export default App;
