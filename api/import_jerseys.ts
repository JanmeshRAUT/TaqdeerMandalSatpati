import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import xlsx from 'xlsx';
import { JerseyBooking } from './models/index.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

async function importData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const workbook = xlsx.readFile('complete_size_payment_list (2).xlsx');
    const sheet_name_list = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    console.log("Clearing previous JerseyBooking entries...");
    await JerseyBooking.deleteMany({});
    console.log("Cleared.");

    let count = 0;
    for (const row of xlData) {
      if (!row['Name'] || !row['Number']) {
        continue;
      }

      const amount = Number(row['Amount (₹)']) || 0;
      let status = 'Pending';
      if (amount >= 350) {
        status = 'Fully Paid';
      } else if (amount >= 100 && amount < 350) {
        status = 'Verified';
      } else {
        status = 'Pending';
      }

      const name = row['Name'].trim();
      const size = row['Size'] || 0;
      const paymentMode = row['Payment Mode'] || '';

      const booking = new JerseyBooking({
        id: new mongoose.Types.ObjectId().toString(),
        name: name,
        address: 'Satpati',
        phone: '',
        paymentMode: paymentMode,
        amountPaid: amount,
        items: [{
          id: new mongoose.Types.ObjectId().toString(),
          size: size,
          sleeveType: 'Half',
          quantity: 1
        }],
        bookingDate: new Date().toISOString(),
        status: status
      });

      await booking.save();
      count++;
    }

    console.log(`Successfully imported ${count} valid entries.`);
    process.exit(0);
  } catch (error) {
    console.error("Error importing:", error);
    process.exit(1);
  }
}

importData();
