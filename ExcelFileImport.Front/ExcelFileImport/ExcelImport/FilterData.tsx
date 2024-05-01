import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ComboInput from '../components/ComboInput';
import { API_URL } from '../config';

const DataForm: React.FC = () => {
    const [formData, setFormData] = useState({ ClientCode: '', ProductCategory: '', ProductSku: '', InitialDate: '', EndDate: '', Quantity: '', Revenue: '', FileAlias: '' });
    const [responseList, setResponseList] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [loadData, setLoadData] = useState<boolean>(false);
    const [fileAlias, setFileAlias] = useState('');

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            FileAlias: fileAlias
        }));
    }, [fileAlias]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'Quantity' || name === 'ClientCode') {
            
            if (value === '' || /^\d+$/.test(value)) {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        }
        else if (name === 'Revenue') {
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        }
        else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleComboInputChange = (selectedValue: string) => {
        setFileAlias(selectedValue); 
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formData.InitialDate && !formData.EndDate) {
            alert("Preencha as duas Datas!");
            return;
        }
        if (!formData.InitialDate && formData.EndDate) {
            alert("Preencha as duas Datas!");
            return;
        }
        const startDate = new Date(formData.InitialDate);
        const endDate = new Date(formData.EndDate);

        if (startDate > endDate) {
            alert("Data Inicial não pode ser que a Data Final!");

            setFormData({ ...formData, EndDate: "" });

            return;
        }

        setLoadData(true);

        try {
            const response = await axios.post(API_URL + 'FilterFileData', formData);
            setResponseList(response.data);
            setCurrentPage(1);
            setLoadData(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoadData(false);
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = responseList.slice(indexOfFirstRecord, indexOfLastRecord);



    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy');
    };

    const formatCurrency = (value: any) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const renderTable = () => (

        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr className='border text-center'>
                        <th scope="col" className="px-6 py-3">Código Cliente</th>
                        <th scope="col" className="px-6 py-3">Categoria do Produto</th>
                        <th scope="col" className="px-6 py-3">Sku/Produto</th>
                        <th scope="col" className="px-6 py-3">Data</th>
                        <th scope="col" className="px-6 py-3">Quantidade</th>
                        <th scope="col" className="px-6 py-3">Valor de Faturamento</th>
                        <th scope="col" className="px-6 py-3">Planilha</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((item, index) => (
                        <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-center'>
                            <td className='px-6 py-2'>{item.ClientCode}</td>
                            <td className='px-6 py-2'>{item.ProductCategory}</td>
                            <td className='px-6 py-2'>{item.ProductSku}</td>
                            <td className='px-6 py-2'>{formatDate(item.Date)}</td>
                            <td className='px-6 py-2'>{item.Quantity}</td>
                            <td className='px-6 py-2'>{formatCurrency(item.Revenue)}</td>
                            <td className='px-6 py-2'>{item.FileAlias}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderPagination = () => {

        const totalPages = Math.ceil(responseList.length / recordsPerPage);

        return (
            totalPages > 0 &&
            (<div className='flex w-96 border justify-between'>
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handlePaginate(currentPage - 1, totalPages)}>
                    &lt; Anterior
                </button>
                <h2 className='mx-2'>
                    {currentPage} de {totalPages}
                </h2>
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => handlePaginate(currentPage + 1, totalPages)}>
                    Próximo &gt;
                </button>
            </div>)

        );
    };

    const handlePaginate = (currentPage: number, totalPages: number) => {

        if (currentPage < 1 || currentPage > totalPages) return;

        setCurrentPage(currentPage);
    };

    return (
        <div className='w-full'>
            <div className='flex items-center justify-center border'>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-6 mb-6 md:grid-cols-8'>
                        <div>
                            <label htmlFor="ClientCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Código Cliente:</label>
                            <input type="text" id="ClientCode" name='ClientCode' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.ClientCode} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="ProductCategory" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria do Produto:</label>
                            <input type="text" id="ProductCategory" name='ProductCategory' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.ProductCategory} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="InitialDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data Inicial:</label>
                            <input type="date" id="InitialDate" name='InitialDate' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.InitialDate} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="EndDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Data Final:</label>
                            <input type="date" id="EndDate" name='EndDate' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.EndDate} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="ProductSku" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sku/Produto:</label>
                            <input type="text" id="ProductSku" name='ProductSku' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.ProductSku} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="Quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantidade:</label>
                            <input type="text" id="Quantity" name='Quantity' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.Quantity} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="Revenue" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor de Faturamento:</label>
                            <input type="text" id="Revenue" name='Revenue' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.Revenue} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="FileAlias" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Planilha:</label>
                            <ComboInput apiUrl={API_URL + "FilterFileData/GetFiles"} onChange={handleComboInputChange} />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <button type="submit" disabled={loadData} className="flex disabled:cursor-not-allowed text-white bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            {
                                loadData ?
                                    <>
                                        <svg aria-hidden="true" className="mr-3 w-5 h-5 text-gray-200 animate-spin fill-gray-50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>  Gerando Resultados... </>
                                    : "Buscar"
                            }
                        </button>
                    </div>
                </form>
            </div>
            <div className='flex h-full items-center justify-center border-t'>
                {renderTable()}
            </div>
            <div className='flex justify-center items-center'>
                {renderPagination()}
            </div>
        </div>
    );
};

export default DataForm;
