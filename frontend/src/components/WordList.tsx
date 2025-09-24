import { Word } from "../../../shared/types";
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
  BookOpen,
  Volume2,
  Calendar,
  Heart,
  AlertCircle,
} from "lucide-react";

interface WordListProps {
  words: Word[];
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
}

export function WordList({ words, onEdit, onDelete }: WordListProps) {
  if (words.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Nu există cuvinte în dicționar
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Dicționarul este gol. Adaugă primul cuvânt pentru a începe să
            construiești colecția de cuvinte din Banat.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span>Folosește butonul "Adaugă cuvânt nou" pentru a începe</span>
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
            Cuvinte în dicționar
          </h2>
          <p className="text-gray-600 mt-1">
            {words.length} {words.length === 1 ? "cuvânt" : "cuvinte"} în total
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <BookOpen className="mr-2 h-4 w-4" />
          {words.length} cuvinte
        </Badge>
      </div>

      {/* Table */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50 border-emerald-200">
                <TableHead className="font-semibold text-emerald-800">
                  Cuvânt
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Descriere
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Categorie
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Aprecieri
                </TableHead>
                <TableHead className="font-semibold text-emerald-800">
                  Adăugat
                </TableHead>
                <TableHead className="font-semibold text-emerald-800 text-center">
                  Acțiuni
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {words.map((word, index) => (
                <TableRow
                  key={word.id}
                  className="hover:bg-emerald-50/50 transition-colors border-gray-100"
                >
                  {/* Word Column */}
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-800">
                          {word.word}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      {word.pronunciation && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Volume2 className="h-3 w-3" />
                          <span className="italic">{word.pronunciation}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Description Column */}
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-gray-700 leading-relaxed line-clamp-2">
                        {word.shortDescription}
                      </p>
                    </div>
                  </TableCell>

                  {/* Category Column */}
                  <TableCell>
                    {word.category ? (
                      <Badge variant="secondary" className="text-xs">
                        {word.category}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </TableCell>

                  {/* Appreciations Column */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-gray-700">
                        {word.smileCount || 0}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date Added Column */}
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(word.createdAt).toLocaleDateString("ro-RO")}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() => onEdit(word)}
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        title="Editează cuvântul"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onDelete(word.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        title="Șterge cuvântul"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-1">
                {words.length}
              </h3>
              <p className="text-emerald-600 font-medium">Cuvinte totale</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-1">
                {words.reduce((sum, word) => sum + (word.smileCount || 0), 0)}
              </h3>
              <p className="text-emerald-600 font-medium">Aprecieri totale</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-1">
                {new Set(words.map((w) => w.category).filter(Boolean)).size}
              </h3>
              <p className="text-emerald-600 font-medium">Categorii</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
