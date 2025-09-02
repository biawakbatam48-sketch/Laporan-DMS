import { useState } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import {
  Plus,
  FileSpreadsheet,
  Trash2,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [reports, setReports] = useState([])
  const [activeReport, setActiveReport] = useState(null)
  const [activePage, setActivePage] = useState("dashboard")
  const [showForm, setShowForm] = useState(true)
  const [showDetail, setShowDetail] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState({})

  const chartData = [
    { name: "Done", value: reports.filter((r) => r.status === "Done").length },
    { name: "Progress", value: reports.filter((r) => r.status === "Progress").length },
    { name: "Pending", value: reports.filter((r) => r.status === "Pending").length },
  ]
  const COLORS = ["#4ade80", "#facc15", "#f87171"]
  const totalReports = reports.length
  const filledReports = reports.filter((r) => r.status !== "").length
  const reportPercentage = totalReports === 0 ? 0 : Math.round((filledReports / totalReports) * 100)

  const handleChange = (index, field, value) => {
    const newReports = [...reports]
    newReports[index][field] = value
    setReports(newReports)
  }

  const handleFileChange = (index, file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file)
      const newReports = [...reports]
      newReports[index].evidence = { name: file.name, url: fileURL }
      setReports(newReports)
    }
  }

  const handleDrop = (index, e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(index, file)
  }

  const addRow = () => {
    setReports([
      ...reports,
      { nama: "", tanggal: "", agenda: "", pekerjaan: "", plan: "", aktual: "", status: "", evidence: null },
    ])
  }

  const deleteRow = (index) => {
    const newReports = [...reports]
    newReports.splice(index, 1)
    setReports(newReports)
    if (activeReport === index) setActiveReport(null)
    setExpandedRows((prev) => {
      const newExpanded = { ...prev }
      delete newExpanded[index]
      return newExpanded
    })
  }

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const exportToExcel = async () => {
    for (let r of reports) {
      if (!r.nama || !r.tanggal || !r.agenda || !r.pekerjaan || !r.status) {
        alert("Semua field wajib diisi sebelum export Excel!")
        return
      }
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Laporan")
    worksheet.addRow(["Nama", "Tanggal", "Agenda", "Pekerjaan", "Plan", "Aktual", "Status", "Evidence"])

    reports.forEach((r) => {
      const row = worksheet.addRow([r.nama, r.tanggal, r.agenda, r.pekerjaan, r.plan, r.aktual, r.status, r.evidence ? r.evidence.name : ""])
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
      { width: 20 }, { width: 20 }, { width: 15 }, { width: 40 },
    ]

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), "Laporan Harian CV Rangga.xlsx")
  }

  const filteredReports = reports.filter((r) => r.nama.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className={`${darkMode ? "dark" : ""} transition-colors duration-500`}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col md:flex-row transition-colors duration-500">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white p-6 shadow-lg rounded-tr-3xl rounded-br-3xl transition-colors duration-500">
          <h2 className="text-2xl font-bold mb-8 leading-snug text-white">
            ALL TEAM <br />
            <span className="text-sm font-medium">Laporan Harian CV RANGGA</span>
          </h2>
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
                    filteredReports.map((r, i) => (
                      <li
                        key={i}
                        onClick={() => setActiveReport(i)}
                        className={`truncate cursor-pointer hover:text-yellow-300 ${activeReport === i ? "font-bold text-yellow-300" : ""}`}
                        title={r.nama}
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
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 transition-colors duration-500">
          {/* Navbar */}
          <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 shadow rounded-lg px-6 py-3 flex-wrap gap-4 transition-colors duration-500">
            <h1 className="text-xl font-semibold capitalize">📌 {activePage}</h1>
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="🔍 Search nama"
                className="px-3 py-2 border rounded w-48 dark:bg-gray-700 dark:text-white transition-colors duration-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Dashboard */}
          {activePage === "dashboard" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-500">
              <h2 className="text-lg font-semibold mb-3">📊 Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Selamat datang di sistem laporan. Silakan pilih menu di sidebar.
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-4 font-medium">
                Persentase laporan yang telah dibuat: <span className="font-bold">{reportPercentage}%</span>
              </p>
              <div className="w-full h-64 transition-colors duration-500">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Laporan Form */}
          {activePage === "laporan" && (
            <>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 transition-colors duration-500">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex justify-between items-center w-full px-4 py-3 font-semibold border-b dark:border-gray-700 transition-colors duration-500"
                >
                  <span>📝 Form Laporan</span>
                  {showForm ? <ChevronUp /> : <ChevronDown />}
                </button>
                <div
                  className={`overflow-hidden transition-[max-height] duration-500`}
                  style={{ maxHeight: showForm ? "2000px" : "0px" }}
                >
                  <div className="p-4">
                    <div className="flex flex-wrap gap-4 mb-4">
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

                    {filteredReports.map((r, index) => (
                      <div key={index} className="mb-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-500">
                        {/* Header */}
                        <div
                          className="flex justify-between items-center p-4 cursor-pointer bg-gray-200 dark:bg-gray-800 transition-colors duration-500"
                          onClick={() => toggleRow(index)}
                        >
                          <span>{r.nama || `Laporan ${index + 1}`}</span>
                          {expandedRows[index] ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {/* Expandable Form */}
                        <div
                          className={`overflow-hidden transition-[max-height] duration-500`}
                          style={{ maxHeight: expandedRows[index] ? "1000px" : "0px" }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(index, e)}
                        >
                          <div className="p-4 grid grid-cols-2 gap-6">
                            <div>
                              <label className="block mb-1">Nama</label>
                              <input
                                type="text"
                                value={r.nama}
                                onChange={(e) => handleChange(index, "nama", e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-800 transition-colors duration-500"
                              />
                              <label className="block mt-3 mb-1">Tanggal</label>
                              <input
                                type="date"
                                value={r.tanggal}
                                onChange={(e) => handleChange(index, "tanggal", e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-800 transition-colors duration-500"
                              />
                              <label className="block mt-3 mb-1">Agenda</label>
                              <input
                                type="text"
                                value={r.agenda}
                                onChange={(e) => handleChange(index, "agenda", e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-800 transition-colors duration-500"
                              />
                              <label className="block mt-3 mb-1">Pekerjaan</label>
                              <input
                                type="text"
                                value={r.pekerjaan}
                                onChange={(e) => handleChange(index, "pekerjaan", e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-800 transition-colors duration-500"
                              />
                            </div>

                            <div>
                              <label className="block mb-1">Plan</label>
                              <input
                                type="text"
                                value={r.plan}
                                onChange={(e) => handleChange(index, "plan", e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-800 transition-colors duration-500"
                              />
                              <label className="block mt-3 mb-1">Aktual</label>
                              <input
                                type="text"
                                value={r.aktual}
                                onChange={(e) => handleChange(index, "aktual", e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-800 transition-colors duration-500"
                              />
                              <label className="block mt-3 mb-1">Status</label>
                              <select
                                value={r.status}
                                onChange={(e) => handleChange(index, "status", e.target.value)}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-800 transition-colors duration-500"
                              >
                                <option value="">Pilih</option>
                                <option value="Done">Done</option>
                                <option value="Progress">Progress</option>
                                <option value="Pending">Pending</option>
                              </select>

                              <label className="block mt-3 mb-1">Evidence</label>
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow flex items-center gap-2 transition">
                                  <FileSpreadsheet size={16} /> Upload File
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                                    className="hidden"
                                  />
                                </label>
                                {r.evidence && (
                                  <a
                                    href={r.evidence.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 hover:underline truncate max-w-[200px]"
                                    title={r.evidence.name}
                                  >
                                    {r.evidence.name}
                                  </a>
                                )}
                              </div>

                              <div className="text-right mt-2">
                                <button
                                  onClick={() => deleteRow(index)}
                                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detail Laporan */}
              {activeReport !== null && reports[activeReport] && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-500">
                  <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="flex justify-between items-center w-full px-4 py-3 font-semibold border-b dark:border-gray-700 transition-colors duration-500"
                  >
                    <span>📄 Detail Laporan</span>
                    {showDetail ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-500`}
                    style={{ maxHeight: showDetail ? "1000px" : "0px" }}
                  >
                    <div className="p-5 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-500">
                      {[
                        { label: "Nama", value: reports[activeReport].nama },
                        { label: "Tanggal", value: reports[activeReport].tanggal },
                        { label: "Agenda", value: reports[activeReport].agenda },
                        { label: "Pekerjaan", value: reports[activeReport].pekerjaan },
                        { label: "Plan", value: reports[activeReport].plan },
                        { label: "Aktual", value: reports[activeReport].aktual },
                        { label: "Status", value: reports[activeReport].status },
                        { label: "Evidence", value: reports[activeReport].evidence ? reports[activeReport].evidence.name : "-" },
                      ].map((item, i) => (
                        <div key={i} className="py-2 flex justify-between">
                          <span className="font-medium">{item.label}</span>
                          {item.label === "Evidence" && reports[activeReport].evidence ? (
                            <a
                              href={reports[activeReport].evidence.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {reports[activeReport].evidence.name}
                            </a>
                          ) : (
                            <span>{item.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
