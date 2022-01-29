import React from "react";
import { Button } from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { exportDataCsv } from "src/utils/myutils";
export default function CsvFileExport({ data, fileName }) {
  return (
    <>
      <Button
        variant="contained"
        startIcon={<CloudDownloadIcon />}
        style={{ marginLeft: "5px" }}
      >
        <a
          href={exportDataCsv(data)}
          download={fileName + ".csv"}
          style={{ textDecoration: "none", color: "white" }}
        >
          export file
        </a>
      </Button>
    </>
  );
}
