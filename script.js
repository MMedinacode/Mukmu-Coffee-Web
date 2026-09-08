/* ---------- DATOS DE LA CARTA ----------
   Verificado en Google Maps (pestaña Menú) el 08-09-2026: categorías
   reales (Preparaciones Calientes/Frías, Filtrados, Pastelería,
   Sandwich). Los precios de café/bebidas vienen de una foto real de la
   pizarra del local (subida por una clienta, fechada feb-2023) — se
   muestran como referencia con la fecha visible, no como tarifa 2026
   confirmada. La pastelería y los sándwiches NO tienen precio
   confirmado en ningún canal — se muestran "Consultar". */
const MENU = {
  caliente: {
    label: 'Café Caliente',
    table: true,
    sizes: ['Precio ref. (pizarra feb-2023)'],
    rows: [
      ['Ristretto 4oz', 2900],
      ['Espresso 4oz', 3000],
      ['Lungo 4oz', 3200],
      ['Macchiato 4oz', 3200],
      ['Capuccino sabor 8oz', 4100],
      ['Americano 12oz', 3250],
      ['Latte sabor 12oz', 4500],
      ['Mokaccino', 4500],
      ['Chocolate caliente', 4700],
      ['Té 12oz', 2500],
    ]
  },
  frio: {
    label: 'Café Frío',
    table: true,
    sizes: ['Precio ref. (pizarra feb-2023)'],
    rows: [
      ['Espresso Tonic 16oz', 6000],
      ['Café Helado 16oz', 5800],
      ['Latte Frío 16oz', 4500],
      ['Affogato 8oz', 4000],
      ['Frappe', 5800],
      ['Smoothie', 5600],
    ]
  },
  filtrados: {
    label: 'Filtrados',
    groups: [{ title: 'Destacados reales de la carta', items: [
      { n: 'Kalita' },
      { n: 'Flat White' },
      { n: 'Coffee Orange Tonic' },
    ]}]
  },
  pasteleria: {
    label: 'Pastelería y Sandwich',
    groups: [
      { title: 'Pastelería', items: [
        { n: 'Croissant Jamón Queso', img: 'fotos/interior-mokaccino.jpg' },
        { n: 'Rollo de Canela' },
        { n: 'Torta Red Velvet' },
        { n: 'Cheesecake Maracuyá' },
        { n: 'Canelé' },
        { n: 'Torta de Zanahoria' },
        { n: 'Vegan Carrot Cake Slice', v: 1 },
        { n: 'Opciones sin gluten', v: 1, d: 'Categoría propia real en la carta: Pastelería Sin Gluten' },
      ]},
      { title: 'Sandwich', items: [
        { n: 'Sandwich (ver variedades en el local)' },
      ]}
    ]
  }
};

const money = n => n ? '$' + n.toLocaleString('es-CL') : 'Consultar';

const tabsEl = document.getElementById('menuTabs');
const panelsEl = document.getElementById('menuPanels');
const catKeys = Object.keys(MENU);

