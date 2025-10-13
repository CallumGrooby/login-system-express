import express from "express";
import { Booking } from "../models/Booking.js";
import { authMiddleware } from "../middleware/auth.js";

export const BookingRouter = express.Router();

BookingRouter.post("/add-booking", async (req, res) => {
  try {
    let { name, emailAddress, date, time, message } = req.body;

    name = name?.trim();
    emailAddress = emailAddress?.trim();
    message = message?.trim();

    // Test for empties
    if (!name || !emailAddress || !date || !time || !message) {
      return res.json({ status: "FAILED", message: "Empty input field" });
    }

    // regex to test if name contains anything other than letters, reject it
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return res.json({ status: "FAILED", message: "Invalid Name Entered" });
    }

    if (!/^[a-zA-Z\s]*$/.test(message)) {
      return res.json({ status: "FAILED", message: "Invalid message Entered" });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailAddress)) {
      return res.json({ status: "FAILED", message: "Invalid Email Entered" });
    }

    const newBooking = new Booking({
      name,
      emailAddress,
      date,
      time,
      message,
      approved: false,
      paid: false,
      invoiceSent: false,
    });
    const savedBooking = await newBooking.save();

    res.json({
      status: "SUCCESS",
      message: "New booking successfully created",
      data: savedBooking,
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: "FAILED",
      message: "An error occurred creating the booking",
    });
  }
});

BookingRouter.get("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.json({
        status: "FAILED",
        message: "Booking with this id does not exists",
      });
    }

    res.json({ message: "Found booking", data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "Error retrieving booking",
    });
  }
});

BookingRouter.delete("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        status: "FAILED",
        message: "Booking with this id does not exist",
      });
    }

    res.json({
      status: "SUCCESS",
      message: "Booking deleted successfully",
      data: deletedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "Error deleting booking",
    });
  }
});

BookingRouter.put("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      req.body, // fields to update
      { new: true } // return updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({
        status: "FAILED",
        message: "Booking not found",
      });
    }

    res.json({
      status: "SUCCESS",
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "Error updating booking",
    });
  }
});
