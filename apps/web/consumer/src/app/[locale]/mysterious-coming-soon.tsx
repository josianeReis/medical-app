"use client";

import { Button, Input, Card, CardContent } from "@packages/ui-components";
import { Badge } from "@packages/ui-components";
import { Eye, Zap, Lock, Activity, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function MysteriousComingSoon() {
  const [glitchText, setGlitchText] = useState("Nexdoc.clinic");
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchText("N3xd0c.cl1n1c");
        setTimeout(() => setGlitchText("Nexdoc.clinic"), 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Matrix-like particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 bg-black/40 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center relative">
              <Activity className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg animate-ping"></div>
            </div>
            <span className="text-xl font-mono text-white tracking-wider">
              {glitchText}
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-cyan-400/50 text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20"
          >
            <Eye className="w-3 h-3 mr-1" />
            CLASSIFIED
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-mono text-xs">
                    PROJETO CONFIDENCIAL
                  </Badge>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 leading-tight animate-pulse">
                  Algo está
                  <br />
                  <span className="text-white">chegando...</span>
                </h1>

                <div className="space-y-4">
                  <p className="text-xl text-gray-300 leading-relaxed font-light">
                    Uma revolução silenciosa está sendo forjada nas sombras da
                    medicina moderna.
                  </p>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Aqueles que enxergam além do óbvio sabem que o futuro dos
                    diagnósticos está prestes a ser{" "}
                    <span className="text-cyan-400 font-semibold">
                      redefinido
                    </span>
                    .
                  </p>
                </div>
              </div>

              {/* Mysterious Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-2xl font-mono text-cyan-400">80%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Redução
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-2xl font-mono text-purple-400">∞</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Possibilidades
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-2xl font-mono text-green-400">???</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Mistério
                  </div>
                </div>
              </div>

              {/* Secret Access */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-400" />
                  <p className="text-lg font-medium text-white">
                    Acesso Antecipado - Apenas Convidados
                  </p>
                </div>
                <div className="flex gap-3 max-w-md">
                  <Input
                    type="email"
                    placeholder="Digite seu código de acesso..."
                    className="flex-1 h-12 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                  <Button className="h-12 px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0">
                    <Zap className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Eye className="w-3 h-3" />
                  Apenas médicos selecionados receberão o convite
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                <CardContent className="relative z-10 p-8">
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full mx-auto flex items-center justify-center relative">
                          <Activity className="w-10 h-10 text-white animate-pulse" />
                          <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
                          <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping delay-1000"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          PROJETO NEXUS
                        </h3>
                        <p className="text-gray-400 font-mono text-sm">
                          CLASSIFICAÇÃO: ULTRA SECRETO
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-yellow-400" />
                          Informações Classificadas:
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            <span className="font-mono">
                              IA_MEDICAL_v2.0 - ATIVO
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-mono">
                              NEURAL_NETWORK - TREINANDO
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="font-mono">
                              QUANTUM_ANALYSIS - BETA
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-500">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="font-mono">
                              ████████ - REDACTED
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="w-full p-4 bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-lg border border-red-800/50 text-red-400 hover:bg-red-900/50 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {showSecret ? "OCULTAR DADOS" : "REVELAR SEGREDO"}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${showSecret ? "rotate-180" : ""}`}
                        />
                      </button>

                      {showSecret && (
                        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg animate-pulse">
                          <p className="text-red-300 text-sm font-mono text-center">
                            &quot;O futuro da medicina não será apenas digital...
                            <br />
                            será{" "}
                            <span className="text-cyan-400">
                              transcendental
                            </span>
                            .&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating mysterious elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border border-cyan-400/30 rounded-full animate-spin-slow"></div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 border border-purple-400/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 bg-black/60 backdrop-blur-sm border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 font-mono text-sm">
            © 2025 NEXUS PROJECT - &quot;Veritas in Tenebris&quot; - A verdade está nas
            sombras
          </p>
        </div>
      </footer>
    </div>
  );
}
