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
import isEmpty from "lodash.isempty";

import GaugeTypes from "../GaugeTypes";
import map from "lodash.map";
import clone from "lodash.clone";

export const GaugeModalForm = (props) => {
  const {
    isOpen,
    toggleGaugeModal,
    addGaugeToLayout,
    updateGaugeInLayout,
    gaugeEditing,
  } = props;
  const defaultFormState = { containerWidth: 6 };

  const isEditingAGauge = !isEmpty(gaugeEditing);

  const [formState, setFormState] = useState(
    isEditingAGauge ? gaugeEditing : defaultFormState
  ); // Set up a form state to handle two way binding

  const handleFormChange = (e) => {
    setFormState((prevFormState) => {
      let newFormState = { ...prevFormState };
      newFormState[e.target.name] = e.target.value;
      return newFormState;
    });
  };

  const selectedGaugeType = GaugeTypes.find(
    (gt) => gt.value === formState.type
  );

  useEffect(() => {
    if (selectedGaugeType?.defaultValues) {
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
            <select
              name="type"
              value={formState["type"]}
              onChange={handleFormChange}
            >
              <option value="" disabled selected>
                Select a gauge type
              </option>
              {map(GaugeTypes, (gauge) => (
                <option value={gauge.value}>{gauge.label}</option>
              ))}
            </select>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col md={4}>Container Width (1 to 12)</Col>
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
        <Row row>
          <Col md={4}>Data Channel</Col>
          <Col md={4}>
            <Input
              name="channel"
              id="channel"
              onChange={handleFormChange}
              value={formState.channel}
              type="string"
            />
          </Col>
        </Row>

        {formState.type && selectedGaugeType && (
          <Fragment>
            <hr />
            <Row>
              <Col md={7}>
                <selectedGaugeType.renderGauge gaugeValues={formState} />
              </Col>
              <Col md={5}>
                <selectedGaugeType.renderForm
                  editing={false}
                  formState={formState}
                  handleFormChange={handleFormChange}
                />
              </Col>
            </Row>
            <hr />
          </Fragment>
        )}

        {formState && (
          <Button
            className="mt-5"
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
        )}
      </ModalBody>
    </Modal>
  );
};

export default GaugeModalForm;
