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
      className="relative w-[800px] h-[400px] bg-[#ffffff] overflow-hidden text-[#111827] flex rounded-2xl border-4 border-[#FF9933]"
      style={{ boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}
    >
      {/* Left section - Details */}
      <div className="flex-1 p-8 flex flex-col justify-between relative border-r-4 border-dashed border-[#D1D5DB]">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FF9933]"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[#FF9933]"></div>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-[#FF9933] mb-1 tracking-tight">TAKDEER MITRA MANDAL</h1>
            <p className="text-[#6B7280] font-bold tracking-widest text-sm uppercase">Satpati</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black uppercase tracking-wider text-[#1F2937]">Jersey Ticket</h2>
            <p className="text-sm font-mono text-[#6B7280] mt-1">{data.id.toUpperCase()}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex gap-12 mb-6">
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Customer Name</p>
              <p className="text-2xl font-bold text-[#111827]">{data.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Phone Number</p>
              <p className="text-xl font-bold text-[#1F2937]">{data.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-2">Order Summary ({totalQuantity} Total Items)</p>
            <div className="bg-[#FFF7ED] rounded-lg p-3 max-w-md border border-[#FFEDD5]">
              <div className="flex font-bold text-[10px] text-[#9CA3AF] uppercase mb-2 border-b border-[#FED7AA] pb-1">
                <div className="w-20">Size</div>
                <div className="w-24">Sleeve</div>
                <div className="w-16 text-center">Qty</div>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="flex font-bold text-sm text-[#1F2937] mb-1 last:mb-0">
                  <div className="w-20 text-[#FF9933]">{item.size}</div>
                  <div className="w-24">{item.sleeveType === 'Half' ? 'Half' : 'Full'}</div>
                  <div className="w-16 text-center">{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 flex justify-between items-end border-t border-[#F3F4F6]">
          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">Booking Date</p>
            <p className="text-base font-bold text-[#374151]">{dd}/{mm}/{yyyy}</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider ${
              data.status === 'Verified' ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]' : 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]'
            }`}>
              {data.status === 'Verified' ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Right section - Stub */}
      <div className="w-[200px] bg-[#FFF7ED] p-6 flex flex-col justify-between items-center relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FF9933]"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-[#FF9933]"></div>
        
        {/* Semi-circles for the dashed line effect */}
        <div className="absolute -left-3 top-[-10px] w-6 h-6 rounded-full bg-[#ffffff] border-b-4 border-r-4 border-[#D1D5DB] transform rotate-45 hidden"></div>

        <div className="text-center w-full mt-4">
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Admit One</p>
          <div className="w-full h-24 bg-[#ffffff] border-2 border-[#E5E7EB] rounded flex items-center justify-center p-2">
            {/* Fake Barcode */}
            <div className="w-full h-full flex justify-between gap-0.5 opacity-60">
              {[3,1,4,2,3,1,5,2,4,1,3,2,4,1,2,5,3,1,4,2,3,1,5,2,4,1,3,2,4,1].map((w, i) => (
                <div key={i} className={`bg-[#000000] h-full`} style={{ width: `${w}px` }}></div>
              ))}
            </div>
          </div>
          <p className="text-[10px] font-mono text-[#9CA3AF] mt-2 tracking-widest">{data.id.substring(0, 15).toUpperCase()}</p>
        </div>

        <div className="text-center">
          <p className="text-4xl font-black text-[#FF9933] mb-1">{totalQuantity}</p>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Items</p>
        </div>
      </div>
    </div>
  );
});

JerseyTicket.displayName = 'JerseyTicket';
