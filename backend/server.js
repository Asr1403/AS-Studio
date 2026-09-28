const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// Inquiry Schema
const inquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

         business: {
             type: String,
             required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String
        },

        service: {
            type: String
        },

        budget: {
            type: String
        },

        message: {
            type: String
        }
    },
    {
        timestamps: true
    }
);


const Inquiry = mongoose.model("Inquiry", inquirySchema);


// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "AS Studio Backend is running"
    });
});


// Save Inquiry
app.post("/api/inquiries", async (req, res) => {

    try {

       const inquiry = new Inquiry({
    name: req.body.name,
    business: req.body.business,
    email: req.body.email,
    phone: req.body.phone,
    service: req.body.service,
    budget: req.body.budget,
    message: req.body.message
});

        const savedInquiry = await inquiry.save();

        res.status(201).json({
            success: true,
            message: "Inquiry saved successfully",
            data: savedInquiry
        });

    } catch (error) {

        console.error("Error saving inquiry:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save inquiry"
        });

    }

});


// Get All Inquiries
app.get("/api/inquiries", async (req, res) => {

    try {

        const inquiries = await Inquiry.find()
            .sort({ createdAt: -1 });

        res.json(inquiries);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch inquiries"
        });

    }

});


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
