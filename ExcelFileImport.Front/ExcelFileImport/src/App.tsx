import React from 'react';
import ExcelImport from '../ExcelImport/ExcelImport';
import DataForm from '../ExcelImport/FilterData';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav className='bg-white border-gray-200 dark:bg-gray-900'>
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Importador de Excel</span>
            </Link>            
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link to="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Importar</Link>
                </li>
                <li>
                  <Link to="/data-form" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Filtrar Dados</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<ExcelImport />} />
          <Route path="/data-form" element={<DataForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;