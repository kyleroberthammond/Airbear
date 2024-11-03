import { Fragment } from "preact/jsx-runtime";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import ReactRadialGauge from "../helpers/ReactRadialGuage";
import { useState } from "preact/hooks";

const RadialGaugeForm = (props) => {
  const { formState, handleFormChange } = props;
  const [activeTab, setActiveTab] = useState("text");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Fragment>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab == "text" ? "active" : ""}
            onClick={() => {
              toggle("text");
            }}
          >
            Text
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab == "values" ? "active" : ""}
            onClick={() => {
              toggle("values");
            }}
          >
            Values
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="text" className="p-3">
          <TextTab formState={formState} handleFormChange={handleFormChange} />
        </TabPane>
        <TabPane tabId="values" className="p-3">
          <ValuesTab
            formState={formState}
            handleFormChange={handleFormChange}
          />
        </TabPane>
      </TabContent>
    </Fragment>
  );
};

const TextTab = (props) => {
  const { formState, handleFormChange } = props;
  return (
    <Fragment>
      <Row row>
        <Col md={3}>Title</Col>
        <Col md={9}>
          <Input
            name="title"
            id="title"
            onChange={handleFormChange}
            value={formState?.title || ""}
          />
        </Col>
      </Row>
      <FormGroup row>
        <Col md={3}>
          <Label for="units">Units</Label>
        </Col>
        <Col md={9}>
          <Input
            name="units"
            id="units"
            onChange={handleFormChange}
            value={formState?.units}
            type="text"
          />
        </Col>
      </FormGroup>
    </Fragment>
  );
};

const ValuesTab = (props) => {
  const { formState, handleFormChange } = props;
  return (
    <Fragment>
      <Row row>
        <Col md={3}>Default Value</Col>
        <Col md={9}>
          <Input
            name="value"
            id="value"
            onChange={handleFormChange}
            value={formState?.value}
            type="number"
          />
        </Col>
      </Row>
      <Row row>
        <Col md={3}>Min Value</Col>
        <Col md={9}>
          <Input
            name="minValue"
            id="minValue"
            onChange={handleFormChange}
            value={formState?.minValue}
            type="number"
          />
        </Col>
      </Row>
      <Row row>
        <Col md={3}>Max Value</Col>
        <Col md={9}>
          <Input
            name="maxValue"
            id="maxValue"
            onChange={handleFormChange}
            value={formState?.maxValue}
            type="number"
          />
        </Col>
      </Row>
      <FormGroup row>
        <Col md={3}>
          <Label for="majorTicks">Major Ticks</Label>
        </Col>
        <Col md={9}>
          <Input
            name="majorTicks"
            id="majorTicks"
            onChange={handleFormChange}
            value={formState?.majorTicks}
            formType="arrayString"
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col md={3}>
          <Label for="minorTicks">Minor Ticks</Label>
        </Col>
        <Col md={9}>
          <Input
            name="minorTicks"
            id="minorTicks"
            onChange={handleFormChange}
            value={formState?.minorTicks}
            type="number"
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Col md={3}>
          <Label for="strokeTicks">Stroke Ticks</Label>
        </Col>
        <Col md={9}>
          <Input
            name="strokeTicks"
            id="strokeTicks"
            onChange={handleFormChange}
            checked={formState?.strokeTicks}
            type="checkbox"
          />
        </Col>
      </FormGroup>
    </Fragment>
  );
};

const RadialGaugeRender = ({ editing, gaugeValues, onGaugeClick }) => {
  return (
    <ReactRadialGauge
      style={{ cursor: editing ? "pointer" : "" }}
      onClick={() => {
        if (editing) {
          onGaugeClick();
        }
      }}
      {...gaugeValues}
    />
  );
};

const RadialDefaultValues = {
  width: 400,
  height: 400,
  units: "RPM",
  title: false,
  value: 0,
  minValue: 0,
  maxValue: 9000,
  majorTicks: [
    "0",
    "1000",
    "2000",
    "3000",
    "4000",
    "5000",
    "6000",
    "7000",
    "8000",
    "9000",
  ],
  minorTicks: 2,
  strokeTicks: false,
  highlights: [
    { from: 0, to: 5000, color: "rgba(0,255,0,.15)" },
    { from: 5000, to: 6500, color: "rgba(255,255,0,.15)" },
    { from: 6500, to: 9000, color: "rgba(255,30,0,.25)" },
  ],
  colorPlate: "#555",
  colorPlateEnd: "#111",
  //colorPlate: "rgba(255, 255, 255, 0)",
  colorMajorTicks: "#f5f5f5",
  colorMinorTicks: "#ddd",
  colorTitle: "#fff",
  colorUnits: "#ccc",
  colorNumbers: "#eee",
  colorNeedleStart: "rgba(240, 128, 128, 1)",
  colorNeedleEnd: "rgba(255, 160, 122, .9)",
  colorBorderOuterEnd: "rgba(255, 160, 122, .5)",
  valueBox: true,
  valueInt: 4,
  valueDec: 0,
  animation: false,
  animationRule: "linear",
  animationDuration: "33", //Must be at most 1000/data frequency
  animatedValue: true,
  fontValue: "Led",
  startAngle: 45,
};

export const RadialGauge = {
  label: "Radial", // Select label
  value: "radial", // Select value
  renderForm: RadialGaugeForm,
  renderGauge: RadialGaugeRender,
  defaultValues: RadialDefaultValues,
};

export default RadialGauge;
