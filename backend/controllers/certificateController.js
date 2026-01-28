const Certificate = require('../models/Certificate');
const Booking = require('../models/Booking');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// @desc    Issue a Certificate (Only for Gurus)
// @route   POST /api/certificates/issue
exports.issueCertificate = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    // 1. Verify Booking & Permissions
    const booking = await Booking.findById(bookingId)
      .populate('learner', 'name email')
      .populate('skill', 'title')
      .populate('guru', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.guru._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to issue certificate for this booking' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Certificate can only be issued for COMPLETED sessions' });
    }

    // 2. Check if already issued
    const existingCert = await Certificate.findOne({ booking: booking._id });
    if (existingCert) {
      return res.status(400).json({ message: 'Certificate already issued for this session' });
    }

    // 3. Generate Verification Code
    const verificationCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // 4. Create Certificate Record
    // Note: Actual PDF URL hum Cloudinary upload ke baad set kar sakte hain, 
    // lekin abhi ke liye hum dynamic generation on download use karenge.
    const certificate = await Certificate.create({
      shishya: booking.learner._id,
      guru: req.user.id,
      skill: booking.skill._id,
      booking: booking._id,
      verificationCode,
      certificateUrl: `/api/certificates/${verificationCode}/download` // Virtual URL
    });

    res.status(201).json({ 
      success: true, 
      message: 'Certificate Issued Successfully', 
      certificate 
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get My Certificates (For Shishya)
// @route   GET /api/certificates/my-certificates
exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ shishya: req.user.id })
      .populate('guru', 'name')
      .populate('skill', 'title')
      .sort('-createdAt');

    res.status(200).json({ certificates });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Certificate PDF
// @route   GET /api/certificates/:id/download
exports.downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('shishya', 'name')
      .populate('guru', 'name')
      .populate('skill', 'title');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // PDF Generation
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    // Set Response Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate-${certificate.verificationCode}.pdf`);

    doc.pipe(res);

    // --- PDF DESIGN ---
    // Background Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#4F46E5');

    // Header
    doc.fontSize(40).fillColor('#4F46E5').text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
    
    // Body
    doc.moveDown();
    doc.fontSize(20).fillColor('black').text('This is to certify that', { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(35).fillColor('#1F2937').font('Helvetica-Bold').text(certificate.shishya.name, { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(18).font('Helvetica').text('has successfully completed the session on', { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(25).fillColor('#4F46E5').text(certificate.skill.title, { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(15).fillColor('black').text(`Mentored by: ${certificate.guru.name}`, { align: 'center' });

    // Footer
    doc.moveDown(4);
    const date = new Date(certificate.createdAt).toLocaleDateString();
    doc.fontSize(12).text(`Date Issued: ${date}`, 100, 500);
    doc.text(`Certificate ID: ${certificate.verificationCode}`, 550, 500);

    doc.end();

  } catch (error) {
    next(error);
  }
};