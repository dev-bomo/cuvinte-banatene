import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usersApi } from "../services/api";
import { User, RegisterRequest } from "../types";
import { UserForm } from "../components/UserForm";
import { UserList } from "../components/UserList";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Users,
  Plus,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

export function UsersPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (token && user?.role === "admin") {
      fetchUsers();
    }
  }, [token, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await usersApi.getUsers(token!);
      setUsers(usersData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (
    userData: RegisterRequest & { role?: "admin" | "contributor" }
  ) => {
    try {
      const newUser = await usersApi.createUser(userData, token!);
      setUsers((prev) =>
        [...prev, newUser].sort((a, b) => a.username.localeCompare(b.username))
      );
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating user");
    }
  };

  const handleUpdateUser = async (
    id: string,
    updates: Partial<RegisterRequest & { role?: "admin" | "contributor" }>
  ) => {
    try {
      const updatedUser = await usersApi.updateUser(id, updates, token!);
      setUsers((prev) =>
        prev
          .map((user) => (user.id === id ? updatedUser : user))
          .sort((a, b) => a.username.localeCompare(b.username))
      );
      setEditingUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Sigur vrei să ștergi acest utilizator?")) {
      return;
    }

    try {
      await usersApi.deleteUser(id, token!);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting user");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // Access control
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Acces Restricționat
            </h3>
            <p className="text-gray-600 mb-6">
              Doar administratorii pot accesa această pagină. Contactați
              administratorul pentru a obține acces.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <a href="/">Înapoi la dicționar</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-emerald-700 font-medium text-lg">
            Se încarcă utilizatorii...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-emerald-600 mr-3" />
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Gestionare Utilizatori
                </CardTitle>
                <Users className="h-8 w-8 text-emerald-600 ml-3" />
              </div>

              <CardDescription className="text-lg text-gray-600">
                Gestionează utilizatorii și permisiunile din dicționar
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 shadow-lg border-0 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <Button
                  onClick={() => setError(null)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {users.length}
              </h3>
              <p className="text-gray-600">Utilizatori totali</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {users.filter((u) => u.role === "admin").length}
              </h3>
              <p className="text-gray-600">Administratori</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {users.filter((u) => u.emailVerified).length}
              </h3>
              <p className="text-gray-600">Email verificate</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <UserX className="h-12 w-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {users.filter((u) => u.role === "contributor").length}
              </h3>
              <p className="text-gray-600">Contribuitori</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Acțiuni rapide
              </CardTitle>
              <CardDescription>
                Gestionează utilizatorii din dicționar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Adaugă utilizator nou
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Form Overlay */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {editingUser
                    ? "Editează utilizatorul"
                    : "Adaugă utilizator nou"}
                </CardTitle>
                <CardDescription>
                  {editingUser
                    ? "Modifică informațiile despre utilizator"
                    : "Completează informațiile pentru noul utilizator"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm
                  user={editingUser}
                  onSubmit={
                    editingUser
                      ? (data) => handleUpdateUser(editingUser.id, data)
                      : handleCreateUser
                  }
                  onCancel={handleCancelForm}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users List */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Lista utilizatorilor
            </CardTitle>
            <CardDescription>
              Toți utilizatorii din dicționar, organizați alfabetic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserList
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              currentUserId={user?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
