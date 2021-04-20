import React, { useState } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { useParams } from 'react-router';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import RangeSlider from 'react-bootstrap-range-slider';
import cat from '../assets/cat.gif'

const LobbyContainer = styled(Container)`
  background-color: #44A3E5;
  height: 100vh;
  color: white;
  padding: 0;
`

const LobbyHeading = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 72pt;
  color: #333333;
  margin-bottom: 0;
  font-weight: 1000;

  @media (max-width: 992px) {
    font-size: 56pt;
  }
`

const LobbyMediumText = styled(LobbyHeading)`
  font-size: 56pt;
  @media (max-width: 992px) {
    font-size: 36pt;
  }
`

const LobbySmallText = styled(LobbyHeading)`
  font-size: 24pt;
  @media (max-width: 992px) {
    font-size: 20pt;
  }
`

const Lobby = () => {
  const { sessionId } = useParams();

  // default volume
  const [volume, setVolume] = useState(10);

  // background music playlist
  const songs = [
    'https://www.youtube.com/watch?v=u1HyZ2hmxnc',
    'https://www.youtube.com/watch?v=HbbGCld47mA'
  ]

  return (
    <LobbyContainer className="p-2" fluid>
      <ReactPlayer url={songs}
        playing={true}
        controls={false}
        loop={true}
        height={0}
        volume={volume / 100}
      />
      <Container className="pb-4" style={{ backgroundColor: '#5AADE7' }} fluid>
        <Row md={8} className="d-flex justify-content-center pt-4 mb-0 px-4 mx-4">
          <LobbySmallText className="p-2 bg-light overflow-visible">Lobby ID</LobbySmallText>
        </Row>
        <Row md={8} className="d-flex justify-content-center">
          <LobbyHeading className="p-4 text-center bg-light overflow-visible">{sessionId}</LobbyHeading>
        </Row>

      </Container>
      <Container>
        <Col>
          <Row md={12} className="d-flex justify-content-center pt-4 mb-4 px-4 mx-4">
            <LobbyMediumText className="p-4 mx-4 text-center bg-light overflow-visible">
              Waiting ...
            </LobbyMediumText>
          </Row>
          <Row className="d-flex justify-content-center" md={4}>
            <Col className="px-0" md={4}>
              <Row md={12} className="d-flex justify-content-center pt-4 mb-0">
                <h4 className="text-center">Volume</h4>
              </Row>
              <Row md={12} className="d-flex justify-content-center pt-4 mb-0 px-4">
                <RangeSlider
                  id="volume-slider"
                  value={volume}
                  onChange={e => setVolume(e.target.value)}
                  max={100}
                  min={0}
                  step={1}
                  tooltip={'auto'}
                />
              </Row>
            </Col>
          </Row>
        </Col>
      </Container>
      <div className="fixed-bottom">
        <Image src={cat}></Image>
      </div>
      <div className="fixed-bottom d-flex justify-content-end">
        <Image style={{ transform: 'scaleX(-1)' }} src={cat}></Image>
      </div>
    </LobbyContainer>
  )
}

export default Lobby
