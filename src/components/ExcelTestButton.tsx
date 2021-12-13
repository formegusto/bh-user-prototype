import xlsx from "xlsx";

function ExcelTestButton() {
  const excelDownload = () => {
    const ws = xlsx.utils.json_to_sheet([{ status: "1" }, { name: "2" }]);
    const wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    const merge = [
      { s: { r: 0, c: 0 }, e: { r: 3, c: 0 } },
      { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } },
    ];
    ws["!merges"] = merge;
    xlsx.writeFile(wb, "test.xlsx");
  };
  return <button onClick={excelDownload}>excel test</button>;
}

export default ExcelTestButton;
