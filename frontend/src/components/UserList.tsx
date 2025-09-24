import { User } from "../types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Edit,
  Trash2,
  Users,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  Crown,
} from "lucide-react";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  currentUserId?: string;
}

export function UserList({
  users,
  onEdit,
  onDelete,
  currentUserId,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Nu există utilizatori în sistem
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Sistemul nu conține încă utilizatori. Adaugă primul utilizator
            pentru a începe să gestionezi echipa dicționarului.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span>
              Folosește butonul "Adaugă utilizator nou" pentru a începe
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Utilizatori în sistem
          </h2>
          <p className="text-gray-600 mt-1">
            {users.length} {users.length === 1 ? "utilizator" : "utilizatori"}{" "}
            în total
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Users className="mr-2 h-4 w-4" />
          {users.length} utilizatori
        </Badge>
      </div>

      {/* Table */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50 border-emerald-200">
                <TableHead className="font-semibold text-emerald-800">
                  Utilizator
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Rol
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Status Email
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Data creării
                </TableHead>
                <TableHead className="font-semibold text-emerald-800 text-center">
                  Acțiuni
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-emerald-50/50 transition-colors border-gray-100"
                >
                  {/* User Column */}
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-800">
                          {user.username}
                        </span>
                        {currentUserId === user.id && (
                          <Badge
                            variant="default"
                            className="text-xs bg-blue-600"
                          >
                            <Crown className="mr-1 h-3 w-3" />
                            Tu
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email Column */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                  </TableCell>

                  {/* Role Column */}
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={`text-xs ${
                        user.role === "admin"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <>
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </>
                      ) : (
                        <>
                          <Users className="mr-1 h-3 w-3" />
                          Contributor
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  {/* Email Status Column */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.emailVerified ? (
                        <>
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700"
                          >
                            Verificat
                          </Badge>
                        </>
                      ) : (
                        <>
                          <UserX className="h-4 w-4 text-orange-600" />
                          <Badge
                            variant="secondary"
                            className="text-xs bg-orange-100 text-orange-700"
                          >
                            Neverificat
                          </Badge>
                        </>
                      )}
                    </div>
                  </TableCell>

                  {/* Date Column */}
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(user.createdAt).toLocaleDateString("ro-RO")}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() => onEdit(user)}
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        title="Editează utilizatorul"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {currentUserId !== user.id && (
                        <Button
                          onClick={() => onDelete(user.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          title="Șterge utilizatorul"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-1">
                {users.length}
              </h3>
              <p className="text-emerald-600 font-medium">Utilizatori totali</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-1">
                {users.filter((u) => u.role === "admin").length}
              </h3>
              <p className="text-emerald-600 font-medium">Administratori</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-1">
                {users.filter((u) => u.emailVerified).length}
              </h3>
              <p className="text-emerald-600 font-medium">Email verificate</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-1">
                {users.filter((u) => u.role === "contributor").length}
              </h3>
              <p className="text-emerald-600 font-medium">Contribuitori</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
