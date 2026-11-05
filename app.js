// Copy buttons
const toast = document.getElementById('toast');
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove('show'), 1800);
}
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = document.getElementById(btn.dataset.target).innerText.trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    const old = btn.textContent;
    btn.textContent = 'Copied!';
    showToast('Copied to clipboard');
    setTimeout(() => btn.textContent = old, 1500);
  });
});

// Count-up stats
document.querySelectorAll('[data-count]').forEach(el => {
  const end = +el.dataset.count; let n = 0;
  const step = () => { n += 1; el.textContent = n; if (n < end) setTimeout(step, 90); };
  step();
});

// Card spotlight
document.querySelectorAll('.card').forEach(c => {
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// Floating particle background
const cv = document.getElementById('bg');
const ctx = cv.getContext('2d');
let W, H, pts = [];
function resize(){
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({length: Math.min(70, Math.floor(W / 20))}, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
    r: Math.random() * 1.8 + .6
  }));
}
function draw(){
  ctx.clearRect(0, 0, W, H);
  for (const p of pts){
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
    ctx.fillStyle = 'rgba(34,227,166,.55)'; ctx.fill();
  }
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++){
    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
    if (d < 120){
      ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 120) * .25})`;
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
    }
  }
  requestAnimationFrame(draw);
}
addEventListener('resize', resize);
resize();
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
