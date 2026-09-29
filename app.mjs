import { calcula, defaults, tramsInicials } from './calculs.mjs';
const euro = n => new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' }).format(n);
const percent = n => new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 2 }).format(n) + ' %';
const enter = n => new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 2 }).format(n);
const form = document.querySelector('#formulari');
const tramsBody = document.querySelector('#files-trams');
const error = document.querySelector('#error');
const key = 'calculadora-rendibilitat-v1';
let saved;
try { saved = JSON.parse(localStorage.getItem(key)); } catch { /* Dades locals incorrectes. */ }
let trams = Array.isArray(saved?.trams) && saved.trams.length ? saved.trams : structuredClone(tramsInicials);
for (const [k, value] of Object.entries(defaults)) form.elements[k].value = Number.isFinite(Number(saved?.inputs?.[k])) && saved?.inputs?.[k] !== '' ? saved.inputs[k] : value;

function pintaTrams() {
  tramsBody.replaceChildren();
  trams.forEach((tram, i) => {
    const row = document.createElement('tr');
    for (const [field, label] of [['minim', 'Import mínim'], ['tipus', 'Percentatge']]) {
      const cell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number'; input.step = 'any'; input.min = '0';
      if (field === 'tipus') input.max = '100';
      input.setAttribute('aria-label', `${label} del tram ${i + 1}`);
      input.value = tram[field];
      input.addEventListener('input', () => { trams[i][field] = input.value; actualitza(); });
      cell.append(input); row.append(cell);
    }
    const cell = document.createElement('td');
    const button = document.createElement('button'); button.type = 'button'; button.className = 'elimina';
    button.textContent = 'Elimina'; button.disabled = trams.length === 1;
    button.setAttribute('aria-label', `Elimina el tram ${i + 1}`);
    button.addEventListener('click', () => { trams.splice(i, 1); pintaTrams(); actualitza(); });
    cell.append(button); row.append(cell); tramsBody.append(row);
  });
}
const detall = [
  ['Rendiment anual', 'Capital × rendiment', 'rendimentEuro', euro],
  ['Capital brut', 'Capital + rendiment', 'capitalBrut', euro],
  ['IRPF aplicat', 'Segons la taula', 'irpfTipus', percent],
  ['IRPF a pagar', 'Rendiment × IRPF', 'irpfEuro', euro],
  ['Net 1', 'Rendiment − IRPF', 'net1', euro],
  ['Comissió', 'Rendiment × comissió', 'comissioEuro', euro],
  ['IVA de la comissió', 'Comissió × IVA', 'ivaEuro', euro],
  ['Comissió total', 'Comissió + IVA', 'comissioTotal', euro],
  ['Net 2', 'Net 1 − comissió total', 'net2', euro],
  ['Claud service anual', 'Quota mensual × 12', 'claudAnual', euro],
  ['Net 3', 'Net 2 − Claud service anual', 'net3', euro],
  ['Operacions diàries', 'Actius × 12', 'operacionsDia', enter],
  ['Cost bròquer anual', 'Cost/operació × operacions/dia × dies', 'brokerAnual', euro],
  ['Crèdits anuals', 'Preu × crèdits/dia × dies', 'creditsAnual', euro],
  ['Net 4 final', 'Net 3 − crèdits − bròquer', 'netFinal', euro],
  ['Rendibilitat anual', 'Net final / capital', 'rendibilitat', percent],
  ['Net mensual final', 'Net final / 12', 'netMensual', euro]
];
const tbody = document.querySelector('#detall');
for (const [nom, operacio, id] of detall) {
  const tr = document.createElement('tr'); if (['net1','net2','net3','netFinal'].includes(id)) tr.className = 'subtotal';
  const th = document.createElement('th'); th.scope = 'row'; th.textContent = nom;
  const td = document.createElement('td'); td.textContent = operacio;
  const valor = document.createElement('td'); valor.dataset.result = id; valor.textContent = '—';
  tr.append(th, td, valor); tbody.append(tr);
}
function actualitza() {
  const inputs = Object.fromEntries(Object.keys(defaults).map(k => [k, form.elements[k].value]));
  try { localStorage.setItem(key, JSON.stringify({ inputs, trams })); } catch { /* Pot estar desactivat. */ }
  try {
    const resultat = calcula(inputs, trams);
    error.hidden = true;
    for (const [,,id, format] of detall) {
      document.querySelector(`[data-result="${id}"]`).textContent = format(resultat[id]);
      const resum = document.getElementById(id); if (resum) resum.textContent = format(resultat[id]);
    }
    document.querySelector('#rendibilitat').textContent = percent(resultat.rendibilitat);
  } catch (e) {
    error.textContent = e.message; error.hidden = false;
    document.querySelectorAll('[data-result]').forEach(node => node.textContent = '—');
    for (const [,,id] of detall) { const node = document.getElementById(id); if (node) node.textContent = '—'; }
    document.querySelector('#rendibilitat').textContent = '—';
  }
}
form.addEventListener('input', actualitza);
document.querySelector('#afegeix').addEventListener('click', () => { trams.push({ minim: '', tipus: '' }); pintaTrams(); actualitza(); tramsBody.lastElementChild.querySelector('input').focus(); });
document.querySelector('#restaura').addEventListener('click', () => {
  for (const [k, value] of Object.entries(defaults)) form.elements[k].value = value;
  trams = structuredClone(tramsInicials); pintaTrams(); actualitza();
});
pintaTrams(); actualitza();
