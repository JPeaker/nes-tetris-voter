import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import Cropper from 'react-easy-crop'
import getBoardState from './paste-handler';
import cropImage, { Area } from './cropImage';
import { Grid } from 'nes-tetris-representation';
import { emptyGrid } from './emptyGrid';
import { TetrisGrid } from 'nes-tetris-components';

export default ({ show = false, hide, submit }: { show?: boolean, hide: () => void, submit: (grid: Grid) => void }) => {
  const [cropping, setCropping] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [canUpdateGrid, setCanUpdateGrid] = useState<boolean>(true);

  useEffect(() => {
    setInterval(() => setCanUpdateGrid(true), 200);
  }, []);

  useEffect(() => {
    if (canUpdateGrid && image && croppedAreaPixels) {
      const doEffect = async () => getBoardState(await cropImage(image!, croppedAreaPixels!), board => {
        setGrid(board);
      });

      doEffect();
      setCanUpdateGrid(false);
    }
  }, [canUpdateGrid, cropping, image, crop, zoom, croppedAreaPixels]);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target!.result as string);
        setCropping(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const reset = () => {
    setCropping(false);
    setImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setGrid(emptyGrid);
    setCropping(false)
  }

  const onSubmit = async () => {
    getBoardState(await cropImage(image!, croppedAreaPixels!), (board) => {
      submit(board);
      reset();
    });
  };

  return <Modal show={show} onHide={hide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Upload a screenshot</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <canvas id="canvas" style={{ display: 'none' }} />
        <Container>
          <Row>
            <Col xs={6}>
              {
                !cropping
                  ?
                    <div className="upload-button-wrapper">
                      <input type="file" id="file" onChange={onChange}/>
                    </div>
                  : <Cropper
                      image={image || undefined}
                      crop={crop}
                      zoom={zoom}
                      aspect={0.5}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      classes={{ containerClassName: 'upload-cropper' }}
                    />
              }
            </Col>
            <Col xs={6} style={{ paddingLeft: '1rem' }}>
              <TetrisGrid grid={grid} />
            </Col>
          </Row>
        </Container>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={image ? reset : hide}>{image ? 'Clear' : 'Cancel'}</Button>
      <Button disabled={!image} onClick={onSubmit}>Done</Button>
    </Modal.Footer>
  </Modal>
}