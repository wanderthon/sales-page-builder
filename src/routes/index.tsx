import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ArrowDown, Plus, X, Settings2, Save, RotateCcw, Eye } from 'lucide-react';
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
  { id: 1, name: 'MODELOS DE CONTRATOS', category: 'Modelos', subtitle: '8 MODELOS PRONTOS', price: '49,90', buyUrl: '', image: proposta, label: 'MAIS VENDIDO', description: 'Uma apresentação bem pensada para valorizar suas ideias. Um modelo de proposta comercial com espaço para o projeto, o processo e o investimento.' },
  { id: 2, name: 'ROTEIROS DE BRIEFINGS', category: 'Modelos', subtitle: '8 MODELOS PRONTOS', price: '39,90', buyUrl: '', image: orcamento, label: '', description: 'O essencial, sem complicar. Um modelo de orçamento com uma estrutura clara para apresentar serviços, prazos e valores.' },
];
type Product = typeof initialProducts[number];
type EditableProduct = Pick<Product, 'id' | 'name' | 'category' | 'subtitle' | 'price' | 'buyUrl' | 'label' | 'description' | 'image'>;

const CONFIG_KEY = 'sales-page-builder-config';
const DB_NAME = 'sales-page-builder';
const STORE_NAME = 'settings';

function openConfigDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Não foi possível abrir o banco local.'));
  });
}

async function readSavedConfig(): Promise<any | null> {
  try {
    if ('indexedDB' in window) {
      const db = await openConfigDb();
      const value = await new Promise<any>((resolve, reject) => {
        const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(CONFIG_KEY);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => reject(request.error);
      });
      db.close();
      if (value) return value;
    }
  } catch (error) { console.warn('IndexedDB indisponível, tentando armazenamento local.', error); }
  const legacy = window.localStorage.getItem(CONFIG_KEY);
  return legacy ? JSON.parse(legacy) : null;
}

async function writeSavedConfig(config: unknown): Promise<void> {
  let databaseError: unknown;
  try {
    if (!('indexedDB' in window)) throw new Error('IndexedDB indisponível.');
    const db = await openConfigDb();
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        transaction.objectStore(STORE_NAME).put(config, CONFIG_KEY);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error ?? new Error('Falha ao gravar as alterações.'));
        transaction.onabort = () => reject(transaction.error ?? new Error('O navegador cancelou a gravação.'));
      });
      return;
    } finally { db.close(); }
  } catch (error) {
    databaseError = error;
  }
  try {
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (fallbackError) {
    const detail = fallbackError instanceof Error ? fallbackError.message : 'armazenamento local indisponível';
    throw new Error('O navegador bloqueou o salvamento (' + detail + '). Tente uma imagem menor ou permita o armazenamento do site.');
  }
  if (databaseError) console.warn('Configuração salva no armazenamento alternativo.', databaseError);
}

async function removeSavedConfig(): Promise<void> {
  window.localStorage.removeItem(CONFIG_KEY);
  if (!('indexedDB' in window)) return;
  const db = await openConfigDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(CONFIG_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Não foi possível remover as configurações.'));
    });
  } finally { db.close(); }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Não foi possível ler a imagem.'));
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));
    reader.readAsDataURL(file);
  });
}

const defaults = {
  shopName: 'seu estúdio',
  eyebrow: 'PEQUENOS RECURSOS. GRANDES POSSIBILIDADES.',
  headline: 'Sua loja',
  heroCopy: 'Boas ideias merecem um bom começo.\nModelos e guias para o seu próximo projeto.',
  collectionEyebrow: 'ESCOLHIDOS PARA VOCÊ',
  collectionTitle: 'A coleção',
  aboutTitle: 'Espaço para suas boas ideias.',
  aboutCopy: 'Uma coleção de recursos que simplificam o começo e deixam o resto com você. Porque cada projeto tem uma história, e a próxima pode ser a sua.',
  heroColor: '#f5f4ef',
  backgroundColor: '#fbfaf6',
  logoDot: '.',
  logoDotColor: '#777777',
  heroImage: '',
  contactLink: '',
  instagram: '',
};

