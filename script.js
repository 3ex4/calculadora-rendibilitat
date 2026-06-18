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

res.innerHTML=`
<tr><td>Capital brut</td><td>${capitalBrut.toFixed(2)} €</td></tr>
<tr><td>Guany brut</td><td>${guanyBrut.toFixed(2)} €</td></tr>
<tr><td>Comissió</td><td>${comissio.toFixed(2)} €</td></tr>
<tr><td>IVA</td><td>${ivaImp.toFixed(2)} €</td></tr>
<tr><td>Tram IRPF aplicat</td><td>${tipus}%</td></tr>
<tr><td>IRPF</td><td>${irpf.toFixed(2)} €</td></tr>
<tr><td>Cost cloud anual</td><td>${cloudAnual.toFixed(2)} €</td></tr>
<tr><td>Cost crèdits anual</td><td>${costCredits.toFixed(2)} €</td></tr>
<tr><td>Benefici net final</td><td>${netFinal.toFixed(2)} €</td></tr>
<tr><td>Rendibilitat final</td><td>${rendFinal.toFixed(2)} %</td></tr>`;
}

const capitalEl=capital,rendEl=rend,comEl=com,ivaEl=iva,cloudEl=cloud,creditEl=credit,diesEl=dies,creditsdiaEl=creditsdia;
document.querySelectorAll('input').forEach(i=>i.addEventListener('input',calc));
calc();
