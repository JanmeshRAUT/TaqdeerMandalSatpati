import React from 'react';
import { numberToMarathiWords } from '../utils/numberToMarathiWords';

interface ReceiptProps {
  data: {
    receiptNo?: string;
    transactionId?: string;
    date?: string;
    name: string;
    address?: string;
    amount: number | string;
    details?: string;
  };
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ data }, ref) => {
  const d = data.date ? new Date(data.date) : new Date();
  const validDate = isNaN(d.getTime()) ? new Date() : d;
  
  const dd = String(validDate.getDate()).padStart(2, '0');
  const mm = String(validDate.getMonth() + 1).padStart(2, '0');
  const yy = String(validDate.getFullYear()).slice(-2); // just last 2 digits for "20__"
  
  const receiptNo = data.receiptNo || (data.transactionId || 'RCP' + Date.now()).substring(0, 14).toUpperCase();
  const amountWords = numberToMarathiWords(Number(data.amount));

  return (
    <div
      ref={ref}
      className="relative w-[1536px] h-[1024px] overflow-hidden text-[#111827]"
    >
      <img 
        src="/images/receipt-template.png" 
        alt="Receipt Background" 
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Receipt Number */}
      <div className="absolute left-[1290px] top-[349px] w-[177px] h-[21px] flex items-center text-[20px] font-bold font-mono tracking-wider">
        {receiptNo}
      </div>

      {/* Date DD */}
      <div className="absolute left-[1265px] top-[397px] w-[43px] h-[21px] flex items-center justify-center text-[20px] font-bold font-mono">
        {dd}
      </div>

      {/* Date MM */}
      <div className="absolute left-[1332px] top-[397px] w-[46px] h-[21px] flex items-center justify-center text-[20px] font-bold font-mono">
        {mm}
      </div>

      {/* Date YY */}
      <div className="absolute left-[1430px] top-[397px] w-[40px] h-[21px] flex items-center justify-center text-[20px] font-bold font-mono">
        {yy}
      </div>

      {/* Donor Name */}
      <div className="absolute left-[704px] top-[428px] w-[454px] h-[20px] flex items-center text-[26px] font-bold leading-none">
        {data.name}
      </div>

      {/* Address */}
      <div className="absolute left-[585px] top-[476px] w-[878px] text-[24px] font-semibold leading-[48px]">
        {data.address}
      </div>

      {/* Donation Details */}
      <div className="absolute left-[890px] top-[624px] w-[560px] text-[24px] font-semibold leading-tight">
        {data.details}
      </div>

      {/* Amount In Words */}
      <div className="absolute left-[678px] top-[691px] w-[784px] h-[20px] flex items-center text-[26px] font-bold text-[#8B0000] leading-none">
        {amountWords}
      </div>

      {/* Amount in Numbers */}
      <div className="absolute left-[630px] top-[748px] w-[300px] text-[40px] text-center font-extrabold text-[#8B0000]">
        {data.amount} /-
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';