catKeys.forEach((key, i) => {
  const tab = document.createElement('button');
  tab.className = 'menu-tab' + (i===0 ? ' active':'');
  tab.textContent = MENU[key].label;
  tab.addEventListener('click', () => showTab(key));
  tab.dataset.key = key;
  tabsEl.appendChild(tab);

  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i===0 ? ' active':'');
  panel.id = 'panel-' + key;

  if(MENU[key].table){
    const hint = document.createElement('p');
    hint.className = 'price-table-hint';
    hint.textContent = 'Desliza para ver la tabla completa →';
    panel.appendChild(hint);
    const wrap = document.createElement('div');
    wrap.className = 'price-table-wrap';
    const table = document.createElement('table');
    table.className = 'price-table';
    const thead = document.createElement('tr');
    thead.innerHTML = '<th></th>' + MENU[key].sizes.map(s => `<th>${s}</th>`).join('');
    table.appendChild(thead);
    MENU[key].rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="name">${row[0]}</td>` + row.slice(1).map(p => `<td class="mono">${money(p)}</td>`).join('');
      table.appendChild(tr);
    });
    wrap.appendChild(table);
    panel.appendChild(wrap);
    const note = document.createElement('p');
    note.className = 'menu-note';
    note.textContent = 'Precios sacados de una foto real de la pizarra del local (feb-2023) — pueden haber cambiado, confirmar en el local.';
    panel.appendChild(note);
    panelsEl.appendChild(panel);
    return;
  }

  MENU[key].groups.forEach(group => {
    if(group.title){
      const h = document.createElement('div');
      h.className = 'menu-group-title';
      h.textContent = group.title;
      panel.appendChild(h);
    }
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'menu-item';
      row.addEventListener('click', () => openModal(item));

      if(item.img){
        const photo = document.createElement('div');
        photo.className = 'menu-item-photo';
        const photoImg = document.createElement('img');
        photoImg.src = item.img;
        photoImg.alt = item.n;
        photo.appendChild(photoImg);
        row.appendChild(photo);
      }

      const textWrap = document.createElement('div');
      textWrap.className = 'menu-item-text';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'name';
      nameSpan.textContent = item.n;
      textWrap.appendChild(nameSpan);

      if(item.v){
        const vegTag = document.createElement('span');
        vegTag.className = 'veg-tag';
        vegTag.textContent = 'INFO';
        textWrap.appendChild(vegTag);
      }

      if(item.d){
        const descDiv = document.createElement('div');
        descDiv.className = 'desc';
        descDiv.textContent = item.d;
        textWrap.appendChild(descDiv);
      }

      const priceDiv = document.createElement('div');
      priceDiv.className = 'price mono';
      priceDiv.textContent = money(item.p);

      row.appendChild(textWrap);
      row.appendChild(priceDiv);
      grid.appendChild(row);
    });
    panel.appendChild(grid);
  });
  panelsEl.appendChild(panel);
});

function showTab(key){
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + key));
}

/* ---------- MODAL PRODUCTO ---------- */
let currentItem = null;
function openModal(item){
  currentItem = item;
  document.getElementById('modalName').textContent = item.n;
  document.getElementById('modalPrice').textContent = money(item.p);
  document.getElementById('modalDesc').textContent = item.d || 'Preparado real de la carta de Mukmu Coffee.';
  const photoWrap = document.getElementById('modalPhoto');
  if(item.img){
    photoWrap.innerHTML = '';
    const photoImg = document.createElement('img');
    photoImg.src = item.img;
    photoImg.alt = item.n;
    photoWrap.appendChild(photoImg);
    photoWrap.style.display = 'block';
  } else {
    photoWrap.style.display = 'none';
  }
  toggleModal(true);
}
document.getElementById('modalAddBtn').addEventListener('click', () => {
  addToCart(currentItem);
  toggleModal(false);
  toggleCart(true);
});
function toggleModal(open){ document.getElementById('modalOverlay').classList.toggle('open', open); }

/* ---------- CARRITO ---------- */
let cart = [];
function addToCart(item){
  const existing = cart.find(c => c.n === item.n);
  if(existing){ existing.qty++; } else { cart.push({...item, qty:1}); }
  renderCart();
}
function changeQty(name, delta){
  const line = cart.find(c => c.n === name);
  if(!line) return;
  line.qty += delta;
  if(line.qty <= 0) cart = cart.filter(c => c.n !== name);
  renderCart();
}
function renderCart(){
  const linesEl = document.getElementById('cartLines');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');
  const totalQty = cart.reduce((s,c) => s + c.qty, 0);
  countEl.textContent = totalQty;
  if(cart.length === 0){
    linesEl.innerHTML = '<p class="cart-empty">Todavía no agregaste nada.</p>';
    totalEl.textContent = 'A consultar';
    return;
  }
  linesEl.innerHTML = '';
  cart.forEach(line => {
    const div = document.createElement('div');
    div.className = 'cart-line';
    div.innerHTML = `
      <div>
        <div class="name">${line.n}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" data-name="${line.n}" data-delta="-1">−</button>
          <span class="mono">${line.qty}</span>
          <button class="qty-btn" data-name="${line.n}" data-delta="1">+</button>
        </div>
      </div>
      <div class="price mono">${money(line.p)}</div>
    `;
    linesEl.appendChild(div);
  });
  totalEl.textContent = 'A consultar';
  linesEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => changeQty(btn.dataset.name, parseInt(btn.dataset.delta)));
  });
}
document.getElementById('cartBtn').addEventListener('click', () => toggleCart(true));
document.getElementById('cartCloseBtn').addEventListener('click', () => toggleCart(false));
function toggleCart(open){ document.getElementById('cartOverlay').classList.toggle('open', open); }

document.getElementById('modalCloseBtn').addEventListener('click', () => toggleModal(false));
[document.getElementById('cartOverlay'), document.getElementById('modalOverlay')].forEach(ov => {
  ov.addEventListener('click', (e) => { if(e.target === ov) ov.classList.remove('open'); });
});

/* ---------- NAV MÓVIL Y NAVEGACIÓN POR PESTAÑAS ---------- */
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

const panels = document.querySelectorAll('.tab-panel');
function goToTab(tabId){
  panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabId));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('navLinks').classList.remove('open');
  initScrollReveal();
}

document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goToTab(el.dataset.tab);
  });
});

/* ---------- INDICADOR ABIERTO/CERRADO EN VIVO
   Verificado en Google Maps el 08-09-2026: Lun-Vie 8:00-20:00,
   Sábado cerrado, Domingo 10:00-19:00. ---------- */
function updateOpenStatus(dotId, textId){
  const dot = document.getElementById(dotId);
  const text = document.getElementById(textId);
  if(!dot || !text) return;
  const now = new Date();
  const day = now.getDay(); // 0 dom ... 6 sáb
  const minutes = now.getHours()*60 + now.getMinutes();
  let isOpen = false;
  if(day >= 1 && day <= 5){ isOpen = minutes >= (8*60) && minutes < (20*60); }
  else if(day === 0){ isOpen = minutes >= (10*60) && minutes < (19*60); }
  text.textContent = isOpen ? 'Abierto ahora' : 'Cerrado ahora';
  dot.classList.toggle('closed', !isOpen);
}
updateOpenStatus('statusDot', 'statusText');
updateOpenStatus('statusDot2', 'statusText2');

/* ---------- SCROLL REVEAL (entrada ordenada al hacer scroll) ----------
   Solo agrega/observa animación de entrada — la navegación sigue siendo
   100% por pestañas (SPA), esto NO es sticky-scroll. Incluye red de
   seguridad por si IntersectionObserver no dispara a tiempo (lección de
   Café Kanela/Café Del Mundo). */
function initScrollReveal(){
  const els = document.querySelectorAll('.reveal:not(.revealed)');
  if(!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el, i) => {
    el.style.transitionDelay = (Math.min(i % 6, 6) * 60) + 'ms';
    io.observe(el);
  });
  // Red de seguridad: si algo se queda sin revelar (observer no disparó),
  // forzarlo visible después de 1.2s para nunca perder contenido.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => el.classList.add('revealed'));
  }, 1200);
}
initScrollReveal();

/* ---------- PANTALLA DE CARGA (rápida, <1s) ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 350);
});
