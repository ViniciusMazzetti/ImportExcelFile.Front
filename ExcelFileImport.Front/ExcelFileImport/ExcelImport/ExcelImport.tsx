import React, { useState } from 'react';
import axios from 'axios';

const ExcelImport: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Arquivo');
        const selectedFile = event.target.files && event.target.files[0];
        setFile(selectedFile);
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result && typeof reader.result === 'string') {
                    const base64Data = reader.result.split(',')[1];
                    resolve(base64Data);
                } else {
                    reject(new Error('Failed to read file.'));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleUpload = async () => {
        console.log('entrou');
        if (!file) {
            console.log('sem arquivo');
            alert('Please select a file.');
            return;
        }

        try {
            console.log('1');
            const base64Data = await convertToBase64(file);
            console.log(base64Data);
            // Send base64Data to API
            const response = await axios.post('https://localhost:3001/api/ImportFile', { fileData: base64Data });
            alert('Excel file uploaded successfully.');
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading Excel file:', error);
            alert('An error occurred while uploading the Excel file.');
        }
    };

    return (
        <div>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Excel File</button>
        </div>
    );
};

export default ExcelImport;
