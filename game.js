const map=L.map('map',{zoomControl:true,minZoom:3,maxZoom:9,attributionControl:false,preferCanvas:true}).setView([48,10],4);
map.getContainer().style.background='#4f9eb8';
const info=document.querySelector('#info'),status=document.querySelector('#status');
const cfg=window.MAP_LAYERS,cities=window.EUROPE_CITIES||{};
const countryFills=['#85898d','#92969a','#7c8185','#9ba0a4','#888d91','#747d83','#96908a'];
map.createPane('countryFillPane');map.getPane('countryFillPane').style.zIndex=280;
map.createPane('provincePane');map.getPane('provincePane').style.zIndex=315;
map.createPane('countryBorderPane');map.getPane('countryBorderPane').style.zIndex=340;
map.createPane('routePane');map.getPane('routePane').style.zIndex=380;
map.createPane('cityPane');map.getPane('cityPane').style.zIndex=420;
map.createPane('unitPane');map.getPane('unitPane').style.zIndex=460;
const layers={countries:L.layerGroup().addTo(map),provinces:L.layerGroup().addTo(map),countryBorders:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),cities:L.layerGroup().addTo(map),units:L.layerGroup().addTo(map)};
let selectedCity=null,selectedProvince=null;
async function getLocalJSON(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(`${r.status} ${path}`);return r.json()}
function provinceName(f){return f.properties.shapeName||f.properties.NAME_2||f.properties.NAME_1||f.properties.name||'Provincia'}
function selectProvince(layer,name,country){if(selectedProvince&&selectedProvince!==layer){selectedProvince.closeTooltip();selectedProvince.setStyle({weight:.72,color:'#dce2e5',fillOpacity:0});}selectedProvince=layer;layer.setStyle({weight:1.8,color:'#f7f1d0',fillOpacity:.13});layer.bindTooltip(name,{permanent:true,direction:'center',className:'capital-label'}).openTooltip();info.innerHTML=`<b>${name}</b><br>País: ${country}<br>Provincia / territorio<br>Moral: 100%<br>Producción base: 100`;}
function selectCity(marker,name,country){if(selectedCity&&selectedCity!==marker)selectedCity.closeTooltip();selectedCity=marker;marker.bindTooltip(name,{permanent:true,direction:'top',offset:[0,-7],className:'capital-label'}).openTooltip();info.innerHTML=`<b>${name}</b><br>País: ${country}<br>Nodo urbano estratégico`;}
function addCity(name,lat,lng,country){const icon=L.divIcon({className:'',html:'<div class="node-land"></div>',iconSize:[15,15],iconAnchor:[7,7]});const m=L.marker([lat,lng],{icon,pane:'cityPane'}).addTo(layers.cities);m.on('click',()=>selectCity(m,name,country));}
async function loadCountry(iso,index){const country=cfg.names[iso]||iso;let land=false,provinceCount=0;
 try{const data=await getLocalJSON(`${cfg.paths.countries}/${iso}.geojson`);L.geoJSON(data,{pane:'countryFillPane',style:{color:'transparent',weight:0,fillColor:countryFills[index%countryFills.length],fillOpacity:1},interactive:false}).addTo(layers.countries);L.geoJSON(data,{pane:'countryBorderPane',style:{color:'#30383e',weight:2.8,fill:false,opacity:1},interactive:false}).addTo(layers.countryBorders);land=true;}catch(e){console.warn('Falta país local:',iso)}
 try{const provinces=await getLocalJSON(`${cfg.paths.provinces}/${iso}.geojson`);provinceCount=provinces.features?.length||0;L.geoJSON(provinces,{pane:'provincePane',style:{color:'#dce2e5',weight:.72,fillColor:'#ffffff',fillOpacity:0,opacity:.9},onEachFeature:(f,l)=>{const name=provinceName(f);l.on('click',()=>selectProvince(l,name,country));}}).addTo(layers.provinces);}catch(e){console.warn('Faltan provincias:',iso)}
 (cities[iso]||[]).forEach(([name,lat,lng])=>addCity(name,lat,lng,country));return {land,provinceCount};}
status.textContent='Cargando países, provincias y ciudades…';
Promise.all(cfg.countries.map(loadCountry)).then(results=>{const n=results.filter(r=>r.land).length,p=results.reduce((a,r)=>a+r.provinceCount,0),total=Object.values(cities).reduce((a,v)=>a+v.length,0);status.textContent=`${n} países · ${p} provincias`;info.innerHTML=`Provincias restauradas: ${p}.<br>También se mantienen ${total} ciudades estratégicas. Toca una provincia o una ciudad para seleccionarla.`;});
const seaNodes=[['Atlántico',[45,-10]],['Canal de la Mancha',[50,-2]],['Mar del Norte',[55,3]],['Báltico',[57,18]],['Mediterráneo O.',[39,5]],['Mediterráneo C.',[37,13]],['Adriático',[43,15]],['Egeo',[38,25]],['Mar Negro',[43,32]]];
seaNodes.forEach(([n,p])=>{const icon=L.divIcon({className:'',html:'<div class="node-sea"></div>',iconSize:[12,12],iconAnchor:[6,6]});L.marker(p,{icon,pane:'cityPane'}).addTo(layers.routes).on('click',()=>info.innerHTML=`<b>${n}</b><br>Nodo marítimo neutral<br>No conquistable`)});
document.querySelector('#reset').onclick=()=>location.reload();