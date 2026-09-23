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


/* =========================
   HELPMESTUDY STUDY TOOLS
   ========================= */
(function(){
  const STORAGE_KEY="helpmeStudyToolsV1";
  const defaultState={
    timerMinutes:25,
    timerRemaining:1500,
    timerRunning:false,
    streak:0,
    lastStudyDate:"",
    studyDates:[],
    candidateOn:false,
    candidateYear:"11",
    candidateDate:"",
    candidateStartDate:""
  };

  let state={...defaultState};
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
    state={...state,...saved};
  }catch(e){}

  const $=id=>document.getElementById(id);
  const timerDisplay=$("timerDisplay");
  const plantVisual=$("plantVisual");
  const timerMessage=$("timerMessage");
  const timerStatus=$("timerStatus");
  const streakCount=$("streakCount");
  const streakMessage=$("streakMessage");
  let timerInterval=null;

  function save(){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }

  function dateKey(d=new Date()){
    const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  }

  function addDays(dateKeyValue,amount){
    const d=new Date(dateKeyValue+"T12:00:00");
    d.setDate(d.getDate()+amount);
    return dateKey(d);
  }

  function refreshStreak(){
    const today=dateKey();
    const yesterday=addDays(today,-1);
    if(state.lastStudyDate && state.lastStudyDate!==today && state.lastStudyDate!==yesterday){
      state.streak=0;
      state.lastStudyDate="";
    }
    state.studyDates=[...new Set((state.studyDates||[]))].slice(-120);
    save();

    streakCount.textContent=state.streak;
    if(state.streak===0) streakMessage.textContent="Complete a focus session to start your streak.";
    else if(state.lastStudyDate===today) streakMessage.textContent="You showed up today. Keep the chain alive. 🔥";
    else streakMessage.textContent="You're one session away from keeping it going today.";

    renderWeek();
  }

  function recordStudySession(){
    const today=dateKey();
    const yesterday=addDays(today,-1);

    if(state.lastStudyDate!==today){
      state.streak=state.lastStudyDate===yesterday ? state.streak+1 : 1;
      state.lastStudyDate=today;
    }
    state.studyDates=[...(state.studyDates||[]),today];
    save();
    refreshStreak();
  }

  function renderWeek(){
    const wrap=$("streakWeek");
    if(!wrap)return;
    const labels=["M","T","W","T","F","S","S"];
    const today=new Date();
    const day=today.getDay()||7;
    const monday=new Date(today);
    monday.setDate(today.getDate()-day+1);

    wrap.innerHTML=Array.from({length:7},(_,i)=>{
      const d=new Date(monday);
      d.setDate(monday.getDate()+i);
      const key=dateKey(d);
      const done=(state.studyDates||[]).includes(key);
      const isToday=key===dateKey();
      return `<div class="streak-day ${done?"done":""} ${isToday?"today":""}">
        <span>${labels[i]}</span><div class="streak-dot">${done?"✓":""}</div>
      </div>`;
    }).join("");
  }

  function setPlantStage(){
    const total=Math.max(1,state.timerMinutes*60);
    const progress=1-(state.timerRemaining/total);
    let stage=0;
    if(progress>=1)stage=4;
    else if(progress>=.75)stage=3;
    else if(progress>=.5)stage=2;
    else if(progress>=.25)stage=1;

    plantVisual.className=`plant-visual stage-${stage}`;
    const plants=["🌱","🌿","🪴","🌳","🌳✨"];
    plantVisual.textContent=plants[stage];
  }

  function renderTimer(){
    const mins=Math.floor(state.timerRemaining/60);
    const secs=state.timerRemaining%60;
    timerDisplay.textContent=`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    setPlantStage();

    if(state.timerRunning){
      timerStatus.textContent="Growing";
      timerMessage.textContent="Stay with it. Your plant is growing with you. 🌿";
    }else if(state.timerRemaining===state.timerMinutes*60){
      timerStatus.textContent="Ready";
      timerMessage.textContent="Set a session and let your little plant grow with you.";
    }
  }

  function stopInterval(){
    if(timerInterval){
      clearInterval(timerInterval);
      timerInterval=null;
    }
  }

  function startTimer(){
    if(state.timerRemaining<=0) return;
    state.timerRunning=true;
    save();
    renderTimer();
    stopInterval();

    timerInterval=setInterval(()=>{
      state.timerRemaining-=1;
      if(state.timerRemaining<=0){
        state.timerRemaining=0;
        state.timerRunning=false;
        stopInterval();
        save();
        setPlantStage();
        timerDisplay.textContent="00:00";
        timerStatus.textContent="Grown! 🌳";
        timerMessage.textContent="You finished your session. Your plant grew up! 🌳✨";
        recordStudySession();
        return;
      }
      if(state.timerRemaining%5===0)save();
      renderTimer();
    },1000);
  }

  function resetTimer(){
    stopInterval();
    state.timerRunning=false;
    state.timerRemaining=state.timerMinutes*60;
    save();
    renderTimer();
  }

  function chooseMinutes(minutes){
    stopInterval();
    state.timerMinutes=minutes;
    state.timerRemaining=minutes*60;
    state.timerRunning=false;
    document.querySelectorAll(".timer-preset").forEach(b=>b.classList.toggle("active",Number(b.dataset.minutes)===minutes));
    save();
    renderTimer();
  }

  document.querySelectorAll(".timer-preset").forEach(btn=>{
    btn.addEventListener("click",()=>chooseMinutes(Number(btn.dataset.minutes)));
  });

  $("setCustomTimer").addEventListener("click",()=>{
    const n=Math.round(Number($("customMinutes").value));
    if(n>=1&&n<=180)chooseMinutes(n);
    else timerMessage.textContent="Choose a custom time from 1 to 180 minutes.";
  });

  $("startTimer").addEventListener("click",()=>{
    if(state.timerRunning){
      stopInterval();
      state.timerRunning=false;
      save();
      renderTimer();
      $("startTimer").textContent="Continue growing 🌱";
    }else{
      startTimer();
      $("startTimer").textContent="Pause";
    }
  });

  $("resetTimer").addEventListener("click",()=>{
    resetTimer();
    $("startTimer").textContent="Start growing 🌱";
  });

  $("resetStreak").addEventListener("click",()=>{
    if(confirm("Reset your HelpMeStudy streak?")){
      state.streak=0;
      state.lastStudyDate="";
      state.studyDates=[];
      save();
      refreshStreak();
    }
  });

  function makeCookedRecommendation(){
    const year=$("cookedYear").value;
    const subject=$("cookedSubject").value;
    const level=Number($("cookedLevel").value);
    const box=$("studyRecommendation");

    const plans={
      1:{
        title:"You're chilling 😎",
        text:`Keep your ${subject} skills warm without overloading yourself.`,
        tasks:["20 min: review one topic","10 min: do 5 practice questions","5 min: write down anything you still want to revisit."]
      },
      2:{
        title:"A little cooked 🙂",
        text:`Let's target ${subject} without turning the evening into a six-hour study marathon.`,
        tasks:["25 min: review your weakest topic","15 min: practise questions","5 min: check mistakes and make a tiny to-do list."]
      },
      3:{
        title:"Pretty cooked 🫠",
        text:`For Year ${year} ${subject}, focus on the gaps first. Don't try to relearn the entire universe tonight.`,
        tasks:["25 min: weakest topic only","20 min: exam-style questions","10 min: mark, correct and explain your mistakes."]
      },
      4:{
        title:"Absolutely cooked 🔥",
        text:`Emergency mode: pick one high-priority ${subject} topic and make real progress on it.`,
        tasks:["10 min: identify what you don't know","30 min: learn/revise one topic","20 min: questions + corrections."]
      },
      5:{
        title:"Exam emergency 🚨",
        text:`No panic. We are shrinking the problem. One topic, one session, one next step.`,
        tasks:["5 min: choose the most urgent topic","25 min: focused revision","20 min: exam questions","5 min: write the three mistakes you must fix next."]
      }
    };
    const plan=plans[level];
    box.innerHTML=`<strong>${plan.title}</strong><p>${plan.text}</p><ul>${plan.tasks.map(t=>`<li>${t}</li>`).join("")}</ul>`;
  }
  $("makeRecommendation").addEventListener("click",makeCookedRecommendation);

  function updateCandidate(){
    const date=$("candidateDate").value;
    const days=$("candidateDays");
    const percent=$("candidatePercent");
    const progress=$("candidateProgress");
    const message=$("candidateMessage");

    if(!date){
      days.textContent="--";
      percent.textContent="0%";
      progress.style.width="0%";
      message.textContent="Pick a date to start your countdown.";
      return;
    }

    const target=new Date(date+"T23:59:59");
    const now=new Date();
    const diff=target-now;
    const remaining=Math.max(0,Math.ceil(diff/86400000));

    if(!state.candidateStartDate){
      state.candidateStartDate=dateKey();
      save();
    }

    const start=new Date(state.candidateStartDate+"T12:00:00");
    const total=Math.max(1,target-start);
    const elapsed=Math.min(total,Math.max(0,now-start));
    const pct=Math.min(100,Math.max(0,(elapsed/total)*100));

    days.textContent=remaining;
    percent.textContent=`${Math.round(pct)}%`;
    progress.style.width=`${pct}%`;
    message.textContent=remaining===0
      ?"Today is the date you set. You've got this. Take things one task at a time."
      :`Year ${$("candidateYear").value} Candidate Mode is ${state.candidateOn?"ON":"saved but OFF"}. Keep your next study session small and specific.`;
  }

  function applyCandidateMode(){
    document.body.classList.toggle("candidate-mode",!!state.candidateOn);
    const toggle=$("candidateToggle");
    if(toggle){
      toggle.classList.toggle("on",!!state.candidateOn);
      toggle.textContent=state.candidateOn?"On":"Off";
      toggle.setAttribute("aria-pressed",String(!!state.candidateOn));
    }
  }

  $("candidateToggle").addEventListener("click",()=>{
    state.candidateOn=!state.candidateOn;
    save();
    applyCandidateMode();
    updateCandidate();
  });

  $("saveCandidate").addEventListener("click",()=>{
    const date=$("candidateDate").value;
    if(!date){
      $("candidateMessage").textContent="Choose an exam or assessment date first.";
      return;
    }
    state.candidateYear=$("candidateYear").value;
    state.candidateDate=date;
    state.candidateStartDate=dateKey();
    state.candidateOn=true;
    save();
    applyCandidateMode();
    $("candidateToggle").classList.add("on");
    $("candidateToggle").textContent="On";
    $("candidateToggle").setAttribute("aria-pressed","true");
    updateCandidate();
    $("candidateMessage").textContent=`Candidate Mode saved for Year ${state.candidateYear}. Your countdown is live on this device. 🎓`;
  });

  $("candidateYear").value=state.candidateYear;
  $("candidateDate").value=state.candidateDate;
  applyCandidateMode();

  refreshStreak();
  renderTimer();
  updateCandidate();

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"){
      refreshStreak();
      updateCandidate();
    }
  });
})();
