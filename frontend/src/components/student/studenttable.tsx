import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Student = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSyncedAt?: string;
  inactiveReminders: number;
  emailRemindersEnabled: boolean;
};

interface StudentTableProps {
  students?: Student[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function StudentTable({  }: StudentTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const navigate= useNavigate();
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token= localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/student",{
           headers: {
          token: token
        }
        });
        setStudents(res.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token= localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/student/${id}`,{
         headers: {
          token: token
        }
      });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete student", error);
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Enrolled Students</h2>
      </div>

      <Table>
        <TableCaption>Enrolled Students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Handle</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Last Synced</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium cursor-pointer" onClick={()=>{navigate(`/profile/${student.id}`)}}>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phoneNumber}</TableCell>
                <TableCell>{student.codeforcesHandle}</TableCell>
                <TableCell>
                  {student.currentRating} / {student.maxRating}
                </TableCell>
                <TableCell>
                  {student.lastSyncedAt
                    ? new Date(student.lastSyncedAt).toLocaleString()
                    : "Never"}
                </TableCell>
                <TableCell className="space-x-2 flex">

                  <NavLink to={`/${student.id}`}>
                    <Button variant="secondary"  className="cursor-pointer" size="sm">
                      <Pencil className=" h-4 w-4" />
                    </Button>
                  </NavLink>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="cursor-pointer"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTargetId(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the student record.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No students found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total Students</TableCell>
            <TableCell>{students.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
