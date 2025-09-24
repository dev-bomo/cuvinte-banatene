import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { wordsApi } from "../services/api";
import { Word } from "../types";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import SmileButton from "../components/SmileButton";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Tag,
  Globe,
  Volume2,
  Heart,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function WordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchWord(id);
    }
  }, [id]);

  const fetchWord = async (wordId: string) => {
    try {
      setLoading(true);
      const wordData = await wordsApi.getWordById(wordId);
      setWord(wordData);
    } catch (err) {
      setError("Eroare la încărcarea cuvântului");
      console.error("Error fetching word:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-emerald-700 font-medium text-lg">
            Se încarcă cuvântul...
          </p>
        </div>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Cuvântul nu a fost găsit
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "Cuvântul pe care îl căutați nu există în dicționar."}
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi la pagina principală
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            asChild
            variant="outline"
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          >
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la pagina principală
            </Link>
          </Button>
        </div>

        {/* Main Word Card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-emerald-600 mr-3" />
              <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {word.word}
              </CardTitle>
              <Sparkles className="h-8 w-8 text-emerald-600 ml-3" />
            </div>

            {word.pronunciation && (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Volume2 className="h-5 w-5 text-gray-500" />
                <CardDescription className="text-lg text-gray-600 italic">
                  {word.pronunciation}
                </CardDescription>
              </div>
            )}

            <div className="flex items-center justify-center space-x-4">
              <SmileButton
                wordId={word.id}
                initialSmileCount={word.smileCount}
                onSmileCountUpdate={(newCount) => {
                  setWord((prev: Word | null) =>
                    prev ? { ...prev, smileCount: newCount } : null
                  );
                }}
              />
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Heart className="mr-1 h-3 w-3" />
                {word.smileCount} aprecieri
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Definition */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-emerald-600" />
                Definiție
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {word.definition}
                </p>
              </div>
            </div>

            {/* Short Description */}
            {word.shortDescription && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Sparkles className="mr-2 h-6 w-6 text-emerald-600" />
                  Descriere scurtă
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {word.shortDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Examples */}
            {word.examples && word.examples.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-emerald-600" />
                  Exemple de utilizare
                </h2>
                <div className="space-y-3">
                  {word.examples.map((example: string, index: number) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <Badge variant="outline" className="mt-1 text-xs">
                          {index + 1}
                        </Badge>
                        <p className="text-gray-700 leading-relaxed italic">
                          "{example}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Tag className="mr-2 h-6 w-6 text-emerald-600" />
                Informații suplimentare
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {word.category && (
                  <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Categorie
                          </p>
                          <p className="text-lg font-semibold text-emerald-700">
                            {word.category}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {word.origin && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Origine
                          </p>
                          <p className="text-lg font-semibold text-blue-700">
                            {word.origin}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Adăugat
                        </p>
                        <p className="text-lg font-semibold text-purple-700">
                          {new Date(word.createdAt).toLocaleDateString("ro-RO")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Explorează mai multe cuvinte
              </h3>
              <p className="text-gray-600 mb-4">
                Descoperă alte cuvinte interesante din dicționarul nostru
              </p>
              <Button
                asChild
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Link
                  to="/alphabetical"
                  className="flex items-center justify-center"
                >
                  Vezi toate cuvintele
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Caută alte cuvinte</h3>
              <p className="text-gray-600 mb-4">
                Folosește funcția de căutare pentru a găsi cuvinte similare
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <Link to="/search" className="flex items-center justify-center">
                  Caută cuvinte
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
