import React, { useState, useEffect } from 'react';
import { uploadDataset, triggerTraining } from '../services/api';

interface DatasetFormProps {
    onUpload?: (formData: FormData) => Promise<void>;
}

interface UploadedDataset {
    id: string;
    name: string;
    file_count: number;
    created_at?: string;
    preview?: string; // optional preview url
}

const MIN_FILES = 150; // minimum required images

const DatasetForm: React.FC<DatasetFormProps> = ({ onUpload }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingTrain, setLoadingTrain] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const urls = files.map(f => URL.createObjectURL(f));
        setPreviews(urls);
        return () => {
            urls.forEach(u => URL.revokeObjectURL(u));
        };
    }, [files]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const selected = e.target.files ? Array.from(e.target.files) : [];
        const images = selected.filter(f => f.type.startsWith('image/'));
        if (images.length === 0 && selected.length > 0) {
            setError('Only image files are supported for preview.');
        }
        setFiles(prev => [...prev, ...images].slice(0, 5000));
        e.currentTarget.value = '';
    };

    const removeAt = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Upload only — adds to uploadedDatasets list after server response
    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one image to upload.');
            return;
        }
        setLoadingUpload(true);
        setError(null);

        const formData = new FormData();
        files.forEach(f => formData.append('files', f));

        try {
            const resp = await uploadDataset(formData);
            // assume resp contains dataset metadata; fallback to a locally generated entry
            const newDataset: UploadedDataset = resp && resp.id ? {
                id: resp.id,
                name: resp.name ?? `dataset-${resp.id}`,
                file_count: resp.file_count ?? files.length,
                created_at: resp.created_at,
                preview: previews[0],
            } : {
                id: String(Date.now()),
                name: `uploaded-${new Date().toISOString()}`,
                file_count: files.length,
                preview: previews[0],
            };

            setUploadedDatasets(prev => [newDataset, ...prev]);
            setFiles([]);
            setPreviews([]);
        } catch (err) {
            let message = String(err);
            if (err && typeof err === 'object' && 'message' in err) {
                // @ts-ignore
                message = err['message'];
            }
            setError(message);
        } finally {
            setLoadingUpload(false);
        }
    };

    // Trigger training — sends selected dataset ids to backend
    const handleTrain = async () => {
        if (selectedIds.size === 0) {
            setError('Select at least one uploaded dataset to include in training.');
            return;
        }
        setLoadingTrain(true);
        setError(null);
        try {
            await triggerTraining(Array.from(selectedIds));
            alert('Training triggered successfully.');
        } catch (err) {
            let message = String(err);
            if (err && typeof err === 'object' && 'message' in err) {
                // @ts-ignore
                message = err['message'];
            }
            setError(message);
        } finally {
            setLoadingTrain(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const clearUploaded = () => {
        setUploadedDatasets([]);
        setSelectedIds(new Set());
    };

    const enoughFiles = files.length >= MIN_FILES;

    return (
        <>
            <form className="form-card" onSubmit={(e) => e.preventDefault()}>
                <h2 className="form-title">Add New Dataset</h2>

                <div className="form-row">
                    <label className="label">Upload images</label>
                    <div className="file-controls">
                        <label className="file-btn" htmlFor="file-upload">
                            Choose images
                        </label>
                        <input
                            id="file-upload"
                            className="file-input-hidden"
                            type="file"
                            accept="image/*,.zip"
                            multiple
                            onChange={handleFileChange}
                        />
                        <span className="muted">{files.length} file(s) selected</span>
                    </div>
                </div>

                {previews.length > 0 && (
                    <div className="preview-grid">
                        {previews.map((src, i) => (
                            <div key={i} className="preview-item">
                                <img src={src} className="preview-img" alt={`preview-${i}`} />
                                <button type="button" className="remove-btn" onClick={() => removeAt(i)}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <p className="muted">
                    Minimum required images for dataset (for bulk dataset uploads): <strong>{MIN_FILES}</strong>.
                </p>

                {error && <p className="error">{error}</p>}

                <div className="form-actions">
                    <button
                        className="button"
                        type="button"
                        onClick={handleUpload}
                        disabled={loadingUpload || files.length === 0}
                    >
                        {loadingUpload ? 'Uploading...' : 'Upload Dataset'}
                    </button>

                    <div style={{ width: 12 }} />

                    <button
                        className="button button-ghost"
                        type="button"
                        onClick={() => { setFiles([]); setError(null); }}
                        disabled={loadingUpload || files.length === 0}
                    >
                        Clear Selection
                    </button>
                </div>
            </form>

            {/* Uploaded dataset library */}
            <section className="form-card" style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Uploaded Datasets</h2>
                    <div>
                        <button className="button button-ghost" onClick={clearUploaded} disabled={uploadedDatasets.length === 0}>
                            Clear Library
                        </button>
                        <button
                            className="button"
                            onClick={handleTrain}
                            disabled={loadingTrain || selectedIds.size === 0}
                            style={{ marginLeft: 10 }}
                        >
                            {loadingTrain ? 'Triggering...' : 'Train the Selected Datasets'}
                        </button>
                    </div>
                </div>

                {uploadedDatasets.length === 0 ? (
                    <p className="muted" style={{ marginTop: 12 }}>No uploaded datasets yet. Upload a dataset to add it to the library.</p>
                ) : (
                    <div className="dataset-list" style={{ marginTop: 12 }}>
                        {uploadedDatasets.map(ds => (
                            <div key={ds.id} className={`dataset-card ${selectedIds.has(ds.id) ? 'selected' : ''}`}>
                                <div className="dataset-left">
                                    {ds.preview ? <img src={ds.preview} className="dataset-thumb" alt={ds.name}/> : <div className="dataset-thumb placeholder" />}
                                </div>
                                <div className="dataset-body">
                                    <div className="dataset-title">{ds.name}</div>
                                    <div className="dataset-meta">{ds.file_count} files {ds.created_at ? `· ${new Date(ds.created_at).toLocaleString()}` : ''}</div>
                                </div>
                                <div className="dataset-actions">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(ds.id)}
                                        onChange={() => toggleSelect(ds.id)}
                                        aria-label={`Select dataset ${ds.name}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default DatasetForm;