import { useState } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { motion, AnimatePresence } from "framer-motion"

import {
  Plus,
  FileSpreadsheet,
  Trash2,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Home,
  FileText,
  Settings,
  Search,
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
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [rekapreports, setrekapreports] = useState([])
  const [laporanExpanded, setLaporanExpanded] = useState(false)

  const openReportFromSidebar = (index) => {
    setActiveReport(index)                 // Set laporan aktif
    setExpandedRows((prev) => ({ ...prev, [index]: true }))  // Expand form laporan
    setActivePage("laporan")               // Pindah ke halaman laporan jika belum di halaman itu
  }
  
  // Import banyak file excel untuk rekap gabungan langsung jadi Excel baru
  const importMultipleExcel = async (files) => {
    const allData = []
    for (let file of files) {
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(await file.arrayBuffer())
      const worksheet = workbook.worksheets[0]

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return // skip header
        allData.push({
          nama: row.getCell(1).value || "",
          tanggal: row.getCell(2).value || "",
          site: row.getCell(3).value || "",
          agenda: row.getCell(4).value || "",
          pekerjaan: row.getCell(5).value || "",
          plan: row.getCell(6).value || "",
          aktual: row.getCell(7).value || "",
          status: row.getCell(8).value || "",
          evidence: row.getCell(9).value
            ? { name: row.getCell(9).value.toString(), url: "#" }
            : null,
        })
      })
    }

    // Buat Excel baru hasil rekap gabungan
    const newWorkbook = new ExcelJS.Workbook()
    const newWorksheet = newWorkbook.addWorksheet("Rekap Gabungan")

    newWorksheet.addRow([
      "Nama","Tanggal","Site","Agenda","Pekerjaan","Plan","Aktual","Status","Evidence"
    ])

    allData.forEach((r) => {
      newWorksheet.addRow([
        r.nama, r.tanggal, r.site, r.agenda,
        r.pekerjaan, r.plan, r.aktual, r.status,
        r.evidence ? r.evidence.name : "",
      ])
    })

    // Styling header
    newWorksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } }
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
    })

    // Lebar kolom
    newWorksheet.columns = [
      { width: 25 }, { width: 15 }, { width: 20 }, { width: 25 },
      { width: 30 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 40 }
    ]

    // Export hasil langsung jadi file baru
    const buf = await newWorkbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), "Rekap-Gabungan.xlsx")
  }

  const chartData = [
    { name: "Done", value: reports.filter((r) => r.status === "Done").length },
    { name: "Progress", value: reports.filter((r) => r.status === "Progress").length },
    { name: "Pending", value: reports.filter((r) => r.status === "Pending").length },
  ]
  const COLORS = ["#4ade80", "#facc15", "#f87171"]
  const totalReports = reports.length
  const filledReports = reports.filter((r) => r.status !== "").length
  const reportPercentage =
    totalReports === 0 ? 0 : Math.round((filledReports / totalReports) * 100)

  const handleChange = (index, field, value) => {
    const newReports = [...reports]
    newReports[index][field] = value
    setReports(newReports)
  }

  const handleFileChange = async (index, file) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:4000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        const newReports = [...reports];
        newReports[index].evidence = { name: data.name, url: data.url };
        setReports(newReports);
      } catch (error) {
        console.error("Upload gagal:", error);
      }
    }
  };
  const handleDrop = (index, e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(index, file)
  }

  const addRow = () => {
    setReports([
      ...reports,
      {
        nama: "",
        tanggal: "",
        site: "",
        agenda: "",
        pekerjaan: "",
        plan: "",
        aktual: "",
        status: "",
        evidence: null,
      },
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

  // Import Excel Rekap
  const importFromExcel = async (file) => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(await file.arrayBuffer())
    const worksheet = workbook.worksheets[0]

    const newData = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      newData.push({
        nama: row.getCell(1).value || "",
        tanggal: row.getCell(2).value || "",
        site: row.getCell(3).value || "",
        agenda: row.getCell(4).value || "",
        pekerjaan: row.getCell(5).value || "",
        plan: row.getCell(6).value || "",
        aktual: row.getCell(7).value || "",
        status: row.getCell(8).value || "",
        evidence: row.getCell(9).value
          ? {
              name: row.getCell(9).text || row.getCell(9).value.toString(),
              url: row.getCell(9).hyperlink || "#",
            }
          : null,
      })
    })

    setReports([...reports, ...newData])
  }

  // Export hasil Rekap Gabungan
  const exportRekapExcel = async () => {
    if (rekapreports.length === 0) {
      alert("Belum ada data rekap. Upload beberapa file excel terlebih dahulu.")
      return
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Rekap Gabungan")

    worksheet.addRow([
      "Nama","Tanggal","Site","Agenda","Pekerjaan","Plan","Aktual","Status","Evidence"
    ])

    rekapreports.forEach((r) => {
      worksheet.addRow([
        r.nama, r.tanggal, r.site, r.agenda,
        r.pekerjaan, r.plan, r.aktual, r.status,
        r.evidence ? r.evidence.name : "",
      ])
    })

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), "Hasil-Rekap-Laporan.xlsx")
  }

  // Export Rekap Excel (filter tanggal)
  const exportFilteredExcel = async () => {
    if (!startDate || !endDate) {
      alert("Pilih rentang tanggal terlebih dahulu")
      return
    }

    const filtered = reports.filter(
      (r) => r.tanggal >= startDate && r.tanggal <= endDate
    )

    if (filtered.length === 0) {
      alert("Tidak ada laporan pada rentang tanggal tersebut")
      return
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Rekap")

    worksheet.addRow([
      "Nama","Tanggal","Site","Agenda","Pekerjaan","Plan","Aktual","Status","Evidence",
    ])

    filtered.forEach((r) => {
      const row = worksheet.addRow([
        r.nama, r.tanggal, r.site, r.agenda,
        r.pekerjaan, r.plan, r.aktual, r.status,
        r.evidence ? r.evidence.name : "",
      ])
      if (r.evidence) {
        const cell = row.getCell(10)
        cell.value = { text: r.evidence.name, hyperlink: r.evidence.url }
        cell.font = { color: { argb: "FF0000FF" }, underline: true }
      }
    })

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), `Rekap-Laporan-${startDate}-sd-${endDate}.xlsx`)
  }

  // Export Excel biasa
  const exportToExcel = async () => {
    for (let r of reports) {
      if (!r.nama || !r.tanggal || !r.agenda || !r.pekerjaan || !r.status || !r.site) {
        alert("Semua kolom harus diisi sebelum export ke Excel")
        return
      }
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Laporan")
    worksheet.addRow([
      "Nama","Tanggal","Site","Agenda","Pekerjaan","Plan","Aktual","Status","Evidence",
    ])

    reports.forEach((r) => {
      const row = worksheet.addRow([
        r.nama, r.tanggal, r.site, r.agenda,
        r.pekerjaan, r.plan, r.aktual, r.status,
        r.evidence ? r.evidence.name : "",
      ])
      if (r.evidence) {
        const cell = row.getCell(9)
        cell.value = { text: r.evidence.name, hyperlink: r.evidence.url }
        cell.font = { color: { argb: "FF0000FF" }, underline: true }
      }
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })
    })

    worksheet.columns = [
      { width: 30 },{ width: 20 },{ width: 20 },
      { width: 25 },{ width: 30 },{ width: 20 },
      { width: 20 },{ width: 15 },{ width: 40 },
    ]

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), "Laporan Harian CV Rangga.xlsx")
  }

  const filteredReports = reports.filter((r) =>
    r.nama.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`${darkMode ? "dark" : ""} transition-colors duration-500`}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col md:flex-row transition-colors duration-500">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white p-6 shadow-xl rounded-tr-3xl rounded-br-3xl backdrop-blur-md bg-opacity-90 transition-colors duration-500">
          <h2 className="text-2xl font-extrabold mb-10 leading-snug tracking-wide">
            ALL TEAM <br />
            <span className="text-sm font-medium opacity-90">Laporan Harian CV RANGGA</span>
          </h2>
          <ul className="space-y-3">
            <li
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20 ${
                activePage === "dashboard" ? "bg-white/30 font-bold" : ""
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              <Home size={18} /> Dashboard
            </li>

            {/* Laporan dengan Expand/Collapse */}
            <li>
              <div
                className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20 ${
                  activePage === "laporan" ? "bg-white/30 font-bold" : ""
                }`}
                onClick={() => {
                  setActivePage("laporan")
                  setLaporanExpanded(!laporanExpanded)
                }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} /> Laporan
                </div>
                {laporanExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </div>
              {/* Submenu laporan */}
              <AnimatePresence>
                {laporanExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2 pl-6"
                  >
                  {reports.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400 italic"
                    >
                      Belum ada laporan
                    </motion.p>
                  ) : (
                    <>
                      {reports.map((r, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="text-sm dark:text-gray-200 cursor-pointer"
                          onClick={() => openReportFromSidebar(index)}
                        >
                          • {r.nama || `Laporan ${index + 1}`}{" "}
                          <span className="text-sm dark:text-gray-200">
                            ({r.tanggal || "Belum ada tanggal"})
                          </span>
                        </motion.p>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </li>

            <li
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/20 ${
                activePage === "pengaturan" ? "bg-white/30 font-bold" : ""
              }`}
              onClick={() => setActivePage("pengaturan")}
            >
              <Settings size={18} /> Pengaturan
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 transition-colors duration-500">
          
          {/* Navbar */}
          <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 shadow rounded-2xl px-6 py-3 flex-wrap gap-4 transition-colors duration-500">
            <h1 className="text-xl font-bold capitalize tracking-wide flex items-center gap-2">
              {activePage === "dashboard" && (
                <Home className="w-5 h-5 text-black dark:text-white opacity-60" />
              )}
              {activePage === "laporan" && (
                <FileText className="w-5 h-5 text-black dark:text-white opacity-60" />
              )}
              {activePage === "pengaturan" && (
                <Settings className="w-5 h-5 text-black dark:text-white opacity-60" />
              )}
              {activePage}
            </h1>
            <div className="flex gap-3 flex-wrap items-center">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                            text-gray-400 dark:text-gray-300 opacity-50 pointer-events-none"
                />
            <input
                type="text"
                placeholder="Cari nama laporan..."
                className="pl-10 pr-4 py-2 border rounded-lg w-56
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-white
                          focus:ring-2 focus:ring-purple-400
                          transition-colors duration-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform shadow"
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
                Persentase laporan yang telah dibuat:{" "}
                <span className="font-bold">{reportPercentage}%</span>
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

          {/* Laporan */}
          {activePage === "laporan" && (
            <>
            {/* Form Laporan */}
            <div className="flex flex-wrap gap-4 mb-4">

              <button
                onClick={addRow}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
              >
                <Plus size={18} /> Tambah Laporan
              </button>

              {/* Export Excel */}
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow"
              >
                <FileSpreadsheet size={18} /> Export Excel
              </button>

              {/* Import Excel Rekap */}
              <label className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg cursor-pointer hover:bg-yellow-600 shadow">
                <FileSpreadsheet size={18} /> Import Excel
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) =>
                    e.target.files[0] && importFromExcel(e.target.files[0])
                  }
                  className="hidden"
                />
              </label>

              {/* Import Banyak Excel */}
              <label className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 shadow">
                <FileSpreadsheet size={18}/> Bikin Rekap Excel
                <input
                  type="file"
                  accept=".xlsx"
                  multiple
                  onChange={(e) => e.target.files.length > 0 && importMultipleExcel(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
              {/* Daftar laporan */}
              {filteredReports.map((r, index) => (
                <div
                  key={index}
                  className="mb-4 border rounded-2xl dark:border-gray-700 bg-transparent shadow-lg transition-all duration-500"
                >
                  {/* Header: nama laporan + tombol expand & hapus */}
                  <div className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 rounded-2xl transition-all duration-500">
                    {/* Nama laporan (klik untuk expand) */}
                    <span
                      className="cursor-pointer flex-1 font-semibold"
                      onClick={() => toggleRow(index)}
                    >
                      {r.nama || `Laporan ${index + 1}`}
                    </span>

                    {/* Tombol kanan (expand + hapus) */}
                    <div className="flex items-center gap-2">
                      {/* Expand/Collapse */}
                      <button
                        onClick={() => toggleRow(index)}
                        className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full transition"
                        aria-label={`toggle-laporan-${index}`}
                      >
                        {expandedRows[index] ? <ChevronUp /> : <ChevronDown />}
                      </button>
                      {/* Tombol Hapus */}
                      <button
                        onClick={() => deleteRow(index)}
                        className="p-2 bg-transparent text-red-500 rounded-full hover:text-red-600 transition"
                        aria-label={`hapus-laporan-${index}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable content (form laporan) - berada DI DALAM parent div */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      expandedRows[index] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                  <div className="p-4 grid grid-cols-2 gap-6" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(index, e)}>
                  <div>
                    <label className="block mb-1">Nama</label>
                    <input
                      type="text"
                      value={r.nama}
                      onChange={(e) => handleChange(index, "nama", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    />

                    <label className="block mt-3 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={r.tanggal}
                      onChange={(e) => handleChange(index, "tanggal", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    />

                    <label className="block mt-3 mb-1">Site</label>
                    <select
                      value={r.site}
                      onChange={(e) => handleChange(index, "site", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    >
                      <option value="">Pilih Site</option>
                      <option value="BMO I">BMO I</option>
                      <option value="BMO II">BMO II</option>
                      <option value="BMO III">BMO III</option>
                      <option value="PMO">PMO</option>
                      <option value="GMO">GMO</option>
                      <option value="LMO">LMO</option>
                      <option value="SMO">SMO</option>
                      <option value="Office KDC">Office KDC</option>
                      <option value="HO">HO</option>
                      <option value="Mess CV. Rangga">Mess CV. Rangga</option>
                      <option value="Area Tanjung">Area Tanjung</option>
                      <option value="Mess Pama">Mess Pama</option>
                    </select>

                    <label className="block mt-3 mb-1">Agenda</label>
                    <input
                      type="text"
                      value={r.agenda}
                      onChange={(e) => handleChange(index, "agenda", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    />

                    {/* Evidence pindah ke kiri */}
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
                  </div>

                  {/* Kolom kanan */}
                  <div>
                    {/* Pekerjaan pindah ke kanan */}
                    <label className="block mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      value={r.pekerjaan}
                      onChange={(e) => handleChange(index, "pekerjaan", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    />

                    <label className="block mt-3 mb-1">Plan</label>
                    <input
                      type="text"
                      value={r.plan}
                      onChange={(e) => handleChange(index, "plan", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    />

                    <label className="block mt-3 mb-1">Aktual</label>
                    <input
                      type="text"
                      value={r.aktual}
                      onChange={(e) => handleChange(index, "aktual", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    />

                    <label className="block mt-3 mb-1">Status</label>
                    <select
                      value={r.status}
                      onChange={(e) => handleChange(index, "status", e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                    >
                      <option value="">Pilih</option>
                      <option value="Done">Done</option>
                      <option value="Progress">Progress</option>
                      <option value="Pending">Pending</option>
                    </select>
                    </div>
                  </div>
                </div>
              </div>
              ))}
              {rekapreports.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold mb-3">📊 Hasil Rekap Gabungan</h2>
                  <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 dark:bg-gray-700 text-sm uppercase">
                      <tr>
                        {["Nama","Tanggal","Site","Agenda","Pekerjaan","Plan","Aktual","Status","Evidence"].map((h,i)=>(
                          <th key={i} className="px-4 py-3 text-center">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rekapreports.map((r,index)=>(
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                          <td className="px-4 py-2">{r.nama}</td>
                          <td className="px-4 py-2">{r.tanggal}</td>
                          <td className="px-4 py-2">{r.site}</td>
                          <td className="px-4 py-2">{r.agenda}</td>
                          <td className="px-4 py-2">{r.pekerjaan}</td>
                          <td className="px-4 py-2">{r.plan}</td>
                          <td className="px-4 py-2">{r.aktual}</td>
                          <td className="px-4 py-2">{r.status}</td>
                          <td className="px-4 py-2">{r.evidence?.name || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={exportRekapExcel}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
                  >
                    <FileSpreadsheet size={18}/> Export Hasil Rekap
                  </button>
                </div>
              )}
              {/* Detail Laporan */}
              {activeReport !== null && reports[activeReport] && (
                <div className="mb-4 border rounded-2xl dark:border-gray-700 bg-transparent shadow-lg transition-all duration-500">
                  {/* Header */}
                  <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="flex justify-between items-center w-full p-4 bg-gray-200 dark:bg-gray-800 rounded-t-2xl font-semibold transition"
                  >
                    <span>📄 Detail Laporan</span>
                    {showDetail ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {/* Isi */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      showDetail ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 grid grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-1">Nama</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].nama || "Belum diisi"}
                        </p>

                        <label className="block mt-3 mb-1">Tanggal</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].tanggal || "Belum diisi"}
                        </p>

                        <label className="block mt-3 mb-1">Site</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].site || "Belum diisi"}
                        </p>

                        <label className="block mt-3 mb-1">Agenda</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].agenda || "Belum diisi"}
                        </p>

                        <label className="block mt-3 mb-1">Evidence</label>
                        {reports[activeReport].evidence ? (
                          <a
                            href={reports[activeReport].evidence.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block w-full p-2 border rounded bg-blue-500 text-white hover:bg-blue-600 text-center"
                          >
                            {reports[activeReport].evidence.name}
                          </a>
                        ) : (
                          <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                            Belum diisi
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-1">Pekerjaan</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].pekerjaan || "Belum diisi"}
                        </p>

                        <label className="block mt-3 mb-1">Plan</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].plan || "Belum diisi"}
                        </p>

                        <label className="block mt-3 mb-1">Aktual</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].aktual || "Belum diisi"}
                        </p>

                        <label className="block mt-3 mb-1">Status</label>
                        <p className="w-full p-2 border rounded bg-white dark:bg-gray-800">
                          {reports[activeReport].status || "Belum diisi"}
                        </p>
                      </div>
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
