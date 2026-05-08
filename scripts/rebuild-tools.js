// Regenerate all tool HTML files with correct UTF-8 encoding
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'tools');

function writeTool(filename, content) {
  const fp = path.join(toolsDir, filename);
  fs.writeFileSync(fp, content, 'utf8');
  const check = fs.readFileSync(fp, 'utf8');
  if (check.includes('\uFFFD')) {
    console.error(`❌ ${filename} STILL CORRUPTED`);
  } else {
    console.log(`✅ ${filename}`);
  }
}

const FOOTER = `</main>
<footer class="site-footer">
  H24 工具箱 &copy; 2026 &middot; 纯前端 &middot; 隐私安全
</footer>
<div id="toast" class="toast"></div>
<script src="../js/main.js"></script>`;

const HEAD = (title, desc, icon) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - H24 工具箱</title>
  <meta name="description" content="${desc}">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${icon}</text></svg>">
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a href="../" class="logo"><span class="logo-icon">H24</span><span>工具箱</span></a>
    <nav class="header-nav"><a href="../">← 返回首页</a></nav>
  </div>
</header>
<main class="tool-page">
<div class="tool-page-header">
  <a href="../" class="back-link">← 返回全部工具</a>
  <h1>${icon} ${title}</h1>
  <p>${desc}</p>
</div>`;

// ===========================
// 1. QR Code
// ===========================
writeTool('qrcode.html', `${HEAD('二维码生成器', '输入文本或链接，一键生成二维码，支持下载高清 PNG。', '📱')}
<div class="tool-box">
  <div class="input-group">
    <label for="qrInput">输入内容</label>
    <textarea id="qrInput" rows="3" placeholder="输入文本、网址… 例如：https://example.com"></textarea>
  </div>
  <div class="input-group" style="display:flex;gap:.8rem;flex-wrap:wrap">
    <div style="flex:1;min-width:120px">
      <label for="qrSize">尺寸 (px)</label>
      <select id="qrSize">
        <option value="200">200 × 200</option>
        <option value="300" selected>300 × 300</option>
        <option value="400">400 × 400</option>
        <option value="500">500 × 500</option>
      </select>
    </div>
    <div style="flex:1;min-width:120px">
      <label for="qrECC">纠错等级</label>
      <select id="qrECC">
        <option value="L">低 (L)</option>
        <option value="M" selected>中 (M)</option>
        <option value="Q">较高 (Q)</option>
        <option value="H">高 (H)</option>
      </select>
    </div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="generateQR()">生成二维码</button>
    <button class="btn btn-secondary" id="downloadBtn" onclick="downloadQR()" disabled>下载 PNG</button>
  </div>
  <div class="result-box" style="text-align:center;padding:1.5rem;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center">
    <div id="qrContainer" style="background:white;padding:8px;border-radius:4px;display:inline-block"></div>
    <p id="qrHint" style="color:var(--gray-400);margin-top:1rem">点击「生成二维码」预览</p>
  </div>
