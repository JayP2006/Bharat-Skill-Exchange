const Certificate = require('../models/Certificate');
const Booking = require('../models/Booking');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

exports.issueCertificate = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
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
    const existingCert = await Certificate.findOne({ booking: booking._id });
    if (existingCert) {
      return res.status(400).json({ message: 'Certificate already issued for this session' });
    }

    const verificationCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const certificate = await Certificate.create({
      shishya: booking.learner._id,
      guru: req.user.id,
      skill: booking.skill._id,
      booking: booking._id,
      verificationCode,
      certificateUrl: `/api/certificates/${verificationCode}/download`
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

exports.downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('shishya', 'name')
      .populate('guru', 'name')
      .populate('skill', 'title');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate-${certificate.verificationCode}.pdf`);

    doc.pipe(res);


    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#4F46E5');

    doc.fontSize(40).fillColor('#4F46E5').text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
    
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

    doc.moveDown(4);
    const date = new Date(certificate.createdAt).toLocaleDateString();
    doc.fontSize(12).text(`Date Issued: ${date}`, 100, 500);
    doc.text(`Certificate ID: ${certificate.verificationCode}`, 550, 500);

    doc.end();

  } catch (error) {
    next(error);
  }
};