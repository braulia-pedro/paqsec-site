//-----------------FerramentaPage.tsx ffb16b77dd8e48d3838e14035464ae3f
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ScanLine,
  Search,
  Lock,
  Shield,
  Radar,
  Terminal,
  ArrowRight,
} from "lucide-react";

// ======= TIPOS =======
type Breach = {
  name?: string;
  Title?: string;
  Name?: string;
  BreachDate?: string;
  date?: string;
  Domain?: string;
  domain?: string;
};

type StatusObj =
  | { type: "ok" | "found" | "error"; message: string; details?: Breach[] }
  | null;

export default function FerramentaPage() {
  const [mode, setMode] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // substituído any por StatusObj
  const [status, setStatus] = useState<StatusObj>(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  async function sha1Native(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  async function handleCheckEmail() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: "error", message: "Por favor, introduza um email válido." });
      return;
    }
    setLoading(true);
    setIsScanning(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/check_email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) {
        // normaliza e valida o formato de breaches para Breach[]
        const breaches: Breach[] | undefined = Array.isArray(data.breaches)
          ? (data.breaches as unknown[]).map((b) => {
              // garante shape mínimo sem lançar
              const obj = (b ?? {}) as Record<string, unknown>;
              return {
                name: typeof obj.Title === "string" ? (obj.Title as string)
                       : typeof obj.Name === "string" ? (obj.Name as string)
                       : typeof obj.name === "string" ? obj.name
                       : "Unknown",
                date: typeof obj.BreachDate === "string" ? (obj.BreachDate as string)
                      : typeof obj.date === "string" ? (obj.date as string)
                      : "Unknown",
                domain: typeof obj.Domain === "string" ? (obj.Domain as string)
                        : typeof obj.domain === "string" ? (obj.domain as string)
                        : undefined,
              } as Breach;
            })
          : undefined;

        const total = breaches?.length ?? (data.found ? 1 : 0);

        if (total > 0) {
          setStatus({
            type: "found",
            message: ` O seu email foi encontrado em ${total} violações.`,
            details: breaches,
          });
        } else {
          setStatus({
            type: "ok",
            message: " Nenhuma violação conhecida encontrada para este email.",
          });
        }
      } else {
        setStatus({ type: "error", message: data?.error || "Erro ao consultar API." });
      }
    } catch (e: unknown) {
      // safe handling do error
      if (e instanceof Error) {
        setStatus({ type: "error", message: e.message || "Erro de rede." });
      } else {
        setStatus({ type: "error", message: "Erro de rede desconhecido." });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setIsScanning(false), 600);
    }
  }

  async function handleCheckPassword() {
    if (!password) {
      setStatus({ type: "error", message: "Por favor, introduza uma palavra-passe." });
      return;
    }
    setLoading(true);
    setIsScanning(true);
    setStatus(null);
    try {
      const sha1 = await sha1Native(password);
      const prefix = sha1.slice(0, 5);
      const suffix = sha1.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!res.ok) throw new Error(`Erro ao consultar Pwned Passwords: ${res.status}`);
      const text = await res.text();
      const match = text.split(/\r?\n/).find((line) => line.startsWith(suffix));
      if (match) {
        const count = match.split(":")[1];
        setStatus({
          type: "found",
          message: ` A sua palavra-passe apareceu em ${count} vazamentos públicos.`,
        });
      } else {
        setStatus({
          type: "ok",
          message: " Nenhuma ocorrência conhecida encontrada para esta palavra-passe.",
        });
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setStatus({ type: "error", message: e.message || "Erro ao verificar palavra-passe." });
      } else {
        setStatus({ type: "error", message: "Erro desconhecido ao verificar palavra-passe." });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setIsScanning(false), 600);
    }
  }

  function handlePrimaryAction() {
    if (mode === "email") {
      handleCheckEmail();
    } else {
      handleCheckPassword();
    }
  }


  function toggleMode() {
    setMode((m) => (m === "email" ? "password" : "email"));
    setStatus(null);
    setLoading(false);
    setIsScanning(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15}}
      animate={{ opacity: 1, y: 0}}
      transition={{
        duration: 0.6,
        ease: "easeInOut"
      }}
      className="min-h-screen bg-black text-white"
    >
      <section className="relative overflow-hidden pt-24">
        <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Coluna Esquerda */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Ferramenta Gratuita—
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0043FF] to-[#0029BB]">
                Olhar Atento
              </span>
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-2xl">
              Descubra se o seu email já apareceu em violações de dados.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-[260px] relative">
                {mode === "email" ? (
                  <>
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite aqui o seu email"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00AEFF] placeholder-white/40"
                    />
                  </>
                ) : (
                  <>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite aqui a sua palavra-passe"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00AEFF] placeholder-white/40"
                    />
                  </>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePrimaryAction}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold shadow-lg border border-red-600 bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <ScanLine className="animate-pulse" />
                    A analisar...
                  </>
                ) : (
                  <>
                    <Search />
                    {mode === "email" ? "Verificar Vazamento" : "Verificar Senha"}
                  </>
                )}
              </motion.button>
            </div>

            <p className="mt-3 text-xs text-white/60">
              Ao utilizar esta ferramenta concorda com o nosso aviso de privacidade.
            </p>

            <div className="mt-5 flex items-center gap-4 text-sm">
              <button
                onClick={toggleMode}
                className="inline-flex items-center gap-2 opacity-80 hover:opacity-100 transition"
              >
                {mode === "email" ? (
                  <>
                    <Lock className="w-4 h-4" /> Verificar palavra-passe (k-anonymity)
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" /> Verificar email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl grid place-items-center bg-[#0029BB]">
                  <Radar />
                </div>
                <div>
                  <p className="text-white/70 text-sm">PAQ SEC • Radar</p>
                  <h3 className="font-semibold">Monitorização Contínua</h3>
                </div>
              </div>

              {/* 🔹 Resultados aparecem só aqui */}
              <div className="mt-6 space-y-3 text-sm">
                {!status && (
                  <p className="text-white/60">
                    Os resultados da sua verificação irão aparecer aqui.
                  </p>
                )}

                {status?.type === "found" && (
                  <>
                    {mode === "email" ? (
                      <div className="space-y-2">
                        <InfoRow
                          icon={<Terminal className="w-4 h-4" />}
                          label="Email encontrado"
                          value={`${status.details?.length || 0} violações`}
                          accent="#EE1216"
                        />

                        {/* 🔹 Lista resumida das violações */}
                        <div className="mt-3 max-h-40 overflow-y-auto pr-1 text-white/70 text-xs space-y-1 border-t border-white/10 pt-2">
                          {status.details?.slice(0, 5).map((b: Breach, i: number) => (
                            <div
                              key={i}
                              className="flex items-center justify-between border-b border-white/5 py-1"
                            >
                              <span className="truncate max-w-[160px]">{b.name}</span>
                              <span className="text-white/50">{b.date}</span>
                            </div>
                          ))}

                          {(status.details?.length ?? 0) > 5 && (
                            <p className="text-[11px] text-white/50 italic mt-1">
                              + {(status.details?.length ?? 0) - 5} outras violações não exibidas
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-400">{status.message}</p>
                    )}
                  </>
                )}


                {status?.type === "ok" && (
                  <p className="text-green-400">{status.message}</p>
                )}

                {status?.type === "error" && (
                  <p className="text-red-400">{status.message}</p>
                )}
              </div>

              <a
                href="#servicos"
                className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
              >
                Explorar soluções <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="ferramenta" className="bg-[#0a0f1f] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Por que esta ferramenta é importante?
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Todos os dias, milhões de credenciais são expostas em vazamentos de dados,
              muitas vezes sem que os usuários percebam. Isso permite que criminosos
              explorem essas informações para realizar golpes, sequestro de contas ou
              até fraudes financeiras.  
              <br /><br />
              Com esta ferramenta gratuita, você pode verificar rapidamente se o seu
              e-mail já foi comprometido em alguma violação conhecida — e obter dicas
              práticas para fortalecer sua segurança digital antes que seja tarde.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Porque oferecemos isto?</h3>
            <ul className="space-y-2 text-sm text-white/70 list-disc pl-5">
              <li>Promover consciência e reduzir riscos cibernéticos.</li>
              <li>Traduzir sinais técnicos em orientações claras e acionáveis.</li>
              <li>Conectar usuários a serviços de Threat Intelligence confiáveis.</li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
};

function InfoRow({ icon, label, value, accent }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/80">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

