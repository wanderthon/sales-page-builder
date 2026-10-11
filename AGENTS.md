<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep the storefront presentational at the index route with in-memory category filters and product previews; no purchase or persistence layer is needed for a layout-only template.
- Centralize storefront styling in semantic CSS tokens and shared Button variants so the template can be restyled consistently.
