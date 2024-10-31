import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { RenderGauge } from "./index";
import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { gaugeConfig_rpm } from "./gauges";

export const GaugeModalForm = (props) => {
  const { isOpen, toggleGaugeModal, addGaugeToLayout } = props;
  const [formState, setFormState] = useState({
    ...gaugeConfig_rpm,
    containerWidth: 6,
  }); // Set up a form state to handle two way binding

  const handleFormChange = (e) => {
    setFormState((prevFormState) => {
      let newFormState = { ...prevFormState };
      newFormState[e.target.name] = e.target.value;
      return newFormState;
    });
  };

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
              <option value="radial">Radial</option>
              <option value="linear-set">Vertical set of linear gauges</option>
              <option value="linear">Single linear</option>
            </select>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col md={4}>Container Width (1 to 12)</Col>
          <Col md={4}>
            <input
              type="number"
              max="12"
              min="1"
              onChange={handleFormChange}
              name="containerWidth"
              value={formState["containerWidth"]}
            />
          </Col>
        </FormGroup>

        {formState.type && (
          <Fragment>
            <hr />
            <Row>
              <Col md={7}>
                <RenderGauge gaugeValues={formState} />
              </Col>
              <Col md={5}>
                <RadialGaugeForm
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
              addGaugeToLayout(formState);
              setFormState({ ...gaugeConfig_rpm, containerWidth: 6 });
              toggleGaugeModal();
            }}
          >
            Add Gauge
          </Button>
        )}
      </ModalBody>
    </Modal>
  );
};

export default GaugeModalForm;

const RadialGaugeForm = (props) => {
  const { formState, handleFormChange } = props;
  return (
    <Fragment>
      <Row row>
        <Col md={5}>Width (px)</Col>
        <Col md={7}>
          <Input
            name="width"
            id="width"
            onChange={handleFormChange}
            value={formState.width}
            type="number"
          />
        </Col>
      </Row>

      <Row>
        <Col md={5}>Height (px)</Col>
        <Col md={7}>
          <Input
            name="height"
            id="height"
            onChange={handleFormChange}
            value={formState.height}
            type="number"
          />
        </Col>
      </Row>

      <FormGroup row>
        <Col md={5}>
          <Label for="units">Units</Label>
        </Col>
        <Col md={7}>
          <Input
            name="units"
            id="units"
            onChange={handleFormChange}
            value={formState.units}
            type="text"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="value">Value</Label>
        </Col>
        <Col md={7}>
          <Input
            name="value"
            id="value"
            onChange={handleFormChange}
            value={formState.value}
            type="number"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="minValue">Min Value</Label>
        </Col>
        <Col md={7}>
          <Input
            name="minValue"
            id="minValue"
            onChange={handleFormChange}
            value={formState.minValue}
            type="number"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="maxValue">Max Value</Label>
        </Col>
        <Col md={7}>
          <Input
            name="maxValue"
            id="maxValue"
            onChange={handleFormChange}
            value={formState.maxValue}
            type="number"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="majorTicks">Major Ticks</Label>
        </Col>
        <Col md={7}>
          <Input
            name="majorTicks"
            id="majorTicks"
            onChange={handleFormChange}
            value={formState.majorTicks}
            type="text"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="minorTicks">Minor Ticks</Label>
        </Col>
        <Col md={7}>
          <Input
            name="minorTicks"
            id="minorTicks"
            onChange={handleFormChange}
            value={formState.minorTicks}
            type="number"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="strokeTicks">Stroke Ticks</Label>
        </Col>
        <Col md={7}>
          <Input
            name="strokeTicks"
            id="strokeTicks"
            onChange={handleFormChange}
            checked={formState.strokeTicks}
            type="checkbox"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="colorPlate">Color Plate</Label>
        </Col>
        <Col md={7}>
          <Input
            name="colorPlate"
            id="colorPlate"
            onChange={handleFormChange}
            value={formState.colorPlate}
            type="text"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={5}>
          <Label for="fontValue">Font Value</Label>
        </Col>
        <Col md={7}>
          <Input
            name="fontValue"
            id="fontValue"
            onChange={handleFormChange}
            value={formState.fontValue}
            type="text"
          />
        </Col>
      </FormGroup>
    </Fragment>
  );
};
