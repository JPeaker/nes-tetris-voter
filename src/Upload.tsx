import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal, Container, Row, Col, Card } from 'react-bootstrap';
import Cropper from 'react-easy-crop'
import getBoardState from './paste-handler';
import cropImage, { Area } from './cropImage';
import { Grid } from 'nes-tetris-representation';
import { emptyGrid } from './emptyGrid';
import { TetrisGrid } from 'nes-tetris-components';
import Slider from 'react-bootstrap-range-slider';
import _ from 'lodash';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

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

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const { items } = event.clipboardData!;
    // find pasted image among pasted items
    let blob: File | null = null;
    // tslint:disable-next-line prefer-for-of
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target!.result as string);
        setCropping(true);
      };
      reader.readAsDataURL(blob);
    }
  }

  const reset = () => {
    setCropping(false);
    setImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setGrid(_.cloneDeep(emptyGrid));
    setCropping(false)
  }

  const onSubmit = async () => {
    getBoardState(await cropImage(image!, croppedAreaPixels!), (board) => {
      submit(board);
      reset();
    });
  };

  return <Modal show={show} onHide={hide} centered className="modal-dialog-create">
    <Modal.Header closeButton>
      <Modal.Title>Upload a screenshot</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <canvas id="canvas" style={{ display: 'none' }} />
      <img alt="" id="pasted-image" style={{ display: 'none' }} />
      <Container>
        <Row>
          <Col xs={4}>
            <Card style={{ height: '100%' }}>
              <Card.Body>
                <Card.Title>Instructions</Card.Title>
                <Card.Text>
                  <ol>
                    <li>If you have the screenshot saved, click "Choose File" and select your screenshot. If you have the screenshot copied already, click the field that says "Paste here" and paste</li>
                    <li>Once uploaded, help us find the grid. You can use the slider or mousewheel to zoom, and click & drag to move the picture around. Make sure that you select exactly the 10x20 grid and try to cut out anything else. Use the preview on the right-hand side to see what the result will be</li>
                    <li>Once you have the grid as you want it, click "Done" and it will be inserted into the creator</li>
                  </ol>
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <strong>TIP</strong>: If you have a floating piece, it will be automatically removed, don't worry!
              </Card.Footer>
            </Card>
          </Col>
          <Col xs={4}>
            {
              !cropping
                ?
                  <div className="upload-button-wrapper">
                    <input type="file" id="file" onChange={onChange} />
                    <span className="or">or</span>
                    <input className="paste-box" id="paste-area" onPaste={onPaste} placeholder="Paste Here" />
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
          <Col xs={4} style={{ paddingLeft: '1rem' }}>
            <TetrisGrid grid={grid} />
          </Col>
        </Row>
      </Container>
    </Modal.Body>
    <Modal.Footer>
      <Container className="pa-0">
        <Row className="fluid">
          <Col xs={{ span: 4, offset: 4 }}>
            <div style={{ display: 'inline-block' }}>
              <h6 className="zoom-title">Zoom:</h6>
              <Slider disabled={!cropping} min={0.75} max={4} step={0.01} value={zoom} onChange={event => setZoom(parseFloat(event.target.value))} />
            </div>
          </Col>
          <Col xs={4} className="text-right pr-0">
            <Button onClick={image ? reset : hide} style={{ marginRight: '0.25rem'}}>{image ? 'Clear' : 'Cancel'}</Button>
            <Button disabled={!image} onClick={onSubmit}>Done</Button>
          </Col>
        </Row>
      </Container>
    </Modal.Footer>
  </Modal>
}