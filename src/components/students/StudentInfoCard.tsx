
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface StudentInfoProps {
  student: {
    name: string;
    grade: string;
    section: string;
    rollNumber: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    parentName: string;
    parentContact: string;
    attendance: string;
    status: string;
  };
}

export const StudentInfoCard = ({ student }: StudentInfoProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <h2 className="text-2xl font-bold">Personal Information</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">{student.name}</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{`Class ${student.grade}${student.section}`}</Badge>
            <Badge variant="outline">Roll #{student.rollNumber}</Badge>
          </div>
          <Badge className={`${
            student.status === 'active' 
              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
              : 'bg-red-100 text-red-800 hover:bg-red-100'
          }`}>
            {student.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{student.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{student.phone || 'Not available'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{student.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Joined: {student.joinDate}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Parent/Guardian</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{student.parentName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{student.parentContact}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Attendance</h3>
          <div className="flex items-center justify-between">
            <span>Current Term</span>
            <span className={`font-semibold ${
              parseInt(student.attendance) >= 90 
                ? 'text-green-600' 
                : parseInt(student.attendance) >= 75 
                  ? 'text-amber-600' 
                  : 'text-red-600'
            }`}>
              {student.attendance}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
