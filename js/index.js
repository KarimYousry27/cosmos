const API_Key = "jsNwDxEGGwPbncFgUUjtfAjCHYgvyia2w9S3iBIW"
const apodDate = document.getElementById('apod-date')
const apodDateInput = document.getElementById('apod-date-input')
const apodImage = document.getElementById('apod-image')
const apodLoading = document.getElementById('apod-loading')
const apodTitle = document.getElementById('apod-title')
const apodDateDetail = document.getElementById('apod-date-detail')
const apodExplanation = document.getElementById('apod-explanation')
const apodCopyright = document.getElementById('apod-copyright')
const apodDateInfo = document.getElementById('apod-date-info')
const apodMediaType = document.getElementById('apod-media-type')
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const apodError = document.createElement('p');
apodError.className = 'text-amber-300 text-sm mt-3 hidden';
apodImage.parentElement.appendChild(apodError);
const apodVideo = document.createElement('iframe');
apodVideo.className = 'w-full h-full min-h-80 rounded-xl hidden';
apodVideo.title = 'NASA Astronomy Picture of the Day video';
apodVideo.allowFullscreen = true;
apodImage.parentElement.appendChild(apodVideo);
let apodRequest = 0;
// NASA moved APOD to the WordPress endpoint in September 2026.
// In the new response, `url` is a web page; `hdurl` is the actual image.
const apodEndpoint = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';
const apodLogoPattern = /nasa-logo|\/assets\/images\/nasa-logo/i;
function apodImageURL(data) {
  const candidate = [data.hdurl, data.thumbnail_url, data.url].find(url =>
    typeof url === 'string' && /^https:\/\//i.test(url) &&
    !apodLogoPattern.test(url) &&
    !/\/image-article\//i.test(url) &&
    (/\.(png|jpe?g|webp|gif|avif)(?:[?#]|$)/i.test(url) || /\/dynamicimage\//i.test(url))
  );
  return candidate || null;
}
async function getSpaceToday(date = apodDateInput.value || todayISO()) {
  const request = ++apodRequest;
  apodDateInput.max = todayISO();
  apodDateInput.value = date;
  apodLoading.classList.remove('hidden');
  apodImage.classList.add('hidden');
  apodImage.removeAttribute('src');
  apodVideo.classList.add('hidden');
  apodVideo.removeAttribute('src');
  apodError.classList.add('hidden');
  try {
    if (date < '1995-06-16' || date > todayISO()) throw new Error('Choose a date between June 16, 1995 and today');
    const response = await fetch(`${apodEndpoint}?date=${encodeURIComponent(date)}&api_key=${encodeURIComponent(API_Key)}`, {cache:'no-store'});
    if (!response.ok) throw new Error(`NASA API returned ${response.status}`);
    const result = await response.json();
    if (request !== apodRequest) return;
    const data = Array.isArray(result) ? result.find(item => item.date === date) : result;
    if (!data || data.date !== date) throw new Error('NASA did not return the selected date');
    if (data.title === 'NASA Science' || /Discover the cosmos! Each day a different image/i.test(data.explanation || '')) {
      throw new Error('NASA returned its generic placeholder instead of the astronomy picture');
    }
    const media = data.media_type || 'image';
    const imageURL = apodImageURL(data);
    const videoURL = media === 'video' && typeof data.url === 'string' &&
      /^https:\/\//i.test(data.url) && !/\/image-article\//i.test(data.url) ? data.url : null;
    if (media === 'image' && !imageURL) throw new Error('NASA did not provide an image URL for this date');
    if (media !== 'image' && !videoURL && !imageURL) throw new Error('NASA did not provide embeddable media for this date');
    const formatted = new Date(`${data.date}T12:00:00`).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'2-digit'});
    apodDate.textContent = `Astronomy Picture of the Day - ${formatted}`;
    apodDateInput.nextElementSibling.textContent = new Date(`${data.date}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'});
    apodTitle.textContent = data.title || 'NASA Astronomy Picture of the Day';
    const plainText = value => { const node = document.createElement('div'); node.innerHTML = String(value || ''); return node.textContent || ''; };
    apodExplanation.textContent = plainText(data.explanation) || 'No description available.';
    apodDateDetail.textContent = formatted;
    apodDateInfo.textContent = formatted;
    apodCopyright.textContent = plainText(data.copyright || data.credit) || 'Not provided';
    apodMediaType.textContent = media;
    if (media === 'image' || !videoURL) {
      apodImage.onerror = () => {
        if (request !== apodRequest) return;
        apodImage.classList.add('hidden');
        apodError.textContent = 'NASA image could not be loaded. Try another date.';
        apodError.classList.remove('hidden');
      };
      apodImage.alt = data.alt || data.title || 'NASA astronomy picture';
      apodImage.src = imageURL;
      apodImage.classList.remove('hidden');
    } else {
      apodVideo.src = videoURL;
      apodVideo.classList.remove('hidden');
    }
  } catch (err) {
    if (request !== apodRequest) return;
    apodError.textContent = `Unable to load NASA content for ${date}. ${err.message}. Try another date.`;
    apodError.classList.remove('hidden');
  } finally { if(request === apodRequest) apodLoading.classList.add('hidden'); }
}
apodDateInput.max = todayISO();
apodDateInput.value = todayISO();
apodDateInput.addEventListener('change', () => getSpaceToday(apodDateInput.value));
document.getElementById('load-date-btn').addEventListener('click', () => getSpaceToday(apodDateInput.value));
document.getElementById('today-apod-btn').addEventListener('click', () => getSpaceToday(todayISO()));
getSpaceToday(todayISO());
const navLinks = document.querySelectorAll('.nav-link')
const sections = document.querySelectorAll('.app-section')
navLinks.forEach(function(link){
    link.addEventListener('click',function(event){
        event.preventDefault();
        const targetSection = this.dataset.section
        sections.forEach(section=>{
            section.classList.add('hidden')
        })
        navLinks.forEach(link=>{
            link.classList.remove('active')
        })
        document.querySelector(`.app-section[data-section="${targetSection}"]`).classList.remove('hidden')
        this.classList.add('active')
    })  
})
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const launchPlaceholder = 'images/launch-placeholder.png';
const launchImage = launch => {
  const url = launch.image?.image_url || launch.image?.thumbnail_url || launch.image?.url;
  return `<img class="w-full h-full object-cover" src="${escapeHTML(url || launchPlaceholder)}" alt="${escapeHTML(launch.name || 'Space launch')}" onerror="this.onerror=null;this.src='${launchPlaceholder}'">`;
};
const launchDate = date => date ? new Date(date).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}) : 'TBD';
const launchTime = date => date ? new Date(date).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'UTC'}) + ' UTC' : 'TBD';
const launchDetail = launch => [launch.name, launch.launch_service_provider?.name, launch.pad?.name, launch.mission?.description || 'Details TBD.'].filter(Boolean).join('\n\n');
function launchCard(launch, featured=false) {
  const title=escapeHTML(launch.name || 'Upcoming launch');
  const provider=escapeHTML(launch.launch_service_provider?.name || 'Unknown provider');
  const rocket=escapeHTML(launch.rocket?.configuration?.name || 'Unknown rocket');
  const location=escapeHTML(launch.pad?.name || 'TBD');
  const status=escapeHTML(launch.status?.abbrev || 'TBD');
  const description=escapeHTML(launch.mission?.description || 'Details TBD.');
  if(featured) return `<div class="bg-slate-800/50 border border-slate-700 rounded-3xl p-5 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6"><div><span class="text-blue-400 font-semibold">★ Featured Launch</span> <span class="text-green-400 ml-3">${status}</span><h3 class="text-2xl font-bold mt-4 mb-3">${title}</h3><p class="text-slate-400 mb-5">${provider} · ${rocket}</p><div class="grid grid-cols-2 gap-3 mb-5"><div class="bg-slate-900/40 rounded-xl p-3"><small>Launch Date</small><p class="font-semibold">${launchDate(launch.net)}</p></div><div class="bg-slate-900/40 rounded-xl p-3"><small>Launch Time</small><p class="font-semibold">${launchTime(launch.net)}</p></div><div class="bg-slate-900/40 rounded-xl p-3"><small>Location</small><p>${location}</p></div><div class="bg-slate-900/40 rounded-xl p-3"><small>Country</small><p>${escapeHTML(launch.pad?.location?.country?.name || 'TBD')}</p></div></div><p class="text-slate-300 line-clamp-3 mb-5">${description}</p><button class="launch-details bg-blue-500 hover:bg-blue-600 rounded-lg px-5 py-3 w-full font-semibold">View Full Details</button></div><div class="h-72 lg:h-auto bg-slate-900/40 rounded-xl overflow-hidden">${launchImage(launch)}</div></div>`;
  return `<div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden"><div class="relative h-48 bg-slate-900/50">${launchImage(launch)}<span class="absolute top-3 right-3 bg-slate-800 rounded-full px-3 py-1 text-xs">${status}</span></div><div class="p-5"><h4 class="font-bold text-lg mb-2 line-clamp-2">${title}</h4><p class="text-slate-400 text-sm mb-3">${provider}</p><div class="space-y-2 text-sm text-slate-300 mb-4"><p>📅 ${launchDate(launch.net)}</p><p>🕒 ${launchTime(launch.net)}</p><p>🚀 ${rocket}</p><p>📍 ${location}</p></div><button class="launch-details bg-slate-700 hover:bg-slate-600 rounded-lg w-full py-2">Details</button></div></div>`;
}
async function getLaunches(){
  const featured=document.getElementById('featured-launch'), grid=document.getElementById('launches-grid');
  featured.textContent='Loading launches...'; grid.textContent='';
  try {
    const response=await fetch('https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10');
    if(!response.ok) throw new Error(`Launch API returned ${response.status}`);
    const data=await response.json();
    if(!Array.isArray(data.results) || !data.results.length) throw new Error('No upcoming launches available');
    featured.innerHTML=launchCard(data.results[0],true);
    grid.innerHTML=data.results.slice(1).map(x=>launchCard(x)).join('');
    featured.querySelector('.launch-details').addEventListener('click',()=>alert(launchDetail(data.results[0])));
    grid.querySelectorAll('.launch-details').forEach((button,i)=>button.addEventListener('click',()=>alert(launchDetail(data.results[i+1]))));
  } catch(err) { featured.textContent=`Unable to load launches: ${err.message}`; grid.textContent=''; }
}
getLaunches();
const planetDescriptions = {
 mercury:'The smallest planet and closest to the Sun.',venus:'The hottest planet, with a thick atmosphere.',earth:'Our home planet and the only known world with life.',mars:'The red planet, known for its dusty surface and giant volcanoes.',jupiter:'The largest planet, a gas giant with the Great Red Spot.',saturn:'A gas giant famous for its beautiful rings.',uranus:'An ice giant that rotates on its side.',neptune:'A distant ice giant with powerful winds.'
};
const planetData = {
 mercury:{radius:2440, distance:57.9, moons:0, gravity:3.7, orbital:88, rotation:1407.6, temp:167},
 venus:{radius:6052,distance:108.2,moons:0,gravity:8.87,orbital:224.7,rotation:5832.5,temp:464},
 earth:{radius:6371,distance:149.6,moons:1,gravity:9.81,orbital:365.25,rotation:24,temp:15},
 mars:{radius:3390,distance:227.9,moons:2,gravity:3.71,orbital:687,rotation:24.6,temp:-65},
 jupiter:{radius:69911,distance:778.6,moons:95,gravity:24.79,orbital:4333,rotation:9.9,temp:-110},
 saturn:{radius:58232,distance:1433.5,moons:146,gravity:10.44,orbital:10759,rotation:10.7,temp:-140},
 uranus:{radius:25362,distance:2872.5,moons:28,gravity:8.69,orbital:30687,rotation:17.2,temp:-195},
 neptune:{radius:24622,distance:4495.1,moons:16,gravity:11.15,orbital:60190,rotation:16.1,temp:-200}
};
const setPlanetField=(id,value)=>{const element=document.getElementById(id);if(element)element.textContent=value ?? 'N/A';};
function showPlanet(id){
 const data=planetData[id];if(!data)return;
 document.querySelectorAll('.planet-card').forEach(card=>{
   const active=card.dataset.planetId===id;
   card.classList.toggle('border-blue-500',active);
   card.classList.toggle('ring-2',active);
   card.classList.toggle('ring-blue-500/50',active);
 });
 const img=document.getElementById('planet-detail-image');img.src=`images/${id}.png`;img.alt=`${id} planet`;
 setPlanetField('planet-detail-name',id[0].toUpperCase()+id.slice(1));
 setPlanetField('planet-detail-description',planetDescriptions[id]);
 setPlanetField('planet-distance',`${data.distance.toLocaleString('en-US')}M km`);
 setPlanetField('planet-radius',`${data.radius.toLocaleString('en-US')} km`);
 setPlanetField('planet-mass','See NASA fact sheet');
 setPlanetField('planet-density','See NASA fact sheet');
 setPlanetField('planet-orbital-period',`${data.orbital.toLocaleString('en-US')} days`);
 setPlanetField('planet-rotation',`${data.rotation} hours`);
 setPlanetField('planet-moons',data.moons);
 setPlanetField('planet-gravity',`${data.gravity} m/s²`);
 setPlanetField('planet-discoverer', ['uranus','neptune'].includes(id) ? (id==='uranus'?'William Herschel':'Johann Galle'):'Known since antiquity');
 setPlanetField('planet-discovery-date',id==='uranus'?'1781':id==='neptune'?'1846':'Ancient');
 setPlanetField('planet-body-type','Planet');
 setPlanetField('planet-volume','See NASA fact sheet');
 setPlanetField('planet-perihelion','See NASA fact sheet');
 setPlanetField('planet-aphelion','See NASA fact sheet');
 setPlanetField('planet-eccentricity','See NASA fact sheet');
 setPlanetField('planet-inclination','See NASA fact sheet');
 setPlanetField('planet-axial-tilt','See NASA fact sheet');
 setPlanetField('planet-temp',`${data.temp}°C (approx.)`);
 setPlanetField('planet-escape','See NASA fact sheet');
 const facts=document.getElementById('planet-facts');
 if(facts)facts.innerHTML=`<li class="text-slate-300">${escapeHTML(planetDescriptions[id])}</li>`;
}
document.querySelectorAll('.planet-card').forEach(card=>{
 card.setAttribute('role','button');card.setAttribute('tabindex','0');
 card.addEventListener('click',()=>showPlanet(card.dataset.planetId));
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showPlanet(card.dataset.planetId);}});
});
showPlanet('earth');
