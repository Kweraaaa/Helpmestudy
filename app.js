const resources=[
{level:"GENERAL",subject:"General",topic:"General Study",type:"General Site",icon:"🤖",title:"Gizmo",tag:"AI Learning",tagClass:"ai",desc:"AI-powered quizzes, flashcards and an AI Tutor to help you learn and practise.",url:"https://gizmo.ai/"},
{level:"GENERAL",subject:"General",topic:"Exam Revision",type:"General Site",icon:"📚",title:"Save My Exams",desc:"Revision notes, exam questions, past papers, flashcards and other exam-prep resources.",url:"https://www.savemyexams.com/"},
{level:"GENERAL",subject:"General",topic:"Cambridge Exams",type:"General Site",icon:"📝",title:"PapaCambridge",desc:"Cambridge exam resources including past papers, mark schemes, syllabuses and practice materials.",url:"https://pastpapers.papacambridge.com/"},
{level:"GENERAL",subject:"General",topic:"Learning & Revision",type:"General Site",icon:"🧠",title:"Cognito",desc:"Video lessons, notes, quizzes, flashcards and exam-style practice for KS3, GCSE and more.",url:"https://cognito.org/"},
{level:"KS3",subject:"Maths",topic:"Algebra",type:"Video",icon:"🎥",title:"Cognito: KS3 Maths",desc:"Explore Cognito's KS3 maths course and choose topics to study.",url:"https://cognito.org/courses"},
{level:"KS3",subject:"Science",topic:"Science",type:"Lessons",icon:"🧪",title:"Oak: KS3 Science",desc:"Sequenced science lessons covering biology, chemistry and physics.",url:"https://www.thenational.academy/teachers/programmes/science-secondary-aqa/units?keystages=ks3"},
{level:"KS3",subject:"All Subjects",topic:"Revision",type:"Lessons",icon:"📚",title:"Cognito: KS3 Courses",desc:"Browse Cognito's KS3 courses and learning materials.",url:"https://cognito.org/courses"},
{level:"KS4",subject:"Maths",topic:"Maths",type:"Video",icon:"🧮",title:"Cognito: GCSE Maths",desc:"GCSE Maths courses organised by exam board, including CIE and Edexcel International.",url:"https://cognito.org/courses/gcse/maths"},
{level:"KS4",subject:"Biology",topic:"Biology",type:"Video",icon:"🧬",title:"Cognito: GCSE Biology",desc:"GCSE Biology lessons and revision resources organised by exam board.",url:"https://www.cognito.org/courses/gcse/biology"},
{level:"KS4",subject:"Science",topic:"Science",type:"Lessons",icon:"🔬",title:"Oak: Secondary Science",desc:"Free curriculum resources for secondary science.",url:"https://www.thenational.academy/"},
{level:"KS4",subject:"All Subjects",topic:"Revision",type:"Quizzes",icon:"🧠",title:"Cognito: GCSE Revision",desc:"Videos, quizzes, flashcards, exam questions and past papers across many GCSE subjects.",url:"https://go.cognitoedu.org/gcse"},
{level:"KS4",subject:"Maths",topic:"Exam Practice",type:"Past Papers",icon:"📝",title:"Cognito: GCSE Past Papers",desc:"Past papers organised by subject and exam board, including Cambridge IGCSE.",url:"https://go.cognitoedu.org/gcse-pastpapers"},
{level:"KS4",subject:"English",topic:"English",type:"Lessons",icon:"📖",title:"Cognito: English Courses",desc:"Browse available GCSE English learning resources.",url:"https://cognito.org/courses/gcse/english-language"}
];

const cards=document.getElementById("cards"),empty=document.getElementById("empty"),level=document.getElementById("levelFilter"),subject=document.getElementById("subjectFilter"),type=document.getElementById("typeFilter"),search=document.getElementById("search"),heroSearch=document.getElementById("heroSearch");
const subjects=[...new Set(resources.map(r=>r.subject))].sort();
subjects.forEach(s=>subject.insertAdjacentHTML("beforeend",`<option>${s}</option>`));

