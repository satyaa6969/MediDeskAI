import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const createPrescriptionPDF = (patient, prescription, doctorInfo) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text('MediDesk AI Clinic', 14, 22);
    doc.setFontSize(12); doc.setFont('helvetica', 'normal');
    doc.text(`Dr. ${doctorInfo.name || ''}, ${doctorInfo.title || ''}`, 14, 30);

    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('Medical Prescription', 105, 50, { align: 'center' });
    doc.setLineWidth(0.5); doc.line(14, 55, 196, 55);

    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('Patient Information:', 14, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${patient.name || 'N/A'}`, 16, 73);
    doc.text(`Age: ${patient.age || 'N/A'}`, 16, 81);
    doc.text(`Primary Diagnosis: ${patient.diagnosis || 'N/A'}`, 16, 89);
    doc.setFont('helvetica', 'bold');
    doc.text('Date Issued:', 140, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(today, 142, 73);

    doc.setFontSize(36); doc.setFont('times', 'bold');
    doc.text('Rx', 14, 110);
    autoTable(doc, {
        startY: 115,
        head: [['Medication', 'Dosage', 'Instructions']],
        body: [[
            prescription.medication || 'N/A',
            prescription.dosage || 'N/A',
            prescription.instructions || 'N/A'
        ]],
        theme: 'grid',
        headStyles: { fillColor: [26, 128, 182], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 11, cellPadding: 3 },
        columnStyles: { 2: { cellWidth: 'auto' } }
    });

    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(10); doc.setFont('helvetica', 'italic');
    doc.text('This prescription was generated with the assistance of MediDeskAI.', 105, finalY + 25, { align: 'center', maxWidth: 180 });
    doc.line(130, finalY + 45, 196, finalY + 45);
    doc.setFont('helvetica', 'normal');
    doc.text(`Signature (Dr. ${doctorInfo.name || ''})`, 132, finalY + 50);

    doc.save(`Prescription-${patient.name.replace(/\s+/g, '_')}-${today}.pdf`);
};
