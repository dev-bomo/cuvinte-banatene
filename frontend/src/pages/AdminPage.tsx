import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { adminApi, authApi } from "../services/api";
import { Word, WordCreateRequest } from "../types";
import { WordForm } from "../components/WordForm";
import { WordList } from "../components/WordList";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Settings,
  Plus,
  LogOut,
  User,
  Mail,
  AlertTriangle,
  CheckCircle,
  Loader2,
  BookOpen,
  Sparkles,
  Shield,
  X,
} from "lucide-react";

export function AdminPage() {
  const { user, token, logout } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWords();
    }
  }, [token]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getWords(1, 100, "alphabetical", token!);
      setWords(response.words);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching words");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWord = async (wordData: WordCreateRequest) => {
    try {
      const newWord = await adminApi.createWord(wordData, token!);
      setWords((prev) =>
        [...prev, newWord].sort((a, b) => a.word.localeCompare(b.word))
      );
      setShowForm(false);
    } catch (err: any) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message?.includes("Email verification required")
      ) {
        setError(
          "Pentru a adăuga cuvinte, trebuie să îți verifici mai întâi adresa de email. Verifică inbox-ul pentru email-ul de verificare."
        );
      } else {
        setError(err.response?.data?.message || "Error creating word");
      }
    }
  };

  const handleUpdateWord = async (
    id: string,
    updates: Partial<WordCreateRequest>
  ) => {
    try {
      const updatedWord = await adminApi.updateWord(id, updates, token!);
      setWords((prev) =>
        prev
          .map((word) => (word.id === id ? updatedWord : word))
          .sort((a, b) => a.word.localeCompare(b.word))
      );
      setEditingWord(null);
    } catch (err: any) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message?.includes("Email verification required")
      ) {
        setError(
          "Pentru a edita cuvinte, trebuie să îți verifici mai întâi adresa de email. Verifică inbox-ul pentru email-ul de verificare."
        );
      } else {
        setError(err.response?.data?.message || "Error updating word");
      }
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (!window.confirm("Sigur vrei să ștergi acest cuvânt?")) {
      return;
    }

    try {
      await adminApi.deleteWord(id, token!);
      setWords((prev) => prev.filter((word) => word.id !== id));
    } catch (err: any) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message?.includes("Email verification required")
      ) {
        setError(
          "Pentru a șterge cuvinte, trebuie să îți verifici mai întâi adresa de email. Verifică inbox-ul pentru email-ul de verificare."
        );
      } else {
        setError(err.response?.data?.message || "Error deleting word");
      }
    }
  };

  const handleEditWord = (word: Word) => {
    setEditingWord(word);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingWord(null);
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResendingVerification(true);
    try {
      await authApi.resendVerification(user.email);
      setError(null);
      alert(
        `Email de verificare trimis cu succes la ${user.email}! Verifică inbox-ul.`
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Eroare la trimiterea email-ului de verificare"
      );
    } finally {
      setIsResendingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-emerald-700 font-medium text-lg">
            Se încarcă panoul de administrare...
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
                <Shield className="h-8 w-8 text-emerald-600 mr-3" />
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Panou de Administrare
                </CardTitle>
                <Shield className="h-8 w-8 text-emerald-600 ml-3" />
              </div>

              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-full">
                  <User className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    Bună, {user?.username}!
                  </span>
                  {user?.role === "admin" && (
                    <Badge variant="secondary" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Deconectare
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Email Verification Notice */}
        {user && !user.emailVerified && (
          <Card className="mb-8 shadow-lg border-0 bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6" />
                Email Neverificat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-700">
                Pentru a putea adăuga, edita sau șterge cuvinte, trebuie să îți
                verifici adresa de email. Am trimis un email de verificare la{" "}
                <strong className="text-amber-800">{user.email}</strong>.
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  {isResendingVerification ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Rescrie Email de Verificare
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-amber-600">
                Verifică și folderul de spam dacă nu găsești email-ul în inbox.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Email Verified Notice */}
        {user && user.emailVerified && (
          <Card className="mb-8 shadow-lg border-0 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-700 font-medium">
                  Email verificat cu succes! Poți gestiona cuvintele din
                  dicționar.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {words.length}
              </h3>
              <p className="text-gray-600">Cuvinte în dicționar</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {user?.role === "admin" ? "Admin" : "Contributor"}
              </h3>
              <p className="text-gray-600">Nivel de acces</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {words.reduce((sum, word) => sum + (word.smileCount || 0), 0)}
              </h3>
              <p className="text-gray-600">Aprecieri totale</p>
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
                Gestionează cuvintele din dicționar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Adaugă cuvânt nou
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Word Form Overlay */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {editingWord ? "Editează cuvântul" : "Adaugă cuvânt nou"}
                </CardTitle>
                <CardDescription>
                  {editingWord
                    ? "Modifică informațiile despre cuvânt"
                    : "Completează informațiile pentru noul cuvânt"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WordForm
                  word={editingWord}
                  onSubmit={
                    editingWord
                      ? (data) => handleUpdateWord(editingWord.id, data)
                      : handleCreateWord
                  }
                  onCancel={handleCancelForm}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Words List */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Lista cuvintelor
            </CardTitle>
            <CardDescription>
              Toate cuvintele din dicționar, organizate alfabetic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WordList
              words={words}
              onEdit={handleEditWord}
              onDelete={handleDeleteWord}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
