import React, { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [rows, setRows] = useState([
    { tanggal: "", deskripsi: "", status: "" },
  ]);

  // Tambah baris baru
  const addRow = () => {
    setRows([...rows, { tanggal: "", deskripsi: "", status: "" }]);
  };

  // Update nilai cell
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // Export ke Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, "laporan.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan Harian</h1>

      <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Tanggal</th>
            <th className="border border-gray-400 px-4 py-2">Deskripsi</th>
            <th className="border border-gray-400 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">
                <input
                  type="date"
                  value={row.tanggal}
                  onChange={(e) =>
                    handleChange(index, "tanggal", e.target.value)
                  }
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input
                  type="text"
                  value={row.deskripsi}
                  onChange={(e) =>
                    handleChange(index, "deskripsi", e.target.value)
                  }
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <select
                  value={row.status}
                  onChange={(e) =>
                    handleChange(index, "status", e.target.value)
                  }
                  className="border px-2 py-1 w-full"
                >
                  <option value="">Pilih</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Proses">Proses</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Tambah Baris
        </button>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
}

export default App;
