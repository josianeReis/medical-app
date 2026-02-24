"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@packages/ui-components";

import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle,
  FileText,
  Instagram,
  Linkedin,
  Scan,
  Shield,
  Sparkles,
  Star,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { LandingHeader } from "./landing-header";
export default function LandingPage() {
  const { theme } = useTheme();
  const t = useTranslations("landing-page");

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-black"
          : "bg-gradient-to-br from-cyan-50 via-blue-50 to-white"
      }`}
    >
      {/* Fundo animado fixo - fora do fluxo normal */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-500/20"
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
            isDark ? "bg-blue-500/10" : "bg-blue-500/20"
          }`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-2000 ${
            isDark ? "bg-purple-500/10" : "bg-purple-500/20"
          }`}
        ></div>
        {isDark &&
          [...Array(50)].map((_, i) => (
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
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="relative z-10 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge
                    className={`border-cyan-400/30 hover:bg-cyan-400/20 ${
                      isDark
                        ? "bg-cyan-100/10 text-cyan-400"
                        : "bg-cyan-100 text-cyan-700"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t("here-section-sparkles")}
                  </Badge>

                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className={isDark ? "text-white" : "text-gray-900"}>
                      {t("here-sectionh1-1")}{" "}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      {t("here-section-span1")}
                    </span>
                    <br />
                    <span className={isDark ? "text-white" : "text-gray-900"}>
                      {t("here-sectionh1-2")}
                    </span>
                  </h1>

                  <p
                    className={`text-xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {t("here-section-p1")}
                  </p>
                </div>

                {/* CTA */}
                <div className="space-y-4">
                  <div className="flex gap-3 max-w-md">
                    <Input
                      type="email"
                      placeholder={t("here-section-input")}
                      className={`flex-1 h-12 border focus:border-cyan-500 focus:ring-cyan-500/20 ${
                        isDark
                          ? "bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                    <Button className="h-12 px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0">
                      <Zap className="w-4 h-4 mr-2" />
                      {t("here-section-button-free-trial")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: CheckCircle,
                      text: t("here-section-span2"),
                      color: "green",
                    },
                    { icon: Zap, text: t("here-section-span3"), color: "cyan" },
                    {
                      icon: Shield,
                      text: t("here-section-span4"),
                      color: "blue",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-900/30 border-gray-800"
                          : "bg-white/60 border-gray-200"
                      }`}
                    >
                      <feature.icon
                        className={`w-5 h-5 text-${feature.color}-400`}
                      />
                      <span
                        className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Dashboard Preview */}
              <div className="relative">
                <Card
                  className={`backdrop-blur-sm shadow-2xl relative overflow-hidden ${
                    isDark
                      ? "bg-gray-900/60 border-gray-800"
                      : "bg-white/80 border-gray-200"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                  <CardContent className="relative z-10 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {t("name-app")} Dashboard
                        </h3>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {t("here-section-div")}
                        </Badge>
                      </div>

                      <div
                        className={`rounded-lg p-4 border ${
                          isDark
                            ? "bg-gray-800/50 border-gray-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Scan className="w-5 h-5 text-cyan-400" />
                          <span
                            className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            Exame de Ultrassom
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div
                            className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                          >
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full w-4/5 animate-pulse"></div>
                          </div>
                          <p
                            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            Análise IA: 95% concluída
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`rounded-lg p-3 border ${
                            isDark
                              ? "bg-gray-800/30 border-gray-700"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="text-2xl font-bold text-cyan-400">
                            2.3s
                          </div>
                          <div
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            Tempo de análise
                          </div>
                        </div>
                        <div
                          className={`rounded-lg p-3 border ${
                            isDark
                              ? "bg-gray-800/30 border-gray-700"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="text-2xl font-bold text-green-400">
                            99.7%
                          </div>
                          <div
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            Precisão
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades Section */}
        <section
          id="funcionalidades"
          className={`relative z-10 px-6 py-20 ${isDark ? "bg-gray-900/20" : "bg-gray-50/50"}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <Badge
                className={`border-purple-400/30 ${
                  isDark
                    ? "bg-purple-100/10 text-purple-400"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {t("features")}
              </Badge>
              <h2
                className={`text-4xl lg:text-5xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("feature-section-h2")}
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("feature-section-p")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: t("feature-section-title1"),
                  description: t("feature-section-description1"),
                  color: "cyan",
                },
                {
                  icon: Zap,
                  title: t("feature-section-title2"),
                  description: t("feature-section-description2"),
                  color: "purple",
                },
                {
                  icon: Shield,
                  title: t("feature-section-title4"),
                  description: t("feature-section-description4"),
                  color: "green",
                },
                {
                  icon: FileText,
                  title: t("feature-section-title3"),
                  description: t("feature-section-description3"),
                  color: "blue",
                },
                {
                  icon: Scan,
                  title: t("feature-section-title5"),
                  description: t("feature-section-description5"),
                  color: "yellow",
                },
                {
                  icon: Users,
                  title: t("feature-section-title6"),
                  description: t("feature-section-description6"),
                  color: "pink",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className={`backdrop-blur-sm transition-all duration-300 group hover:scale-105 ${
                    isDark
                      ? "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                      : "bg-white/80 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}-400/20 to-${feature.color}-600/20 flex items-center justify-center border border-${feature.color}-400/30 group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon
                          className={`w-6 h-6 text-${feature.color}-400`}
                        />
                      </div>
                      <h3
                        className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Preços Section */}
        <section id="precos" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <Badge
                className={`border-green-400/30 ${
                  isDark
                    ? "bg-green-100/10 text-green-400"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {t("prices")}
              </Badge>
              <h2
                className={`text-4xl lg:text-5xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("pricing-section-h2")}
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("pricing-section-p")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: t("pricing-section-name1"),
                  price: t("pricing-section-prece1"),
                  period: t("pricing-section-period1"),
                  description: t("pricing-section-description1"),
                  features: [
                    t("pricing-section-features1.item1"),
                    t("pricing-section-features1.item2"),
                    t("pricing-section-features1.item3"),
                    t("pricing-section-features1.item4"),
                    t("pricing-section-features1.item5"),
                  ],
                  cta: t("pricing-section-cta1"),
                  popular: false,
                },
                {
                  name: t("pricing-section-name2"),
                  price: t("pricing-section-prece2"),
                  period: t("pricing-section-period2"),
                  description: t("pricing-section-description2"),
                  features: [
                    t("pricing-section-features2.item1"),
                    t("pricing-section-features2.item2"),
                    t("pricing-section-features2.item3"),
                    t("pricing-section-features2.item4"),
                    t("pricing-section-features2.item5"),
                    t("pricing-section-features2.item6"),
                    t("pricing-section-features2.item7"),
                  ],
                  cta: t("pricing-section-cta2"),
                  popular: true,
                },
                {
                  name: t("pricing-section-name3"),
                  price: t("pricing-section-prece3"),
                  period: t("pricing-section-period3"),
                  description: t("pricing-section-description3"),
                  features: [
                    t("pricing-section-features3.item1"),
                    t("pricing-section-features3.item2"),
                    t("pricing-section-features3.item3"),
                    t("pricing-section-features3.item4"),
                    t("pricing-section-features3.item5"),
                    t("pricing-section-features3.item6"),
                    t("pricing-section-features3.item7"),
                  ],
                  cta: t("pricing-section-cta3"),
                  popular: false,
                },
              ].map((plan, index) => (
                <Card
                  key={index}
                  className={`relative backdrop-blur-sm transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-cyan-400/50 scale-105" : ""
                  } ${
                    isDark
                      ? "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                      : "bg-white/80 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white border-0">
                        {t("pricing-section-badge2")}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle
                      className={`text-2xl ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.name}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        {plan.price}
                        <span
                          className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {plan.period}
                        </span>
                      </div>
                      <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                        {plan.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full h-12 ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                          : isDark
                            ? "bg-gray-800 hover:bg-gray-700"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                      } text-white border-0`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos Section */}
        <section
          id="depoimentos"
          className={`relative z-10 px-6 py-20 ${isDark ? "bg-gray-900/20" : "bg-gray-50/50"}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <Badge
                className={`border-yellow-400/30 ${
                  isDark
                    ? "bg-yellow-100/10 text-yellow-400"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {t("testimonials")}
              </Badge>
              <h2
                className={`text-4xl lg:text-5xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("testimonials-section-h2")}
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("testimonials-section-p")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: t("testimonials-section-name1"),
                  role: t("testimonials-section-role1"),
                  hospital: t("testimonials-section-hospital1"),
                  content: t("testimonials-section-quote1"),
                  rating: 5,
                },
                {
                  name: t("testimonials-section-name2"),
                  role: t("testimonials-section-rnole2"),
                  hospital: t("testimonials-section-hospital2"),
                  content: t("testimonials-section-quote2"),
                  rating: 5,
                },
                {
                  name: t("testimonials-section-name3"),
                  role: t("testimonials-section-role3"),
                  hospital: t("testimonials-section-hospital3"),
                  content: t("testimonials-section-quote3"),
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className={`backdrop-blur-sm transition-all duration-300 ${
                    isDark
                      ? "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                      : "bg-white/80 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p
                        className={`leading-relaxed italic ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {testimonial.content}
                      </p>
                      <div
                        className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}
                      >
                        <div
                          className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {testimonial.name}
                        </div>
                        <div
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {testimonial.role}
                        </div>
                        <div
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {testimonial.hospital}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="relative z-10 px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <Badge
                className={`border-blue-400/30 ${isDark ? "bg-blue-100/10 text-blue-400" : "bg-blue-100 text-blue-700"}`}
              >
                {t("faq")}
              </Badge>
              <h2
                className={`text-4xl lg:text-5xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("faq-section-h2")}
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {t("faq-section-p")}
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: t("faq-section-question1"),
                  answer: t("faq-section-answer1"),
                },
                {
                  question: t("faq-section-question2"),
                  answer: t("faq-section-answer2"),
                },
                {
                  question: t("faq-section-question3"),
                  answer: t("faq-section-answer3"),
                },
                {
                  question: t("faq-section-question4"),
                  answer: t("faq-section-answer4"),
                },
                {
                  question: t("faq-section-question5"),
                  answer: t("faq-section-answer5"),
                },
                {
                  question: t("faq-section-question6"),
                  answer: t("faq-section-answer6"),
                },
                {
                  question: t("faq-section-question7"),
                  answer: t("faq-section-answer7"),
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className={`backdrop-blur-sm transition-all duration-300 ${
                    isDark
                      ? "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                      : "bg-white/80 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        value={`item-${index}`}
                        className="border-none"
                      >
                        <AccordionTrigger
                          className={`flex items-center justify-between cursor-pointer font-semibold text-lg hover:no-underline ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent
                          className={`mt-4 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section
          className={`relative z-10 px-6 py-20 ${
            isDark
              ? "bg-gradient-to-r from-gray-900/60 to-black/60"
              : "bg-gradient-to-r from-gray-100 to-gray-50"
          }`}
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2
              className={`text-4xl lg:text-5xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("end-section-h2")}
            </h2>
            <p
              className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              {t("end-section-p")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t("here-section-input")}
                className={`h-12 border focus:border-cyan-500 focus:ring-cyan-500/20 ${
                  isDark
                    ? "bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                }`}
              />
              <Button className="h-12 px-8 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 whitespace-nowrap">
                {t("end-section-button1")}
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`h-4 w-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  {t("end-section-span1")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`h-4 w-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  {t("end-section-span2")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`h-4 w-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  {t("end-section-span3")}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 px-6 py-12 backdrop-blur-sm border-t ${
          isDark ? "bg-black/60 border-gray-800" : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`text-xl font-mono ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {t("footer-span1")}
                </span>
              </div>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                {t("footer-p1")}
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("footer-h3-1")}
              </h4>
              <ul
                className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link1")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link2")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link3")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link4")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("footer-h3")}
              </h4>
              <ul
                className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link9")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link10")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link12")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link11")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("footer-h3-2")}
              </h4>
              <ul
                className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link5")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link6")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link7")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {t("footer-link8")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`border-t mt-12 pt-8 text-center ${isDark ? "border-gray-800" : "border-gray-200"}`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={isDark ? "text-gray-500" : "text-gray-400"}>
                {t("footer-p2")}
              </p>
              <div className="flex gap-6 text-sm">
                <a
                  href="#"
                  className={`hover:text-cyan-400 transition-colors ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {t("footer-link13")}
                </a>
                <a
                  href="#"
                  className={`hover:text-cyan-400 transition-colors ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {t("footer-link14")}
                </a>
                <a
                  href="#"
                  className={`hover:text-cyan-400 transition-colors ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {t("footer-link15")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
