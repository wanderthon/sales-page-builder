import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ArrowDown, Plus, X, Asterisk, Settings2, Save, RotateCcw, Eye } from 'lucide-react';
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

const initialProducts = [
  { id: 1, name: 'MODELOS DE CONTRATOS', category: 'Modelos', subtitle: '8 MODELOS PRONTOS', price: '49,90', image: proposta, label: 'MAIS VENDIDO', description: 'Uma apresentação bem pensada para valorizar suas ideias. Um modelo de proposta comercial com espaço para o projeto, o processo e o investimento.' },
  { id: 2, name: 'ROTEIROS DE BRIEFINGS', category: 'Modelos', subtitle: '8 MODELOS PRONTOS', price: '39,90', image: orcamento, label: '', description: 'O essencial, sem complicar. Um modelo de orçamento com uma estrutura clara para apresentar serviços, prazos e valores.' },
];
type Product = typeof initialProducts[number];
type EditableProduct = Pick<Product, 'id' | 'name' | 'subtitle' | 'price' | 'label' | 'description'>;

const defaults = {
  shopName: 'seu estúdio',
  eyebrow: 'PEQUENOS RECURSOS. GRANDES POSSIBILIDADES.',
  headline: 'Sua loja',
  heroCopy: 'Boas ideias merecem um bom começo.\nModelos e guias para o seu próximo projeto.',
  collectionEyebrow: 'ESCOLHIDOS PARA VOCÊ',
  collectionTitle: 'A coleção',
  aboutTitle: 'Espaço para suas boas ideias.',
  aboutCopy: 'Uma coleção de recursos que simplificam o começo e deixam o resto com você. Porque cada projeto tem uma história, e a próxima pode ser a sua.',
  heroColor: '#f4e85b',
  backgroundColor: '#fbfaf6',
};

