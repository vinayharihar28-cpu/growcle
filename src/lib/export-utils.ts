import ExcelJS from "exceljs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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

export interface MeetingWiseExportRow {
  meetingDate: string;
  chapterName: string;
  chapterCode?: string;
  region?: string;
  meetingTitle: string;
  totalChapterMembers?: number;
  membersPresent: number;
  membersAbsent?: number;
  memberTurnoutRate?: number | string;
  visitorsPresent?: number;
  totalAttendees: number;
  totalBusinessGenerated: number;
  referralsExchanged?: number;
  feesCollected?: number;
  location?: string;
  meetingType?: string;
  status?: string;
}

export const MEETING_WISE_REPORT_HEADERS = [
  "Meeting Date",
  "Chapter Name",
  "Chapter Code",
  "Region",
  "Meeting Title / Theme",
  "Total Chapter Members",
  "Members Present",
  "Members Absent",
  "Member Turnout %",
  "Visitors Present",
  "Total Turnout (Attendees)",
  "Total Business Generated (INR)",
  "Referrals Exchanged",
  "Meeting Fees Collected (INR)",
  "Venue / Location",
  "Meeting Type",
  "Status",
];

export function mapMeetingRowsForExport(items: MeetingWiseExportRow[]): (string | number)[][] {
  return items.map((m) => [
    m.meetingDate,
    m.chapterName || "Chapter",
    m.chapterCode || "CHP",
    m.region || "Primary Region",
    m.meetingTitle || "Weekly Meeting",
    m.totalChapterMembers ?? 0,
    m.membersPresent ?? 0,
    m.membersAbsent ?? 0,
    typeof m.memberTurnoutRate === "number" ? `${m.memberTurnoutRate}%` : (m.memberTurnoutRate || "0%"),
    m.visitorsPresent ?? 0,
    m.totalAttendees ?? 0,
    m.totalBusinessGenerated ?? 0,
    m.referralsExchanged ?? 0,
    m.feesCollected ?? 0,
    m.location || "Chapter Venue",
    m.meetingType || "HYBRID",
    m.status || "SCHEDULED",
  ]);
}

/**
 * Direct meeting-wise CSV export
 */
export function exportMeetingWiseReportToCsv(items: MeetingWiseExportRow[], filename = "meeting_wise_report") {
  const rows = mapMeetingRowsForExport(items);
  exportToCsv(filename, MEETING_WISE_REPORT_HEADERS, rows);
}

/**
  * Direct meeting-wise Excel export with styled headers and currency formatting
  */
export async function exportMeetingWiseReportToExcel(items: MeetingWiseExportRow[], filename = "meeting_wise_report") {
  const rows = mapMeetingRowsForExport(items);
  await exportMultiSheetExcel(filename, [
    {
      name: "Meeting-Wise Breakdown",
      headers: MEETING_WISE_REPORT_HEADERS,
      rows,
    },
  ]);
}

/**
 * Clean text for standard PDF fonts (Latin-1 compatible)
 */
function sanitizePdfText(str?: string | number): string {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/₹/g, "INR ")
    .replace(/[^\x00-\x7F]/g, " ")
    .trim();
}

/**
 * Export meeting report as a standalone PDF file directly to user's downloads folder.
 * Does NOT invoke browser print screen.
 */
