
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type S = {
  title: string;
  desc: string;

};

export default function Servico() {
  const posts: S[] = [
    {
      title: "Resposta a Incidentes (DFIR)",
      desc: "Identificamos, contemos e erradicamos incidentes de segurança rapidamente ...",
    },
    {
      title: "Threat Intelligence & DRP",
      desc: "Monitoramos a superfície digital da sua organização para detectar vazamen ...",
    },
    {
      title: "Attack Surface Management",
      desc: "Veja o que os hackers veem. Monitorizamos continuamente os seus ativos ex ...",

    },
  ];

  return (
    <section
      id="blog"
      className="relative py-20 px-6 bg-gradient-to-b from-black via-[#001f3f] to-black"
    >
      <div className="mx-auto max-w-7xl">
        {/* Título + subtítulo centralizados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold">
            Nossos <span className="text-blue-400">Servicos</span>
          </h2>
          <p className="text-white/70 mt-2 max-w-2xl mx-auto">
            Soluções completas para proteger sua organização contra riscos digitais.
          </p>
        </motion.div>

        {/* Grid de artigos */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-md hover:shadow-blue-500/20 hover:bg-white/10 transition"
            >

              <h3 className="text-2xl font-semibold mb-3 text-blue-400">{p.title}</h3>
              <p className="text-gray-300">{p.desc}</p>
              {/*<Link
                href={p.href}
                className="text-sm text-white/70 mt-3 flex items-center gap-1 hover:underline"
              >
                Leia mais <ArrowRight className="inline w-4 h-4" />
              </Link>*/}
            </motion.div>
          ))}
        </div>

        {/* Botão Ver tudo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/servicos"
            className="inline-block px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg hover:opacity-90 transition"
          >
            Ver tudo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
