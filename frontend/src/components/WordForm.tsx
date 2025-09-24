import { useState, useEffect } from "react";
import { Word, WordCreateRequest } from "../types";
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
  BookOpen,
  Type,
  Volume2,
  FileText,
  Tag,
  Globe,
  List,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Loader2,
} from "lucide-react";

interface WordFormProps {
  word?: Word | null;
  onSubmit: (data: WordCreateRequest) => void;
  onCancel: () => void;
}

export function WordForm({ word, onSubmit, onCancel }: WordFormProps) {
  const [formData, setFormData] = useState<WordCreateRequest>({
    word: "",
    definition: "",
    shortDescription: "",
    category: "",
    origin: "",
    examples: [],
    pronunciation: "",
  });

  const [exampleText, setExampleText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (word) {
      setFormData({
        word: word.word,
        definition: word.definition,
        shortDescription: word.shortDescription,
        category: word.category || "",
        origin: word.origin || "",
        examples: word.examples || [],
        pronunciation: word.pronunciation || "",
      });
      setExampleText((word.examples || []).join("\n"));
    }
  }, [word]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.word.trim()) {
      newErrors.word = "Cuvântul este obligatoriu";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Descrierea scurtă este obligatorie";
    }

    if (!formData.definition.trim()) {
      newErrors.definition = "Definiția este obligatorie";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const examples = exampleText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    try {
      await onSubmit({
        ...formData,
        examples: examples.length > 0 ? examples : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
          <Sparkles className="h-8 w-8 text-emerald-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            {word ? "Editează cuvântul" : "Adaugă cuvânt nou"}
          </h2>
          <Sparkles className="h-8 w-8 text-emerald-600 ml-3" />
        </div>
        <p className="text-gray-600">
          {word
            ? "Modifică informațiile despre cuvânt"
            : "Completează informațiile pentru noul cuvânt"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Word and Pronunciation Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="word"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Type className="mr-2 h-4 w-4 text-emerald-600" />
              Cuvânt *
            </label>
            <Input
              type="text"
              id="word"
              name="word"
              value={formData.word}
              onChange={handleChange}
              className={`border-emerald-200 focus:border-emerald-400 ${
                errors.word ? "border-red-300 focus:border-red-400" : ""
              }`}
              placeholder="Introduceți cuvântul"
              required
            />
            {errors.word && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.word}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="pronunciation"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Volume2 className="mr-2 h-4 w-4 text-emerald-600" />
              Pronunție
            </label>
            <Input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleChange}
              className="border-emerald-200 focus:border-emerald-400"
              placeholder="ex: cu-vânt"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label
            htmlFor="shortDescription"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <FileText className="mr-2 h-4 w-4 text-emerald-600" />
            Descriere scurtă *
          </label>
          <Input
            type="text"
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className={`border-emerald-200 focus:border-emerald-400 ${
              errors.shortDescription
                ? "border-red-300 focus:border-red-400"
                : ""
            }`}
            placeholder="O scurtă descriere a cuvântului"
            required
          />
          {errors.shortDescription && (
            <div className="flex items-center space-x-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.shortDescription}</span>
            </div>
          )}
        </div>

        {/* Definition */}
        <div className="space-y-2">
          <label
            htmlFor="definition"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <BookOpen className="mr-2 h-4 w-4 text-emerald-600" />
            Definiție *
          </label>
          <textarea
            id="definition"
            name="definition"
            value={formData.definition}
            onChange={handleChange}
            className={`w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 resize-none ${
              errors.definition ? "border-red-300 focus:border-red-400" : ""
            }`}
            rows={3}
            placeholder="Definiția completă a cuvântului"
            required
          />
          {errors.definition && (
            <div className="flex items-center space-x-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.definition}</span>
            </div>
          )}
        </div>

        {/* Category and Origin Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Tag className="mr-2 h-4 w-4 text-emerald-600" />
              Categorie
            </label>
            <Input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border-emerald-200 focus:border-emerald-400"
              placeholder="ex: Familie, Natură, etc."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="origin"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Globe className="mr-2 h-4 w-4 text-emerald-600" />
              Origine
            </label>
            <Input
              type="text"
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="border-emerald-200 focus:border-emerald-400"
              placeholder="ex: Română, Latină, etc."
            />
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-2">
          <label
            htmlFor="examples"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            <List className="mr-2 h-4 w-4 text-emerald-600" />
            Exemple (câte unul pe linie)
          </label>
          <textarea
            id="examples"
            value={exampleText}
            onChange={(e) => setExampleText(e.target.value)}
            className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 resize-none"
            rows={4}
            placeholder="Exemplu 1&#10;Exemplu 2&#10;Exemplu 3"
          />
          <p className="text-xs text-gray-500">
            Introduceți fiecare exemplu pe o linie separată
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <X className="mr-2 h-4 w-4" />
            Anulează
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se salvează...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {word ? "Actualizează" : "Adaugă"}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Information Card */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-emerald-800 mb-1">
                Sfaturi pentru adăugarea cuvintelor
              </h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Folosiți descrieri clare și concise</li>
                <li>• Includeți exemple relevante din viața de zi cu zi</li>
                <li>• Specificați categoria și originea când este posibil</li>
                <li>• Verificați ortografia înainte de salvare</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
