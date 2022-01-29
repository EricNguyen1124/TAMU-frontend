import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

export function getMimeType(type) {
  if (type.includes("wordprocessingml")) return "word_docx";
  if (type.includes("document")) return "google_docx";
  if (type.includes("csv")) return "csv";
  if (type.includes("image/png")) return "png";
  if (type.includes("image/jpg")) return "jpg";
  if (type.includes("image/jpeg")) return "jpeg";
  if (type.includes("pdf")) return "pdf";
  if (type.includes("pdf")) return "pdf";
  if (type.includes("presentation")) return "pptx";
  if (type.includes("text/plain")) return "plain";
  if (type.includes("javascript")) return "javascript";
  if (type.includes("java")) return "java";
  if (type.includes("sql")) return "sql";
  if (type.includes("spreadsheetml")) return "excel_sheet"; // will allow user to download the file
  if (type.includes("sheet")) return "google_sheet"; // will allow user to download the file
}

export function getIcon(type) {
  if (type.includes("document")) return <DescriptionIcon />;
  if (type.includes("image/png")) return <ImageIcon />;
  if (type.includes("image/jpg")) return <ImageIcon />;
  if (type.includes("image/jpeg")) return <ImageIcon />;
  if (type.includes("pdf")) return <PictureAsPdfIcon />;
  if (type.includes("pdf")) return <PictureAsPdfIcon />;
  else return <DescriptionIcon />;
}

export function formatNumber(number) {
  return Number(number).toLocaleString();
}

export function exportDataCsv(data) {
  if (data[0]) {
    let keys = Object.keys(data[0]);
    let csvContent = "data:text/csv;charset=utf-8," + keys.join(",") + "\n";
    let csvContent1 = data.map((row) => {
      let values = Object.keys(row).map((key) => row[key]);
      return values.join(",");
    });
    // console.log("keys2", csvContent1.length)
    csvContent1 = csvContent1.join("\n").toString();
    // console.log(csvContent1);
    csvContent += csvContent1;
    return encodeURI(csvContent);
  }
}
