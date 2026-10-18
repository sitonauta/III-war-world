const map=L.map('map',{zoomControl:true,minZoom:3,maxZoom:9,attributionControl:false,preferCanvas:true}).setView([48,10],4);
map.getContainer().style.background='#4f9eb8';
const info=document.querySelector('#info'),status=document.querySelector('#status');
const cfg=window.MAP_LAYERS,cities=window.EUROPE_CITIES||{};
const countryFills=['#85898d','#92969a','#7c8185','#9ba0a4','#888d91','#747d83','#96908a'];
map.createPane('countryFillPane');map.getPane('countryFillPane').style.zIndex=280;
map.createPane('countryBorderPane');map.getPane('countryBorderPane').style.zIndex=340;
map.createPane('routePane');map.getPane('routePane').style.zIndex=380;
map.createPane('cityPane');map.getPane('cityPane').style.zIndex=420;
map.createPane('unitPane');map.getPane('unitPane').style.zIndex=460;
const layers={countries:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),cities:L.layerGroup().addTo(map),units:L.layerGroup().addTo(map)};
let selectedCity=null;
async function getLocalJSON(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(`${r.status} ${path}`);return r.json()}
function selectCity(marker,name,country){if(selectedCity&&selectedCity!==marker)selectedCity.closeTooltip();selectedCity=marker;marker.bindTooltip(name,{permanent:true,direction:'top',offset:[0,-7],className:'capital-label'}).openTooltip();info.innerHTML=`<b>${name}</b><br>País: ${country}<br>Nodo urbano estratégico<br>Moral: 100%<br>Producción base: 100`;}
function addCity(name,lat,lng,country){const icon=L.divIcon({className:'',html:'<div class="node-land"></div>',iconSize:[15,15],iconAnchor:[7,7]});const m=L.marker([lat,lng],{icon,pane:'cityPane'}).addTo(layers.cities);m.on('click',()=>selectCity(m,name,country));}
async function loadCountry(iso,index){const country=cfg.names[iso]||iso;let land=false;try{const data=await getLocalJSON(`${cfg.paths.countries}/${iso}.geojson`);L.geoJSON(data,{pane:'countryFillPane',style:{color:'#30383e',weight:2.2,fillColor:countryFills[index%countryFills.length],fillOpacity:1},onEachFeature:(f,l)=>l.on('click',()=>info.innerHTML=`<b>${country}</b><br>${(cities[iso]||[]).length} nodos urbanos estratégicos`)}).addTo(layers.countries);land=true;}catch(e){console.warn('Falta país local:',iso)}
(cities[iso]||[]).forEach(([name,lat,lng])=>addCity(name,lat,lng,country));return land;}
status.textContent='Cargando países y ciudades estratégicas…';
Promise.all(cfg.countries.map(loadCountry)).then(results=>{const n=results.filter(Boolean).length,total=Object.values(cities).reduce((a,v)=>a+v.length,0);status.textContent=`${n} países · ${total} ciudades estratégicas`;info.innerHTML='Toca una ciudad para ver su nombre y datos. Los nombres permanecen ocultos mientras no selecciones el nodo.';});
const seaNodes=[['Atlántico',[45,-10]],['Canal de la Mancha',[50,-2]],['Mar del Norte',[55,3]],['Báltico',[57,18]],['Mediterráneo O.',[39,5]],['Mediterráneo C.',[37,13]],['Adriático',[43,15]],['Egeo',[38,25]],['Mar Negro',[43,32]]];
seaNodes.forEach(([n,p])=>{const icon=L.divIcon({className:'',html:'<div class="node-sea"></div>',iconSize:[12,12],iconAnchor:[6,6]});L.marker(p,{icon,pane:'cityPane'}).addTo(layers.routes).on('click',()=>info.innerHTML=`<b>${n}</b><br>Nodo marítimo neutral<br>No conquistable`)});
document.querySelector('#reset').onclick=()=>location.reload();