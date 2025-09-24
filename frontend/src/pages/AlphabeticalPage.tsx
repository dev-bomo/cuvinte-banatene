import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { wordsApi } from "../services/api";
import { Word } from "../../shared/types";
import SmileButton from "../components/SmileButton";
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
  BookOpen,
  ArrowLeft,
  Search,
  Sparkles,
  Loader2,
  AlertCircle,
  Hash,
  Heart,
} from "lucide-react";

export function AlphabeticalPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const response = await wordsApi.getWordsAlphabetically();
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

  // Group words by first letter
  const groupedWords = words.reduce((groups, word) => {
    const firstLetter = word.word.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(word);
    return groups;
  }, {} as Record<string, Word[]>);

  // Get alphabet letters for navigation
  const alphabetLetters = Object.keys(groupedWords).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-emerald-700 font-medium text-lg">
            Se încarcă cuvintele...
          </p>
          <p className="text-gray-600 mt-2">
            Organizăm dicționarul alfabetic pentru dvs.
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Eroare la încărcare
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Încearcă din nou
            </Button>
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
            <BookOpen className="h-8 w-8 text-emerald-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Cuvinte Alfabetic
            </h1>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Toate cuvintele din dicționar, organizate alfabetic pentru o
            navigare ușoară și rapidă.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Hash className="mr-1 h-4 w-4" />
              {words.length} cuvinte totale
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <BookOpen className="mr-1 h-4 w-4" />
              {alphabetLetters.length} litere
            </Badge>
          </div>

          {/* Quick Navigation */}
          <Card className="max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Navigare rapidă
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {alphabetLetters.map((letter) => (
                  <Button
                    key={letter}
                    variant="outline"
                    size="sm"
                    className="rounded-full w-10 h-10 text-sm font-bold hover:bg-emerald-50 hover:border-emerald-300"
                    onClick={() => {
                      const element = document.getElementById(
                        `letter-${letter}`
                      );
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Words by Letter */}
        <div className="space-y-8">
          {alphabetLetters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
                    <Sparkles className="mr-3 h-8 w-8" />
                    {letter}
                    <Sparkles className="ml-3 h-8 w-8" />
                  </CardTitle>
                  <CardDescription className="text-center text-white/90 text-lg">
                    {groupedWords[letter].length}{" "}
                    {groupedWords[letter].length === 1 ? "cuvânt" : "cuvinte"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedWords[letter].map((word, index) => (
                      <Card
                        key={word.id}
                        className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-emerald-300 hover:-translate-y-1"
                      >
                        <CardHeader className="pb-3">
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
                          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                            <Link to={`/word/${word.id}`}>{word.word}</Link>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <CardDescription className="text-gray-600 leading-relaxed">
                            {word.shortDescription}
                          </CardDescription>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                              <Badge variant="secondary" className="text-xs">
                                <Heart className="mr-1 h-3 w-3" />
                                {word.smileCount}
                              </Badge>
                            </div>

                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="rounded-lg"
                            >
                              <Link to={`/word/${word.id}`}>
                                Citește mai mult
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Nu găsiți ceea ce căutați?
              </h3>
              <p className="text-white/90 mb-6 text-lg">
                Folosiți funcția de căutare pentru a găsi cuvinte specifice sau
                explorați alte secțiuni ale dicționarului.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100"
                >
                  <Link to="/search" className="flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    Caută cuvinte
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link to="/" className="flex items-center">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Înapoi la pagina principală
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
