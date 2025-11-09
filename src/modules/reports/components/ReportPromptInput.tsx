/**
 * ReportPromptInput Component
 *
 * Componente para ingresar prompts de texto o voz para generar reportes
 */

import React, { useState } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';

interface ReportPromptInputProps {
  onSubmit: (prompt: string, format: string) => void;
  isLoading: boolean;
}

export const ReportPromptInput: React.FC<ReportPromptInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt, format);
    }
  };

  const handleVoiceInput = () => {
    // Verificar compatibilidad del navegador
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        'Tu navegador no soporta reconocimiento de voz. Por favor usa Chrome o Edge.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error);
      setIsListening(false);
      alert('Error al capturar la voz. Intenta de nuevo.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Generar Reporte
      </h2>

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
              placeholder='Ej: "Reporte de ventas de septiembre en PDF"'
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading || isListening}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Escuchando...' : 'Voz'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Puedes usar texto o voz. Ejemplos: "Top 10 productos más vendidos en Excel", "Clientes del último mes en CSV"
          </p>
        </div>

        {/* Format Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato del reporte
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
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
          <li className="cursor-pointer hover:text-blue-600" onClick={() => setPrompt('Reporte de ventas del último mes en PDF')}>
            • "Reporte de ventas del último mes en PDF"
          </li>
          <li className="cursor-pointer hover:text-blue-600" onClick={() => setPrompt('Top 10 productos más vendidos en Excel')}>
            • "Top 10 productos más vendidos en Excel"
          </li>
          <li className="cursor-pointer hover:text-blue-600" onClick={() => setPrompt('Clientes registrados este año en CSV')}>
            • "Clientes registrados este año en CSV"
          </li>
          <li className="cursor-pointer hover:text-blue-600" onClick={() => setPrompt('Pedidos pendientes en PDF')}>
            • "Pedidos pendientes en PDF"
          </li>
        </ul>
      </div>
    </div>
  );
};
