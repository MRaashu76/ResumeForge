import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(elementId, filename = 'resume.pdf') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found:', elementId)
    return false
  }

  let canvas = null
  try {
    // A4 dimensions in pixels at 96dpi: 794 x 1123
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
    })

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Generated canvas is 0x0. The browser may have optimized the element out of layout.')
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.98)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize?.width || pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize?.height || pdf.internal.pageSize.getHeight()

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
        const currentHeight = Math.min(pageHeightInPx, imgHeight - y)
        if (currentHeight <= 1) break // Prevent 0px height canvas from fractional pixel remainders

        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = imgWidth
        pageCanvas.height = currentHeight
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
    alert(`PDF Export Failed: ${err.message}\nDebug Info: canvas(${canvas?.width}x${canvas?.height})`)
    return false
  }
}
