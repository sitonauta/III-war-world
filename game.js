const map=L.map('map',{zoomControl:true,minZoom:4,maxZoom:9,attributionControl:false,preferCanvas:true}).setView([41.2,-2.5],6);
map.getContainer().style.background='#4f9eb8';

// Primera capa territorial estratégica. Sin carreteras, bosques, edificios ni mapa urbano.
// El mar es azul y cada provincia es un polígono independiente con borde visible.
const provinces=[
 {n:'A Coruña',c:'España',cap:[43.3623,-8.4115],poly:[[43.78,-9.30],[43.80,-7.70],[43.25,-7.55],[42.85,-8.05],[42.95,-9.25]]},
 {n:'Lugo',c:'España',cap:[43.0123,-7.5558],poly:[[43.80,-7.70],[43.72,-6.85],[42.90,-6.70],[42.55,-7.35],[43.25,-7.55]]},
 {n:'Pontevedra',c:'España',cap:[42.431,-8.6444],poly:[[42.95,-9.25],[42.85,-8.05],[42.10,-8.00],[41.85,-8.85],[42.35,-9.05]]},
 {n:'Ourense',c:'España',cap:[42.3358,-7.8639],poly:[[42.85,-8.05],[42.55,-7.35],[41.95,-6.85],[41.85,-8.00],[42.10,-8.00]]},
 {n:'Asturias',c:'España',cap:[43.3619,-5.8494],poly:[[43.72,-6.85],[43.68,-4.50],[43.10,-4.45],[42.90,-6.70]]},
 {n:'Cantabria',c:'España',cap:[43.4623,-3.81],poly:[[43.68,-4.50],[43.55,-3.10],[42.95,-3.15],[43.10,-4.45]]},
 {n:'León',c:'España',cap:[42.5987,-5.5671],poly:[[42.90,-6.70],[43.10,-4.45],[42.20,-4.15],[41.85,-5.75],[41.95,-6.85]]},
 {n:'Zamora',c:'España',cap:[41.5033,-5.7446],poly:[[41.95,-6.85],[41.85,-5.75],[41.05,-5.20],[40.95,-6.65]]},
 {n:'Salamanca',c:'España',cap:[40.9701,-5.6635],poly:[[40.95,-6.65],[41.05,-5.20],[40.25,-4.95],[40.05,-6.75]]},
 {n:'Cáceres',c:'España',cap:[39.4753,-6.3724],poly:[[40.05,-6.75],[40.25,-4.95],[39.05,-4.80],[38.65,-6.90]]},
 {n:'Badajoz',c:'España',cap:[38.8794,-6.9707],poly:[[38.65,-6.90],[39.05,-4.80],[38.00,-4.65],[37.10,-7.45],[38.15,-7.35]]},
 {n:'Bizkaia',c:'España',cap:[43.263,-2.935],poly:[[43.55,-3.10],[43.50,-2.20],[42.90,-2.30],[42.95,-3.15]]},
 {n:'Gipuzkoa',c:'España',cap:[43.3183,-1.9812],poly:[[43.50,-2.20],[43.42,-1.72],[42.92,-1.55],[42.90,-2.30]]},
 {n:'Álava',c:'España',cap:[42.8467,-2.6727],poly:[[42.95,-3.15],[42.90,-2.30],[42.35,-2.15],[42.20,-2.95]]},
 {n:'Navarra',c:'España',cap:[42.8125,-1.6458],poly:[[42.92,-1.55],[42.90,-2.30],[42.35,-2.15],[41.95,-1.45],[42.45,-0.95]]},
 {n:'Huesca',c:'España',cap:[42.1401,-0.4089],poly:[[42.45,-0.95],[42.85,0.75],[41.65,0.70],[41.25,-0.55],[41.95,-1.45]]},
 {n:'Lleida',c:'España',cap:[41.6176,0.6200],poly:[[42.85,0.75],[42.65,1.85],[41.80,1.75],[41.25,0.95],[41.65,0.70]]},
 {n:'Girona',c:'España',cap:[41.9794,2.8214],poly:[[42.65,1.85],[42.50,3.20],[41.75,3.25],[41.65,2.05],[41.80,1.75]]},
 {n:'Barcelona',c:'España',cap:[41.3874,2.1686],poly:[[41.80,1.75],[41.65,2.05],[41.75,3.25],[41.10,2.55],[40.95,1.65],[41.25,0.95]]},
 {n:'Tarragona',c:'España',cap:[41.1189,1.2445],poly:[[41.25,0.95],[40.95,1.65],[40.45,0.75],[40.65,-0.10],[41.25,-0.55]]},
 {n:'Zaragoza',c:'España',cap:[41.6488,-0.8891],poly:[[41.95,-1.45],[41.25,-0.55],[40.65,-0.10],[40.10,-1.20],[40.55,-2.05],[42.35,-2.15]]},
 {n:'Teruel',c:'España',cap:[40.3456,-1.1065],poly:[[40.65,-0.10],[40.45,0.75],[39.65,0.25],[39.45,-1.25],[40.10,-1.20]]},
 {n:'Castellón',c:'España',cap:[39.9864,-0.0513],poly:[[40.45,0.75],[39.65,0.25],[39.15,-0.05],[39.45,-1.25]]},
 {n:'Valencia',c:'España',cap:[39.4699,-0.3763],poly:[[39.45,-1.25],[39.15,-0.05],[38.65,-0.15],[38.25,-1.05],[38.75,-1.65]]},
 {n:'Alicante',c:'España',cap:[38.3452,-0.481],poly:[[38.65,-0.15],[38.25,-1.05],[37.45,-1.10],[37.75,-0.10]]},
 {n:'Madrid',c:'España',cap:[40.4168,-3.7038],poly:[[41.15,-4.55],[41.20,-3.25],[40.45,-2.95],[39.85,-3.25],[39.80,-4.35],[40.45,-4.65]]},
 {n:'Toledo',c:'España',cap:[39.8628,-4.0273],poly:[[39.80,-4.35],[39.85,-3.25],[39.20,-2.70],[38.75,-3.40],[38.65,-4.70],[39.05,-4.80]]},
 {n:'Ciudad Real',c:'España',cap:[38.9848,-3.9274],poly:[[38.65,-4.70],[38.75,-3.40],[38.25,-2.50],[37.65,-2.95],[37.45,-4.65],[38.00,-4.65]]},
 {n:'Murcia',c:'España',cap:[37.9922,-1.1307],poly:[[38.25,-2.50],[38.25,-1.05],[37.45,-1.10],[37.35,-1.70],[37.65,-2.95]]},
 {n:'Córdoba',c:'España',cap:[37.8882,-4.7794],poly:[[38.00,-4.65],[37.45,-4.65],[37.05,-5.65],[37.55,-6.05],[38.25,-5.60]]},
 {n:'Sevilla',c:'España',cap:[37.3891,-5.9845],poly:[[37.55,-6.05],[37.05,-5.65],[36.70,-5.95],[36.75,-6.75],[37.45,-6.65]]},
 {n:'Huelva',c:'España',cap:[37.2614,-6.9447],poly:[[37.45,-6.65],[36.75,-6.75],[36.95,-7.45],[37.60,-7.50]]},
 {n:'Cádiz',c:'España',cap:[36.5271,-6.2886],poly:[[36.75,-6.75],[36.70,-5.95],[36.05,-5.35],[36.00,-6.35]]},
 {n:'Málaga',c:'España',cap:[36.7213,-4.4214],poly:[[37.05,-5.65],[37.45,-4.65],[37.15,-3.75],[36.45,-3.70],[36.05,-5.35],[36.70,-5.95]]},
 {n:'Granada',c:'España',cap:[37.1773,-3.5986],poly:[[37.45,-4.65],[37.45,-3.10],[36.95,-2.45],[36.45,-3.70],[37.15,-3.75]]},
 {n:'Almería',c:'España',cap:[36.834,-2.4637],poly:[[37.45,-3.10],[37.35,-1.70],[36.70,-1.75],[36.45,-2.55],[36.95,-2.45]]},
 {n:'Illes Balears',c:'España',cap:[39.5696,2.6502],poly:[[40.10,2.10],[40.15,3.60],[39.10,4.25],[38.65,2.75],[39.10,1.85]]}
];
const fills=['#85898d','#92969a','#7c8185','#9ba0a4'];
const info=document.querySelector('#info'),status=document.querySelector('#status');
const provinceLayer=L.layerGroup().addTo(map);
provinces.forEach((p,i)=>{
 const poly=L.polygon(p.poly,{color:'#d8dde0',weight:1.5,fillColor:fills[i%fills.length],fillOpacity:1}).addTo(provinceLayer);
 poly.on('click',()=>{info.innerHTML=`<b>${p.n}</b><br>País: ${p.c}<br>Moral: 100%<br>Producción base: 100`;});
});

