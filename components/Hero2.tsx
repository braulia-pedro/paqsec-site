"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
// 🔹 Variantes tipadas corretamente
const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1], // easeInOut padrão natural
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export default function Hero1() {
  return (
    <motion.section
      id="home"
      className="relative flex items-center justify-between min-h-screen px-8 pt-24 bg-black text-white overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.15 }}
    >
      {/* 🔹 Texto lado esquerdo */}
      <div className="z-10 max-w-xl space-y-6">
        {/* 🔹 Título principal */}
        <motion.h1 variants={fadeInLeft} className="text-5xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-[#00AEFF] to-[#0029BB] bg-clip-text text-transparent">
            PAQSEC
          </span>{" "}
          <span className="text-white">Cibersegurança que antecipa riscos —</span>
          <span className="block bg-gradient-to-r from-[#00AEFF] to-[#0029BB] bg-clip-text text-transparent mt-2">
            inteligência, investigação e proteção
          </span>
        </motion.h1>

        {/* 🔹 Subtítulo */}
        <motion.p variants={fadeInLeft} className="text-lg text-gray-300">
          Descubra se o seu email ou senha já apareceu em violações de dados.
          Verifique agora mesmo com nossa ferramenta gratuita —
          <strong> Olhar Atento</strong>.
        </motion.p>

        {/* 🔹 Botão CTA */}
        <motion.div variants={fadeInUp}>
          <Link
            href="/ferramenta"
            className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-[#EE1216] rounded-xl shadow-lg hover:bg-[#0030B5] transition-colors"
          >
            Verificar vazamentos
          </Link>
        </motion.div>
      </div>

      {/* 🔹 Imagem com gradientes e deslocamento vertical */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden"
      >
        <div className="relative w-full h-full translate-y-20"> {/* ⬇️ desloca a imagem um pouco para baixo */}
          <Image
            src="/hero.jpg"
            alt="Background visual representando segurança digital"
            fill
            className="object-cover opacity-75"
            priority
          />

          {/* 🔸 Gradiente à esquerda */}
          <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black via-black/70 to-transparent" />

          {/* 🔸 Gradiente inferior */}
          <div className="absolute left-0 bottom-0 right-0 h-1/4 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      </motion.div>
    </motion.section>
  );
}
