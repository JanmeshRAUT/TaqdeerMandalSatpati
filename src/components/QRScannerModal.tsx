import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { X, CheckCircle, AlertCircle, Shirt } from 'lucide-react';
import { JerseyBooking } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (decodedText: string) => void;
  bookingData?: JerseyBooking | null;
  onMarkDelivered?: () => void;
  isProcessing?: boolean;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ 
  isOpen, 
  onClose, 
  onScanResult,
  bookingData,
  onMarkDelivered,
  isProcessing
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      return;
    }

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true
      },
      false
    );

    let isScanned = false;

    scanner.render(
      (decodedText) => {
        if (isScanned) return;
        
        let extractedId = decodedText;
        if (decodedText.startsWith('ID:')) {
          const match = decodedText.match(/^ID:\s*(.*?)(?=\n|$)/);
          if (match && match[1]) {
            extractedId = match[1].trim();
          }
        }
        
        if (extractedId) {
          isScanned = true;
          try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.connect(ctx.destination);
            osc.frequency.value = 800;
            osc.start();
            setTimeout(() => osc.stop(), 100);
          } catch(e) {}
          
          scanner.clear();
          onScanResult(extractedId);
        }
      },
      (errorMessage) => {}
    );

    return () => {
      scanner.clear().catch(e => console.error("Failed to clear scanner", e));
    };
  }, [isOpen, onScanResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shirt className="w-5 h-5 text-[#FF9933]" />
            स्कॅन करा (Scan Ticket)
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!bookingData && !error && (
            <div className="text-center mb-4 text-sm text-gray-500 font-bold">
              कॅमेरा वापरून जर्सी तिकीट स्कॅन करा.<br/>
              (Point your camera at the QR code)
            </div>
          )}

          {!bookingData && (
            <div id="qr-reader" className="w-full max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-inner border border-gray-200"></div>
          )}

          {bookingData && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900">{bookingData.name}</h3>
                <p className="text-gray-500 font-bold font-mono mt-1 text-xs">{bookingData.id}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 mt-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-bold text-xs">फोन (Phone)</span>
                  <span className="font-bold text-gray-900">{bookingData.phone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-bold text-xs">पेमेंट स्थिती (Status)</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                    bookingData.status === 'Fully Paid' || bookingData.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {bookingData.status} (₹{bookingData.amountPaid || 0})
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-bold text-xs">वितरण (Delivery)</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                    bookingData.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {bookingData.isDelivered ? 'दिले (Delivered)' : 'बाकी (Pending)'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold text-xs block mb-1">मागणी (Order Items)</span>
                  <div className="space-y-1">
                    {(bookingData.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between bg-white px-3 py-2 rounded border border-gray-100 shadow-sm">
                        <span className="font-bold text-[#FF9933]">{item.size}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{item.sleeveType === 'Half' ? 'Half' : 'Full'} Sleeve</span>
                        <span className="font-black text-gray-900">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => {
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  बंद करा (Close)
                </button>
                
                {(!bookingData.isDelivered && (bookingData.status === 'Verified' || bookingData.status === 'Fully Paid')) && (
                  <button 
                    onClick={onMarkDelivered}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl bg-[#FF9933] text-white font-bold hover:bg-[#e68a2e] disabled:opacity-50"
                  >
                    {isProcessing ? 'Working...' : 'मार्क डिलिव्हर्ड'}
                  </button>
                )}
              </div>
              
              {(!bookingData.isDelivered && (bookingData.status !== 'Verified' && bookingData.status !== 'Fully Paid')) && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-start gap-2 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>हे तिकीट पूर्णपणे पेड (Paid/Verified) नाही. कृपया डिलिव्हरी देण्यापूर्वी पेमेंटची खात्री करा.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
