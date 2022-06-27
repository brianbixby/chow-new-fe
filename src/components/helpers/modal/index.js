import React from 'react';
import spoon from '../assets/icons/spoon.icon.svg';

function Modal(props) {
  return (
    <div className="modal">
      <div className="modal-overlay" onClick={props.close}></div>
      <div className="modal-wrapper">
        <div className="iconClose" onClick={props.close}></div>
        <div className="modal-header">
          <div className="modalIconDiv">
            <p className="modalIcon">
              {' '}
              {props.heading}{' '}
              <span className="spoonContainer">
                <img
                  data-src={spoon}
                  className="lazyload spoon"
                  alt="spoon logo"
                />
              </span>
            </p>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-content">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
