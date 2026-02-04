import { protect, teacherOnly } from '../middleware/auth.js';
import { TeacherUpload } from '../models/teachers/index.js';
import path from 'path';
import fs from 'fs';

// Upload material function
export const uploadMaterial = async (req, res) => {
    try {
        // Apply protection and teacher-only middleware
        // Note: We need to apply this logic inside the function or use separate routes
        // For now, we'll trust that the route handles authentication
        
        if (!req.file && !req.body.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }
        
        const { subject, course, description, uploadType } = req.body;
        
        // Create upload record in database
        const newUpload = new TeacherUpload({
            teacherId: req.user.id, // Assuming teacher ID is available in req.user from JWT
            fileName: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            uploadType: uploadType || 'resources',
            subject,
            course,
            description,
            uploadedBy: req.user.name || req.user.email
        });
        
        await newUpload.save();
        
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                id: newUpload._id,
                name: req.file ? req.file.originalname : (req.body.file ? req.body.file.name : 'unknown'),
                size: req.file ? req.file.size : (req.body.file ? req.file.size : 0),
                type: req.file ? req.file.mimetype : (req.body.file ? req.body.file.type : 'unknown'),
                uploadType: newUpload.uploadType,
                subject: newUpload.subject
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during file upload'
        });
    }
};

// Get teacher's uploads
export const getTeacherUploads = async (req, res) => {
    try {
        const uploads = await TeacherUpload.find({ teacherId: req.user.id })
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            uploads
        });
    } catch (error) {
        console.error('Get uploads error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving uploads'
        });
    }
};

// Get all uploads (for admin/teacher access)
export const getAllUploads = async (req, res) => {
    try {
        const uploads = await TeacherUpload.find({})
            .populate('teacherId', 'name email department')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            uploads
        });
    } catch (error) {
        console.error('Get all uploads error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving uploads'
        });
    }
};

// Delete upload
export const deleteUpload = async (req, res) => {
    try {
        const { id } = req.params;
        
        const upload = await TeacherUpload.findOne({ _id: id, teacherId: req.user.id });
        
        if (!upload) {
            return res.status(404).json({
                success: false,
                message: 'Upload not found or unauthorized'
            });
        }
        
        // Delete file from filesystem
        if (fs.existsSync(upload.filePath)) {
            fs.unlinkSync(upload.filePath);
        }
        
        // Delete record from database
        await TeacherUpload.deleteOne({ _id: id });
        
        res.status(200).json({
            success: true,
            message: 'Upload deleted successfully'
        });
    } catch (error) {
        console.error('Delete upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting upload'
        });
    }
};