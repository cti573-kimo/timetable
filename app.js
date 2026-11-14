const $=id=>document.getElementById(id);let data=[],homerooms={};const days=['一','二','三','四','五'];
function csvParse(t){const out=[];let row=[],field='',quoted=false;for(let i=0;i<t.length;i++){let c=t[i];if(c==='"'){if(quoted&&t[i+1]==='"'){field+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(field);field=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&t[i+1]==='\n')i++;row.push(field);if(row.some(x=>x))out.push(row);row=[];field=''}else field+=c}if(field||row.length){row.push(field);out.push(row)}const head=out.shift().map(x=>x.replace(/^\uFEFF/,''));return out.map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]||''])))}
function opt(sel,items){sel.replaceChildren(...items.map(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;return o}))}
function grade(c){if(c.includes('一'))return '一年級';if(c.includes('二'))return '二年級';if(c.includes('三'))return '三年級';return '其他'}
function refresh(){const mode=$('mode').value;const cls=Object.keys(homerooms);$('grade').hidden=mode!=='class';$('grade').parentElement.hidden=mode!=='class';$('classLabel').hidden=mode!=='class';$('teacherLabel').hidden=mode!=='teacher';if(mode==='class'){const g=$('grade').value;opt($('class'),cls.filter(c=>grade(c)===g))}render()}
function render(){const mode=$('mode').value,chosen=$(mode).value;if(!chosen)return;const cells={};for(const row of data){for(let d=1;d<=5;d++)for(let p=1;p<=9;p++){const k=''+d+p,subject=row['s'+k],classes=(row['c'+k]||'').split(' ');if(!subject)continue;if(mode==='teacher'&&row.teachername===chosen||mode==='class'&&classes.includes(chosen)){const key=d+'-'+p;(cells[key]??=[]).push({subject,detail:mode==='teacher'?row['c'+k]:row.teachername})}}}
$('heading').textContent=chosen+(mode==='class'?' 班課表（導師：'+(homerooms[chosen]||'未提供')+'）':' 老師課表');const t=document.createElement('table');const thead=t.createTHead(),tr=thead.insertRow();['節次',...days].forEach(x=>{const th=document.createElement('th');th.textContent=x;tr.append(th)});const tbody=t.createTBody();for(let p=1;p<=9;p++){const tr=tbody.insertRow(),time=CONFIG.PERIOD_TIMES[p];tr.insertCell().textContent=`第${p}節\n${time.start}–${time.end}`;for(let d=1;d<=5;d++){const td=tr.insertCell();for(const x of cells[d+'-'+p]||[]){const a=document.createElement('div');a.className='subject';a.textContent=x.subject;const b=document.createElement('div');b.className='detail';b.textContent=x.detail;td.append(a,b)}}} $('table').replaceChildren(t)}
async function init(){
  try {
    const [label,url]=Object.entries(CONFIG.SEMESTERS)[0];
    $('semester').textContent=label;
    const offline=window.TIMETABLE_OFFLINE_DATA;
    let csvText,homeData;
    // file:// 環境禁止 fetch()，直接使用隨網站附上的離線備援資料。
    if(location.protocol==='file:'){
      if(!offline)throw Error('缺少 data.js，請確認所有檔案位於同一資料夾');
      csvText=offline.csv;homeData=offline.homerooms;
    }else{
      try{
        const homeroomUrl=url.replace('timetable_','homerooms_').replace(/\\.csv(?:\\?.*)?$/,'.json');
        const [c,h]=await Promise.all([fetch(url),fetch(homeroomUrl)]);
        if(!c.ok||!h.ok)throw Error('伺服器資料檔讀取失敗');
        csvText=await c.text();homeData=await h.json();
      }catch(error){
        if(!offline)throw error;
        csvText=offline.csv;homeData=offline.homerooms;
        $('status').textContent='使用內建備援課表資料';
      }
    }
    data=csvParse(csvText);
    homerooms=homeData;
    if(!data.length||!Object.keys(homerooms).length)throw Error('課表資料為空');
    opt($('grade'),['一年級','二年級','三年級','其他'].filter(g=>Object.keys(homerooms).some(c=>grade(c)===g)));
    opt($('teacher'),[...new Set(data.map(r=>r.teachername).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant')));
    $('mode').addEventListener('change',refresh);
    $('grade').addEventListener('change',refresh);
    $('class').addEventListener('change',render);
    $('teacher').addEventListener('change',render);
    refresh();
    $('status').textContent=`已載入 ${Object.keys(homerooms).length} 班、${data.length} 位教師`+
      (location.protocol==='file:'?'（離線模式）':'');
  }catch(e){
    $('status').textContent='載入失敗：'+e.message;
    console.error('課表載入錯誤',e);
  }
}
init();