const N={
 mad:{n:'Madrid',p:[40.4168,-3.7038],t:'land',o:'España'},bar:{n:'Barcelona',p:[41.3874,2.1686],t:'land',o:'España'},val:{n:'Valencia',p:[39.4699,-0.3763],t:'land',o:'España'},
 s1:{n:'Mar Balear O.',p:[39.3,2.7],t:'sea'},s2:{n:'Mar Balear E.',p:[39.7,5.4],t:'sea'}
};
const E=[['mad','val'],['val','bar'],['bar','s1'],['s1','s2']];
const adj={};Object.keys(N).forEach(k=>adj[k]=[]);E.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);let type=N[a].t===N[b].t?N[a].t:'mixed';L.polyline([N[a].p,N[b].p],{color:type==='land'?'#47423c':type==='sea'?'#d8edf4':'#b5d3da',weight:type==='land'?2.2:1.8,opacity:.9,dashArray:type==='sea'?'5 7':null}).addTo(map)});
Object.entries(N).forEach(([id,n])=>{const icon=L.divIcon({className:'',html:`<div class="node-${n.t}"></div>`,iconSize:[16,16],iconAnchor:[8,8]});let m=L.marker(n.p,{icon}).addTo(map);if(n.t==='land')m.bindTooltip(n.n,{permanent:true,direction:'top',offset:[0,-8],className:'capital-label'});m.on('click',()=>{info.innerHTML=n.t==='sea'?`<b>${n.n}</b><br>Nodo marítimo neutral<br>No conquistable`:`<b>${n.n}</b><br>País: ${n.o}<br>Moral: 100%<br>Producción base: 100`;if(selected)moveArmy(selected,id)})});
let selected=null;const armies={a:{node:'mad',side:'blue',units:1000,morale:100},b:{node:'bar',side:'red',units:850,morale:80}};
function armyIcon(a){return L.divIcon({className:'',html:`<div class="army ${a.side==='red'?'enemy':''}">${Math.round(a.units/100)}</div>`,iconSize:[28,28],iconAnchor:[14,14]})}
Object.entries(armies).forEach(([id,a])=>{a.marker=L.marker(N[a.node].p,{icon:armyIcon(a),zIndexOffset:500}).addTo(map);a.marker.on('click',e=>{L.DomEvent.stopPropagation(e);selected=id;status.textContent=`Ejército seleccionado: ${a.units} soldados · moral ${a.morale}%`;info.innerHTML=`<b>Ejército ${a.side==='blue'?'azul':'rojo'}</b><br>${a.units} soldados<br>Moral: ${a.morale}%<br>Toca un nodo conectado para moverlo.`})});
function moveArmy(id,target){let a=armies[id];if(!adj[a.node].includes(target)){status.textContent='Ese nodo no está conectado directamente.';return}let from=a.node,to=target,start=performance.now(),dur=1800,p1=map.latLngToLayerPoint(N[from].p),p2=map.latLngToLayerPoint(N[to].p);status.textContent=`Moviendo hacia ${N[to].n}...`;function tick(t){let q=Math.min(1,(t-start)/dur),p=p1.add(p2.subtract(p1).multiplyBy(q)),ll=map.layerPointToLatLng(p);a.marker.setLatLng(ll);if(q<1)requestAnimationFrame(tick);else{a.node=to;selected=null;status.textContent=`Llegada a ${N[to].n}`;checkCombat(id)}}requestAnimationFrame(tick)}
function checkCombat(id){let a=armies[id];for(const [oid,b] of Object.entries(armies)){if(oid!==id&&b.units>0&&b.node===a.node&&b.side!==a.side){let af=Math.max(.1,a.morale/100),bf=Math.max(.1,b.morale/100);if(a.units*af>=b.units*bf){a.units=Math.max(1,Math.round(a.units-b.units*bf/af));b.units=0;b.marker.remove();status.textContent=`Victoria. Quedan ${a.units} soldados.`;a.marker.setIcon(armyIcon(a))}else{b.units=Math.max(1,Math.round(b.units-a.units*af/bf));a.units=0;a.marker.remove();status.textContent=`Derrota. Enemigo restante: ${b.units}.`;b.marker.setIcon(armyIcon(b))}break}}}
document.querySelector('#reset').onclick=()=>location.reload();