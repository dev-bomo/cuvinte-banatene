import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wordsApi } from "../services/api";
import { Word } from "../types";
import SmileButton from "../components/SmileButton";
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
import { Search, BookOpen, ArrowRight, Sparkles } from "lucide-react";

export function HomePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const response = await wordsApi.getWords(1, 6);
        setWords(response.words);
      } catch (err) {
        setError("Eroare la încărcarea cuvintelor");
        console.error("Error fetching words:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">
            Se încarcă cuvintele...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-emerald-600 mr-3" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Cuvinte Banatene
              </h1>
              <Sparkles className="h-8 w-8 text-emerald-600 ml-3" />
            </div>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Descoperă frumusețea limbii române prin cuvintele din Banat.
              <br className="hidden md:block" />
              Caută, explorează și învață despre cuvintele care definesc această
              regiune.
            </p>

            <Card className="max-w-2xl mx-auto mb-12 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>
      </div>

      {/* Featured Words Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Cuvinte populare
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descoperă cele mai căutate și apreciate cuvinte din dicționarul
            nostru
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {words.map((word, index) => (
            <Card
              key={word.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                  {word.category && (
                    <Badge variant="outline" className="text-xs">
                      {word.category}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  <Link to={`/word/${word.id}`}>{word.word}</Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {word.shortDescription}
                </CardDescription>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <SmileButton
                      wordId={word.id}
                      initialSmileCount={word.smileCount}
                      onSmileCountUpdate={(newCount) => {
                        setWords((prevWords) =>
                          prevWords.map((w) =>
                            w.id === word.id
                              ? { ...w, smileCount: newCount }
                              : w
                          )
                        );
                      }}
                    />
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                  >
                    <Link to={`/word/${word.id}`} className="flex items-center">
                      Citește mai mult
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <CardContent className="p-12">
              <BookOpen className="h-16 w-16 mx-auto mb-6 text-white/90" />
              <h3 className="text-3xl font-bold mb-4">
                Explorează întregul dicționar
              </h3>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Descoperă toate cuvintele organizate alfabetic și explorează
                bogăția limbii române din Banat
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-xl"
              >
                <Link to="/alphabetical" className="flex items-center">
                  Vezi toate cuvintele alfabetic
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Dicționarul Cuvinte Banatene - Păstrând tradiția lingvistică a
            regiunii
          </p>
        </div>
      </div>
    </div>
  );
}
