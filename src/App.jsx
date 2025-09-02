import React, { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [reports, setReports] = useState([]);

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
        evidence: null, // simpan file / url
      },
    ]);
  };

  // Update cell teks
  const handleChange = (index, field, value) => {
    const updated = [...reports];
    updated[index][field] = value;
    setReports(updated);
  };

  // Update evidence (gambar)
  const handleFileChange = (index, file) => {
    const updated = [...reports];
    updated[index].evidence = file ? URL.createObjectURL(file) : null;
    setReports(updated);
  };

  // Hapus baris
  const deleteRow = (index) => {
    const updated = [...reports];
    updated.splice(index, 1);
    setReports(updated);
  };

  // Export ke Excel (gambar disimpan sebagai link/path)
  const exportToExcel = () => {
    const worksheetData = [
      ["Nama", "Tanggal", "Agenda", "Pekerjaan", "Plan", "Aktual", "Status", "Evidence"],
      ...reports.map((r) => [
        r.nama,
        r.tanggal,
        r.agenda,
        r.pekerjaan,
        r.plan,
        r.aktual,
        r.status,
        r.evidence ? r.evidence : "", // hanya simpan path/url
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, "laporan_dms.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan DMS</h1>

      {/* Filter */}
      <div className="flex gap-4 mb-4">
        <select className="border p-2 rounded">
          <option>Harian</option>
          <option>Mingguan</option>
          <option>Bulanan</option>
        </select>
        <button
          onClick={addRow}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Tambah Laporan
        </button>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export Excel
        </button>
      </div>

      {/* Tabel */}
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Agenda</th>
            <th className="border px-2 py-1">Pekerjaan</th>
            <th className="border px-2 py-1">Plan</th>
            <th className="border px-2 py-1">Aktual</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Evidence</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((row, index) => (
            <tr key={index}>
              {/* Kolom teks biasa */}
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.nama}
                  onChange={(e) => handleChange(index, "nama", e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="date"
                  value={row.tanggal}
                  onChange={(e) => handleChange(index, "tanggal", e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.agenda}
                  onChange={(e) => handleChange(index, "agenda", e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.pekerjaan}
                  onChange={(e) => handleChange(index, "pekerjaan", e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.plan}
                  onChange={(e) => handleChange(index, "plan", e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.aktual}
                  onChange={(e) => handleChange(index, "aktual", e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border px-2 py-1">
                <select
                  value={row.status}
                  onChange={(e) => handleChange(index, "status", e.target.value)}
                  className="border px-2 py-1 w-full"
                >
                  <option value="">Pilih</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Proses">Proses</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
              {/* Kolom Evidence */}
              <td className="border px-2 py-1 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
                {row.evidence && (
                  <img
                    src={row.evidence}
                    alt="evidence"
                    className="mt-2 max-h-20 mx-auto"
                  />
                )}
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => deleteRow(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