</div>
${FOOTER}
<script src="../js/qrcode.min.js"></script>
<script>
let qrData = null;
function generateQR() {
  const text = document.getElementById('qrInput').value.trim();
  if (!text) { toast('⚠️ 请输入要生成的内容'); return; }
  const size = parseInt(document.getElementById('qrSize').value);
  const ecc = document.getElementById('qrECC').value;
  const el = document.getElementById('qrContainer');
  el.innerHTML = '';
  try {
    new QRCode(el, { text, width: size, height: size, colorDark: '#000', colorLight: '#fff', correctLevel: QRCode.CorrectLevel[ecc] || QRCode.CorrectLevel.M });
    setTimeout(() => {
      const cv = el.querySelector('canvas');
      if (cv) { qrData = cv.toDataURL('image/png'); document.getElementById('downloadBtn').disabled = false; document.getElementById('qrHint').textContent = '✅ 生成成功，可点击下载'; toast('✅ 二维码已生成'); }
    }, 150);
  } catch(e) { toast('❌ 生成失败: ' + e.message); }
}
function downloadQR() {
  if (!qrData) return;
  const a = document.createElement('a'); a.href = qrData;
  const t = document.getElementById('qrInput').value.trim().substring(0,20).replace(/[^\\w\\u4e00-\\u9fa5]/g, '_');
  a.download = 'qrcode_' + (t || 'h24') + '.png'; a.click();
}
</script>
</body>
</html>`);

// ===========================
// 2. Password Generator
// ===========================
writeTool('password.html', `${HEAD('密码生成器', '生成高强度随机密码，可自定义长度和字符类型，一键复制。', '🔑')}
<div class="tool-box">
  <div class="input-group">
    <label for="pwdLength">密码长度</label>
    <input type="range" id="pwdLength" min="4" max="64" value="16" oninput="updateLabel()">
    <div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--gray-400)">
      <span>4</span><span id="lenLabel">16</span><span>64</span>
    </div>
  </div>
  <div class="input-group">
    <label>字符类型</label>
    <div style="display:flex;gap:1.2rem;flex-wrap:wrap">
      <label style="font-weight:400;cursor:pointer;display:flex;align-items:center;gap:.35rem"><input type="checkbox" id="chkUpper" checked> 大写 A-Z</label>
      <label style="font-weight:400;cursor:pointer;display:flex;align-items:center;gap:.35rem"><input type="checkbox" id="chkLower" checked> 小写 a-z</label>
      <label style="font-weight:400;cursor:pointer;display:flex;align-items:center;gap:.35rem"><input type="checkbox" id="chkDigit" checked> 数字 0-9</label>
      <label style="font-weight:400;cursor:pointer;display:flex;align-items:center;gap:.35rem"><input type="checkbox" id="chkSymbol" checked> 符号 !@#%</label>
    </div>
  </div>
  <div class="input-group">
    <label for="pwdCount">生成数量</label>
    <select id="pwdCount">
      <option value="1">1 个</option>
      <option value="5" selected>5 个</option>
      <option value="10">10 个</option>
      <option value="20">20 个</option>
    </select>
  </div>
  <div class="btn-row"><button class="btn btn-primary" onclick="genPwd()">生成密码</button></div>
  <div id="pwdResults"></div>
</div>
${FOOTER}
<script>
function updateLabel(){document.getElementById('lenLabel').textContent=document.getElementById('pwdLength').value}
function genPwd(){
  const len=parseInt(document.getElementById('pwdLength').value),cnt=parseInt(document.getElementById('pwdCount').value);
  const u=document.getElementById('chkUpper').checked,l=document.getElementById('chkLower').checked,d=document.getElementById('chkDigit').checked,s=document.getElementById('chkSymbol').checked;
  if(!u&&!l&&!d&&!s){toast('至少选一种字符类型');return}
  let chars='';if(u)chars+='ABCDEFGHJKLMNPQRSTUVWXYZ';if(l)chars+='abcdefghijkmnpqrstuvwxyz';if(d)chars+='23456789';if(s)chars+='!@#%^&*()_-+=[]{}|;:,.<>?';
  const arr=new Uint8Array(len*cnt);crypto.getRandomValues(arr);
  const res=[];let idx=0;
  for(let n=0;n<cnt;n++){let p='';for(let i=0;i<len;i++)p+=chars[arr[idx++]%chars.length];res.push(p)}
  document.getElementById('pwdResults').innerHTML=res.map(function(p){return '<div class=\"result-box\" style=\"display:flex;align-items:center;justify-content:space-between;padding:.6rem 1rem\"><code style=\"font-size:1rem;user-select:all\">'+p+'</code><button class=\"btn btn-sm btn-secondary\" onclick=\"navigator.clipboard.writeText(\"'+p+'\").then(function(){toast(\"已复制\")})\">复制</button></div>'}).join('');
}
genPwd();
</script>
</body>
</html>`);

// ===========================
// 3. JSON Formatter
// ===========================
writeTool('json.html', `${HEAD('JSON 格式化', '格式化、压缩、校验 JSON 数据，自动检测语法错误位置。', '📋')}
<div class="tool-box">
  <div class="input-group">
    <label for="jsonInput">输入 JSON</label>
    <textarea id="jsonInput" rows="8" placeholder='{"name":"H24","version":1}'></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="fmt(2)">格式化</button>
    <button class="btn btn-secondary" onclick="fmt(0)">压缩</button>
    <button class="btn btn-secondary" onclick="fmt(4)">缩进 4</button>
    <button class="btn btn-secondary" onclick="var o=document.getElementById('jsonOutput');navigator.clipboard.writeText(o.textContent).then(function(){toast('已复制')})">复制结果</button>
  </div>
  <div class="input-group"><label>输出</label>
    <div id="jsonOutput" class="result-box" style="min-height:120px"><span class="result-empty">等待输入…</span></div>
  </div>
  <div id="jsonStatus"></div>
