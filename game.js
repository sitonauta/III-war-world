const map=L.map('map',{zoomControl:true,minZoom:3,maxZoom:9,attributionControl:false,preferCanvas:true}).setView([48,10],4);
map.getContainer().style.background='#4f9eb8';
const info=document.querySelector('#info'),status=document.querySelector('#status');
const cfg=window.MAP_LAYERS;
const fills=['#85898d','#92969a','#7c8185','#9ba0a4','#888d91'];

// Orden visual fijo: mar -> provincias -> fronteras nacionales -> red -> capitales -> unidades.
map.createPane('provincePane');map.getPane('provincePane').style.zIndex=300;
map.createPane('countryPane');map.getPane('countryPane').style.zIndex=340;
map.createPane('routePane');map.getPane('routePane').style.zIndex=380;
map.createPane('capitalPane');map.getPane('capitalPane').style.zIndex=420;
map.createPane('unitPane');map.getPane('unitPane').style.zIndex=460;
const layers={
 provinces:L.layerGroup().addTo(map),countries:L.layerGroup().addTo(map),routes:L.layerGroup().addTo(map),capitals:L.layerGroup().addTo(map),units:L.layerGroup().addTo(map)
};
function provinceName(f){return f.properties.shapeName||f.properties.NAME_2||f.properties.name||'Provincia'}
function addCapital(name,ll,country){const icon=L.divIcon({className:'',html:'<div class="node-land"></div>',iconSize:[15,15],iconAnchor:[7,7]});const m=L.marker(ll,{icon,pane:'capitalPane'}).addTo(layers.capitals);m.bindTooltip(name,{permanent:true,direction:'top',offset:[0,-7],className:'capital-label'});m.on('click',()=>info.innerHTML=`<b>${name}</b><br>País: ${country}<br>Capital provincial / nodo terrestre`)}
async function getLocalJSON(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(`${r.status} ${path}`);return r.json()}
async function loadCountry(iso,index){const country=cfg.names[iso]||iso;let ok=false;
 try{const data=await getLocalJSON(`${cfg.paths.provinces}/${iso}.geojson`);L.geoJSON(data,{pane:'provincePane',style:f=>({color:'#dce2e5',weight:.75,fillColor:fills[(index+(f.properties.shapeID||'').length)%fills.length],fillOpacity:1}),onEachFeature:(f,l)=>{const n=provinceName(f);l.on('click',()=>info.innerHTML=`<b>${n}</b><br>País: ${country}<br>Moral: 100%<br>Producción base: 100`);addCapital(n,l.getBounds().getCenter(),country)}}).addTo(layers.provinces);ok=true}catch(e){console.warn('Falta capa provincial local:',iso)}
 try{const data0=await getLocalJSON(`${cfg.paths.countries}/${iso}.geojson`);L.geoJSON(data0,{pane:'countryPane',style:{color:'#30383e',weight:2.5,fill:false,opacity:1},interactive:false}).addTo(layers.countries)}catch(e){console.warn('Falta borde nacional local:',iso)}
 return ok;
}
status.textContent='Cargando capas locales de Europa…';
Promise.all(cfg.countries.map(loadCountry)).then(results=>{const n=results.filter(Boolean).length;status.textContent=n?`${n} países cargados · mapa por capas`:'Preparando archivos geográficos locales…';info.innerHTML=n?`Capas activas: provincias, fronteras nacionales y capitales.<br>Países cargados: ${n}.`:'La estructura por capas está lista. Faltan incorporar los GeoJSON locales.'});

// Capa de red marítima independiente.
const seaNodes=[['Atlántico',[45,-10]],['Canal de la Mancha',[50,-2]],['Mar del Norte',[55,3]],['Báltico',[57,18]],['Mediterráneo O.',[39,5]],['Mediterráneo C.',[37,13]],['Adriático',[43,15]],['Egeo',[38,25]],['Mar Negro',[43,32]]];
seaNodes.forEach(([n,p])=>{const icon=L.divIcon({className:'',html:'<div class="node-sea"></div>',iconSize:[12,12],iconAnchor:[6,6]});L.marker(p,{icon,pane:'capitalPane'}).addTo(layers.routes).on('click',()=>info.innerHTML=`<b>${n}</b><br>Nodo marítimo neutral<br>No conquistable`)});
document.querySelector('#reset').onclick=()=>location.reload();