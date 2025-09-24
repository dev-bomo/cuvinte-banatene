import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { smileApi } from "../services/api";
import { Heart } from "lucide-react";

interface SmileButtonProps {
  wordId: string;
  initialSmileCount: number;
  onSmileCountUpdate: (newCount: number) => void;
  className?: string;
}

const SmileButton: React.FC<SmileButtonProps> = ({
  wordId,
  initialSmileCount,
  onSmileCountUpdate,
  className = "",
}) => {
  const { user, token } = useAuth();
  const [smileCount, setSmileCount] = useState(initialSmileCount);
  const [isSmiling, setIsSmiling] = useState(false);
  const [hasSmiled, setHasSmiled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already smiled at this word
  useEffect(() => {
    const checkSmileStatus = async () => {
      if (user && token) {
        try {
          const userSmiles = await smileApi.getUserSmiles(token);
          setHasSmiled(userSmiles.smiledWordIds.includes(wordId));
        } catch (error) {
          console.error("Error checking smile status:", error);
        }
      } else {
        // For anonymous users, check local storage
        const smiledWords = JSON.parse(
          localStorage.getItem("smiledWords") || "[]"
        );
        setHasSmiled(smiledWords.includes(wordId));
      }
    };

    checkSmileStatus();
  }, [user, token, wordId]);

  const handleSmile = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let response;

      if (user && token) {
        // Authenticated user
        if (hasSmiled) {
          response = await smileApi.removeUserSmile(wordId, token);
          setHasSmiled(false);
        } else {
          response = await smileApi.addUserSmile(wordId, token);
          setHasSmiled(true);
        }
      } else {
        // Anonymous user
        if (hasSmiled) {
          // For anonymous users, we don't allow removing smiles
          return;
        }

        // Check if already smiled (local storage)
        const smiledWords = JSON.parse(
          localStorage.getItem("smiledWords") || "[]"
        );
        if (smiledWords.includes(wordId)) {
          return;
        }

        response = await smileApi.addSmile(wordId);

        // Add to local storage
        const newSmiledWords = [...smiledWords, wordId];
        localStorage.setItem("smiledWords", JSON.stringify(newSmiledWords));
        setHasSmiled(true);
      }

      setSmileCount(response.smileCount);
      onSmileCountUpdate(response.smileCount);
      setIsSmiling(true);

      // Reset animation after a short delay
      setTimeout(() => setIsSmiling(false), 1000);
    } catch (error: any) {
      console.error("Error handling smile:", error);
      alert(
        error.response?.data?.message || "Eroare la înregistrarea zâmbetului"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSmile}
      disabled={isLoading || (!user && hasSmiled)}
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
        hasSmiled
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-emerald-200"
      } ${isSmiling ? "animate-pulse bg-emerald-100" : ""} ${className}`}
      title={
        hasSmiled
          ? "Ai apreciat acest cuvânt! ❤️"
          : "Apreciază acest cuvânt! ❤️"
      }
    >
      <Heart
        className={`h-4 w-4 transition-colors duration-200 ${
          hasSmiled ? "fill-emerald-600 text-emerald-600" : "text-gray-400"
        }`}
      />
      <span className="text-sm font-medium">{smileCount}</span>
    </button>
  );
};

export default SmileButton;
