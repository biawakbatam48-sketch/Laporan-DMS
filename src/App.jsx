import { useState } from "react"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Plus, FileSpreadsheet, Moon, Sun } from "lucide-react"

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [reports, setReports] = useState([])

  // Handle perubahan input
  const handleChange = (index, field, value) => {
    const newReports = [...reports]
    newReports[index][field] = value
    setReports(newReports)
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
        evidence: ""
      }
    ])
  }

  // Hapus baris laporan
  const deleteRow = (index) => {
    const newReports = [...reports]
    newReports.splice(index, 1)
    setReports(newReports)
  }

  // Export Excel dengan style tabel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Laporan")

    // Header
    worksheet.addRow([
      "Nama", "Tanggal", "Agenda", "Pekerjaan",
      "Plan", "Aktual", "Status", "Evidence"
    ])

    // Isi data
    reports.forEach((r) => {
      const row = worksheet.addRow([
        r.nama, r.tanggal, r.agenda, r.pekerjaan,
        r.plan, r.aktual, r.status, r.evidence || "",
      ])

      if (r.evidence) {
        const cell = row.getCell(8)
        cell.value = { text: "Lihat Bukti", hyperlink: r.evidence }
        cell.font = { color: { argb: "FF0000FF" }, underline: true }
      }
    })

    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: "center", vertical: "middle" }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } }
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
    })

    // Style isi tabel
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" }
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } }
      })
    })

    worksheet.columns = [
      { width: 20 }, { width: 15 }, { width: 20 }, { width: 25 },
      { width: 15 }, { width: 15 }, { width: 12 }, { width: 40 }
    ]

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), "laporan_dms.xlsx")
  }

  // Data untuk chart status
  const chartData = [
    { name: "Done", value: reports.filter(r => r.status === "Done").length },
    { name: "Progress", value: reports.filter(r => r.status === "Progress").length },
    { name: "Pending", value: reports.filter(r => r.status === "Pending").length }
  ]
  const COLORS = ["#10B981", "#FACC15", "#EF4444"]

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen flex" : "bg-gray-100 text-gray-900 min-h-screen flex"}>
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-700 to-blue-500 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 leading-snug">
          ALL TEAM <br /> 
          <span className="text-sm font-medium">Laporan Harian CV RANGGA</span>
        </h2>
        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-yellow-300">🏠 Dashboard</li>
          <li className="cursor-pointer hover:text-yellow-300">📝 Laporan</li>
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
            {darkMode ? <Sun size={20}/> : <Moon size={20}/> }
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">📊 Status Laporan</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
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
                    <input type="text" value={r.nama} onChange={(e)=>handleChange(index,"nama",e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="date" value={r.tanggal} onChange={(e)=>handleChange(index,"tanggal",e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={r.agenda} onChange={(e)=>handleChange(index,"agenda",e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={r.pekerjaan} onChange={(e)=>handleChange(index,"pekerjaan",e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={r.plan} onChange={(e)=>handleChange(index,"plan",e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={r.aktual} onChange={(e)=>handleChange(index,"aktual",e.target.value)} className="w-full border rounded px-2 py-1"/>
                  </td>
                  <td className="px-4 py-2">
                    <select value={r.status} onChange={(e)=>handleChange(index,"status",e.target.value)} className="w-full border rounded px-2 py-1">
                      <option value="">--Pilih--</option>
                      <option value="Done">Done</option>
                      <option value="Progress">Progress</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={(e)=>{
                        const file = e.target.files[0]
                        if(file){
                          handleChange(index,"evidence",URL.createObjectURL(file))
                        }
                      }}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={()=>deleteRow(index)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
