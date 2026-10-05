/*
 * verificar-localizadores.js
 * -------------------------------------------------------------
 * Valida los 7 objetivos de la tarea (CSS + XPath) sobre la
 * página StartBootstrap/index.html.
 *
 * USO: abrí StartBootstrap/index.html en el navegador, abrí la
 * consola (F12 > Console), pegá TODO este archivo y Enter.
 * Imprime una tabla: cada objetivo debe dar CSS_count = 1,
 * XPath_count = 1 y mismo_nodo = true.
 * -------------------------------------------------------------
 */
(() => {
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const $x = (xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return Array.from({ length: r.snapshotLength }, (_, i) => r.snapshotItem(i));
  };

  const objetivos = [
    {
      n: 1,
      desc: 'Elemento con el texto "START BOOTSTRAP" (masthead heading)',
      css: 'h1.masthead-heading',
      xpath: "//h1[contains(@class,'masthead-heading')]",
      esperado: (el) => el.tagName === 'H1' && el.textContent.trim() === 'Start Bootstrap',
    },
    {
      n: 2,
      desc: 'Elemento con "Graphic Artist - Web Designer - Illustrator"',
      css: 'p.masthead-subheading',
      xpath: "//p[contains(@class,'masthead-subheading')]",
      esperado: (el) => el.textContent.includes('Graphic Artist - Web Designer - Illustrator'),
    },
    {
      n: 3,
      desc: 'PADRE del parrafo "Freelancer is a free bootstrap theme..."',
      css: '#about .row > div.col-lg-4.ms-auto',
      xpath: "//p[contains(.,'Freelancer is a free bootstrap theme created by Start Bootstrap')]/parent::div",
      esperado: (el) => el.tagName === 'DIV' && el.querySelector('p.lead') && el.classList.contains('ms-auto'),
    },
    {
      n: 4,
      desc: 'PADRE del parrafo "2215 John Daniel Drive / Clark, MO 65243"',
      css: 'footer .row > div.col-lg-4:first-child',
      xpath: "//p[contains(.,'2215 John Daniel Drive')]/parent::div",
      esperado: (el) => el.tagName === 'DIV' && el.textContent.includes('2215 John Daniel Drive') && !!el.querySelector('h4'),
    },
    {
      n: 5,
      desc: 'Boton de la red social LinkedIn',
      css: 'a.btn-social:has(.fa-linkedin-in)',
      xpath: "//a[.//*[contains(@class,'fa-linkedin-in')]]",
      esperado: (el) => el.tagName === 'A' && !!el.querySelector('.fa-linkedin-in'),
    },
    {
      n: 6,
      desc: 'Boton de descarga "Free Download!"',
      css: '#about a.btn-xl',
      xpath: "//a[contains(normalize-space(.),'Free Download!')]",
      esperado: (el) => el.tagName === 'A' && el.textContent.includes('Free Download!'),
    },
    {
      n: 7,
      desc: 'Contenedor de la imagen cabin.png (miniatura del portfolio)',
      css: "#portfolio .portfolio-item:has(img[src$='cabin.png'])",
      xpath: "//div[contains(@class,'portfolio-item')][.//img[contains(@src,'cabin.png')]]",
      esperado: (el) => el.tagName === 'DIV' && el.classList.contains('portfolio-item') && !!el.querySelector("img[src$='cabin.png']"),
    },
  ];

  const filas = objetivos.map((o) => {
    let cssNodes = [];
    let cssError = '';
    try { cssNodes = $$(o.css); } catch (e) { cssError = e.message; }
    const xpNodes = $x(o.xpath);
    const cssEl = cssNodes[0] || null;
    const xpEl = xpNodes[0] || null;
    return {
      Obj: o.n,
      Descripcion: o.desc,
      CSS_count: cssError ? `ERR: ${cssError}` : cssNodes.length,
      XPath_count: xpNodes.length,
      mismo_nodo: !!cssEl && cssEl === xpEl,
      cumple_esperado: !!cssEl && !!xpEl && o.esperado(cssEl) && o.esperado(xpEl),
      OK: cssNodes.length === 1 && xpNodes.length === 1 && cssEl === xpEl && !!cssEl && o.esperado(cssEl),
    };
  });

  console.table(filas);
  const total = filas.length;
  const pasan = filas.filter((f) => f.OK).length;
  console.log(`%cResultado: ${pasan}/${total} objetivos OK`, `font-weight:bold;color:${pasan === total ? 'green' : 'red'}`);
  if (pasan !== total) {
    console.warn('Objetivos con problema:', filas.filter((f) => !f.OK).map((f) => f.Obj));
  }
  return filas;
})();