const defaultMicrocopy = {
  navAbout: 'Sobre', navFaq: 'Dúvidas', navStore: 'A loja', heroButton: 'Explore a coleção',
  tickerOne: 'ARQUIVOS PARA BOAS IDEIAS', tickerTwo: 'CRIE DO SEU JEITO',
  stampTop: 'feito para', stampBottom: 'criar mais', collectionCta: 'Compre aqui',
  aboutEyebrow: 'MENOS COMPLICAÇÃO, MAIS CRIAÇÃO', faqEyebrow: 'VALE SABER', faqTitle: 'Alguma dúvida?',
  footerTagline: 'Feito para criar.', footerBack: 'Voltar à coleção', contactTitle: 'Vamos conversar?',
  detailsButton: 'Detalhes', detailPriceNote: 'O preço pode ser informado na página de compra.', footerCopyright: '© 2026',
  phoneLabel: 'Conversar no privado', instagramLabel: 'Ver perfil no Instagram',
};

const defaultFaqs = [
  { question: 'O que encontro na coleção?', answer: 'Modelos de documentos e guias para projetos criativos. Explore cada produto para conhecer a proposta.' },
  { question: 'Posso personalizar os materiais?', answer: 'A proposta dos modelos é servir como ponto de partida para sua identidade, seus textos e suas ideias.' },
  { question: 'Onde vejo os detalhes de cada produto?', answer: 'Os detalhes estão disponíveis na apresentação de cada item da coleção.' },
];

