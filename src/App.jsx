import { useState } from "react";
import logo from "./assets/LOGO_CVR-removebg-preview.png";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const reports = [
    {
      id: 1,
      title: "Pengamanan Pemilu 2022",
      status: "DITERIMA",
      date: "25 Mei 2022",
      category: "Sosial",
      desc: "Pengamanan dalam proses pemilu 2022"
    },
    {
      id: 2,
      title: "Vaksin Covid",
      status: "PENDING",
      date: "30 Mei 2022",
      category: "Sosial",
      desc: "Vaksinasi di Kabupaten Palembang Sukarame"
    }
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4">
          <div className="flex items-center space-x-2 mb-8">
            <img src={logo} alt="Logo" className="h-12" />
            <h1 className="text-lg font-bold dark:text-white">
              Laporan DMS
            </h1>
          </div>
          <nav className="space-y-4">
            <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Dashboard
            </a>
            <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Laporan
            </a>
            <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Anggota
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Laporan Kegiatan</h2>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold dark:text-white">
                    {report.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      report.status === "DITERIMA"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{report.desc}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {report.date}, {report.category}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
