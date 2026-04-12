import type { Sale } from "@/interface/sales/sale.interface";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const paymentLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

export const generateInvoicePDF = (sale: Sale) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURA", 20, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("StockLogic", 20, 30);
  doc.text(`Factura: ${sale.code}`, 20, 37);

  // Right side
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`#${sale.code}`, pageWidth - 20, 22, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Fecha: ${new Date(sale.registerDate).toLocaleDateString("es-ES")}`,
    pageWidth - 20,
    30,
    { align: "right" }
  );

  doc.setTextColor(30, 30, 30);

  // Cliente
  doc.setFillColor(248, 248, 255);
  doc.roundedRect(15, 55, pageWidth - 30, 30, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 140);
  doc.text("CLIENTE", 22, 64);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(sale.clientName, 22, 72);

  // Método de pago
  doc.setTextColor(120, 120, 140);
  doc.setFontSize(9);
  doc.text("MÉTODO DE PAGO", pageWidth - 22, 64, { align: "right" });

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(
    paymentLabels[sale.paymentMethod] || sale.paymentMethod,
    pageWidth - 22,
    72,
    { align: "right" }
  );

  // ✅ TABLA (UN SOLO PRODUCTO)
  const tableData = [
    [
      "1",
      sale.Product.name,
      String(sale.quantity),
      `$${(sale.totalPrice / sale.quantity).toLocaleString()}`,
      `$${sale.totalPrice.toLocaleString()}`,
    ],
  ];

  autoTable(doc, {
    startY: 95,
    head: [["#", "Producto", "Cantidad", "Precio Unit.", "Subtotal"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 255],
    },
    margin: { left: 15, right: 15 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totales
  doc.setFillColor(248, 248, 255);
  doc.roundedRect(pageWidth - 95, finalY, 80, 35, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 140);
  doc.text("Subtotal:", pageWidth - 90, finalY + 10);
  // doc.text("IVA (0%):", pageWidth - 90, finalY + 18);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("TOTAL:", pageWidth - 90, finalY + 28);

  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(
    `$${sale.totalPrice.toLocaleString()}`,
    pageWidth - 20,
    finalY + 10,
    { align: "right" }
  );

  doc.text("$0.00", pageWidth - 20, finalY + 18, {
    align: "right",
  });

  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text(
    `$${sale.totalPrice.toLocaleString()}`,
    pageWidth - 20,
    finalY + 28,
    { align: "right" }
  );

  // ✅ ESTADO (BOOLEAN FIX)
  const statusText = sale.isCompleted ? "COMPLETADA" : "PENDIENTE";
  const statusColor = sale.isCompleted
    ? [34, 197, 94]
    : [245, 158, 11];

  doc.setFillColor(
    statusColor[0],
    statusColor[1],
    statusColor[2]
  );

  doc.roundedRect(15, finalY + 5, 50, 10, 2, 2, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(statusText, 40, finalY + 12, {
    align: "center",
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;

  doc.setDrawColor(220, 220, 230);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 160);
  doc.text(
    "Gracias por su compra • Inventory System",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  doc.text(
    `Generado: ${new Date().toLocaleString("es-ES")}`,
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  doc.save(`Factura_${sale.code}.pdf`);
  toast.success(`Factura ${sale.code} descargada`);
};