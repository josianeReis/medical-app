"use client";

import { Button } from "@packages/ui-components";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { redirect } from "next/navigation";

export const LandingHeader = () => {
  const { theme } = useTheme();
  const t = useTranslations("landing-page");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-colors duration-300 ${
        isDark ? "bg-black/40 border-gray-800" : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center relative">
            <Activity className="w-5 h-5 text-white animate-pulse" />
            {isDark && (
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg animate-ping"></div>
            )}
          </div>
          <span
            className={`text-xl font-mono tracking-wider transition-colors ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {t("name-app")}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { id: "funcionalidades", label: t("features") },
            { id: "precos", label: t("prices") },
            { id: "depoimentos", label: t("testimonials") },
            { id: "faq", label: t("faq") },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <LanguageSelector />
          <Button
            variant="ghost"
            className={`transition-colors ${
              isDark
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => redirect("/login")}
          >
            {t("login")}
          </Button>
          <Button
            onClick={() => redirect("/signup")}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
          >
            {t("button-cadastration")}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <LanguageSelector />
          <button
            className={`${isDark ? "text-white" : "text-gray-900"}`}
            onClick={handleToggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t backdrop-blur-sm transition-colors ${
            isDark
              ? "bg-black/90 border-gray-800"
              : "bg-white/90 border-gray-200"
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {[
              { id: "funcionalidades", label: t("features") },
              { id: "precos", label: t("prices") },
              { id: "depoimentos", label: t("testimonials") },
              { id: "faq", label: t("faq") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left transition-colors hover:text-cyan-400 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div
              className={`flex flex-col gap-2 pt-4 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}
            >
              <Button
                onClick={() => redirect("/login")}
                variant="ghost"
                className={`justify-start ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {t("login")}
              </Button>
              <Button
                onClick={() => redirect("/signup")}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white"
              >
                {t("button-cadastration")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