</div>
${FOOTER}
<script>
function fmt(sp){
  var inp=document.getElementById('jsonInput').value.trim(),out=document.getElementById('jsonOutput'),st=document.getElementById('jsonStatus');
  if(!inp){out.innerHTML='<span class=\"result-empty\">请输入 JSON</span>';st.innerHTML='';return}
  try{var p=JSON.parse(inp),f=JSON.stringify(p,null,sp);out.textContent=f;var ln=f.split('\\n').length;st.innerHTML='<div class=\"status-msg success\">✅ 校验通过 · '+ln+' 行</div>'}
  catch(e){out.innerHTML='<span class=\"result-empty\">解析失败</span>';st.innerHTML='<div class=\"status-msg error\">❌ '+e.message+'</div>'}
}
document.getElementById('jsonInput').addEventListener('paste',function(){setTimeout(function(){fmt(2)},50)});
</script>
</body>
</html>`);

// ===========================
// 4. Base64
// ===========================
writeTool('base64.html', `${HEAD('Base64 编解码', '文本与 Base64 互转，也支持文件（图片、PDF 等）转 Base64。', '🔐')}
<div class="tool-box">
  <div style="display:flex;gap:.6rem;margin-bottom:1.2rem">
    <button class="btn btn-primary" onclick="setMode('encode')" id="encBtn">编码</button>
    <button class="btn btn-secondary" onclick="setMode('decode')" id="decBtn">解码</button>
  </div>
  <div class="input-group"><label for="b64Input">输入</label><textarea id="b64Input" rows="5" placeholder="输入要编码/解码的文本…"></textarea></div>
  <div class="input-group"><label for="b64File">或上传文件编码</label><input type="file" id="b64File" onchange="loadFile()"></div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="convert()">执行</button>
    <button class="btn btn-secondary" onclick="var o=document.getElementById('b64Output');navigator.clipboard.writeText(o.textContent).then(function(){toast('已复制')})">复制</button>
  </div>
  <div class="input-group"><label>输出</label><div id="b64Output" class="result-box" style="min-height:80px"><span class="result-empty">等待输入…</span></div></div>
  <div id="b64Status"></div>
</div>
${FOOTER}
<script>
var b64mode='encode';
function setMode(m){b64mode=m;document.getElementById('encBtn').className=m==='encode'?'btn btn-primary':'btn btn-secondary';document.getElementById('decBtn').className=m==='decode'?'btn btn-primary':'btn btn-secondary';document.getElementById('b64Input').placeholder=m==='encode'?'输入要编码的文本…':'输入 Base64 字符串…';document.getElementById('b64File').disabled=m!=='encode'}
function loadFile(){var f=document.getElementById('b64File').files[0];if(!f)return;var r=new FileReader();r.onload=function(e){document.getElementById('b64Input').value=e.target.result;toast('已读取: '+f.name)};r.readAsDataURL(f)}
function convert(){
  var inp=document.getElementById('b64Input').value.trim(),out=document.getElementById('b64Output'),st=document.getElementById('b64Status');
  if(!inp){out.innerHTML='<span class=\"result-empty\">请输入内容</span>';st.innerHTML='';return}
  try{if(b64mode==='encode'){var e=btoa(unescape(encodeURIComponent(inp)));out.textContent=e;st.innerHTML='<div class=\"status-msg success\">✅ 编码成功 · '+e.length+' 字符</div>'}
  else{try{var d=decodeURIComponent(escape(atob(inp)));out.textContent=d;st.innerHTML='<div class=\"status-msg success\">✅ 解码成功</div>'}catch(e){out.innerHTML='<span class=\"result-empty\">无法解码为文本</span>';st.innerHTML='<div class=\"status-msg error\">❌ 无效的 Base64</div>'}}}
  catch(e){out.innerHTML='<span class=\"result-empty\">转换失败</span>';st.innerHTML='<div class=\"status-msg error\">❌ '+e.message+'</div>'}
}
</script>
</body>
</html>`);

// ===========================
// 5. URL Encode/Decode
// ===========================
writeTool('urlcode.html', `${HEAD('URL 编解码', 'URL 编码（百分号编码）与解码，解决中文和特殊字符乱码问题。', '🔗')}
<div class="tool-box">
  <div style="display:flex;gap:.6rem;margin-bottom:1.2rem">
    <button class="btn btn-primary" onclick="setMode('encode')" id="urlEncBtn">编码</button>
    <button class="btn btn-secondary" onclick="setMode('decode')" id="urlDecBtn">解码</button>
  </div>
  <div class="input-group"><label for="urlInput">输入</label><textarea id="urlInput" rows="5" placeholder="输入要编码/解码的文本…"></textarea></div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="convertURL()">执行</button>
    <button class="btn btn-secondary" onclick="swap()">互换</button>
    <button class="btn btn-secondary" onclick="var o=document.getElementById('urlOutput');navigator.clipboard.writeText(o.textContent).then(function(){toast('已复制')})">复制</button>
  </div>
  <div class="input-group"><label>输出</label><div id="urlOutput" class="result-box" style="min-height:80px"><span class="result-empty">等待输入…</span></div></div>
  <div id="urlStatus"></div>
