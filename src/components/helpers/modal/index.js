import React from 'react';

class Modal extends React.Component {
  render() {
    const spoon = require('../assets/icons/spoon.icon.svg');
    return (
      <div className="modal">
        <div className="modal-overlay" onClick={this.props.close}></div>
        <div className="modal-wrapper">
          <div className="iconClose" onClick={this.props.close}></div>
          <div className="modal-header">
            <div className="modalIconDiv">
              <p className="modalIcon">
                {' '}
                {this.props.heading}{' '}
                <span className="spoonContainer">
                  <img src={spoon} className="spoon" />
                </span>
              </p>
            </div>
          </div>
          <div className="modal-body">
            <div className="modal-content">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
