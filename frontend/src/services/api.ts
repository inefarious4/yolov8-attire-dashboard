import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust the base URL as needed

export const fetchDatasets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/datasets`);
        return response.data;
    } catch (error) {
        console.error('Error fetching datasets:', error);
        // TEMP MOCK fallback so UI shows table structure while backend is down
        return [
            { id: 'sample-001', coat: true, shoes: true, gloves: false, date_captured: new Date().toISOString() },
            { id: 'sample-002', coat: true, shoes: false, gloves: true, date_captured: new Date().toISOString() },
            { id: 'sample-003', coat: false, shoes: true, gloves: true, date_captured: new Date().toISOString() }
        ];
    }
};

export const uploadDataset = async (formData: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/datasets`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (err) {
        throw err;
    }
};

// Accept optional dataset IDs to include in training
export const triggerTraining = async (datasetIds?: string[]) => {
    try {
        const payload = datasetIds ? { dataset_ids: datasetIds } : {};
        const response = await axios.post(`${API_BASE_URL}/train`, payload);
        return response.data;
    } catch (error) {
        console.error('Error triggering training:', error);
        throw error;
    }
};