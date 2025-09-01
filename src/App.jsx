import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import * as XLSX from "xlsx"

export default function App() {
  const [reports, setReports] = useState([
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

  const handleChange = (index, field, value) => {
    const newReports = [...reports]
    newReports[index][field] = value
    setReports(newReports)
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
        evidence: ""
      }
    ])
  }

  const exportToExcel = () => {
    const worksheetData = [
      ["Nama", "Tanggal", "Agenda", "Pekerjaan", "Plan", "Aktual", "Status", "Evidence"],
      ...reports.map(r => [
        r.nama,
        r.tanggal,
        r.agenda,
        r.pekerjaan,
        r.plan,
        r.aktual,
        r.status,
        r.evidence
      ])
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan")

    XLSX.writeFile(workbook, "laporan_dms.xlsx")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan Harian DMS</h1>
      {reports.map((report, index) => (
        <Card key={index} className="mb-4">
          <CardContent className="grid grid-cols-2 gap-2 p-4">
            {Object.keys(report).map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={report[field]}
                onChange={(e) => handleChange(index, field, e.target.value)}
                className="border p-2 rounded"
              />
            ))}
          </CardContent>
        </Card>
      ))}
      <div className="flex gap-4 mt-4">
        <Button onClick={addRow}>Tambah Baris</Button>
        <Button onClick={exportToExcel}>Export Excel</Button>
      </div>
    </div>
  )
}
