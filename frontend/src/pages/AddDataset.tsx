import React, { useState } from 'react';
import DatasetForm from '../components/DatasetForm';
import { uploadDataset } from '../services/api';

const AddDataset: React.FC = () => {
    const [message, setMessage] = useState<string>('');

    const handleDatasetUpload = async (formData: FormData) => {
        try {
            await uploadDataset(formData);
            setMessage('Dataset uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading dataset. Please try again.');
        }
    };

    return (
        <div>
            <h1>Dataset</h1>
            <DatasetForm onUpload={handleDatasetUpload} />
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddDataset;