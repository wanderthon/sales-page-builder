# Restauração do projeto WANDERTHON.art

## O que foi verificado
- O código do site no Lovable já é idêntico à branch `main` do GitHub (mesmos arquivos de página, estilos e imagens, incluindo `hero.webp`, `produto-contratos.webp` e `produto-briefings.webp`).
- A branch `customize/two-product-storefront` é uma versão mais antiga: não tem essas três imagens e tem menos ajustes. Por isso, a `main` será a fonte de verdade.
- Já estão no código: cores iniciais `#f4e85b` / `#e2e2e2`, WhatsApp `https://wa.link/rzzyx4`, `© 2026`, editor lateral, envio de imagens e salvamento no navegador (IndexedDB com alternativa em LocalStorage).

Ou seja, nada precisa ser recriado. O trabalho é conferir cada item do documento e corrigir só o que estiver faltando.

## Etapas
1. **Conferência item a item** (seções 2 a 15 do documento), testando o site real em computador e celular: cabeçalho, destaque com e sem imagem, faixa animada, os dois produtos, janela de detalhes (fechar clicando fora, no X e com Esc; bloqueio da rolagem), Sobre, FAQ, contato e rodapé.
2. **Teste do editor**: alterar cada campo e ver a página mudar na hora; editar os produtos de forma independente; enviar imagem (aceitar só imagens, limite de 8 MB, mensagem de erro); adicionar e remover perguntas; Salvar; Restaurar (com confirmação antes de apagar).
3. **Teste do salvamento**: editar, esperar o salvamento automático, recarregar e confirmar que tudo voltou, incluindo imagens; confirmar que dados antigos não são sobrescritos durante o carregamento.
4. **Correções pontuais** apenas nos itens que falharem na conferência, sem mudar identidade visual, textos ou estrutura.
5. **Metadados**: conferir título, descrição e cartões de compartilhamento da página inicial.
6. **Relatório final** listando o que já estava certo e o que foi corrigido.

## Observação
O salvamento fica guardado no navegador de quem edita; não sincroniza entre computadores.

## Detalhes técnicos
- Arquivos que podem ser tocados: `src/routes/index.tsx`, `src/styles.css`. Sem novas dependências, sem nova página.
- Testes via Playwright em 1280px e 390px de largura.
