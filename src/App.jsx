import { useState } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { Plus, FileSpreadsheet, Trash2, Moon, Sun } from "lucide-react"

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [reports, setReports] = useState([])
  const [activeReport, setActiveReport] = useState(null) // laporan yang sedang dibuka

  // Handle perubahan input teks
  const handleChange = (index, field, value) => {
    const newReports = [...reports]
    newReports[index][field] = value
    setReports(newReports)
  }

  // Handle upload file
  const handleFileChange = (index, file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file)
      const newReports = [...reports]
      newReports[index].evidence = { name: file.name, url: fileURL }
      setReports(newReports)
    }
  }

  // Tambah baris baru
  const addRow = () => {
    setReports([
      ...reports,
      {
        nama: "",
        tanggal: "",
        agenda: "",
        pekerjaan: "",
        plan: "",
        aktual: "",
        status: "",
        evidence: null
      }
    ])
  }

  // Hapus baris
  const deleteRow = (index) => {
    const newReports = [...reports]
    newReports.splice(index, 1)
    setReports(newReports)
    if (activeReport === index) setActiveReport(null) // reset detail kalau laporan dihapus
  }

  // Export Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Laporan")

    worksheet.addRow([
      "Nama", "Tanggal", "Agenda", "Pekerjaan",
      "Plan", "Aktual", "Status", "Evidence"
    ])

    reports.forEach((r) => {
      const row = worksheet.addRow([
        r.nama, r.tanggal, r.agenda, r.pekerjaan,
        r.plan, r.aktual, r.status,
        r.evidence ? r.evidence.name : ""
      ])
      if (r.evidence) {
        const cell = row.getCell(8)
        cell.value = { text: r.evidence.name, hyperlink: r.evidence.url }
        cell.font = { color: { argb: "FF0000FF" }, underline: true }
      }
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } }
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
    })

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" }
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
      })
    })

    worksheet.columns = [
      { width: 30 }, { width: 20 }, { width: 25 }, { width: 30 },
      { width: 20 }, { width: 20 }, { width: 15 }, { width: 40 }
    ]

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), "Laporan Harian CV Rangga.xlsx")
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-blue-700 to-blue-500 dark:from-gray-800 dark:to-gray-800 text-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-8 leading-snug">
            ALL TEAM <br />
            <span className="text-sm font-medium">Laporan Harian CV RANGGA</span>
          </h2>
          <ul className="space-y-4">
            <li className="cursor-pointer hover:text-yellow-300">🏠 Dashboard</li>

            {/* Laporan list */}
            <li>
              <div className="cursor-pointer hover:text-yellow-300 mb-2">📝 Laporan</div>
              <ul className="ml-4 space-y-1 text-sm">
                {reports.length === 0 ? (
                  <li className="text-gray-300 italic">Belum ada laporan</li>
                ) : (
                  reports.map((r, i) => (
                    <li
                      key={i}
                      onClick={() => setActiveReport(i)}
                      className={`truncate cursor-pointer hover:text-yellow-300 ${
                        activeReport === i ? "font-bold text-yellow-300" : ""
                      }`}
                    >
                      📄 {r.nama || `Laporan ${i + 1}`}
                    </li>
                  ))
                )}
              </ul>
            </li>

            <li className="cursor-pointer hover:text-yellow-300">⚙️ Pengaturan</li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Navbar */}
          <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 shadow rounded-lg px-6 py-3">
            <h1 className="text-xl font-semibold">📌 Laporan Harian / Mingguan / Bulanan</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
            >
              {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={addRow}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
              >
                <Plus size={18}/> Tambah Laporan
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow"
              >
                <FileSpreadsheet size={18}/> Export Excel
              </button>
            </div>

            <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-700 text-sm uppercase tracking-wide">
                <tr>
                  {["Nama","Tanggal","Agenda","Pekerjaan","Plan","Aktual","Status","Evidence","Aksi"].map((h,i)=>(
                    <th key={i} className="px-4 py-3 text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r,index)=>(
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                    <td className="px-4 py-2">
                      <input 
                        type="text"
                        value={r.nama}
                        onChange={(e)=>handleChange(index,"nama",e.target.value)}
                        className="w-56 p-2 border rounded bg-gray-50 text-gray-900
                                   dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="date"
                        value={r.tanggal}
                        onChange={(e)=>handleChange(index,"tanggal",e.target.value)}
                        className="w-44 p-2 border rounded bg-gray-50 text-gray-900
                                   dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text"
                        value={r.agenda}
                        onChange={(e)=>handleChange(index,"agenda",e.target.value)}
                        className="w-56 p-2 border rounded bg-gray-50 text-gray-900
                                   dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text"
                        value={r.pekerjaan}
                        onChange={(e)=>handleChange(index,"pekerjaan",e.target.value)}
                        className="w-72 p-2 border rounded bg-gray-50 text-gray-900
                                   dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text"
                        value={r.plan}
                        onChange={(e)=>handleChange(index,"plan",e.target.value)}
                        className="w-44 p-2 border rounded bg-gray-50 text-gray-900
                                   dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text"
                        value={r.aktual}
                        onChange={(e)=>handleChange(index,"aktual",e.target.value)}
                        className="w-44 p-2 border rounded bg-gray-50 text-gray-900
                                   dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select 
                        value={r.status}
                        onChange={(e)=>handleChange(index,"status",e.target.value)}
                        className="w-36 p-2 border rounded bg-gray-50 text-gray-900
                                   dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Pilih</option>
                        <option value="Done">Done</option>
                        <option value="Progress">Progress</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      {/* Custom file input */}
                      <label className="block w-56 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded cursor-pointer
                                        dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        Pilih File
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                          onChange={(e)=>handleFileChange(index, e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                      {r.evidence && (
                        <a
                          href={r.evidence.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:underline block mt-1"
                        >
                          {r.evidence.name}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button 
                        onClick={()=>deleteRow(index)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail laporan */}
          {activeReport !== null && reports[activeReport] && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
              <h2 className="text-lg font-semibold mb-3">📄 Detail Laporan</h2>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(reports[activeReport], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
