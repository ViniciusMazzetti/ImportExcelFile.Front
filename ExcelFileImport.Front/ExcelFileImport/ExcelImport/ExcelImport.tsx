import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const ExcelImport: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileDetails, setFileDetails] = useState({ FileName: '', FileSize: 0 });
    const [fileAlias, setFileAlias] = useState(''); // State for FileAlias
    const [loadData, setLoadData] = useState<boolean>(false);
    const [fileAliasError, setFileAliasError] = useState<string>(''); // State for FileAlias error message

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const fileType = file.type;
            const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!allowedTypes.includes(fileType)) {
                alert('Por favor, selecione apenas arquivos no formato .xlsx ou .xls!');
                event.target.value = '';
            } else {
                setFile(file);
                setFileDetails(prevState => ({
                    ...prevState,
                    FileName: file.name,
                    FileSize: file.size
                }));
            }
        }
        else{            
            setFile(null);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileAlias(event.target.value);
        setFileAliasError('');
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
                    reject(new Error('Erro ao ler o arquivo.'));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Por favor, selecione um arquivo.');
            return;
        
        }

        if (!fileAlias.trim()) {
            setFileAliasError('Identificação da Planilha é obrigatória.');
            return;
        }

        setLoadData(true);

        try {
            const base64Data = await convertToBase64(file);
            await axios.post(API_URL +'ImportFile', { fileData: base64Data, fileDetails: fileDetails, fileAlias: fileAlias }); 
            alert('Arquivo importado com sucesso!');
            setLoadData(false);
            setFile(null);
            setFileAlias("");
            const fileInput = document.getElementById('upload_file') as HTMLInputElement;
            fileInput.value = ''; 
            
        } catch (error) {
            console.error('Error uploading Excel file:', error);
            alert('Ocorreu um erro ao realizar a importação do arquivo!');
            setLoadData(false);
        }
    };

    return (
        <form className="max-w-lg mx-auto">
            <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-white" htmlFor="upload_file">Realizar Upload</label>
            <input name='ChooseFile' disabled={loadData} className="my-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  file:me-4 file:py-2 file:px-4
        file:border-0
        file:text-sm file:font-semibold
        file:bg-gray-800 file:text-white
        hover:file:bg-gray-600
        file:disabled:opacity-50 file:disabled:pointer-events-none" aria-describedby="upload_file" id="upload_file" type="file" accept=".xlsx" onChange={handleFileChange} />
            <div>
                <label htmlFor="FileAlias" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Identificação do Arquivo:</label>
                <input type="text" id="FileAlias" name='FileAlias' className={`mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${fileAliasError && 'border-red-500'}`} value={fileAlias} onChange={handleChange} />
                {fileAliasError && <p className="text-red-500 text-sm mt-1">{fileAliasError}</p>}
            </div>
            <button disabled={loadData} type="button" className="flex disabled:cursor-not-allowed text-white bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={handleUpload}>
                {
                    loadData ?
                        <>
                            <svg aria-hidden="true" className="mr-3 w-5 h-5 text-gray-200 animate-spin fill-gray-50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>  Importando... </>
                        : "Enviar!"
                }
            </button>
        </form>
    );
};

export default ExcelImport;
