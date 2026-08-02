function numberToEnglishWords(num: number): string {
  if (!num || isNaN(num)) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
  }

  return inWords(num).trim() + ' Rupees Only';
}

export function sanitizeForPdf(text: string | undefined | null, fallback: string = ''): string {
  if (!text) return fallback;
  // Replace Marathi default strings with English equivalents for PDF compatibility
  if (text.includes('देणगी') || text.includes('देंणगी')) return 'General Donation';
  
  // Remove non-Latin1 / non-ASCII characters that corrupt in PDFKit Helvetica
  const cleaned = text.replace(/[^\x00-\x7F]/g, '').trim();
  return cleaned || fallback;
}

export function formatAmountWords(amountStr: string | number): string {
  const num = typeof amountStr === 'number' ? amountStr : parseInt(String(amountStr).replace(/[^0-9]/g, ''), 10);
  return numberToEnglishWords(num);
}
