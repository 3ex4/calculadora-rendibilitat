export const defaults = {
  capital: 100000, rendiment: 80, comissio: 25, iva: 21,
  claud: 150, dies: 250, broker: 0.02, actius: 6,
  creditPreu: 1, creditsDia: 2
};
export const tramsInicials = [
  { minim: 0, tipus: 19 }, { minim: 6001, tipus: 21 },
  { minim: 50001, tipus: 23 }, { minim: 200001, tipus: 27 },
  { minim: 300001, tipus: 30 }
];

export function calcula(v, trams) {
  const x = Object.fromEntries(Object.entries(v).map(([k, n]) => [k, Number(n)]));
  if (Object.values(x).some(n => !Number.isFinite(n)) || !Array.isArray(trams) || !trams.length) throw Error('Introdueix valors numèrics vàlids.');
  if (x.capital <= 0) throw Error('El capital inicial ha de ser més gran que zero.');
  if ([x.rendiment, x.comissio, x.iva, x.claud, x.dies, x.broker, x.actius, x.creditPreu, x.creditsDia].some(n => n < 0)) throw Error('Els inputs no poden ser negatius.');
  if ([x.comissio, x.iva].some(n => n > 100)) throw Error('La comissió i l’IVA han d’estar entre 0 i 100 %.');
  const t = trams.map(r => ({ minim: Number(r.minim), tipus: Number(r.tipus) }));
  if (t.some(r => !Number.isFinite(r.minim) || !Number.isFinite(r.tipus) || r.minim < 0 || r.tipus < 0 || r.tipus > 100) || t[0].minim !== 0 || t.some((r, i) => i && r.minim <= t[i - 1].minim)) throw Error('Els trams han de començar a 0 €, estar ordenats i tenir percentatges entre 0 i 100 %.');
  const rendimentEuro = x.capital * x.rendiment / 100;
  const tram = [...t].reverse().find(r => rendimentEuro >= r.minim);
  if (!tram) throw Error('Cap tram d’IRPF aplicable.');
  const capitalBrut = x.capital + rendimentEuro;
  const irpfEuro = rendimentEuro * tram.tipus / 100;
  const net1 = rendimentEuro - irpfEuro;
  const comissioEuro = rendimentEuro * x.comissio / 100;
  const ivaEuro = comissioEuro * x.iva / 100;
  const comissioTotal = comissioEuro + ivaEuro;
  const net2 = net1 - comissioTotal;
  const claudAnual = x.claud * 12;
  const net3 = net2 - claudAnual;
  const operacionsDia = x.actius * 12;
  const brokerAnual = x.broker * operacionsDia * x.dies;
  const creditsAnual = x.creditPreu * x.dies * x.creditsDia;
  const netFinal = net3 - creditsAnual - brokerAnual;
  return { rendimentEuro, capitalBrut, irpfTipus: tram.tipus, irpfEuro, net1,
    comissioEuro, ivaEuro, comissioTotal, net2, claudAnual, net3,
    operacionsDia, brokerAnual, creditsAnual, netFinal,
    rendibilitat: netFinal / x.capital * 100, netMensual: netFinal / 12 };
}
