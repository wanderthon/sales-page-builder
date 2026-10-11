import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDown, Plus, X, Asterisk } from 'lucide-react';
import { Button } from '@/components/ui/button';
import proposta from '@/assets/proposta.jpg';
import orcamento from '@/assets/orcamento.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Seu estúdio — Loja criativa' },
    { name: 'description', content: 'Uma coleção de modelos e guias para dar espaço às suas boas ideias.' },
    { property: 'og:title', content: 'Seu estúdio — Loja criativa' },
    { property: 'og:description', content: 'Modelos, guias e novas possibilidades para sua rotina criativa.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Shop,
});

const products = [
  { id: 1, name: 'MODELOS DE CONTRATOS', category: 'Modelos', subtitle: '8 MODELOS PRONTOS', price: '49,90', image: proposta, label: 'MAIS VENDIDO', description: 'Uma apresentação bem pensada para valorizar suas ideias. Um modelo de proposta comercial com espaço para o projeto, o processo e o investimento.' },
  { id: 2, name: 'ROTEIROS DE BRIEFINGS', category: 'Modelos', subtitle: '8 MODELOS PRONTOS', price: '39,90', image: orcamento, label: '', description: 'O essencial, sem complicar. Um modelo de orçamento com uma estrutura clara para apresentar serviços, prazos e valores.' },
];
type Product = typeof products[number];

function Shop() {
  const [selected, setSelected] = useState<Product | null>(null);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', escape); };
  }, [selected]);
  return <>
    <header className="site-header page-width">
      <a href="#" className="brand" aria-label="Seu estúdio, início">seu estúdio<span className="text-muted-foreground">.</span></a>
      <nav className="flex items-center gap-7" aria-label="Navegação principal">
        <a className="nav-link hidden sm:block" href="#sobre">Sobre</a>
        <a className="nav-link hidden sm:block" href="#duvidas">Dúvidas</a>
        <Button variant="outline" size="sm" asChild><a href="#colecao">A loja <ArrowUpRight /></a></Button>
      </nav>
    </header>
    <main>
      <section className="hero">
        <div className="hero-inner page-width">
          <p className="eyebrow flex items-center gap-2"><Asterisk size={15} /> PEQUENOS RECURSOS. GRANDES POSSIBILIDADES.</p>
          <h1 className="hero-title">Sua loja<br />criativa<span className="text-background">.</span></h1>
          <div className="hero-stamp" aria-hidden="true">feito para<span>✳</span>criar mais</div>
          <div className="hero-bottom">
            <p className="hero-copy">Boas ideias merecem um bom começo.<br />Modelos e guias para o seu próximo projeto.</p>
            <Button variant="shop" size="lg" asChild><a href="#colecao">Explore a coleção <ArrowDown /></a></Button>
          </div>
        </div>
      </section>
      <div className="ticker" aria-hidden="true"><div className="ticker-track">{Array.from({ length: 10 }, (_, i) => <span className="flex items-center gap-9" key={i}>ARQUIVOS PARA BOAS IDEIAS <span className="ticker-star">✳</span> CRIE DO SEU JEITO <span className="ticker-star">✳</span></span>)}</div></div>
      <section id="colecao" className="collection page-width">
        <div className="collection-top">
          <div><p className="eyebrow text-muted-foreground mb-3">ESCOLHIDOS PARA VOCÊ</p><h2 className="section-title">A coleção<span className="text-muted-foreground text-sm font-sans ml-3">/ 02</span></h2></div>
        </div>
        <div className="product-grid">{products.map(product => <article key={product.id}>
          <a href={`#produto-${product.id}`} className="product-image block" aria-label={`Ver ${product.name}`} onClick={event => { event.preventDefault(); setSelected(product); }}>
            <img src={product.image} alt={`Páginas do ${product.name}`} width={1024} height={1024} loading="lazy" />
            {product.label && <span className={`product-label ${product.oldPrice ? 'sale' : ''}`}>{product.label}</span>}
          </a>
          <p className="product-category">{product.subtitle}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-bottom"><p className="font-medium text-sm">{product.oldPrice && <del className="text-muted-foreground text-xs mr-2">R$ {product.oldPrice}</del>}R$ {product.price}</p><Button variant="product" size="sm" onClick={() => setSelected(product)}>Ver produto <ArrowUpRight /></Button></div>
        </article>)}</div>
      </section>
      <section id="sobre" className="about-band"><div className="about-inner page-width"><div><p className="eyebrow text-muted-foreground mb-3">MENOS COMPLICAÇÃO, MAIS CRIAÇÃO</p><h2 className="section-title">Espaço para suas boas ideias.</h2></div><p className="text-muted-foreground text-sm leading-7">Uma coleção de recursos que simplificam o começo e deixam o resto com você. Porque cada projeto tem uma história — e a próxima pode ser a sua.</p></div></section>
      <section id="duvidas" className="faq page-width"><div><p className="eyebrow text-muted-foreground mb-3">VALE SABER</p><h2 className="section-title">Alguma dúvida?</h2></div><div>{[
        ['O que encontro na coleção?', 'Modelos de documentos e guias para projetos criativos. Explore cada produto para conhecer a proposta.'],
        ['Posso personalizar os materiais?', 'A proposta dos modelos é servir como ponto de partida para sua identidade, seus textos e suas ideias.'],
        ['Onde vejo os detalhes de cada produto?', 'Os detalhes estão disponíveis na apresentação de cada item da coleção.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}<Plus size={16} className="shrink-0" /></summary><p>{answer}</p></details>)}</div></section>
    </main>
    <footer className="footer page-width"><a href="#" className="brand">seu estúdio.</a><p className="text-xs text-muted-foreground">© 2026 Seu estúdio. Feito para criar.</p><a href="#colecao" className="nav-link flex items-center gap-2">Voltar à coleção <ArrowUpRight size={15} /></a></footer>
    {selected && <div className="detail-overlay" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" onClick={event => event.stopPropagation()}><img src={selected.image} alt={selected.name} width={1024} height={1024} className="w-full rounded-md object-cover" /><div className="pt-8"><Button autoFocus variant="ghost" size="icon" aria-label="Fechar produto" className="absolute top-2 right-2" onClick={() => setSelected(null)}><X /></Button><p className="eyebrow text-muted-foreground">{selected.category}</p><h2 id="product-title" className="section-title mt-4">{selected.name}</h2><p className="text-sm text-muted-foreground leading-7 my-5">{selected.description}</p><p className="text-xl font-medium">R$ {selected.price}</p><p className="text-xs text-muted-foreground mt-5">Produto e preço ilustrativos.</p></div></section></div>}
  </>;
}
