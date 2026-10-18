const map=L.map('map',{zoomControl:true,minZoom:3,maxZoom:9,attributionControl:false,preferCanvas:true}).setView([48,10],4);
map.getContainer().style.background='#4f9eb8';
const info=document.querySelector('#info'),status=document.querySelector('#status');

// Mapa estratégico: mar azul + divisiones administrativas reales simplificadas.
// geoBoundaries gbOpen (CC BY 4.0). ADM2 se usa como base provincial cuando existe.
const EUROPE=['ALB','AND','AUT','BEL','BGR','BIH','BLR','CHE','CYP','CZE','DEU','DNK','ESP','EST','FIN','FRA','GBR','GRC','HRV','HUN','IRL','ISL','ITA','LIE','LTU','LUX','LVA','MDA','MKD','MLT','MNE','NLD','NOR','POL','PRT','ROU','SRB','SVK','SVN','SWE','TUR','UKR'];
const COUNTRY_NAMES={ALB:'Albania',AND:'Andorra',AUT:'Austria',BEL:'Bélgica',BGR:'Bulgaria',BIH:'Bosnia y Herzegovina',BLR:'Bielorrusia',CHE:'Suiza',CYP:'Chipre',CZE:'Chequia',DEU:'Alemania',DNK:'Dinamarca',ESP:'España',EST:'Estonia',FIN:'Finlandia',FRA:'Francia',GBR:'Reino Unido',GRC:'Grecia',HRV:'Croacia',HUN:'Hungría',IRL:'Irlanda',ISL:'Islandia',ITA:'Italia',LIE:'Liechtenstein',LTU:'Lituania',LUX:'Luxemburgo',LVA:'Letonia',MDA:'Moldavia',MKD:'Macedonia del Norte',MLT:'Malta',MNE:'Montenegro',NLD:'Países Bajos',NOR:'Noruega',POL:'Polonia',PRT:'Portugal',ROU:'Rumanía',SRB:'Serbia',SVK:'Eslovaquia',SVN:'Eslovenia',SWE:'Suecia',TUR:'Turquía',UKR:'Ucrania'};
const fills=['#85898d','#92969a','#7c8185','#9ba0a4','#888d91'];
const provinceLayer=L.layerGroup().addTo(map),capitalLayer=L.layerGroup().addTo(map),countryLayer=L.layerGroup().addTo(map);

function centroidOfLayer(layer){const b=layer.getBounds();return b.getCenter()}
function provinceName(f){return f.properties.shapeName||f.properties.NAME_2||f.properties.name||'Provincia'}
function addCapital(name,ll,country){
 const icon=L.divIcon({className:'',html:'<div class="node-land"></div>',iconSize:[15,15],iconAnchor:[7,7]});
 const m=L.marker(ll,{icon,interactive:true}).addTo(capitalLayer);
 m.bindTooltip(name,{permanent:true,direction:'top',offset:[0,-7],className:'capital-label'});
 m.on('click',()=>info.innerHTML=`<b>${name}</b><br>País: ${country}<br>Capital provincial / nodo terrestre`);
}
async function loadCountry(iso,index){
 try{
  const meta=await fetch(`https://www.geoboundaries.org/api/current/gbOpen/${iso}/ADM2/`).then(r=>{if(!r.ok)throw Error(r.status);return r.json()});
  const url=meta.simplifiedGeometryGeoJSON||meta.gjDownloadURL;
  const data=await fetch(url).then(r=>r.json());
  const layer=L.geoJSON(data,{style:(f)=>({color:'#dce2e5',weight:.8,fillColor:fills[(index+(f.properties.shapeID||'').length)%fills.length],fillOpacity:1}),onEachFeature:(f,l)=>{
    const n=provinceName(f),country=COUNTRY_NAMES[iso]||iso;
    l.on('click',()=>info.innerHTML=`<b>${n}</b><br>País: ${country}<br>Moral: 100%<br>Producción base: 100`);
    addCapital(n,centroidOfLayer(l),country);
  }}).addTo(provinceLayer);
  // Borde nacional más grueso usando el contorno ADM0.
  try{
   const m0=await fetch(`https://www.geoboundaries.org/api/current/gbOpen/${iso}/ADM0/`).then(r=>r.json());
   const d0=await fetch(m0.simplifiedGeometryGeoJSON||m0.gjDownloadURL).then(r=>r.json());
   L.geoJSON(d0,{style:{color:'#343b40',weight:2.6,fill:false,opacity:1},interactive:false}).addTo(countryLayer);
  }catch(e){}
  return layer;
 }catch(e){console.warn('No se pudo cargar ADM2',iso,e);return null}
}

status.textContent='Cargando provincias de Europa…';
Promise.all(EUROPE.map(loadCountry)).then(()=>{status.textContent='Europa cargada · selecciona una provincia';});

// Nodos marítimos de muestra; la red marítima completa se ampliará sobre esta base.
const seaNodes=[
 ['Atlántico',[45,-10]],['Canal de la Mancha',[50,-2]],['Mar del Norte',[55,3]],['Báltico',[57,18]],['Mediterráneo O.',[39,5]],['Mediterráneo C.',[37,13]],['Adriático',[43,15]],['Egeo',[38,25]],['Mar Negro',[43,32]]
];
seaNodes.forEach(([n,p])=>{const icon=L.divIcon({className:'',html:'<div class="node-sea"></div>',iconSize:[12,12],iconAnchor:[6,6]});L.marker(p,{icon}).addTo(map).on('click',()=>info.innerHTML=`<b>${n}</b><br>Nodo marítimo neutral<br>No conquistable`)});

document.querySelector('#reset').onclick=()=>location.reload();