</div>
${FOOTER}
<script>
var urlMode='encode';
function setMode(m){urlMode=m;document.getElementById('urlEncBtn').className=m==='encode'?'btn btn-primary':'btn btn-secondary';document.getElementById('urlDecBtn').className=m==='decode'?'btn btn-primary':'btn btn-secondary'}
function convertURL(){var inp=document.getElementById('urlInput').value,out=document.getElementById('urlOutput'),st=document.getElementById('urlStatus');if(!inp){out.innerHTML='<span class=\"result-empty\">请输入内容</span>';st.innerHTML='';return}
try{var r=urlMode==='encode'?encodeURIComponent(inp):decodeURIComponent(inp);out.textContent=r;st.innerHTML='<div class=\"status-msg success\">✅ 成功 · '+r.length+' 字符</div>'}catch(e){out.innerHTML='<span class=\"result-empty\">转换失败</span>';st.innerHTML='<div class=\"status-msg error\">❌ '+e.message+'</div>'}}
function swap(){var o=document.getElementById('urlOutput');document.getElementById('urlInput').value=o.textContent;convertURL()}
</script>
</body>
</html>`);

// ===========================
// 6. Timestamp Converter
// ===========================
writeTool('timestamp.html', `${HEAD('时间戳转换', 'Unix 时间戳（秒/毫秒）与日期时间双向转换。', '⏰')}
<div class="tool-box">
  <h3 style="margin-bottom:1rem">当前时间</h3>
  <div id="nowBox" style="background:var(--primary-light);padding:.8rem 1rem;border-radius:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
    <span id="nowDisplay" style="font-weight:600">加载中…</span>
    <span><code id="nowTs" style="background:white;padding:.3rem .6rem;border-radius:4px"></code> <button class="btn btn-sm btn-secondary" onclick="navigator.clipboard.writeText(Math.floor(Date.now()/1000).toString()).then(function(){toast('已复制')})">复制</button></span>
  </div>
  <hr style="margin:1.5rem 0;border:none;border-top:1px solid var(--gray-200)">
  <h3 style="margin-bottom:1rem">时间戳 → 日期</h3>
  <div class="input-group"><label for="tsInput">输入时间戳</label><input type="text" id="tsInput" placeholder="例如：1700000000 或 1700000000000"></div>
  <div class="btn-row"><button class="btn btn-primary" onclick="ts2date()">转换</button><button class="btn btn-secondary" onclick="document.getElementById('tsInput').value=Math.floor(Date.now()/1000);ts2date()">当前时间戳</button></div>
  <div id="tsResult" class="result-box" style="min-height:50px"><span class="result-empty">等待输入…</span></div>
  <hr style="margin:1.5rem 0;border:none;border-top:1px solid var(--gray-200)">
  <h3 style="margin-bottom:1rem">日期 → 时间戳</h3>
  <div class="input-group"><label for="dateInput">选择日期时间</label><input type="datetime-local" id="dateInput"></div>
  <div class="btn-row"><button class="btn btn-primary" onclick="date2ts()">转换</button></div>
  <div id="dateResult" class="result-box" style="min-height:50px"><span class="result-empty">等待输入…</span></div>