function Shop() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [shopName, setShopName] = useState(defaults.shopName);
  const [eyebrow, setEyebrow] = useState(defaults.eyebrow);
  const [headline, setHeadline] = useState(defaults.headline);
  const [heroCopy, setHeroCopy] = useState(defaults.heroCopy);
  const [collectionEyebrow, setCollectionEyebrow] = useState(defaults.collectionEyebrow);
  const [collectionTitle, setCollectionTitle] = useState(defaults.collectionTitle);
  const [aboutTitle, setAboutTitle] = useState(defaults.aboutTitle);
  const [aboutCopy, setAboutCopy] = useState(defaults.aboutCopy);
  const [heroColor, setHeroColor] = useState(defaults.heroColor);
  const [backgroundColor, setBackgroundColor] = useState(defaults.backgroundColor);
  const [editableProducts, setEditableProducts] = useState<EditableProduct[]>(initialProducts.map(({ id, name, subtitle, price, label, description }) => ({ id, name, subtitle, price, label, description })));

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sales-page-builder-config');
      if (!saved) return;
      const config = JSON.parse(saved);
      setShopName(config.shopName ?? defaults.shopName);
      setEyebrow(config.eyebrow ?? defaults.eyebrow);
      setHeadline(config.headline ?? defaults.headline);
      setHeroCopy(config.heroCopy ?? defaults.heroCopy);
      setCollectionEyebrow(config.collectionEyebrow ?? defaults.collectionEyebrow);
      setCollectionTitle(config.collectionTitle ?? defaults.collectionTitle);
      setAboutTitle(config.aboutTitle ?? defaults.aboutTitle);
      setAboutCopy(config.aboutCopy ?? defaults.aboutCopy);
      setHeroColor(config.heroColor ?? defaults.heroColor);
      setBackgroundColor(config.backgroundColor ?? defaults.backgroundColor);
      if (Array.isArray(config.products)) setEditableProducts(config.products);
    } catch {
      localStorage.removeItem('sales-page-builder-config');
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', escape); };
  }, [selected]);

  const currentProducts: Product[] = initialProducts.map((product) => ({
    ...product,
    ...editableProducts.find((item) => item.id === product.id),
  }));

  function updateProduct(id: number, key: keyof EditableProduct, value: string) {
    setEditableProducts((current) => current.map((product) => product.id === id ? { ...product, [key]: value } : product));
  }

  function saveConfig() {
    try {
      localStorage.setItem('sales-page-builder-config', JSON.stringify({
        shopName, eyebrow, headline, heroCopy, collectionEyebrow, collectionTitle,
        aboutTitle, aboutCopy, heroColor, backgroundColor, products: editableProducts,
      }));
      setSavedMessage('Alterações salvas neste navegador.');
      window.setTimeout(() => setSavedMessage(''), 3500);
    } catch {
      setSavedMessage('Não foi possível salvar neste navegador.');
    }
  }

  function resetConfig() {
    setShopName(defaults.shopName);
    setEyebrow(defaults.eyebrow);
    setHeadline(defaults.headline);
    setHeroCopy(defaults.heroCopy);
    setCollectionEyebrow(defaults.collectionEyebrow);
    setCollectionTitle(defaults.collectionTitle);
    setAboutTitle(defaults.aboutTitle);
    setAboutCopy(defaults.aboutCopy);
    setHeroColor(defaults.heroColor);
    setBackgroundColor(defaults.backgroundColor);
    setEditableProducts(initialProducts.map(({ id, name, subtitle, price, label, description }) => ({ id, name, subtitle, price, label, description })));
    localStorage.removeItem('sales-page-builder-config');
    setSavedMessage('Visual restaurado para o padrão.');
  }

  return <div className="shop-shell" style={{ '--hero': heroColor, '--background': backgroundColor } as CSSProperties}>
    <header className="site-header page-width">
      <a href="#" className="brand" aria-label={shopName + ', início'}>{shopName}<span className="text-muted-foreground">.</span></a>
      <nav className="flex items-center gap-3 sm:gap-7" aria-label="Navegação principal">
        <a className="nav-link hidden sm:block" href="#sobre">Sobre</a>
        <a className="nav-link hidden sm:block" href="#duvidas">Dúvidas</a>
        <Button variant="outline" size="sm" onClick={() => setEditorOpen(true)}><Settings2 size={15} /> Editar loja</Button>
        <Button variant="outline" size="sm" asChild><a href="#colecao">A loja <ArrowUpRight /></a></Button>
      </nav>
    </header>
    <main>
      <section className="hero">
        <div className="hero-inner page-width">
          <p className="eyebrow flex items-center gap-2"><Asterisk size={15} /> {eyebrow}</p>
          <h1 className="hero-title">{headline}<span className="text-background">.</span></h1>
          <div className="hero-stamp" aria-hidden="true">feito para<span>✳</span>criar mais</div>
          <div className="hero-bottom">
            <p className="hero-copy">{heroCopy.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>
            <Button variant="shop" size="lg" asChild><a href="#colecao">Explore a coleção <ArrowDown /></a></Button>
          </div>
        </div>
      </section>
      <div className="ticker" aria-hidden="true"><div className="ticker-track">{Array.from({ length: 10 }, (_, i) => <span className="flex items-center gap-9" key={i}>ARQUIVOS PARA BOAS IDEIAS <span className="ticker-star">✳</span> CRIE DO SEU JEITO <span className="ticker-star">✳</span></span>)}</div></div>
      <section id="colecao" className="collection page-width">
        <div className="collection-top">
          <div><p className="eyebrow text-muted-foreground mb-3">{collectionEyebrow}</p><h2 className="section-title">{collectionTitle}<span className="text-muted-foreground text-sm font-sans ml-3">/ {String(currentProducts.length).padStart(2, '0')}</span></h2></div>
        </div>
        <div className="product-grid">{currentProducts.map(product => <article key={product.id}>
          <a href={`#produto-${product.id}`} className="product-image block" aria-label={`Ver ${product.name}`} onClick={event => { event.preventDefault(); setSelected(product); }}>
            <img src={product.image} alt={`Páginas do ${product.name}`} width={1024} height={1024} loading="lazy" />
            {product.label && <span className="product-label">{product.label}</span>}
          </a>
          <p className="product-category">{product.subtitle}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-bottom"><p className="font-medium text-sm">R$ {product.price}</p><Button variant="product" size="sm" onClick={() => setSelected(product)}>Ver produto <ArrowUpRight /></Button></div>
        </article>)}</div>
      </section>
      <section id="sobre" className="about-band"><div className="about-inner page-width"><div><p className="eyebrow text-muted-foreground mb-3">MENOS COMPLICAÇÃO, MAIS CRIAÇÃO</p><h2 className="section-title">{aboutTitle}</h2></div><p className="text-muted-foreground text-sm leading-7">{aboutCopy}</p></div></section>
      <section id="duvidas" className="faq page-width"><div><p className="eyebrow text-muted-foreground mb-3">VALE SABER</p><h2 className="section-title">Alguma dúvida?</h2></div><div>{[
        ['O que encontro na coleção?', 'Modelos de documentos e guias para projetos criativos. Explore cada produto para conhecer a proposta.'],
        ['Posso personalizar os materiais?', 'A proposta dos modelos é servir como ponto de partida para sua identidade, seus textos e suas ideias.'],
        ['Onde vejo os detalhes de cada produto?', 'Os detalhes estão disponíveis na apresentação de cada item da coleção.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}<Plus size={16} className="shrink-0" /></summary><p>{answer}</p></details>)}</div></section>
    </main>
    <footer className="footer page-width"><a href="#" className="brand">{shopName}.</a><p className="text-xs text-muted-foreground">© 2026 {shopName}. Feito para criar.</p><a href="#colecao" className="nav-link flex items-center gap-2">Voltar à coleção <ArrowUpRight size={15} /></a></footer>

    {editorOpen && <div className="editor-overlay" onClick={() => setEditorOpen(false)}>
      <section className="editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title" onClick={event => event.stopPropagation()}>
        <div className="editor-heading"><div><p className="eyebrow text-muted-foreground">SEU ESPAÇO DE EDIÇÃO</p><h2 id="editor-title">Personalizar loja</h2><p>Edite os campos e acompanhe a prévia ao vivo na página.</p></div><button className="editor-close" aria-label="Fechar editor" onClick={() => setEditorOpen(false)}><X size={20} /></button></div>
        <div className="editor-content">
          <fieldset className="editor-group"><legend>Identidade da loja</legend>
            <label>Nome da loja<input value={shopName} onChange={e => setShopName(e.target.value)} /></label>
            <label>Frase pequena acima do título<input value={eyebrow} onChange={e => setEyebrow(e.target.value)} /></label>
            <label>Título principal<input value={headline} onChange={e => setHeadline(e.target.value)} /></label>
            <label>Texto de apresentação<textarea rows={3} value={heroCopy} onChange={e => setHeroCopy(e.target.value)} /></label>
          </fieldset>
          <fieldset className="editor-group"><legend>Vitrine e sobre</legend>
            <label>Chamada da coleção<input value={collectionEyebrow} onChange={e => setCollectionEyebrow(e.target.value)} /></label>
            <label>Título da coleção<input value={collectionTitle} onChange={e => setCollectionTitle(e.target.value)} /></label>
            <label>Título da seção “Sobre”<input value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} /></label>
            <label>Texto da seção “Sobre”<textarea rows={3} value={aboutCopy} onChange={e => setAboutCopy(e.target.value)} /></label>
          </fieldset>
          <fieldset className="editor-group"><legend>Cores</legend>
            <label className="color-field">Fundo do destaque <input type="color" value={heroColor} onChange={e => setHeroColor(e.target.value)} /><span>{heroColor}</span></label>
            <label className="color-field">Fundo da página <input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} /><span>{backgroundColor}</span></label>
          </fieldset>
          <fieldset className="editor-group"><legend>Produtos</legend>
            {editableProducts.map((product, index) => <div className="editor-product" key={product.id}>
              <h3>Produto {index + 1}</h3>
              <label>Nome<input value={product.name} onChange={e => updateProduct(product.id, 'name', e.target.value)} /></label>
              <label>Subtítulo<input value={product.subtitle} onChange={e => updateProduct(product.id, 'subtitle', e.target.value)} /></label>
              <label>Preço (R$)<input value={product.price} onChange={e => updateProduct(product.id, 'price', e.target.value)} /></label>
              <label>Etiqueta (opcional)<input value={product.label} onChange={e => updateProduct(product.id, 'label', e.target.value)} /></label>
              <label>Descrição do produto<textarea rows={3} value={product.description} onChange={e => updateProduct(product.id, 'description', e.target.value)} /></label>
            </div>)}
          </fieldset>
        </div>
        <div className="editor-footer"><div className="editor-status" role="status">{savedMessage || <><Eye size={14} /> A prévia muda enquanto você edita</>}</div><div className="flex gap-2"><Button variant="outline" onClick={resetConfig}><RotateCcw size={15} /> Restaurar</Button><Button onClick={saveConfig}><Save size={15} /> Salvar</Button></div></div>
      </section>
    </div>}

    {selected && <div className="detail-overlay" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" onClick={event => event.stopPropagation()}><img src={selected.image} alt={selected.name} width={1024} height={1024} className="w-full rounded-md object-cover" /><div className="pt-8"><Button autoFocus variant="ghost" size="icon" aria-label="Fechar produto" className="absolute top-2 right-2" onClick={() => setSelected(null)}><X /></Button><p className="eyebrow text-muted-foreground">{selected.category}</p><h2 id="product-title" className="section-title mt-4">{selected.name}</h2><p className="text-sm text-muted-foreground leading-7 my-5">{selected.description}</p><p className="text-xl font-medium">R$ {selected.price}</p><p className="text-xs text-muted-foreground mt-5">Produto e preço ilustrativos.</p></div></section></div>}
  </div>;
}
