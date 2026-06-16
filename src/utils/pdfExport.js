import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(elementId, filename = 'resume.pdf') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found:', elementId)
    return false
  }

  try {
    // A4 dimensions in pixels at 96dpi: 794 x 1123
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.98)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = imgWidth / imgHeight

    const finalWidth = pdfWidth
    const finalHeight = pdfWidth / ratio

    if (finalHeight <= pdfHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, finalWidth, finalHeight)
    } else {
      // Multi-page support
      let y = 0
      const pageHeightInPx = (pdfHeight * imgWidth) / pdfWidth

      while (y < imgHeight) {
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = imgWidth
        pageCanvas.height = Math.min(pageHeightInPx, imgHeight - y)
        const ctx = pageCanvas.getContext('2d')
        ctx.drawImage(canvas, 0, -y)
        const pageImg = pageCanvas.toDataURL('image/jpeg', 0.98)
        if (y > 0) pdf.addPage()
        pdf.addImage(pageImg, 'JPEG', 0, 0, pdfWidth, (pageCanvas.height * pdfWidth) / imgWidth)
        y += pageHeightInPx
      }
    }

    pdf.save(filename)
    return true
  } catch (err) {
    console.error('PDF export failed:', err)
    return false
  }
}