</div>
${FOOTER}
<script>
function updateClock(){var n=new Date();document.getElementById('nowDisplay').textContent=n.toLocaleString('zh-CN',{hour12:false})+'(北京时间)';document.getElementById('nowTs').textContent=n.getTime()+' ms / '+Math.floor(n.getTime()/1000)+' s'}
setInterval(updateClock,1000);updateClock();
(function(){var n=new Date();document.getElementById('dateInput').value=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+'T'+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')})();
function ts2date(){var v=document.getElementById('tsInput').value.trim(),out=document.getElementById('tsResult');if(!v){out.innerHTML='<span class=\"result-empty\">请输入时间戳</span>';return}
var ts=parseInt(v);if(isNaN(ts)){out.innerHTML='<span class=\"result-empty\">无效时间戳</span>';return}
var ms=v.length>=13?ts:ts*1000;var d=new Date(ms);if(isNaN(d.getTime())){out.innerHTML='<span class=\"result-empty\">无效日期</span>';return}
out.innerHTML='<pre style=\"margin:0;line-height:1.8\"><b>北京时间:</b> '+d.toLocaleString('zh-CN',{hour12:false})+'<br><b>UTC:</b> '+d.toUTCString()+'<br><b>ISO:</b> '+d.toISOString()+'<br><b>秒级:</b> '+Math.floor(d.getTime()/1000)+'<br><b>毫秒级:</b> '+d.getTime()+'<br><b>星期:</b> '+"日一二三四五六".charAt(d.getDay())+'</pre>'}
function date2ts(){var v=document.getElementById('dateInput').value,out=document.getElementById('dateResult');if(!v){out.innerHTML='<span class=\"result-empty\">请选择日期</span>';return}
var d=new Date(v);if(isNaN(d.getTime())){out.innerHTML='<span class=\"result-empty\">无效日期</span>';return}
out.innerHTML='<pre style=\"margin:0;line-height:1.8\"><b>秒级:</b> '+Math.floor(d.getTime()/1000)+'<br><b>毫秒级:</b> '+d.getTime()+'</pre>'}
</script>
</body>
</html>`);

// ===========================
// 7. Word Count
// ===========================
writeTool('wordcount.html', `${HEAD('字数统计', '实时统计中英文字数、字符数、单词数、行数、段落数。', '📝')}
<div class="tool-box">
  <div class="input-group"><label for="wcInput">输入文本</label><textarea id="wcInput" rows="12" placeholder="输入或粘贴文本，实时统计…" oninput="updateStats()" style="min-height:250px"></textarea></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:.75rem;margin-top:1rem">
    <div class="stat-c"><div class="stat-l">总字符</div><div class="stat-v" id="s1">0</div></div>
    <div class="stat-c"><div class="stat-l">中文字</div><div class="stat-v" id="s2">0</div></div>
    <div class="stat-c"><div class="stat-l">英文单词</div><div class="stat-v" id="s3">0</div></div>
    <div class="stat-c"><div class="stat-l">数字</div><div class="stat-v" id="s4">0</div></div>
    <div class="stat-c"><div class="stat-l">标点</div><div class="stat-v" id="s5">0</div></div>
    <div class="stat-c"><div class="stat-l">空格</div><div class="stat-v" id="s6">0</div></div>
    <div class="stat-c"><div class="stat-l">行数</div><div class="stat-v" id="s7">0</div></div>
    <div class="stat-c"><div class="stat-l">段落</div><div class="stat-v" id="s8">0</div></div>
  </div>
  <style>.stat-c{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:8px;padding:.7rem;text-align:center}.stat-l{font-size:.78rem;color:var(--gray-400);margin-bottom:.2rem}.stat-v{font-size:1.3rem;font-weight:700;color:var(--primary)}</style>
</div>
${FOOTER}
<script>
function updateStats(){var t=document.getElementById('wcInput').value;document.getElementById('s1').textContent=t.length;document.getElementById('s2').textContent=(t.match(/[\\u4e00-\\u9fff\\u3400-\\u4dbf]/g)||[]).length;document.getElementById('s3').textContent=(t.match(/[a-zA-Z]+/g)||[]).length;document.getElementById('s4').textContent=(t.match(/[0-9]/g)||[]).length;document.getElementById('s5').textContent=(t.match(/[^\\w\\s\\u4e00-\\u9fff]/g)||[]).length;document.getElementById('s6').textContent=(t.match(/\\s/g)||[]).length;document.getElementById('s7').textContent=t?t.split('\\n').length:0;document.getElementById('s8').textContent=t?t.split(/\\n\\s*\\n/).filter(function(p){return p.trim()}).length:0}
</script>
</body>
</html>`);

// ===========================
// 8. Color Converter
// ===========================
writeTool('color.html', `${HEAD('颜色转换器', 'HEX / RGB / HSL 颜色格式互转，带色块实时预览。', '🎨')}
<div class="tool-box">
  <div id="colorPrev" style="width:100%;height:100px;border-radius:8px;background:#2563eb;border:1px solid var(--gray-200);margin-bottom:1.5rem"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.8rem;margin-bottom:1rem">
    <div class="input-group"><label for="hexVal">HEX</label><input type="text" id="hexVal" value="#2563eb" oninput="fromHex()"></div>
    <div class="input-group"><label for="rgbVal">RGB</label><input type="text" id="rgbVal" value="rgb(37,99,235)" oninput="fromRgb()"></div>
    <div class="input-group"><label for="hslVal">HSL</label><input type="text" id="hslVal" value="hsl(221,83%,53%)" oninput="fromHsl()"></div>
  </div>
  <div class="input-group"><label for="picker">取色器</label><input type="color" id="picker" value="#2563eb" oninput="fromPicker()" style="width:60px;height:38px;padding:2px;border:1px solid var(--gray-200);border-radius:6px;cursor:pointer"></div>
</div>
${FOOTER}
<script>
function setC(r,g,b){var h='#'+[r,g,b].map(function(c){return c.toString(16).padStart(2,'0')}).join('').toUpperCase();document.getElementById('colorPrev').style.background=h;document.getElementById('hexVal').value=h;document.getElementById('rgbVal').value='rgb('+r+','+g+','+b+')';document.getElementById('hslVal').value=rgb2hsl(r,g,b);document.getElementById('picker').value=h}
function fromHex(){var v=document.getElementById('hexVal').value.replace('#','');if(v.length===3)v=v.split('').map(function(c){return c+c}).join('');if(v.length===6&&/^[0-9a-f]{6}$/i.test(v)){var r=parseInt(v.slice(0,2),16),g=parseInt(v.slice(2,4),16),b=parseInt(v.slice(4,6),16);setC(r,g,b)}}
function fromRgb(){var m=document.getElementById('rgbVal').value.match(/rgb\\s*\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)/i);if(m)setC(parseInt(m[1]),parseInt(m[2]),parseInt(m[3]))}
function fromHsl(){var m=document.getElementById('hslVal').value.match(/hsl\\s*\\((\\d+)\\s*,\\s*(\\d+)%\\s*,\\s*(\\d+)%\\s*\\)/i);if(m){var a=hsl2rgb(parseInt(m[1]),parseInt(m[2])/100,parseInt(m[3])/100);setC(a[0],a[1],a[2])}}
function fromPicker(){document.getElementById('hexVal').value=document.getElementById('picker').value.toUpperCase();fromHex()}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2;if(M===m)return'hsl(0,0%,'+Math.round(l*100)+'%)';var d=M-m,s=l>.5?d/(2-M-m):d/(M+m);var h;(M===r)?h=(g-b)/d+(g<b?6:0):(M===g)?h=(b-r)/d+2:h=(r-g)/d+4;h/=6;return'hsl('+Math.round(h*360)+','+Math.round(s*100)+'%,'+Math.round(l*100)+'%)'}
function hsl2rgb(h,s,l){h/=360;var c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h*6)%2-1)),m=l-c/2;var r,g,b;if(h<1/6){r=c;g=x;b=0}else if(h<2/6){r=x;g=c;b=0}else if(h<3/6){r=0;g=c;b=x}else if(h<4/6){r=0;g=x;b=c}else if(h<5/6){r=x;g=0;b=c}else{r=c;g=0;b=x}return[Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)]}
fromHex();
</script>
</body>
</html>`);

// ===========================
// 9. Regex Tester
// ===========================
writeTool('regex.html', `${HEAD('正则测试器', '在线测试正则表达式，实时匹配高亮显示，支持捕获组查看和替换。', '🧪')}
<div class="tool-box">
  <div class="input-group">
    <label for="rePat">正则表达式</label>
    <div style="display:flex;gap:.3rem;align-items:center"><code style="color:var(--gray-400)">/</code><input type="text" id="rePat" value="\\\\d+" style="flex:1;font-family:monospace" oninput="testRe()" placeholder="正则"><code style="color:var(--gray-400)">/</code><input type="text" id="reFlags" value="g" style="width:70px;font-family:monospace" oninput="testRe()" placeholder="gim"></div>
  </div>
  <div class="input-group"><label for="reText">测试文本</label><textarea id="reText" rows="6" oninput="testRe()" placeholder="输入要匹配的文本…">Hello 2026! 价格: 99 元，库存: 42 件。</textarea></div>
  <div class="input-group"><label for="reReplace">替换文本（可选）</label><input type="text" id="reReplace" placeholder="输入替换文本…" oninput="testRe()"></div>
  <div class="btn-row"><button class="btn btn-primary" onclick="testRe()">测试</button><button class="btn btn-secondary" onclick="document.getElementById('rePat').value='';document.getElementById('reText').value='';document.getElementById('reReplace').value='';document.getElementById('reOutput').innerHTML='<span class=\\\"result-empty\\\">等待测试…</span>'">清空</button></div>
  <div id="reOutput" class="result-box" style="min-height:100px;white-space:pre-wrap;font-family:monospace"><span class="result-empty">等待测试…</span></div>
  <div id="reInfo" style="margin-top:.5rem;font-size:.85rem"></div>
