import { useState, useEffect } from "react";
import { User, RegisterRequest } from "../../../shared/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

interface UserFormProps {
  user?: User | null;
  onSubmit: (
    data: RegisterRequest & { role?: "admin" | "contributor" }
  ) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<
    RegisterRequest & { role?: "admin" | "contributor" }
  >({
    username: "",
    email: "",
    password: "",
    role: "contributor",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
        role: user.role,
      });
      setConfirmPassword("");
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Numele de utilizator este obligatoriu";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email-ul este obligatoriu";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email-ul nu este valid";
    }

    if (!user && !formData.password) {
      newErrors.password = "Parola este obligatorie pentru utilizatori noi";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Parola trebuie să aibă cel puțin 6 caractere";
    }

    if (!user && formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Parolele nu se potrivesc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-emerald-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            {user ? "Editează utilizatorul" : "Adaugă utilizator nou"}
          </h2>
          <Sparkles className="h-6 w-6 text-emerald-600 ml-2" />
        </div>
        <p className="text-gray-600">
          {user
            ? "Modifică informațiile despre utilizator"
            : "Completează informațiile pentru noul utilizator"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Nume utilizator *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`pl-10 border-emerald-200 focus:border-emerald-400 ${
                  errors.username ? "border-red-300 focus:border-red-400" : ""
                }`}
                placeholder="Introduceți numele de utilizator"
                required
              />
            </div>
            {errors.username && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 border-emerald-200 focus:border-emerald-400 ${
                  errors.email ? "border-red-300 focus:border-red-400" : ""
                }`}
                placeholder="Introduceți adresa de email"
                required
              />
            </div>
            {errors.email && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Parolă {!user && "*"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 border-emerald-200 focus:border-emerald-400 ${
                  errors.password ? "border-red-300 focus:border-red-400" : ""
                }`}
                placeholder={
                  user
                    ? "Lasă gol pentru a păstra parola actuală"
                    : "Introduceți parola"
                }
                required={!user}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirmă parola {!user && "*"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 pr-10 border-emerald-200 focus:border-emerald-400 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-400"
                    : ""
                }`}
                placeholder={
                  user
                    ? "Lasă gol pentru a păstra parola actuală"
                    : "Confirmați parola"
                }
                required={!user}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-gray-700">
            Rol *
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-md focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none bg-white"
              required
            >
              <option value="contributor">Contributor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {formData.role === "admin" ? (
              <>
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Admin - Acces complet la toate funcțiile</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-gray-600" />
                <span>Contributor - Poate adăuga și edita cuvinte</span>
              </>
            )}
          </div>
        </div>

        {/* Role Information Card */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-emerald-800 mb-1">
                  Informații despre roluri
                </h4>
                <div className="space-y-2 text-sm text-emerald-700">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-700"
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                    <span>
                      Acces complet: gestionează cuvinte, utilizatori și setări
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      <Users className="mr-1 h-3 w-3" />
                      Contributor
                    </Badge>
                    <span>Acces limitat: poate adăuga și edita cuvinte</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Anulează
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
          >
            {user ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Actualizează utilizatorul
              </>
            ) : (
              <>
                <UserIcon className="mr-2 h-4 w-4" />
                Adaugă utilizatorul
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
