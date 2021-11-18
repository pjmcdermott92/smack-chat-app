import React from 'react';
import PropTypes from 'proptypes';
import './Modal.css';

const Modal = ({ children, title, close, isOpen }) => (
    <>
    { isOpen ? (
        <div className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button className="modal-close" onClick={() => close(false)}>&times;</button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    ) : null }
    </>
);

Modal.propTypes = {
    title: PropTypes.string,
    close: PropTypes.func,
    isOpen: PropTypes.bool
}

Modal.defaultProps = {
    title: 'Title',
    close: () => {},
    isOpen: false
}

export default Modal;