</div>
${FOOTER}
<script>
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function testRe(){
  var pat=document.getElementById('rePat').value,flags=document.getElementById('reFlags').value,txt=document.getElementById('reText').value,rpl=document.getElementById('reReplace').value,out=document.getElementById('reOutput'),info=document.getElementById('reInfo');
  if(!pat){out.innerHTML='<span class=\"result-empty\">请输入正则</span>';info.textContent='';return}
  try{var re=new RegExp(pat,flags);var matches=txt.matchAll(re);var arr=Array.from(matches);if(rpl){out.innerHTML='<div>替换结果:</div><div style=margin-top:.3rem>'+esc(txt.replace(re,rpl))+'</div>';info.innerHTML='<span style=color:var(--gray-400)>替换完成</span>';return}
  if(arr.length===0){out.innerHTML='<span class=\"result-empty\">无匹配</span>';info.textContent='';return}
  var last=0,html='',cnt=0;var g=new RegExp(pat,flags.includes('g')?flags:flags+'g');var m;
  while((m=g.exec(txt))!==null){html+=esc(txt.slice(last,m.index));html+='<mark style=background:#fde68a;padding:.1rem .2rem;border-radius:2px>'+esc(m[0])+'</mark>';last=g.lastIndex;cnt++;if(m.index===g.lastIndex)g.lastIndex++}
  html+=esc(txt.slice(last));out.innerHTML='<div style=margin-bottom:.3rem;color:var(--gray-500);font-size:.85rem>匹配 '+cnt+' 处</div><div>'+html+'</div>';
  if(arr[0].length>1){var gi='<div style=margin-top:.3rem;font-size:.85rem>捕获组: ';for(var i=1;i<arr[0].length;i++)gi+='<code style=background:var(--gray-100);padding:.1rem .4rem;border-radius:3px>\\$'+i+': '+esc(arr[0][i]||'(空)')+'</code> ';gi+='</div>';info.innerHTML=gi}else{info.textContent=''}}
  catch(e){out.innerHTML='<span class=\"result-empty\">正则错误</span>';info.innerHTML='<span style=color:#dc2626>'+esc(e.message)+'</span>'}
}
testRe();
</script>
</body>
</html>`);

// ===========================
// 10. Diff Tool
// ===========================
writeTool('diff.html', `${HEAD('文本对比工具', '逐行对比两段文本差异，高亮显示增删改，适合代码和文章对比。', '📊')}
<div class="tool-box">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem">
    <div class="input-group"><label for="diffA">原始文本 (A)</label><textarea id="diffA" rows="10" style="min-height:200px" placeholder="原始版本…"></textarea></div>
    <div class="input-group"><label for="diffB">新文本 (B)</label><textarea id="diffB" rows="10" style="min-height:200px" placeholder="新版本…"></textarea></div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="runDiff()">对比</button>
    <button class="btn btn-secondary" onclick="demo()">示例</button>
    <button class="btn btn-secondary" onclick="document.getElementById('diffA').value='';document.getElementById('diffB').value='';document.getElementById('diffOut').innerHTML='<span class=\\\"result-empty\\\">等待对比…</span>';document.getElementById('diffStats').textContent=''">清空</button>
  </div>
  <div id="diffOut" class="result-box" style="min-height:100px;padding:0;overflow:hidden;font-family:monospace;font-size:.85rem"><span class="result-empty" style="display:block;padding:1rem">等待对比…</span></div>
  <div id="diffStats" style="font-size:.85rem;margin-top:.5rem"></div>