function Shop() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);
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
  const [logoDot, setLogoDot] = useState(defaults.logoDot);
  const [logoDotColor, setLogoDotColor] = useState(defaults.logoDotColor);
  const [heroImage, setHeroImage] = useState(defaults.heroImage);
  const [contactLink, setContactLink] = useState(defaults.contactLink);
  const [instagram, setInstagram] = useState(defaults.instagram);
  const [microcopy, setMicrocopy] = useState(defaultMicrocopy);
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [editableProducts, setEditableProducts] = useState<EditableProduct[]>(initialProducts.map(({ id, name, category, subtitle, price, buyUrl, label, description, image }) => ({ id, name, category, subtitle, price, buyUrl, label, description, image })));

  useEffect(() => {
    let active = true;
    readSavedConfig().then((config) => {
      if (!active) return;
      if (!config) { setConfigLoaded(true); return; }
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
      setLogoDot(config.logoDot ?? defaults.logoDot);
      setLogoDotColor(config.logoDotColor ?? defaults.logoDotColor);
      setHeroImage(config.heroImage ?? defaults.heroImage);
      setContactLink(config.contactLink ?? '');
      setInstagram(config.instagram ?? defaults.instagram);
      setMicrocopy({ ...defaultMicrocopy, ...(config.microcopy ?? {}) });
      setFaqs(Array.isArray(config.faqs) ? config.faqs : defaultFaqs);
      if (Array.isArray(config.products)) {
        setEditableProducts(initialProducts.map((base) => ({ ...base, ...config.products.find((item: EditableProduct) => item.id === base.id) })));
      }
      setConfigLoaded(true);
    }).catch((error) => {
      console.error('Não foi possível carregar as alterações salvas.', error);
      if (active) setSavedMessage('Não consegui carregar o salvamento anterior. Você pode salvar novamente.');
    });
    return () => { active = false; };
  }, []);

  // Salvamento automático: evita perder alterações se a pessoa esquecer de clicar em Salvar.
  useEffect(() => {
    if (!configLoaded) return;
    const config = {
      shopName, eyebrow, headline, heroCopy, collectionEyebrow, collectionTitle,
      aboutTitle, aboutCopy, heroColor, backgroundColor, logoDot, logoDotColor, heroImage,
      contactLink, instagram, microcopy, faqs, products: editableProducts,
      savedAt: new Date().toISOString(),
    };
    const timeout = window.setTimeout(() => {
      writeSavedConfig(config).then(() => {
        setSavedMessage('Salvo automaticamente neste navegador.');
      }).catch((error) => {
        console.error('Falha no salvamento automático:', error);
        setSavedMessage(error instanceof Error ? 'Falha no salvamento automático: ' + error.message : 'Falha no salvamento automático. Clique em Salvar para tentar novamente.');
      });
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [configLoaded, shopName, eyebrow, headline, heroCopy, collectionEyebrow, collectionTitle, aboutTitle, aboutCopy, heroColor, backgroundColor, logoDot, logoDotColor, heroImage, contactLink, instagram, microcopy, faqs, editableProducts]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', escape); };
  }, [selected]);

  const currentProducts: Product[] = initialProducts.map((product) => {
    const editable = editableProducts.find((item) => item.id === product.id);
    return { ...product, ...editable, image: editable?.image || product.image };
  });

  function updateProduct(id: number, key: Exclude<keyof EditableProduct, 'id'>, value: string) {
    setEditableProducts((current) => current.map((product) => product.id === id ? { ...product, [key]: value } : product));
  }

  function updateFaq(index: number, key: 'question' | 'answer', value: string) {
    setFaqs((current) => current.map((faq, i) => i === index ? { ...faq, [key]: value } : faq));
  }

  function updateMicrocopy(key: keyof typeof defaultMicrocopy, value: string) {
    setMicrocopy((current) => ({ ...current, [key]: value }));
  }

  async function saveConfig() {
    setSavedMessage('Salvando…');
    try {
      await writeSavedConfig({
        shopName, eyebrow, headline, heroCopy, collectionEyebrow, collectionTitle,
        aboutTitle, aboutCopy, heroColor, backgroundColor, logoDot, logoDotColor, heroImage,
        contactLink, instagram, microcopy, faqs, products: editableProducts,
        savedAt: new Date().toISOString(),
      });
      setSavedMessage('Salvo! As alterações continuam neste navegador mesmo após fechar a página.');
    } catch (error) {
      console.error('Falha ao salvar configurações:', error);
      setSavedMessage(error instanceof Error ? 'Erro ao salvar: ' + error.message : 'Não foi possível salvar. Tente outro navegador.');
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
    setLogoDot(defaults.logoDot);
    setLogoDotColor(defaults.logoDotColor);
    setHeroImage(defaults.heroImage);
    setContactLink(defaults.contactLink);
    setInstagram(defaults.instagram);
    setMicrocopy(defaultMicrocopy);
    setFaqs(defaultFaqs);
    setEditableProducts(initialProducts.map(({ id, name, category, subtitle, price, buyUrl, label, description, image }) => ({ id, name, category, subtitle, price, buyUrl, label, description, image })));
    removeSavedConfig().then(() => setSavedMessage('Visual restaurado para o padrão.')).catch((error) => setSavedMessage('Visual restaurado na tela, mas não consegui apagar o salvamento: ' + String(error)));
  }

  return <div className="shop-shell" style={{ '--hero': heroColor, '--background': backgroundColor } as CSSProperties}>
    <header className="site-header page-width">
      <a href="#" className="brand" aria-label={shopName + ', início'}>{shopName}<span style={{ color: logoDotColor }}>{logoDot}</span></a>
      <nav className="flex items-center gap-3 sm:gap-7" aria-label="Navegação principal">
        <a className="nav-link hidden sm:block" href="#sobre">{microcopy.navAbout}</a>
        <a className="nav-link hidden sm:block" href="#duvidas">{microcopy.navFaq}</a>
        <Button variant="outline" size="sm" onClick={() => setEditorOpen(true)}><Settings2 size={15} /> Editar loja</Button>
        <Button variant="outline" size="sm" asChild><a href="#colecao">{microcopy.navStore} <ArrowUpRight /></a></Button>
      </nav>
    </header>
    <main>
      <section className={`hero${heroImage ? ' has-hero-image' : ''}`} style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.12), rgba(0,0,0,.03)), url("${heroImage}")`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff' } : undefined}>
        <div className="hero-inner page-width">
          {!heroImage && <h1 className="hero-title">{headline}<span className="text-background">.</span></h1>}
          <div className="hero-bottom">
            <p className="hero-copy">{heroCopy.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p>
            <Button variant="shop" size="lg" asChild><a href="#colecao">{microcopy.heroButton} <ArrowDown /></a></Button>
          </div>
        </div>
      </section>
      <div className="ticker" aria-hidden="true"><div className="ticker-track">{Array.from({ length: 10 }, (_, i) => <span className="flex items-center gap-9" key={i}>{microcopy.tickerOne} <span className="ticker-star">✳</span> {microcopy.tickerTwo} <span className="ticker-star">✳</span></span>)}</div></div>
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
          <div className="product-bottom"><Button variant="product" size="sm" asChild><a href={product.buyUrl || '#produto-' + product.id} target={product.buyUrl ? '_blank' : undefined} rel={product.buyUrl ? 'noreferrer' : undefined}>{microcopy.collectionCta} <ArrowUpRight /></a></Button><Button variant="ghost" size="sm" onClick={() => setSelected(product)}>{microcopy.detailsButton} <ArrowUpRight /></Button></div>
        </article>)}</div>
      </section>
      <section id="sobre" className="about-band"><div className="about-inner page-width"><div><p className="eyebrow text-muted-foreground mb-3">{microcopy.aboutEyebrow}</p><h2 className="section-title">{aboutTitle}</h2></div><p className="text-muted-foreground text-sm leading-7">{aboutCopy}</p></div></section>
      <section id="duvidas" className="faq page-width"><div><p className="eyebrow text-muted-foreground mb-3">{microcopy.faqEyebrow}</p><h2 className="section-title">{microcopy.faqTitle}</h2></div><div>{faqs.map((faq, index) => <details key={index}><summary>{faq.question}<Plus size={16} className="shrink-0" /></summary><p>{faq.answer}</p></details>)}</div></section>
    </main>
    <section className="contact-band page-width"><div><p className="eyebrow text-muted-foreground mb-3">{microcopy.contactTitle}</p><div className="contact-links">{contactLink && <a href={contactLink} target="_blank" rel="noreferrer">{microcopy.phoneLabel} <ArrowUpRight size={15} /></a>}{instagram && <a href={instagram.startsWith('http') ? instagram : 'https://instagram.com/' + instagram.replace(/^@/, '')} target="_blank" rel="noreferrer">{microcopy.instagramLabel} <ArrowUpRight size={15} /></a>}</div></div></section>
    <footer className="footer page-width"><a href="#" className="brand">{shopName}<span style={{ color: logoDotColor }}>{logoDot}</span></a><p className="text-xs text-muted-foreground">{microcopy.footerCopyright} {shopName}. {microcopy.footerTagline}</p><a href="#colecao" className="nav-link flex items-center gap-2">{microcopy.footerBack} <ArrowUpRight size={15} /></a></footer>

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
          <fieldset className="editor-group"><legend>Logo, cores e imagem de destaque</legend>
            <label className="color-field">Cor de fundo (sem foto) <input type="color" value={heroColor} onChange={e => setHeroColor(e.target.value)} /><span>{heroColor}</span></label>
            <label className="color-field">Fundo da página <input type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} /><span>{backgroundColor}</span></label>
            <label>URL da imagem de destaque<input type="url" placeholder="https://exemplo.com/foto.jpg" value={heroImage.startsWith('data:') ? '' : heroImage} onChange={e => setHeroImage(e.target.value)} /></label>
            <label className="image-upload-label">Enviar foto do computador<input type="file" accept="image/*" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { setSavedMessage('Escolha um arquivo de imagem.'); return; } if (file.size > 8 * 1024 * 1024) { setSavedMessage('A imagem precisa ter até 8 MB.'); return; } try { setHeroImage(await fileToDataUrl(file)); setSavedMessage('Foto de destaque carregada. Clique em Salvar para guardar.'); } catch (error) { setSavedMessage(error instanceof Error ? error.message : 'Falha ao carregar imagem.'); } e.currentTarget.value = ''; }} /></label>
            {heroImage && <><img className="editor-image-preview" src={heroImage} alt="Prévia da imagem de destaque" /><Button variant="outline" size="sm" onClick={() => setHeroImage('')}>Remover foto de destaque</Button></>}
          </fieldset>
          <fieldset className="editor-group"><legend>Contatos</legend>
            <label>Link para conversa no privado<input type="url" value={contactLink} onChange={e => setContactLink(e.target.value)} placeholder="https://wa.me/... ou link de mensagem" /></label>
            <p className="editor-help">Cole o link direto que abre a conversa privada, por exemplo um link do WhatsApp, Instagram Direct ou outra plataforma.</p>
            <label>Link do perfil do Instagram<input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/seuperfil" /></label>
          </fieldset>
          <fieldset className="editor-group"><legend>Textos menores do site</legend>
            {(Object.keys(defaultMicrocopy) as Array<keyof typeof defaultMicrocopy>).map(key => <label key={key}>{({ navAbout: 'Link Sobre', navFaq: 'Link Dúvidas', navStore: 'Botão A loja', heroButton: 'Botão do destaque', tickerOne: 'Faixa animada: primeira frase', tickerTwo: 'Faixa animada: segunda frase', stampTop: 'Selo redondo: frase superior', stampBottom: 'Selo redondo: frase inferior', collectionCta: 'Botão de compra', aboutEyebrow: 'Chamada da seção Sobre', faqEyebrow: 'Chamada das dúvidas', faqTitle: 'Título das dúvidas', footerTagline: 'Frase do rodapé', footerBack: 'Link do rodapé', contactTitle: 'Título dos contatos', phoneLabel: 'Texto do botão de contato', instagramLabel: 'Texto do botão do Instagram', detailsButton: 'Botão de detalhes do produto', detailPriceNote: 'Observação abaixo da descrição do produto', footerCopyright: 'Texto de direitos autorais' } as Record<keyof typeof defaultMicrocopy, string>)[key]}<input value={microcopy[key]} onChange={e => updateMicrocopy(key, e.target.value)} /></label>)}
          </fieldset>
          <fieldset className="editor-group"><legend>Dúvidas frequentes</legend>
            {faqs.map((faq, index) => <div className="editor-product" key={index}><h3>Pergunta {index + 1}</h3><label>Pergunta<input value={faq.question} onChange={e => updateFaq(index, 'question', e.target.value)} /></label><label>Resposta<textarea rows={3} value={faq.answer} onChange={e => updateFaq(index, 'answer', e.target.value)} /></label><Button variant="outline" size="sm" onClick={() => setFaqs(current => current.filter((_, i) => i !== index))}>Remover pergunta</Button></div>)}
            <Button variant="outline" onClick={() => setFaqs(current => [...current, { question: 'Nova pergunta', answer: 'Escreva a resposta aqui.' }])}><Plus size={15} /> Adicionar pergunta</Button>
          </fieldset>
          <fieldset className="editor-group"><legend>Produtos</legend>
            {editableProducts.map((product, index) => <div className="editor-product" key={product.id}>
              <h3>Produto {index + 1}</h3>
              <label>Nome<input value={product.name} onChange={e => updateProduct(product.id, 'name', e.target.value)} /></label>
              <label>Categoria<input value={product.category} onChange={e => updateProduct(product.id, 'category', e.target.value)} /></label>
              <label>Subtítulo<input value={product.subtitle} onChange={e => updateProduct(product.id, 'subtitle', e.target.value)} /></label>
              <label>Preço (R$), opcional<input value={product.price} onChange={e => updateProduct(product.id, 'price', e.target.value)} /></label>
              <label>Link do botão “Compre aqui”<input type="url" placeholder="https://checkout..." value={product.buyUrl} onChange={e => updateProduct(product.id, 'buyUrl', e.target.value)} /></label>
              <label>Etiqueta (opcional)<input value={product.label} onChange={e => updateProduct(product.id, 'label', e.target.value)} /></label>
              <label>Descrição do produto<textarea rows={3} value={product.description} onChange={e => updateProduct(product.id, 'description', e.target.value)} /></label>
              <label>URL da imagem<input type="url" placeholder="https://exemplo.com/imagem.jpg" value={product.image.startsWith('data:') || product.image.startsWith('/assets/') ? '' : product.image} onChange={e => updateProduct(product.id, 'image', e.target.value)} /></label>
              <label className="image-upload-label">Enviar imagem do computador<input type="file" accept="image/*" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { setSavedMessage('Escolha um arquivo de imagem.'); return; } if (file.size > 8 * 1024 * 1024) { setSavedMessage('A imagem precisa ter até 8 MB.'); return; } try { const dataUrl = await fileToDataUrl(file); updateProduct(product.id, 'image', dataUrl); setSavedMessage('Imagem carregada. Clique em Salvar para guardar a alteração.'); } catch (error) { setSavedMessage(error instanceof Error ? error.message : 'Falha ao carregar imagem.'); } e.currentTarget.value = ''; }} /></label>
              <img className="editor-image-preview" src={product.image} alt={'Prévia de ' + product.name} />
            </div>)}
          </fieldset>
        </div>
        <div className="editor-footer"><div className="editor-status" role="status">{savedMessage || <><Eye size={14} /> A prévia muda ao editar. Clique em Salvar para guardar.</>}</div><div className="flex gap-2"><Button variant="outline" onClick={resetConfig}><RotateCcw size={15} /> Restaurar</Button><Button onClick={saveConfig}><Save size={15} /> Salvar</Button></div></div>
      </section>
    </div>}

    {selected && <div className="detail-overlay" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" onClick={event => event.stopPropagation()}><img src={selected.image} alt={selected.name} width={1024} height={1024} className="w-full rounded-md object-cover" /><div className="detail-modal-copy"><Button autoFocus variant="ghost" size="icon" aria-label="Fechar produto" className="absolute top-2 right-2" onClick={() => setSelected(null)}><X /></Button><p className="eyebrow text-muted-foreground">{selected.category}</p><h2 id="product-title" className="section-title mt-4">{selected.name}</h2><p className="text-sm text-muted-foreground leading-7 my-5">{selected.description}</p><p className="text-xs text-muted-foreground mt-5">{microcopy.detailPriceNote}</p><Button variant="shop" size="lg" className="mt-4" asChild><a href={selected.buyUrl || '#colecao'} target={selected.buyUrl ? '_blank' : undefined} rel={selected.buyUrl ? 'noreferrer' : undefined}>{microcopy.collectionCta} <ArrowUpRight /></a></Button></div></section></div>}
  </div>;
}
