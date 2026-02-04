import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '../utils/axiosConfig';

const TeacherDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadStatus('');
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post('/teachers/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadStatus(`Upload successful: ${response.data.message}`);
        } catch (error) {
            setUploadStatus('Upload failed. Please try again.');
            console.error('Upload error:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Teacher Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            <div className="upload-section">
                <h2>Upload Material</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} className="upload-button">Upload</button>
                {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
            </div>
        </div>
    );
};

export default TeacherDashboard;