</div>
${FOOTER}
<script>
function demo(){
  document.getElementById('diffA').value='function hello() {\\n  console.log(\"Hello World\");\\n  return true;\\n}\\n\\nconst name = \"张三\";\\nconsole.log(name);';
  document.getElementById('diffB').value='function hello() {\\n  console.log(\"Hello H24!\");\\n  return false;\\n}\\n\\nconst name = \"李四\";\\nconst age = 28;\\nconsole.log(name, age);';runDiff()}
function runDiff(){
  var a=document.getElementById('diffA').value,b=document.getElementById('diffB').value,out=document.getElementById('diffOut');if(!a&&!b){out.innerHTML='<span class=\\\"result-empty\\\">请输入文本对比</span>';return}
  var la=a.split('\\n'),lb=b.split('\\n');var dp=Array.from({length:la.length+1},function(){return new Int32Array(lb.length+1)});
  for(var i=1;i<=la.length;i++)for(var j=1;j<=lb.length;j++)dp[i][j]=la[i-1]===lb[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  var res=[],na=0,nb=0;function walk(i,j){if(i>0&&j>0&&la[i-1]===lb[j-1]){walk(i-1,j-1);res.push({t:'eq',v:la[i-1]})}else if(j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])){walk(i,j-1);res.push({t:'add',v:lb[j-1]})}else if(i>0){walk(i-1,j);res.push({t:'del',v:la[i-1]})}}
  walk(la.length,lb.length);var html='<table style=width:100%;border-collapse:collapse>';var add=0,del=0,eq=0;
  res.forEach(function(d){var bg=d.t==='add'?'#dcfce7':d.t==='del'?'#fee2e2':'transparent';var sign=d.t==='add'?'+':d.t==='del'?'-':' ';var sc=d.t==='add'?'#16a34a':d.t==='del'?'#dc2626':'var(--gray-400)';if(d.t==='add'){nb++;add++}else if(d.t==='del'){na++;del++}else{na++;nb++;eq++}
    html+='<tr style=background:'+bg+'><td style=width:2rem;text-align:right;color:var(--gray-400);padding:.1rem .4rem;border-right:1px solid var(--gray-200)>'+(d.t==='add'?nb:na)+'</td><td style=width:1.2rem;text-align:center;color:'+sc+';padding:.1rem 0>'+sign+'</td><td style=padding:.1rem .5rem;white-space:pre-wrap>'+esc(d.v)+'</td></tr>'});
  html+='</table>';out.innerHTML=html;
  var total=add+del+eq;document.getElementById('diffStats').innerHTML='<span style=color:#16a34a>+'+add+' 新增</span> · <span style=color:#dc2626>-'+del+' 删除</span> · <span style=color:var(--gray-400)>'+eq+' 相同 · 变更 '+Math.round((add+del)/total*100)+'%</span>'}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
</script>
</body>
</html>`);

console.log('All tool pages regenerated successfully!');
