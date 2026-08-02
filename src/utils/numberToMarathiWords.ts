const ones = ['', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ', 'दहा', 'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा', 'सोळा', 'सतरा', 'अठरा', 'एकोणीस', 'वीस', 'एकवीस', 'बावीस', 'तेवीस', 'चोवीस', 'पंचवीस', 'सव्वीस', 'सत्तावीस', 'अठ्ठावीस', 'एकोणतीस', 'तीस', 'एकतीस', 'बत्तीस', 'तेत्तीस', 'चौतीस', 'पस्तीस', 'छत्तीस', 'सदतीस', 'अडतीस', 'एकोणचाळीस', 'चाळीस', 'एकचाळीस', 'बेचाळीस', 'त्रेचाळीस', 'चौचाळीस', 'पंचेचाळीस', 'शीच्छेचाळीस', 'सत्ताचाळीस', 'अठ्ठाचाळीस', 'एकोणपन्नास', 'पन्नास', 'एकपन्नास', 'बावन्न', 'त्रिपन्न', 'चौपन्न', 'पंचावन्न', 'छप्पन्न', 'सत्तावन्न', 'अठ्ठावन्न', 'एकोणसाठ', 'साठ', 'एकसाठ', 'बासाठ', 'त्रेसाठ', 'चौसाठ', 'पाचसाठ', 'साहासाठ', 'सदुसाठ', 'अडसाठ', 'एकोणसत्तर', 'सत्तर', 'एकहत्तर', 'बाहत्तर', 'त्रिहत्तर', 'चौहत्तर', 'पंचहत्तर', 'शहात्तर', 'सत्ताहत्तर', 'अठ्ठाहत्तर', 'एकोणऐंशी', 'ऐंशी', 'एकऐंशी', 'ब्याऐंशी', 'त्र्याऐंशी', 'चौऱ्याऐंशी', 'पंच्याऐंशी', 'शहाऐंशी', 'सत्ताऐंशी', 'अठ्ठाऐंशी', 'एकोणणऊ', 'णव्वद', 'एकॅणऊ', 'ब्याणऊ', 'त्र्याणऊ', 'चौऱ्याणऊ', 'पंच्याणऊ', 'शहाणऊ', 'सत्ताणऊ', 'अठ्ठाणऊ', 'नव्व्याणऊ'];

export function numberToMarathiWords(num: number): string {
  if (isNaN(num) || num === 0) return 'शून्य रुपये मात्र';

  function convertTwoDigits(n: number): string {
    if (n < 100) return ones[n];
    return '';
  }

  function convertUnderThousand(n: number): string {
    let str = '';
    const hundredDigit = Math.floor(n / 100);
    const remainder = n % 100;

    if (hundredDigit > 0) {
      str += ones[hundredDigit] + ' शे ';
    }
    if (remainder > 0) {
      str += convertTwoDigits(remainder);
    }
    return str.trim();
  }

  let result = '';

  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;

  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  if (crore > 0) {
    result += convertUnderThousand(crore) + ' कोटी ';
  }
  if (lakh > 0) {
    result += convertTwoDigits(lakh) + ' लाख ';
  }
  if (thousand > 0) {
    result += convertTwoDigits(thousand) + ' हजार ';
  }
  if (rem > 0) {
    result += convertUnderThousand(rem);
  }

  return (result.trim() + ' रुपये मात्र');
}
