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

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [reports, setReports] = useState([])
  const [activeReport, setActiveReport] = useState(null)
  const [activePage, setActivePage] = useState("dashboard")
  const [showForm, setShowForm] = useState(true)
  const [showDetail, setShowDetail] = useState(true)
  const [user, setUser] = useState(null) // state untuk menyimpan data user

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
        evidence: null,
      },
    ])
  }

  const deleteRow = (index) => {
    const newReports = [...reports]
    newReports.splice(index, 1)
    setReports(newReports)
    if (activeReport === index) setActiveReport(null)
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Laporan")

    worksheet.addRow([
      "Nama",
      "Tanggal",
      "Agenda",
      "Pekerjaan",
      "Plan",
      "Aktual",
      "Status",
      "Evidence",
    ])

    reports.forEach((r) => {
      const row = worksheet.addRow([
        r.nama,
        r.tanggal,
        r.agenda,
        r.pekerjaan,
        r.plan,
        r.aktual,
        r.status,
        r.evidence ? r.evidence.name : "",
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
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      }
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
      { width: 30 },
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 40 },
    ]

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), "Laporan Harian CV Rangga.xlsx")
  }

  // Jika user belum login, tampilkan login/register
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-6">
          <Login supabase={supabase} onLogin={setUser} />
          <Register supabase={supabase} />
        </div>
      </div>
    )
  }

  // === Render konten utama seperti App.jsx Anda sebelumnya ===
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-blue-700 to-blue-500 dark:from-gray-800 dark:to-gray-800 text-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-8 leading-snug">
            ALL TEAM <br />
            <span className="text-sm font-medium">
              Laporan Harian CV RANGGA
            </span>
          </h2>
          <ul className="space-y-4">
            <li
              className={`cursor-pointer hover:text-yellow-300 ${
                activePage === "dashboard" ? "font-bold text-yellow-300" : ""
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              🏠 Dashboard
            </li>

            <li>
              <div
                className={`cursor-pointer hover:text-yellow-300 mb-2 ${
                  activePage === "laporan" ? "font-bold text-yellow-300" : ""
                }`}
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
                        className={`truncate cursor-pointer hover:text-yellow-300 ${
                          activeReport === i ? "font-bold text-yellow-300" : ""
                        }`}
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
              className={`cursor-pointer hover:text-yellow-300 ${
                activePage === "pengaturan" ? "font-bold text-yellow-300" : ""
              }`}
              onClick={() => setActivePage("pengaturan")}
            >
              ⚙️ Pengaturan
            </li>
            <li
              className="cursor-pointer hover:text-red-400 mt-4"
              onClick={async () => {
                await supabase.auth.signOut()
                setUser(null)
              }}
            >
              🔓 Logout
            </li>
          </ul>
        </aside>

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

          {/* Dashboard */}
          {activePage === "dashboard" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">📊 Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Selamat datang, {user.username}! Silakan pilih menu di sidebar.
              </p>
            </div>
          )}

          {/* Laporan */}
          {activePage === "laporan" && (
            <>
              {/* FORM input laporan */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex justify-between items-center w-full px-4 py-3 font-semibold border-b dark:border-gray-700"
                >
                  <span>📝 Form Laporan</span>
                  {showForm ? <ChevronUp /> : <ChevronDown />}
                </button>
                {showForm && (
                  <div className="p-4">
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

                    {/* Grid form laporan */}
                    {reports.map((r, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 gap-6 p-4 border rounded-lg mb-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                      >
                        {/* Kolom Kiri */}
                        <div>
                          <label className="block mb-1">Nama</label>
                          <input
                            type="text"
                            value={r.nama}
                            onChange={(e) =>
                              handleChange(index, "nama", e.target.value)
                            }
                            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                          />

                          <label className="block mt-3 mb-1">Tanggal</label>
                          <input
                            type="date"
                            value={r.tanggal}
                            onChange={(e) =>
                              handleChange(index, "tanggal", e.target.value)
                            }
                            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                          />

                          <label className="block mt-3 mb-1">Agenda</label>
                          <input
                            type="text"
                            value={r.agenda}
                            onChange={(e) =>
                              handleChange(index, "agenda", e.target.value)
                            }
                            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                          />

                          <label className="block mt-3 mb-1">Pekerjaan</label>
                          <input
                            type="text"
                            value={r.pekerjaan}
                            onChange={(e) =>
                              handleChange(index, "pekerjaan", e.target.value)
                            }
                            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                          />
                        </div>

                        {/* Kolom Kanan */}
                        <div>
                          <label className="block mb-1">Plan</label>
                          <input
                            type="text"
                            value={r.plan}
                            onChange={(e) =>
                              handleChange(index, "plan", e.target.value)
                            }
                            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                          />

                          <label className="block mt-3 mb-1">Aktual</label>
                          <input
                            type="text"
                            value={r.aktual}
                            onChange={(e) =>
                              handleChange(index, "aktual", e.target.value)
                            }
                            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                          />

                          <label className="block mt-3 mb-1">Status</label>
                          <select
                            value={r.status}
                            onChange={(e) =>
                              handleChange(index, "status", e.target.value)
                            }
                            className="w-full p-2 border rounded bg-white dark:bg-gray-800"
                          >
                            <option value="">Pilih</option>
                            <option value="Done">Done</option>
                            <option value="Progress">Progress</option>
                            <option value="Pending">Pending</option>
                          </select>

                          <label className="block mt-3 mb-1">Evidence</label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                            onChange={(e) =>
                              handleFileChange(index, e.target.files[0])
                            }
                            className="w-full text-sm"
                          />
                          {r.evidence && (
                            <a
                              href={r.evidence.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:underline block mt-1 truncate"
                              title={r.evidence.name}
                            >
                              {r.evidence.name}
                            </a>
                          )}
                        </div>

                        <div className="col-span-2 text-right">
                          <button
                            onClick={() => deleteRow(index)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail laporan */}
              {activeReport !== null && reports[activeReport] && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                  <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="flex justify-between items-center w-full px-4 py-3 font-semibold border-b dark:border-gray-700"
                  >
                    <span>📄 Detail Laporan</span>
                    {showDetail ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {showDetail && (
                    <div className="p-5 divide-y divide-gray-200 dark:divide-gray-700">
                      {[
                        { label: "Nama", value: reports[activeReport].nama },
                        { label: "Tanggal", value: reports[activeReport].tanggal },
                        { label: "Agenda", value: reports[activeReport].agenda },
                        { label: "Pekerjaan", value: reports[activeReport].pekerjaan },
                        { label: "Plan", value: reports[activeReport].plan },
                        { label: "Aktual", value: reports[activeReport].aktual },
                        { label: "Status", value: reports[activeReport].status },
                        {
                          label: "Evidence",
                          value: reports[activeReport].evidence ? (
                            <a
                              href={reports[activeReport].evidence.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline truncate max-w-[200px] inline-block"
                              title={reports[activeReport].evidence.name}
                            >
                              {reports[activeReport].evidence.name}
                            </a>
                          ) : (
                            "-"
                          ),
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 py-2">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {item.label}
                          </span>
                          <span
                            className={`col-span-2 text-right truncate ${
                              !item.value || item.value === "-"
                                ? "text-gray-400 italic"
                                : "text-gray-800 dark:text-gray-100"
                            }`}
                            title={typeof item.value === "string" ? item.value : ""}
                          >
                            {item.value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Pengaturan */}
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