export async function exportMeetingReportToPdf(detail: any, filename?: string) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 (595 x 842 pt)
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const meeting = detail.meeting || {};
  const presentList: any[] = detail.presentList || [];
  const absentList: any[] = detail.absentList || [];
  const newVisitors: any[] = detail.newVisitors || [];

  let y = 800;

  const ensureSpace = (needed: number) => {
    if (y - needed < 50) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = 800;
    }
  };

  // Top Accent Bar
  page.drawRectangle({
    x: 40,
    y: y - 8,
    width: 515,
    height: 4,
    color: rgb(0.31, 0.27, 0.9), // Indigo #4F46E5
  });
  y -= 25;

  // Header Title & Chapter
  page.drawText("GROWCLE EXECUTIVE MEETING REPORT", {
    x: 40,
    y,
    size: 10,
    font: fontBold,
    color: rgb(0.31, 0.27, 0.9),
  });
  y -= 22;

  page.drawText(sanitizePdfText(meeting.title || "Weekly Business Chapter Meeting"), {
    x: 40,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });
  y -= 16;

  page.drawText(
    `${sanitizePdfText(meeting.chapterName)} (${sanitizePdfText(meeting.chapterCode)})  •  ${sanitizePdfText(meeting.date)}  •  ${sanitizePdfText(meeting.location || "Chapter Venue")}`,
    {
      x: 40,
      y,
      size: 10,
      font: fontReg,
      color: rgb(0.39, 0.45, 0.55),
    }
  );
  y -= 28;

  // KPI Metrics Banner Cards (4 boxes)
  const cardWidth = 120;
  const cardHeight = 44;
  const cards = [
    { label: "TURNOUT RATE", val: `${meeting.turnout || 0}%`, col: rgb(0.08, 0.65, 0.35) },
    { label: "PRESENT ATTENDEES", val: String(meeting.presentCount || presentList.length), col: rgb(0.06, 0.09, 0.16) },
    { label: "ABSENT MEMBERS", val: String(meeting.absentCount || absentList.length), col: rgb(0.88, 0.25, 0.25) },
    { label: "FEES COLLECTED", val: `INR ${meeting.totalCollection || 0}`, col: rgb(0.55, 0.36, 0.96) },
  ];

  cards.forEach((c, idx) => {
    const cx = 40 + idx * (cardWidth + 11);
    page.drawRectangle({
      x: cx,
      y: y - cardHeight,
      width: cardWidth,
      height: cardHeight,
      color: rgb(0.96, 0.97, 0.99),
      borderColor: rgb(0.88, 0.91, 0.94),
      borderWidth: 1,
    });
    page.drawText(c.label, {
      x: cx + 8,
      y: y - 14,
      size: 7,
      font: fontBold,
      color: rgb(0.4, 0.45, 0.55),
    });
    page.drawText(sanitizePdfText(c.val), {
      x: cx + 8,
      y: y - 34,
      size: 13,
      font: fontBold,
      color: c.col,
    });
  });
  y -= cardHeight + 24;

  // First-Time Visitors Section (if any)
  if (newVisitors.length > 0) {
    ensureSpace(30 + newVisitors.length * 16);
    page.drawText(`FIRST-TIME VISITORS (${newVisitors.length})`, {
      x: 40,
      y,
      size: 10,
      font: fontBold,
      color: rgb(0.85, 0.5, 0.1),
    });
    y -= 14;

    for (const v of newVisitors) {
      page.drawText(
        `• ${sanitizePdfText(v.name)} - ${sanitizePdfText(v.business)} (${sanitizePdfText(v.phone || "No phone")})`,
        {
          x: 48,
          y,
          size: 9,
          font: fontReg,
          color: rgb(0.15, 0.18, 0.25),
        }
      );
      y -= 14;
    }
    y -= 10;
  }

  // Present Attendees Table
  ensureSpace(40);
  page.drawText(`PRESENT ATTENDEES ROSTER (${presentList.length})`, {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.08, 0.65, 0.35),
  });
  y -= 16;

  // Table Header
  page.drawRectangle({
    x: 40,
    y: y - 16,
    width: 515,
    height: 18,
    color: rgb(0.93, 0.95, 0.98),
  });
  page.drawText("NAME / ATTENDEE", { x: 46, y: y - 12, size: 8, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
  page.drawText("COMPANY / CATEGORY", { x: 200, y: y - 12, size: 8, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
  page.drawText("TYPE", { x: 370, y: y - 12, size: 8, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
  page.drawText("PAYMENT / FEE", { x: 450, y: y - 12, size: 8, font: fontBold, color: rgb(0.2, 0.25, 0.35) });
  y -= 22;

  for (let i = 0; i < presentList.length; i++) {
    const p = presentList[i];
    ensureSpace(18);

    if (i % 2 === 1) {
      page.drawRectangle({
        x: 40,
        y: y - 13,
        width: 515,
        height: 16,
        color: rgb(0.98, 0.99, 1.0),
      });
    }

    page.drawText(sanitizePdfText(p.name).substring(0, 26), {
      x: 46,
      y: y - 10,
      size: 8,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.2),
    });
    page.drawText(sanitizePdfText(p.business).substring(0, 30), {
      x: 200,
      y: y - 10,
      size: 8,
      font: fontReg,
      color: rgb(0.3, 0.35, 0.45),
    });
    page.drawText(p.isVisitor ? "VISITOR" : "MEMBER", {
      x: 370,
      y: y - 10,
      size: 8,
      font: fontReg,
      color: p.isVisitor ? rgb(0.85, 0.5, 0.1) : rgb(0.2, 0.45, 0.8),
    });
    page.drawText(`${p.paymentMethod || "UPI"} INR ${p.amount || meeting.standardFee || 0}`, {
      x: 450,
      y: y - 10,
      size: 8,
      font: fontBold,
      color: rgb(0.08, 0.65, 0.35),
    });

    y -= 16;
  }
  y -= 14;

  // Absent List Section (if any)
  if (absentList.length > 0) {
    ensureSpace(30);
    page.drawText(`ABSENT MEMBERS (${absentList.length})`, {
      x: 40,
      y,
      size: 11,
      font: fontBold,
      color: rgb(0.88, 0.25, 0.25),
    });
    y -= 16;

    for (const a of absentList) {
      ensureSpace(14);
      page.drawText(`• ${sanitizePdfText(a.name)} (${sanitizePdfText(a.business)})`, {
        x: 48,
        y,
        size: 8,
        font: fontReg,
        color: rgb(0.45, 0.48, 0.55),
      });
      y -= 13;
    }
  }

  // Footer on each page
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const p = pdfDoc.getPage(i);
    p.drawText(`Growcle Executive Platform  •  Page ${i + 1} of ${pageCount}`, {
      x: 40,
      y: 25,
      size: 7,
      font: fontReg,
      color: rgb(0.55, 0.6, 0.68),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const cleanTitle = (meeting.title || "meeting_report").toLowerCase().replace(/[^a-z0-9]+/g, "_");
  link.download = `${cleanTitle}_${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export meeting detail report to CSV directly
 */
export function exportMeetingDetailToCsv(detail: any, filename = "meeting_report") {
  const meeting = detail.meeting || {};
  const presentList: any[] = detail.presentList || [];
  const absentList: any[] = detail.absentList || [];

  const headers = [
    "Meeting Date",
    "Meeting Title",
    "Chapter Name",
    "Chapter Code",
    "Attendee Name",
    "Business / Enterprise",
    "Attendee Type",
    "Status",
    "Payment Method",
    "Fee Amount (INR)",
    "Phone",
    "Email",
  ];

  const rows: (string | number)[][] = [];

  presentList.forEach((p) => {
    rows.push([
      meeting.date || "",
      meeting.title || "Chapter Meeting",
      meeting.chapterName || "",
      meeting.chapterCode || "",
      p.name,
      p.business || "",
      p.isVisitor ? "VISITOR" : "MEMBER",
      "PRESENT",
      p.paymentMethod || "UPI",
      p.amount || 0,
      p.phone || "",
      p.email || "",
    ]);
  });

  absentList.forEach((a) => {
    rows.push([
      meeting.date || "",
      meeting.title || "Chapter Meeting",
      meeting.chapterName || "",
      meeting.chapterCode || "",
      a.name,
      a.business || "",
      "MEMBER",
      "ABSENT",
      "N/A",
      0,
      a.phone || "",
      a.email || "",
    ]);
  });

  const cleanTitle = (meeting.title || filename).toLowerCase().replace(/[^a-z0-9]+/g, "_");
  exportToCsv(cleanTitle, headers, rows);
}


