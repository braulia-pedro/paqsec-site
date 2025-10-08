import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório." }, { status: 400 });
  }

  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta a chave HIBP_API_KEY. Configure no ambiente de produção." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": apiKey,
          "User-Agent": "OlharAtento/1.0",
        },
      }
    );

    // 404 significa "não encontrado" → nenhum vazamento
    if (res.status === 404) {
      return NextResponse.json({
        found: false,
        count: 0,
        breaches: [],
        message: "Nenhuma violação conhecida encontrada para este email.",
      });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Erro na API HIBP (${res.status}): ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // O retorno é uma lista de objetos com dezenas de campos — pegamos os essenciais
    const breaches = Array.isArray(data)
      ? data.map((b) => ({
          name: b.Title || b.Name,
          date: b.BreachDate,
          domain: b.Domain,
        }))
      : [];

    return NextResponse.json({
      found: breaches.length > 0,
      count: breaches.length,
      breaches,
      message:
        breaches.length > 0
          ? `O seu email foi encontrado em ${breaches.length} violações.`
          : "Nenhuma violação conhecida encontrada para este email.",
    });
  } catch (err: unknown) {
    if (err instanceof Error){
      return NextResponse.json(
        { error: err.message},
        { status: 500}
      );
    }
    return NextResponse.json(
      { error:  "Erro ao consultar a API HIBP." },
      { status: 500 }
    );
  }
}
