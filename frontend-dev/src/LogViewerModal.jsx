import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ReactEcharts from "echarts-for-react";

import exampleLog from "./logs/example.csv?raw";
import Papa from "papaparse";
import { useEffect, useState } from "preact/hooks";
import "./LogViewerModal.css";
import each from "lodash/each";
import map from "lodash/map";

const LogViewerModal = (props) => {
  const { isOpen, toggleGaugeModal } = props;
  const [parsedData, setParsedData] = useState(null);
  const [parsedLabels, setParsedLabels] = useState(null);

  useEffect(() => {
    const csvToParse = exampleLog.split("\n").slice(2).join("\n"); // Remove the first two lines
    Papa.parse(csvToParse, {
      header: true,
      delimiter: "\t",
      complete: function (results) {
        const { data } = results;

        let dataObjects = [];
        each(data, (row) => {
          let newObject = map(row, (value, key) => {
            return { [key]: value };
          });
          dataObjects.push(newObject);
        });

        console.log(dataObjects);

        // name: "Dataset 1",
        // type: "line",
        // data: data1,
      },
    });
  }, []);

  console.log(parsedData);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggleGaugeModal}
      contentClassName="logViewer"
    >
      <ModalHeader>Log Viewer</ModalHeader>
      <ModalBody>
        <MultiDatasetLineChart labels={parsedLabels} />
      </ModalBody>
    </Modal>
  );
};

export default LogViewerModal;

const MultiDatasetLineChart = ({ labels }) => {
  // Sample data for multiple datasets
  const data1 = [120, 132, 101, 134, 90, 230, 210];
  const data2 = [220, 182, 191, 234, 290, 330, 310];
  const data3 = [150, 232, 201, 154, 190, 330, 410];

  // ECharts option configuration
  const options = {
    title: {
      text: "Line Chart with Multiple Datasets",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Dataset 1", "Dataset 2", "Dataset 3"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: "[Time]",
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Dataset 1",
        type: "line",
        data: data1,
      },
      {
        name: "Dataset 2",
        type: "line",
        data: data2,
      },
      {
        name: "Dataset 3",
        type: "line",
        data: data3,
      },
    ],
  };

  return (
    <ReactEcharts option={options} style={{ height: "400px", width: "100%" }} />
  );
};
