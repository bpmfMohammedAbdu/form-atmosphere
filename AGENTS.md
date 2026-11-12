<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Site content (profile, projects, exhibition items) lives in `src/data/portfolio.ts`; components read from it so copy changes happen in one place.
- 3D scenes live in `src/components/three/` and are loaded with `React.lazy` behind `<ClientOnly>` + `SceneBoundary`; they pause (`frameloop="never"`) when off-screen, because SSR cannot render WebGL and phones need the GPU idle.
- The chat assistant is a pure rule-based answer engine in `src/lib/chatbot.ts` (tested in `src/test/chatbot.test.ts`), so it works without a backend.
- The contact form validates with `src/lib/contact-schema.ts`; `sendMessage` in `Contact.tsx` is a placeholder until a backend is connected.
- Ambient audio is synthesized with Web Audio in `src/lib/ambient-audio.ts` (no audio files) and only starts on a user click, to respect autoplay rules.
