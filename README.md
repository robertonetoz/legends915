# Legends Barbershop — site

Next.js 16 · React 19 · Tailwind CSS v4 · Motion

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Telefones, endereços, horários, preços, barbeiros, avaliações | `src/lib/site.ts` |
| Fotos e vídeos dos cortes | pasta `public/work/` (veja abaixo) |
| Logo / ícones | `public/brand/`, `src/app/icon.png`, `src/app/opengraph-image.png` |
| Cores e fontes | `src/app/globals.css` (`@theme`) e `src/app/layout.tsx` |

## Galeria de trabalhos

Coloque imagens (`.jpg .png .webp .avif`) e vídeos (`.mp4 .webm .mov`) em `public/work/`.
O prefixo do nome define o filtro:

- `fade-01.jpg` → Fades
- `design-02.mp4` → Designs
- `kids-03.webp` → Kids
- `beard-04.jpg` → Beards

Um número na frente define a ordem: `01-design-ghostface.mp4` (o 1º e o 8º itens ganham o bloco grande).
Capa opcional para vídeo: `01-design-ghostface.poster.jpg`. Rode o build de novo depois de adicionar arquivos.
Vídeos verticais curtos (até ~10 MB, H.264 .mp4) funcionam melhor.

## Agendamento

O formulário envia para `POST /api/booking`.

- **Com** `RESEND_API_KEY` + `BOOKING_EMAIL_TO` (ver `.env.example`): o pedido chega por e-mail na barbearia.
- **Sem** essas variáveis: o cliente recebe a mensagem pronta para mandar por SMS para (915) 920-5204
  (botão "Open in Messages" no celular, "Copy message" no computador).

## Deploy

Vercel: importe o repositório e, se quiser e-mail, adicione as variáveis do `.env.example`.
Atualize `site.url` em `src/lib/site.ts` com o domínio final.
