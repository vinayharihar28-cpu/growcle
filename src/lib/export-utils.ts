/**
 * Utility to export tabular data to downloadable CSV / Excel format
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
  link.setAttribute("download", `${filename.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
