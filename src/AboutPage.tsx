import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function AboutPage() {
  return <Container fluid>
    <Row className="flex-row mt-4 fluid align-items-center justify-content-center">
      <Col>
        <Card>
          <Card.Header>
            <Card.Title>About this site</Card.Title>
          </Card.Header>
          <Card.Body>
            This site came from trying to learn NES Tetris, and struggling to understand the best ways to stack. You can always ask in Discord and people will help, but many people seemed to struggle describing the particular placements they recommended. I figured this could be easily resolved with a site that allowed for choosing them. From there the idea moved into being able to vote and getting community consensus on the correct move to make.
            <br /><br />
            Of course, there are limitations to this. Level 18 vs Level 19 (or even Level 29) could lend to different placements. Tappers may vote differently to DAS. There are various different things that aren't covered in the simple assumption of just looking at the board and voting. I'd love to have time to introduce things like that, and I hope to in the future. But first and foremost, I wanted to get this out so that people could use it and share it with each other.
            <br /><br />
            Throughout this project, I've had help from various community members. I'll thank them via Discord names and hope they're accurate!
            <br/>
            <ul>
              <li>Caffeine - For various conversations about technical implementations, and the initial idea of how to generate all possible placements</li>
              <li>GregBoomCannon - For allowing me to steal the implementation of his "pasted image" to "Tetris Grid" code</li>
              <li>Sam - My designer friend who worked with me to come up with the inital design of the site's layout</li>
              <li>Qwiz - My first UX tester, giving me good ideas on how to improve the voting and creation UI</li>
              <li>TheMisterValor - My coach and also UX tester, giving great ideas on how to really tidy this functionality up</li>
            </ul>
          </Card.Body>
          <Card.Footer>
            This project has been a lot of work. I've learnt a lot of technology, but I've definitely given over a hundred hours into creating this. I hope you find it fun and useful. If you find any bugs in it, please message me on the CTM Discord @Inexistence and I'll get right on it!
            <br /><br />
            If you enjoy what I create and want to support the upkeep and work I do, feel free to <a href="https://www.buymeacoffee.com/inexistence" target="_blank">buy me a drink</a>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  </Container>;
}

export default AboutPage;
