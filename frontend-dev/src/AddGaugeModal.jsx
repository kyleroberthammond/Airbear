import {
  Button,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";

import GaugeTypes from "./GaugeTypes";
import map from "lodash/map";
import clone from "lodash/clone"

export const GaugeModalForm = (props) => {
  const {
    isOpen,
    toggleGaugeModal,
    addGaugeToLayout,
    updateGaugeInLayout,
    removeGaugeFromLayout,
    gaugeEditing,
  } = props;
  const defaultFormState = { containerWidth: 6, offsetWidth: 0 };

  const isEditingAGauge = gaugeEditing?.saved;

  const [formState, setFormState] = useState(
    isEditingAGauge ? gaugeEditing : defaultFormState
  ); // Set up a form state to handle two way binding

  const handleFormChange = (e) => {
    let formType = "string";
    if (e.target.getAttribute) {
      formType = e.target.getAttribute("formType");
    }
    setFormState((prevFormState) => {
      let newFormState = { ...prevFormState };
      if (e.target.type == "checkbox") {
        newFormState[e.target.name] = e.target.checked;
      } else if (formType == "arrayString") {
        newFormState[e.target.name] = e.target.value.split(",");
      } else {
        newFormState[e.target.name] = e.target.value;
      }
      return newFormState;
    });
  };

  const selectedGaugeType = GaugeTypes.find(
    (gt) => gt.value === formState.type
  );

  useEffect(() => {
    // If its a new gauge then set the default values
    if (selectedGaugeType?.defaultValues && !isEditingAGauge) {
      let newFormState = clone(formState);
      newFormState = {
        ...newFormState,
        ...selectedGaugeType.defaultValues,
      };
      setFormState(newFormState);
    }
  }, [selectedGaugeType]);

  return (
    <Modal isOpen={isOpen} toggle={toggleGaugeModal} size="lg">
      <ModalHeader>Add Gauge</ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Col md={4}>Type</Col>
          <Col md={4}>
            <Input
              type="select"
              name="type"
              className="form-control"
              value={formState["type"]}
              onChange={handleFormChange}
              style={{ appearance: "auto" }}
            >
              <option value="" disabled selected>
                Select a gauge type
              </option>
              {map(GaugeTypes, (gauge) => (
                <option value={gauge.value}>{gauge.label}</option>
              ))}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col md={4}>Width (1 to 12)</Col>
          <Col md={4}>
            <Input
              type="number"
              max="12"
              min="1"
              onChange={handleFormChange}
              name="containerWidth"
              value={formState["containerWidth"]}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col md={4}>Offset from the left (1 to 12)</Col>
          <Col md={4}>
            <Input
              type="number"
              max="12"
              min="1"
              onChange={handleFormChange}
              name="offsetWidth"
              value={formState["offsetWidth"]}
            />
          </Col>
        </FormGroup>
        <Row row>
          <Col md={4}>Data Channel</Col>
          <Col md={4}>
            <Input
              name="channel"
              id="channel"
              onChange={handleFormChange}
              value={formState["channel"]}
              type="string"
            />
          </Col>
        </Row>

        {formState.type && selectedGaugeType && (
          <Fragment>
            <hr />
            <Row style={{ textAlign: "center" }}>
              <Col>
                <selectedGaugeType.renderGauge gaugeValues={formState} />
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <selectedGaugeType.renderForm
                  editing={false}
                  formState={formState}
                  handleFormChange={handleFormChange}
                />
              </Col>
            </Row>
          </Fragment>
        )}

        {formState && (
          <Fragment>
            <hr />
            <Row>
              <Col md={10}>
                <Button
                  color="success"
                  onClick={() => {
                    if (isEditingAGauge) {
                      updateGaugeInLayout(formState);
                    } else {
                      addGaugeToLayout(formState);
                    }
                    toggleGaugeModal();
                  }}
                >
                  {isEditingAGauge ? "Update" : "Add"} Gauge
                </Button>
              </Col>
              <Col md={2}>
                {isEditingAGauge && (
                  <Button
                    className="ml-2"
                    color="danger"
                    onClick={() => {
                      removeGaugeFromLayout(formState);
                      toggleGaugeModal();
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
          </Fragment>
        )}
      </ModalBody>
    </Modal>
  );
};

export default GaugeModalForm;
