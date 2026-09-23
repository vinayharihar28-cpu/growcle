import ExcelJS from "exceljs";

/**
 * Utility to export tabular data to downloadable CSV format
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
    ...rows.map((row) =>
      row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface SheetDefinition {
  name: string;
  headers: string[];
  rows: (string | number)[][];
}

/**
 * Utility to export multi-sheet Excel workbooks using ExcelJS.
 * Allows chapter-wise sheets and meeting-wise sheets in separate tabs!
 */
export async function exportMultiSheetExcel(filename: string, sheets: SheetDefinition[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GrowCle SaaS Platform";
  workbook.created = new Date();

  for (const sheetDef of sheets) {
    // Excel sheet name max 31 chars and no illegal chars
    const sanitizedName = sheetDef.name.replace(/[:\\/?*\[\]]/g, "").substring(0, 30) || "Sheet";
    const worksheet = workbook.addWorksheet(sanitizedName);

    // Add headers with styled background
    const headerRow = worksheet.addRow(sheetDef.headers);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" }, // Indigo header
    };
    headerRow.alignment = { vertical: "middle" };

    // Add rows
    for (const rowData of sheetDef.rows) {
      worksheet.addRow(rowData);
    }

    // Auto-fit column widths
    worksheet.columns.forEach((col) => {
      let maxLen = 14;
      col.eachCell?.({ includeEmpty: true }, (cell) => {
        const strVal = String(cell.value ?? "");
        if (strVal.length > maxLen) {
          maxLen = Math.min(strVal.length + 4, 45);
        }
      });
      col.width = maxLen;
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
