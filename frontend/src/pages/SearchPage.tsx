import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { wordsApi } from "../services/api";
import { WordSearchResult } from "../../shared/types";
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
  Search,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<WordSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await wordsApi.searchWords(searchQuery);
      setResults(response.results);
    } catch (err) {
      setError("Eroare la căutarea cuvintelor");
      console.error("Error searching words:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-emerald-700 font-medium text-lg">
            Se caută cuvintele...
          </p>
          <p className="text-gray-600 mt-2">
            Căutăm în dicționar pentru "{query}"
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium text-lg">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-emerald-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Căutare
            </h1>
          </div>

          {/* Search Form */}
          <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Caută un cuvânt în dicționar..."
                    className="pl-10 h-12 text-lg border-2 border-emerald-200 focus:border-emerald-400 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-lg rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Caută cuvântul
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {query && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-emerald-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Rezultate pentru "{query}"
                </h2>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {results.length}{" "}
                {results.length === 1 ? "rezultat găsit" : "rezultate găsite"}
              </Badge>
            </div>

            {/* No Results */}
            {results.length === 0 && (
              <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Nu s-au găsit rezultate
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Nu s-au găsit cuvinte pentru căutarea{" "}
                    <strong>"{query}"</strong>. Încearcă cu alte termeni de
                    căutare sau verifică ortografia.
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Sugestii:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["cuvânt", "definiție", "exemplu", "categorie"].map(
                        (suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchInput(suggestion);
                              setSearchParams({ q: suggestion });
                            }}
                            className="rounded-full"
                          >
                            {suggestion}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result, index) => (
                  <Card
                    key={result.word.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:-translate-y-2"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                        {result.word.category && (
                          <Badge variant="outline" className="text-xs">
                            {result.word.category}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                        <Link to={`/word/${result.word.id}`}>
                          {result.word.word}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {result.word.shortDescription}
                      </CardDescription>

                      <div className="pt-4 border-t border-gray-100">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="rounded-lg w-full"
                        >
                          <Link
                            to={`/word/${result.word.id}`}
                            className="flex items-center justify-center"
                          >
                            Citește definiția completă
                            <ArrowLeft className="ml-1 h-3 w-3 rotate-180" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Query */}
        {!query && (
          <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Începeți căutarea
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Introduceți un termen de căutare în bara de căutare de sus
                pentru a găsi cuvinte în dicționarul nostru.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link to="/alphabetical" className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Vezi toate cuvintele alfabetic
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
