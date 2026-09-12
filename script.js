const openBtn = document.getElementById("openBtn");
const surprise = document.getElementById("surprise");

openBtn.addEventListener("click", () => {
  surprise.classList.remove("hidden");
  surprise.scrollIntoView({behavior:"smooth"});
  openBtn.textContent = "The surprise is open ❤️";
  openBtn.disabled = true;
  for(let i=0;i<18;i++) setTimeout(createHeart,i*100);
});

function createHeart(){
  const h=document.createElement("div");
  h.className="heart";
  h.textContent=["♥","♡","✦","✨"][Math.floor(Math.random()*4)];
  h.style.left=Math.random()*100+"vw";
  h.style.fontSize=(12+Math.random()*24)+"px";
  h.style.animationDuration=(5+Math.random()*4)+"s";
  document.querySelector(".hearts").appendChild(h);
  setTimeout(()=>h.remove(),9000);
}
setInterval(createHeart,900);

function updateCountdown(){
  const now=new Date();
  let year=now.getFullYear();
  let birthday=new Date(year,8,22,0,0,0);
  if(now>=birthday) birthday=new Date(year+1,8,22,0,0,0);
  const diff=birthday-now;
  const days=Math.floor(diff/86400000);
  const hours=Math.floor(diff/3600000)%24;
  const minutes=Math.floor(diff/60000)%60;
  const seconds=Math.floor(diff/1000)%60;
  document.getElementById("days").textContent=days;
  document.getElementById("hours").textContent=String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent=String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent=String(seconds).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);
