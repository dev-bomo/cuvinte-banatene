import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";
import { RegisterRequest } from "../../../shared/types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  UserPlus,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Sparkles,
  BookOpen,
  Shield,
  Loader2,
} from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Numele de utilizator este obligatoriu";
    } else if (formData.username.length < 3) {
      newErrors.username =
        "Numele de utilizator trebuie să aibă cel puțin 3 caractere";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email-ul este obligatoriu";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email-ul nu este valid";
    }

    if (!formData.password) {
      newErrors.password = "Parola este obligatorie";
    } else if (formData.password.length < 6) {
      newErrors.password = "Parola trebuie să aibă cel puțin 6 caractere";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmarea parolei este obligatorie";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Parolele nu se potrivesc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(formData);

      // Store token and user data
      localStorage.setItem("token", response.token);

      // Show verification message instead of redirecting immediately
      setError(null);
      setLoading(false);

      // Show success message with verification info
      alert(
        `Contul a fost creat cu succes! Am trimis un email de verificare la ${formData.email}. Te rugăm să verifici inbox-ul și să urmezi instrucțiunile pentru a activa contul.`
      );

      // Redirect to admin page (user can still access but with limited functionality)
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Eroare la înregistrare");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="Cuvinte Banatene"
              className="h-16 w-16 rounded-lg shadow-lg mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Cuvinte Banatene
              </h1>
              <p className="text-sm text-gray-600">Dicționar</p>
            </div>
          </div>
        </div>

        {/* Register Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-emerald-600 mr-3" />
              <CardTitle className="text-2xl font-bold text-gray-800">
                Înregistrare
              </CardTitle>
              <Sparkles className="h-8 w-8 text-emerald-600 ml-3" />
            </div>
            <CardDescription className="text-gray-600">
              Creează un cont de contributor pentru a adăuga cuvinte în
              dicționar
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      errors.username
                        ? "border-red-300 focus:border-red-400"
                        : ""
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
                  Adresă email *
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

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Parolă *
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
                      errors.password
                        ? "border-red-300 focus:border-red-400"
                        : ""
                    }`}
                    placeholder="Introduceți parola (min. 6 caractere)"
                    required
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
                  Confirmă parola *
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
                    placeholder="Confirmați parola"
                    required
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

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Se creează contul...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Creează cont
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">sau</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 mb-2">Ai deja un cont?</p>
              <Button
                asChild
                variant="outline"
                className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <Link to="/login" className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Conectează-te aici
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-emerald-600"
          >
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la dicționar
            </Link>
          </Button>
        </div>

        {/* Information Card */}
        <Card className="mt-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Despre conturile de contributor
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Conturile de contributor vă permit să adăugați și să editați
              cuvinte în dicționar. După înregistrare, veți primi un email de
              verificare pentru a activa contul.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Adăugare cuvinte</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Editare cuvinte</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Verificare email</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
