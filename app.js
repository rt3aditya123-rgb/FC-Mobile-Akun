const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Math.round(n));
const h2hNames=["Tidak diketahui","World Class","Legendary","FC Champion"];
const vsaNames=["Tidak diketahui","World Class","Legendary","FC Champion"];

function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});}
window.scrollToSection=scrollToSection;

$("themeBtn").onclick=()=>{document.body.classList.toggle("light");$("themeBtn").textContent=document.body.classList.contains("light")?"☀ Light Mode":"☾ Dark Mode";};

const dz=$("dropzone"), input=$("fileInput"), preview=$("preview"), wrap=$("previewWrap");
input.onchange=e=>showFile(e.target.files[0]);
["dragenter","dragover"].forEach(x=>dz.addEventListener(x,e=>{e.preventDefault();dz.classList.add("drag")}));
["dragleave","drop"].forEach(x=>dz.addEventListener(x,e=>{e.preventDefault();dz.classList.remove("drag")}));
dz.addEventListener("drop",e=>showFile(e.dataTransfer.files[0]));
function showFile(file){
  if(!file)return;
  if(file.size>8*1024*1024){alert("Ukuran foto maksimal 8 MB.");return}
  if(!file.type.startsWith("image/")){alert("File harus berupa gambar.");return}
  preview.src=URL.createObjectURL(file);wrap.classList.remove("hidden");$("dropzone").classList.add("hidden");
}
$("removeImg").onclick=()=>{input.value="";wrap.classList.add("hidden");$("dropzone").classList.remove("hidden");};

function val(id, fallback=0){return Number($(id).value)||fallback}
function rankName(id){return id===0?"—":id===1?"World Class":id===2?"Legendary":"FC Champion"}

function analyze(){
  const ovr=val("ovr"), level=val("level"), h2h=val("h2h"), vsa=val("vsa");
  const coins=val("coins"), gems=val("gems"), iconic=val("iconic"), events=val("eventPlayers");
  const pos={gk:val("gk",1),def:val("def",1),mid:val("mid",1),att:val("att",1)};
  if(!ovr){alert("Masukkan OVR tim terlebih dahulu.");$("ovr").focus();return}
  let score=0;
  score += Math.max(0,Math.min(50,(ovr-100)*2.5));
  score += Math.min(10,level/10);
  score += h2h*4 + vsa*3;
  score += Math.min(7,coins/3000000);
  score += Math.min(4,gems/1000);
  score += Math.min(7,iconic*1.5);
  score += Math.min(5,events*.5);
  score += Object.values(pos).reduce((a,b)=>a+b,0)*.75;
  score=Math.max(5,Math.min(100,score));

  // Indicative model, not a live market price.
  const base=30000 + Math.max(0,ovr-105)*13500;
  const rankFactor=1+(h2h+vsa)*.035;
  const assetFactor=1+Math.min(.25,(iconic*.025)+(events*.008));
  const resourceFactor=1+Math.min(.12,(coins/50000000)+(gems/10000));
  const squadFactor=.82+(Object.values(pos).reduce((a,b)=>a+b,0)/4)*.18;
  const mid=base*rankFactor*assetFactor*resourceFactor*squadFactor;
  const low=mid*.82, high=mid*1.18;
  const confidence=Math.round(58+Math.min(24,Math.max(0,(ovr-110)*2))+((h2h+vsa)>0?5:0)+Math.min(7,iconic+events/2));

  $("rOvr").textContent=ovr;$("rLevel").textContent=level||"—";
  $("rH2h").textContent=rankName(h2h);$("rVsa").textContent=rankName(vsa);
  $("ovrLabel").textContent=ovr>=120?"Sangat tinggi":ovr>=115?"Tinggi":ovr>=110?"Bagus":"Perlu ditingkatkan";
  $("price").textContent=money(mid);$("priceRange").textContent=`${money(low)} – ${money(high)}`;
  $("confidence").textContent=confidence+"%";$("confidenceBar").style.width=confidence+"%";

  const pros=[],cons=[];
  if(ovr>=115)pros.push(`OVR tinggi (${ovr})`); else cons.push(`OVR masih di bawah ${115}`);
  if(h2h>=2)pros.push(`Rank H2H ${rankName(h2h)}`); else cons.push("Rank H2H belum tinggi/terdeteksi");
  if(vsa>=2)pros.push(`Rank VSA ${rankName(vsa)}`); else cons.push("Rank VSA belum tinggi/terdeteksi");
  if(iconic>0)pros.push(`${iconic} pemain Ikonik/Legend`);
  if(events>=5)pros.push(`${events} pemain/event asset terdeteksi`);
  if(coins>=10000000)pros.push("Saldo Coins cukup besar"); else cons.push("Saldo Coins relatif terbatas");
  if(gems>=1000)pros.push("Jumlah Gems cukup baik"); else cons.push("Jumlah Gems relatif terbatas");
  if(pos.gk)pros.push("GK dinilai siap dipakai"); else cons.push("GK perlu upgrade");
  if(pos.def)pros.push("Lini pertahanan cukup kuat"); else cons.push("Lini pertahanan perlu upgrade");
  if(pos.mid)pros.push("Lini tengah cukup kuat"); else cons.push("Lini tengah perlu upgrade");
  if(pos.att)pros.push("Lini serang cukup kuat"); else cons.push("Lini serang perlu upgrade");
  while(pros.length<3)pros.push("Squad memiliki aset yang masih bisa dikembangkan");
  while(cons.length<3)cons.push("Beberapa detail akun belum dimasukkan");

  $("pros").innerHTML=pros.slice(0,6).map(x=>`<li>${x}</li>`).join("");
  $("cons").innerHTML=cons.slice(0,6).map(x=>`<li>${x}</li>`).join("");
  const weak=Object.entries(pos).filter(([,v])=>!v).map(([k])=>k.toUpperCase());
  $("recommendation").textContent=weak.length?`Prioritaskan upgrade posisi ${weak.join(", ")}. Setelah itu, bandingkan kembali nilai akun dengan kondisi pasar saat akan dijual.`:"Squad terlihat cukup seimbang. Untuk meningkatkan nilai, fokus pada OVR, pemain event/rare, rank, dan resource yang benar-benar terlihat di akun.";
  $("summary").textContent=`Dengan OVR ${ovr}, rank H2H ${rankName(h2h)} dan VSA ${rankName(vsa)}, estimator memberikan skor internal ${Math.round(score)}/100. Nilai di atas adalah kisaran indikatif berdasarkan data yang kamu masukkan.`;

  const assets=[];
  if(iconic)assets.push(`${iconic} Ikonik/Legend`);
  if(events)assets.push(`${events} Event`);
  if(coins)assets.push(`${coins.toLocaleString("id-ID")} Coins`);
  if(gems)assets.push(`${gems.toLocaleString("id-ID")} Gems`);
  if(!assets.length)assets.push("Belum ada aset tambahan");
  $("assets").innerHTML=assets.map(x=>`<span class="chip">${x}</span>`).join("");
  $("hasil").classList.remove("hidden");$("hasil").scrollIntoView({behavior:"smooth"});
}
$("analyzeBtn").onclick=analyze;
$("resetBtn").onclick=()=>{["ovr","level","coins","gems","iconic","eventPlayers"].forEach(id=>$(id).value="");$("hasil").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"});}
