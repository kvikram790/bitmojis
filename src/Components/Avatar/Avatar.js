import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Piece } from 'avataaars';
import Avatar from 'avataaars';
import map from 'lodash/map';
import Options from './Options';
import {
  Tabs,
  Tabpanes,
  ColorContainer,
  Container,
  StyledAvatar,
  Pieces,
  Color,
  None,
  Tab,
  Tabpane,
} from './Style.js';
import { IoRefresh } from 'react-icons/io5';
import { PiArrowBendUpLeft, PiArrowBendUpRightLight } from 'react-icons/pi';
import { uploadImageToAPI } from '../ApiService/ApiService.js';
import { toast } from 'react-toastify';

export default function Avataaar(props) {
  const canvasRef = useRef(null);
  const avatarRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('top');
  const hideColorContainerTypes = [
    'avatarStyle',
    'eyes',
    'eyebrows',
    'accessories',
    'mouth',
  ];

  const pieceClicked = (attr, val) => {
    var newAttributes = {
      ...props.value,
      [attr]: val,
    };
    if (props.onChange) {
      props.onChange(newAttributes);
    }
  };

  const onDownloadPNG = async () => {
    if (!canvasRef.current) {
      console.error('Canvas ref is null.');
      return;
    }

    const svgNode = ReactDOM.findDOMNode(avatarRef.current);
    if (!svgNode) {
      console.error('SVG Node is not available.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get 2D context from canvas.');
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anyWindow = window;
    const DOMURL = anyWindow.URL || anyWindow.webkitURL || window;

    const data = svgNode.outerHTML;
    const img = new Image();
    const svg = new Blob([data], { type: 'image/svg+xml' });
    const url = DOMURL.createObjectURL(svg);

    img.onload = async () => {
      ctx.save();
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      DOMURL.revokeObjectURL(url);

      canvas.toBlob(async (imageBlob) => {
        try {
          const formData = new FormData();
          formData.append('file', imageBlob, 'avatar.png');

          const response = await uploadImageToAPI(formData);

          toast.success('Avatar saved successfully!');
        } catch (error) {
          toast.error('Failed to save image.');
        }
      });
    };
    img.src = url;
  };

  return (
    <Container
      style={{
        padding: '10px',
        backgroundColor: 'white',
        boxShadow: 'lightblue 2px 2px 12px 4px',
      }}
    >
      <StyledAvatar>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Avatar
            ref={avatarRef}
            style={{ width: '200px', height: '200px' }}
            {...props.value}
          />
        </div>
        <div className="d-flex justify-content-between">
          <div
            style={{
              width: '80px',
              display: 'flex',
              padding: '5px',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '10px',
              border: '1px solid #D9D9D9',
              backgroundColor: '#D9D9D9',
            }}
          >
            <IoRefresh className="fs-5" />
            <PiArrowBendUpLeft className="fs-5" />
            <PiArrowBendUpRightLight className="fs-5" />
          </div>
          <button
            className="float-end"
            style={{
              borderRadius: '4px',
              borderColor: '#75E339',
              fontSize: '16px',
              background: '#75E339',
              color: 'white',
              width: '65px',
            }}
            onClick={onDownloadPNG}
          >
            Save
          </button>
        </div>
      </StyledAvatar>

      <div>
        <Tabpanes>
          <div
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '360px',
              marginBottom: '10px',
            }}
          >
            <div className="tabs-container">
              <Tabs>
                {Options.map((option) => (
                  <Tab
                    key={option.type}
                    selectedTab={selectedTab}
                    type={option.type}
                    onClick={() => setSelectedTab(option.type)}
                  >
                    {option.label}
                  </Tab>
                ))}
              </Tabs>
            </div>
          </div>
          {Options.map((option) => {
            return (
              <Tabpane
                selectedTab={selectedTab}
                type={option.type}
                key={option.type}
              >
                {option.values.map((val) => {
                  var attr = {};
                  attr[option.attribute] = val;
                  if (option.transform) {
                    attr.style = { transform: option.transform };
                  }
                  return (
                    <Pieces
                      onClick={() => pieceClicked(option.attribute, val)}
                      key={val}
                    >
                      {option.type === 'avatarStyle' ? (
                        <span style={{ margin: '5px' }}>{val}</span>
                      ) : (
                        <Piece
                          pieceSize="50"
                          pieceType={option.type}
                          {...attr}
                        />
                      )}
                      {(val === 'Blank' || val === 'NoHair') && (
                        <None>(none)</None>
                      )}
                    </Pieces>
                  );
                })}
                {option.type === 'clothe' && selectedTab === 'clothe' && (
                  <>
                    <ColorContainer
                      style={{
                        position: 'absolute',
                        top: '7rem',
                        border: '1px solid #E8E8E8',
                        backgroundColor: '#E8E8E8',
                        borderRadius: '20px',
                        padding: '2px',
                        rotate: '90deg',
                        width: '42%',
                        left: '17rem',
                      }}
                    >
                      {option.colors &&
                        map(option.colors, (color, colorName) => {
                          return (
                            <Color
                              key={colorName}
                              style={{
                                backgroundColor: color,
                                border:
                                  color === '#FFFFFF'
                                    ? '1px solid #ccc'
                                    : '1px solid ' + color,
                                borderRadius: '5px',
                                marginRight: '12px',
                              }}
                              onClick={() =>
                                pieceClicked(option.colorAttribute, colorName)
                              }
                            ></Color>
                          );
                        })}
                    </ColorContainer>
                    <ColorContainer
                      style={{
                        position: 'absolute',
                        top: ' 17.5rem',
                        left: '2rem',
                      }}
                    >
                      {option.colors1 &&
                        map(option.colors1, (color, colorName) => {
                          return (
                            <Color
                              key={colorName}
                              style={{
                                backgroundColor: color,
                                border:
                                  color === '#FFFFFF'
                                    ? '1px solid #ccc'
                                    : '1px solid ' + color,
                                borderRadius: '3px',
                                margin: '3px',
                                marginRight: '10px',
                              }}
                              onClick={() =>
                                pieceClicked(option.colorAttribute, colorName)
                              }
                            ></Color>
                          );
                        })}
                    </ColorContainer>
                  </>
                )}
                {!hideColorContainerTypes.includes(option.type) && (
                  <ColorContainer />
                )}
              </Tabpane>
            );
          })}
        </Tabpanes>
      </div>
      <canvas
        style={{ display: 'none' }}
        width="528"
        height="560"
        ref={canvasRef}
      />
    </Container>
  );
}
