import { Modal, ModalBody, ModalHeader } from "reactstrap";

import "./LogViewerModal.css";

const LogViewerModal = (props) => {
  const { isOpen, toggleGaugeModal } = props;
  return (
    <Modal isOpen={isOpen} toggle={toggleGaugeModal} contentClassName="logViewer">
      <ModalHeader>Log Viewer</ModalHeader>
      <ModalBody>Log viewer goes here</ModalBody>
    </Modal>
  );
};

export default LogViewerModal;
