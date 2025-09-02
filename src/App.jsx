import { useState } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { Plus, FileSpreadsheet, Trash2, Moon, Sun } from "lucide-react"

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [reports, setReports] = useState([])
  const [activeReport, setActiveReport] = useState(null)
  const [activePage, setActivePage] = useState("dashboard") // halaman aktif

  // ➕ Tambah Laporan
  const addRow = () => {
    const newReport = { nama: "", tanggal: "", deskripsi: "" }
    setReports([...reports, newReport])
  }

  // 📝 Update isi laporan
  const handleInputChange = (index, field, value) => {
    const newReports = [...reports]
    newReports[index][field] = value
    setReports(newReports)
  }

  // ❌ Hapus laporan
  const deleteRow = (index) => {
    const newReports = reports.filter((_, i) => i !== index)
    setReports(newReports)
    if (activeReport === index) setActiveReport(null)
  }

  // 📤 Export ke Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Laporan")

    worksheet.columns = [
      { header: "Nama", key: "nama", width: 20 },
      { header: "Tanggal", key: "tanggal", width: 15 },
      { header: "Deskripsi", key: "deskripsi", width: 30 },
    ]

    reports.forEach((report) => worksheet.addRow(report))

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(blob, "laporan harian CV RANGGA.xlsx")
  }

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white min-h-screen" : "bg-gray-100 text-gray-900 min-h-screen"}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">📊 DMS Report</h2>
          <ul className="space-y-4">
            <li
              className={`cursor-pointer hover:text-yellow-300 ${activePage === "dashboard" ? "font-bold text-yellow-300" : ""}`}
              onClick={() => setActivePage("dashboard")}
            >
              🏠 Dashboard
            </li>

            <li>
              <div
                className={`cursor-pointer hover:text-yellow-300 mb-2 ${activePage === "laporan" ? "font-bold text-yellow-300" : ""}`}
                onClick={() => setActivePage("laporan")}
              >
                📝 Laporan
              </div>
              {activePage === "laporan" && (
                <ul className="ml-4 space-y-1 text-sm">
                  {reports.length === 0 ? (
                    <li className="text-gray-300 italic">Belum ada laporan</li>
                  ) : (
                    reports.map((r, i) => (
                      <li
                        key={i}
                        onClick={() => setActiveReport(i)}
                        className={`truncate cursor-pointer hover:text-yellow-300 ${activeReport === i ? "font-bold text-yellow-300" : ""}`}
                      >
                        📄 {r.nama || `Laporan ${i + 1}`}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>

            <li
              className={`cursor-pointer hover:text-yellow-300 ${activePage === "pengaturan" ? "font-bold text-yellow-300" : ""}`}
              onClick={() => setActivePage("pengaturan")}
            >
              ⚙️ Pengaturan
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Navbar */}
          <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 shadow rounded-lg px-6 py-3">
            <h1 className="text-xl font-semibold capitalize">📌 {activePage}</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Halaman Dashboard */}
          {activePage === "dashboard" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">📊 Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Selamat datang di sistem laporan. Silakan pilih menu di sidebar.
              </p>
            </div>
          )}

          {/* Halaman Laporan */}
          {activePage === "laporan" && (
            <>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={addRow}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
                  >
                    <Plus size={18} /> Tambah Laporan
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow"
                  >
                    <FileSpreadsheet size={18} /> Export Excel
                  </button>
                </div>

                {/* tabel laporan */}
                <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border px-4 py-2">Nama</th>
                      <th className="border px-4 py-2">Tanggal</th>
                      <th className="border px-4 py-2">Deskripsi</th>
                      <th className="border px-4 py-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report, index) => (
                      <tr key={index} className="text-center">
                        <td className="border px-2 py-1">
                          <input
                            type="text"
                            value={report.nama}
                            onChange={(e) => handleInputChange(index, "nama", e.target.value)}
                            className="w-full bg-transparent p-1 outline-none"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="date"
                            value={report.tanggal}
                            onChange={(e) => handleInputChange(index, "tanggal", e.target.value)}
                            className="w-full bg-transparent p-1 outline-none"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="text"
                            value={report.deskripsi}
                            onChange={(e) => handleInputChange(index, "deskripsi", e.target.value)}
                            className="w-full bg-transparent p-1 outline-none"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <button
                            onClick={() => deleteRow(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* detail laporan */}
              {activeReport !== null && reports[activeReport] && (
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                  <h2 className="text-lg font-semibold mb-3">📄 Detail Laporan</h2>
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(reports[activeReport], null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}

          {/* Halaman Pengaturan */}
          {activePage === "pengaturan" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">⚙️ Pengaturan</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fitur pengaturan akan ditambahkan di sini.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
