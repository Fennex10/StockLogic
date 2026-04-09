import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Tipos (puedes moverlos a types también si quieres)
type ChartData = { week: string; ventas: number };
type TopProduct = { name: string; ventas: number; ingresos: number };
type LowRotation = { name: string; ventas: number; ultimaVenta: string };

type ExportPDFParams = {
  startDate: string;
  endDate: string;
  salesChartData: ChartData[];
  topProducts: TopProduct[];
  lowRotation: LowRotation[];
};

export const exportReportPDF = ({ startDate, endDate, salesChartData, topProducts, lowRotation,
}: ExportPDFParams) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Reporte de Ventas e Inventario", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Período: ${startDate} a ${endDate}`, pageWidth / 2, 28, { align: "center" });
  doc.text(`Generado: ${new Date().toLocaleDateString("es-ES")}`, pageWidth / 2, 34, { align: "center" });

  // Ventas por Semana
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ventas por Semana", 14, 48);

  autoTable(doc, {
    startY: 52,
    head: [["Semana", "Ventas ($)"]],
    body: salesChartData.map((d) => [
      d.week,
      `$${d.ventas.toLocaleString()}`
    ]),
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229] },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const y1 = (doc as any).lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.text("Top Productos Más Vendidos", 14, y1);

  autoTable(doc, {
    startY: y1 + 4,
    head: [["Producto", "Ventas (uds)", "Ingresos ($)"]],
    body: topProducts.map((p) => [
      p.name,
      p.ventas.toString(),
      `$${p.ingresos.toLocaleString()}`
    ]),
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229] },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const y2 = (doc as any).lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.text("Productos con Baja Rotación", 14, y2);

  autoTable(doc, {
    startY: y2 + 4,
    head: [["Producto", "Ventas", "Última Venta"]],
    body: lowRotation.map((p) => [
      p.name,
      p.ventas.toString(),
      p.ultimaVenta
    ]),
    theme: "grid",
    headStyles: { fillColor: [239, 68, 68] },
  });

  doc.save(`reporte_${startDate}_${endDate}.pdf`);
};