/**
 * ReportPromptInput Component
 *
 * Componente para ingresar prompts de texto o voz para generar reportes
 */

import React, { useState } from "react";
import { Mic, Send, Loader2, AlertCircle, Info } from "lucide-react";

interface ReportPromptInputProps {
  onSubmit: (prompt: string, format: string) => void;
  isLoading: boolean;
}

export const ReportPromptInput: React.FC<ReportPromptInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [browserSupportsVoice, setBrowserSupportsVoice] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      // NO enviar formato - el backend lo detecta del prompt
      onSubmit(prompt, "");
    }
  };

  const handleVoiceInput = () => {
    setVoiceError(null);

    // Verificar compatibilidad del navegador
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupportsVoice(false);
      setVoiceError(
        "Tu navegador no soporta reconocimiento de voz. Por favor usa Chrome, Edge o Safari en HTTPS/localhost."
      );
      return;
    }

    // Verificar que estamos en HTTPS o localhost
    const isSecureContext = window.isSecureContext;
    if (!isSecureContext) {
      setVoiceError(
        "El reconocimiento de voz requiere una conexión segura (HTTPS) o localhost."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Error en reconocimiento de voz:", event.error);
      setIsListening(false);

      let errorMessage = "Error al capturar la voz. ";
      switch (event.error) {
        case "not-allowed":
        case "permission-denied":
          errorMessage +=
            "Por favor permite el acceso al micrófono en tu navegador.";
          break;
        case "no-speech":
          errorMessage +=
            "No se detectó ningún audio. Intenta hablar más alto.";
          break;
        case "audio-capture":
          errorMessage +=
            "No se pudo acceder al micrófono. Verifica que esté conectado.";
          break;
        case "network":
          errorMessage += "Error de red. Verifica tu conexión a internet.";
          break;
        default:
          errorMessage += "Intenta de nuevo.";
      }

      setVoiceError(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Error al iniciar reconocimiento:", err);
      setVoiceError("Error al iniciar el reconocimiento de voz.");
      setIsListening(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Generar Reporte
      </h2>

      {/* Voice Error Alert */}
      {voiceError && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>Problema con voz:</strong> {voiceError}
          </div>
          <button
            onClick={() => setVoiceError(null)}
            className="ml-auto text-yellow-600 hover:text-yellow-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Voice Info */}
      {!browserSupportsVoice && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Nota:</strong> El reconocimiento de voz requiere Chrome,
            Edge o Safari con conexión segura (HTTPS o localhost).
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe el reporte que necesitas
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Ej: "Reporte de ventas del año 2025 en PDF"'
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading || isListening || !browserSupportsVoice}
              title={
                !browserSupportsVoice
                  ? "Navegador no soporta voz"
                  : "Usar reconocimiento de voz"
              }
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                isListening
                  ? "bg-red-500 text-white"
                  : !browserSupportsVoice
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Mic
                className={`h-5 w-5 ${isListening ? "animate-pulse" : ""}`}
              />
              {isListening ? "Escuchando..." : "Voz"}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Puedes usar texto o voz. Especifica el formato en el prompt (PDF,
            Excel o CSV). Ejemplos: "Top 10 productos más vendidos en Excel",
            "Clientes del año 2025 en CSV"
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generando reporte...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Generar Reporte
            </>
          )}
        </button>
      </form>

      {/* Examples */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Ejemplos de prompts:
        </h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li
            className="cursor-pointer hover:text-blue-600"
            onClick={() => setPrompt("Ventas del año 2025 en PDF")}
          >
            • "Ventas del año 2025 en PDF"
          </li>
          <li
            className="cursor-pointer hover:text-blue-600"
            onClick={() => setPrompt("Top 10 productos más vendidos en Excel")}
          >
            • "Top 10 productos más vendidos en Excel"
          </li>
          <li
            className="cursor-pointer hover:text-blue-600"
            onClick={() => setPrompt("Clientes registrados este año en CSV")}
          >
            • "Clientes registrados este año en CSV"
          </li>
          <li
            className="cursor-pointer hover:text-blue-600"
            onClick={() =>
              setPrompt("Pedidos del primer trimestre 2024 en PDF")
            }
          >
            • "Pedidos del primer trimestre 2024 en PDF"
          </li>
          <li
            className="cursor-pointer hover:text-blue-600"
            onClick={() =>
              setPrompt("Ventas del 01/10/2024 al 01/01/2025 en Excel")
            }
          >
            • "Ventas del 01/10/2024 al 01/01/2025 en Excel"
          </li>
        </ul>
      </div>
    </div>
  );
};
