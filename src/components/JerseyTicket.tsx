import React from 'react';
import { JerseyBooking } from '../types';

interface JerseyTicketProps {
  data: JerseyBooking;
}

export const JerseyTicket = React.forwardRef<HTMLDivElement, JerseyTicketProps>(({ data }, ref) => {
  const validDate = data.bookingDate ? new Date(data.bookingDate) : new Date();
  
  const dd = String(validDate.getDate()).padStart(2, '0');
  const mm = String(validDate.getMonth() + 1).padStart(2, '0');
  const yyyy = validDate.getFullYear();

  const items = data?.items || [];
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      ref={ref}
      className="relative w-[850px] min-h-[450px] h-auto bg-[#ffffff] text-[#111827] flex rounded-xl border border-[#E5E7EB]"
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
    >
      {/* Left section - Details */}
      <div className="flex-1 p-8 flex flex-col relative border-r-[3px] border-dashed border-[#D1D5DB] bg-gradient-to-br from-[#FFF7ED] to-[#ffffff]">
        
        {/* Top/Bottom orange accent bars */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#FF9933] to-[#F97316] rounded-tl-xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#FF9933] to-[#F97316] rounded-bl-xl"></div>
        
        {/* Header with Logo and Bappa */}
        <div className="flex justify-between items-center border-b-2 border-[#FED7AA] pb-4 mb-6 mt-2">
          <div className="flex items-center gap-4">
            <img src="/LogoBGRemoved.png" alt="Logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-3xl font-black text-[#EA580C] leading-none tracking-tight">TAKDEER MITRA MANDAL</h1>
              <p className="text-[#9A3412] font-bold tracking-[0.2em] text-sm uppercase mt-1">Satpati, Palghar</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-[#1F2937]">Jersey Ticket</h2>
              <p className="text-xs font-mono text-[#6B7280] mt-1 tracking-wider">{data.id.toUpperCase()}</p>
            </div>
            <img src="/GanapatiImg.jpeg" alt="Bappa" className="w-16 h-16 object-cover rounded-md shadow-sm border-2 border-[#FED7AA]" />
          </div>
        </div>

        {/* Customer Details */}
        <div className="flex gap-16 mb-8 pt-4 border-t border-[#F3F4F6]">
          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1 tracking-wider">Customer Name</p>
            <p className="text-2xl font-black text-[#111827]">{data.name}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1 tracking-wider">Phone Number</p>
            <p className="text-2xl font-black text-[#1F2937]">{data.phone}</p>
          </div>
        </div>

        {/* Order Summary (Expands) */}
        <div className="flex-1 mb-8">
          <div className="flex justify-between items-end mb-3">
            <p className="text-sm font-bold text-[#EA580C] uppercase tracking-wider">Order Summary</p>
            <p className="text-sm font-bold text-[#C2410C]">{totalQuantity} Total Items</p>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden border border-[#E5E7EB] shadow-sm">
            <div className="flex font-black text-xs text-[#6B7280] uppercase bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <div className="flex-1 py-3 px-6 text-left">Size</div>
              <div className="flex-1 py-3 px-6 text-center">Sleeve Type</div>
              <div className="flex-1 py-3 px-6 text-right">Quantity</div>
            </div>
            <div className="flex flex-col">
              {items.map((item, idx) => (
                <div key={idx} className="flex font-bold text-sm text-[#1F2937] border-b border-[#F3F4F6] last:border-0 hover:bg-[#FFF7ED] transition-colors">
                  <div className="flex-1 py-3 px-6 text-left text-[#EA580C] text-lg">{item.size}</div>
                  <div className="flex-1 py-3 px-6 text-center text-[#4B5563]">{item.sleeveType === 'Half' ? 'Half Sleeve' : 'Full Sleeve'}</div>
                  <div className="flex-1 py-3 px-6 text-right text-lg">{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1 tracking-wider">Booking Date</p>
            <p className="text-lg font-black text-[#374151]">{dd}/{mm}/{yyyy}</p>
          </div>
          <div className="text-right">
            <span className={`px-6 py-2 rounded-lg text-sm font-black uppercase tracking-widest shadow-sm ${
              (data.status === 'Verified' || data.status === 'Paid') 
                ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white' 
                : 'bg-gradient-to-r from-[#FACC15] to-[#EAB308] text-white'
            }`}>
              {data.status || 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Right section - Stub */}
      <div className="w-[220px] bg-[#F9FAFB] p-6 flex flex-col justify-between items-center relative rounded-r-xl">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#F97316] to-[#FF9933] rounded-tr-xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#F97316] to-[#FF9933] rounded-br-xl"></div>
        
        <div className="text-center w-full mt-6">
          <p className="text-xs font-black text-[#D1D5DB] uppercase tracking-[0.3em] mb-4">Scan Status</p>
          
          <div className="w-32 h-32 mx-auto bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center p-2 shadow-inner">
            {/* Real QR Code linking to status */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`ID: ${data.id}\nStatus: ${data.status || 'Pending'}\nItems: ${totalQuantity}`)}`} 
              alt="QR Code" 
              className="w-full h-full object-contain mix-blend-multiply" 
              crossOrigin="anonymous"
            />
          </div>
          <p className="text-[11px] font-mono font-bold text-[#9CA3AF] mt-3 tracking-widest">{data.id.substring(0, 15).toUpperCase()}</p>
        </div>

        <div className="text-center mb-6 mt-auto pt-8">
          <p className="text-6xl font-black text-[#EA580C] leading-tight mb-2 drop-shadow-sm">{totalQuantity}</p>
          <p className="text-sm font-black text-[#4B5563] uppercase tracking-[0.2em] mt-2">Items</p>
        </div>
      </div>
    </div>
  );
});

JerseyTicket.displayName = 'JerseyTicket';