function render(){
 const q=search.value.toLowerCase(),l=level.value,s=subject.value,t=type.value;
 const filtered=resources.filter(r=>(l==="ALL"||r.level===l)&&(s==="ALL"||r.subject===s)&&(t==="ALL"||r.type===t)&&JSON.stringify(r).toLowerCase().includes(q));
 cards.innerHTML=filtered.map(r=>`<article class="resource-card"><span class="icon">${r.icon}</span><span class="meta">${r.level === "GENERAL" ? "GENERAL SITE" : r.level + " · " + r.subject + " · " + r.type}</span>${r.tag ? `<span class="tag ${r.tagClass || ""}">${r.tag}</span>` : ""}<h3>${r.title}</h3><p>${r.desc}</p><a href="${r.url}" target="_blank" rel="noopener noreferrer">Open resource →</a></article>`).join("");
 empty.style.display=filtered.length?"none":"block";
}
[level,subject,type,search].forEach(x=>x.addEventListener("input",render));
document.getElementById("clear").onclick=()=>{level.value="ALL";subject.value="ALL";type.value="ALL";search.value="";heroSearch.value="";render()};
document.querySelectorAll(".level").forEach(btn=>btn.onclick=()=>{level.value=btn.dataset.level;document.getElementById("subjects").scrollIntoView({behavior:"smooth"});render()});
document.getElementById("theme").onclick=()=>{document.body.classList.toggle("dark");document.getElementById("theme").textContent=document.body.classList.contains("dark")?"☀":"☾"};
function doSearch(value){search.value=value.trim();render();document.getElementById("subjects").scrollIntoView({behavior:"smooth"})}
document.getElementById("heroSearchButton").onclick=()=>doSearch(heroSearch.value);
heroSearch.addEventListener("keydown",e=>{if(e.key==="Enter")doSearch(heroSearch.value)});
render();

const plannerSubjects=["Mathematics","Science (Biology, Chemistry & Physics)","Geography","History","Computing / Computer Science","Design & Technology / Food Technology","Art & Design","Music","Drama","Physical Education (PE)","French","Mandarin","Swahili","Business Studies / Economics"];
const subjectCount=document.getElementById("subjectCount"),subjectPicker=document.getElementById("subjectPicker"),makeTimetable=document.getElementById("makeTimetable"),timetable=document.getElementById("timetable"),plannerMessage=document.getElementById("plannerMessage"),sessionsPerDay=document.getElementById("sessionsPerDay");
function buildSubjectPicker(){
 const n=Number(subjectCount.value);
 subjectPicker.innerHTML=Array.from({length:n},(_,i)=>`<label class="subject-choice"><span>Subject ${i+1}</span><select class="planner-subject" aria-label="Subject ${i+1}">${plannerSubjects.map(s=>`<option>${s}</option>`).join("")}</select></label>`).join("");
 [...document.querySelectorAll(".planner-subject")].forEach((sel,i)=>{if(i<plannerSubjects.length)sel.value=plannerSubjects[i]});
}
subjectCount.addEventListener("change",buildSubjectPicker);buildSubjectPicker();
function makePlan(){
 const chosen=[...document.querySelectorAll(".planner-subject")].map(x=>x.value),days=[...document.querySelectorAll(".day-picker input:checked")].map(x=>x.value),sessions=Number(sessionsPerDay.value);
 if(!chosen.length||!days.length){plannerMessage.textContent="Choose at least one subject and one study day.";timetable.innerHTML="";return}
 if(new Set(chosen).size!==chosen.length){plannerMessage.textContent="Choose each subject only once so the timetable stays balanced.";timetable.innerHTML="";return}
 const slots=days.length*sessions,rows=[];let cursor=0;
 days.forEach(day=>{const cells=[];for(let i=0;i<sessions;i++){const sub=chosen[cursor%chosen.length],phase=Math.floor(cursor/chosen.length)%3,task=["Learn / review","Practise questions","Test yourself"][phase];cells.push(`<div class="study-session"><strong>${task}</strong><span>${sub}</span></div>`);cursor++}rows.push(`<div class="day-row"><div class="day-name">${day}</div><div class="session-list">${cells.join("")}</div></div>`)})
 const repeats=Math.floor(slots/chosen.length),remainder=slots%chosen.length;
 plannerMessage.textContent=`Your ${slots}-session plan covers ${chosen.length} subjects. The rotation moves subjects through Learn → Practise → Test, with ${repeats} full round${repeats===1?"":"s"}${remainder?` plus ${remainder} extra session${remainder===1?"":"s"}`:""}.`;
 timetable.innerHTML=rows.join("");
}
makeTimetable.addEventListener("click",makePlan);
