import { NavLink } from "react-router-dom";
import { StudentTable } from "./student/studenttable";
import { Button } from "./ui/button";
import axios from "axios";

export default function Home() { 
  function convertToCSV(data: any[]) {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","), // header row
      ...data.map(row => headers.map(field => JSON.stringify(row[field] ?? "")).join(","))
    ];
    
    return csvRows.join("\n");
  }



  function downloadCSV(data: any[], filename = "students.csv") {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const handleDownloadCSV = async () => {
    try {
      const token= localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/student",{
        headers: {
          token: token
        }
      }); 
      const data = res.data;
      downloadCSV(data);
    } catch (err) {
      console.error("Failed to download CSV:", err);
    }
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student Progress Dashboard</h1>
        <div className="flex gap-2">    
          <nav>
            <NavLink
              to="/add"
              className={({ isActive }) =>`px-4 py-2 rounded-md flex  transition ${isActive ? 'bg-sky-500' : 'bg-sky-500'} hover:bg-sky-600`}>
              +Add Student
            </NavLink>
          </nav>    

          <Button
            onClick={handleDownloadCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            ⬇ Download CSV
          </Button>
        </div>
      </div>
      <StudentTable />
    </main>
  );
}
