function irpfRate(v){
if(v<=6000) return 19;
if(v<=50000) return 21;
if(v<=200000) return 23;
if(v<=300000) return 27;
return 30;
}

function calc(){
let capital=+capitalEl.value;
let rend=+rendEl.value/100;
let com=+comEl.value/100;
let iva=+ivaEl.value/100;
let cloud=+cloudEl.value;
let credit=+creditEl.value;
let dies=+diesEl.value;
let creditsdia=+creditsdiaEl.value;

let guanyBrut=capital*rend;
let capitalBrut=capital+guanyBrut;
let comissio=guanyBrut*com;
let net1=guanyBrut-comissio;
let ivaImp=comissio*iva;
let net2=net1-ivaImp;
let tipus=irpfRate(net2);
let irpf=net2*(tipus/100);
let net3=net2-irpf;
let cloudAnual=cloud*12;
let net4=net3-cloudAnual;
let costCredits=credit*creditsdia*dies;
let netFinal=net4-costCredits;
let rendFinal=(netFinal/capital)*100;

function formatEuro(valor) {
    return valor.toLocaleString('ca-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' €';
}
function formatEuroColor(valor) {
    const classe = valor >= 0 ? "valor positiu" : "valor negatiu";

    return `<span class="${classe}">
        ${valor.toLocaleString('ca-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} €
    </span>`;
}
res.innerHTML=`
<tr><td>Capital brut</td><td>${formatEuroColor(capitalBrut)}</td></tr>
<tr><td>Guany brut</td><td>${formatEuroColor(guanyBrut)}</td></tr>
<tr><td>Comissió</td><td>${formatEuroColor(comissio)}</td></tr>
<tr><td>IVA</td><td>${formatEuroColor(ivaImp)}</td></tr>
<tr><td>Tram IRPF aplicat</td><td class="percentatge">${tipus}%</td></tr>
<tr><td>IRPF</td><td>${formatEuroColor(irpf)}</td></tr>
<tr><td>Cost cloud anual</td><td>${formatEuroColor(cloudAnual)}</td></tr>
<tr><td>Cost crèdits anual</td><td>${formatEuroColor(costCredits)}</td></tr>
<tr><td>Benefici net final</td><td>${formatEuroColor(netFinal)}</td></tr>
<tr><td>Rendibilitat final</td>
<td class="percentatge ${rendFinal>=0?'positiu':'negatiu'}">
${rendFinal.toFixed(2)} %
</td></tr>`;
}

const capitalEl=capital,rendEl=rend,comEl=com,ivaEl=iva,cloudEl=cloud,creditEl=credit,diesEl=dies,creditsdiaEl=creditsdia;
document.querySelectorAll('input').forEach(i=>i.addEventListener('input',calc));
calc();

