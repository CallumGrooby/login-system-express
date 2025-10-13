import mongoose from "mongoose";
const { Schema } = mongoose;

// Create a boiler plate for the information inside of the database, each element is defined as a type

const BookingSchema = new Schema({
  name: String,
  emailAddress: String,
  date: String,
  time: String,
  message: String,
  approved: Boolean,
  paid: Boolean,
  invoiceSent: Boolean,
});

export const Booking = mongoose.model("Booking", BookingSchema);
