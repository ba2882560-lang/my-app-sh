// =====================
// GROWTH SYSTEM 🌱
// =====================

let selectedTime = Number(localStorage.getItem("selectedTime")) || 1;
let seconds = Number(localStorage.getItem("seconds")) || selectedTime * 60;
let interval = null;
let progress = Number(localStorage.getItem("progress")) || 0;
let isRunning = false;

// اختيار الوقت
function setTime(t){
  selectedTime = t;
  seconds = t * 60;

  localStorage.setItem("selectedTime", selectedTime);
  localStorage.setItem("seconds", seconds);

  document.getElementById("selected").textContent = "مدة: " + t + " دقيقة";
  document.getElementById("timer").textContent = formatTime(seconds);
  updateTree();
}

// بدء التايمر
function startTimer(){

  if(isRunning) return;
  isRunning = true;

  interval = setInterval(() => {

    seconds--;

    localStorage.setItem("seconds", seconds);

    document.getElementById("timer").textContent = formatTime(seconds);

    // نسبة التقدم
    let total = selectedTime * 60;
    progress = total - seconds;

    localStorage.setItem("progress", progress);

    updateTree();

    if(seconds <= 0){
      finishTimer();
    }

  }, 1000);
}

// إنهاء
function finishTimer(){
  clearInterval(interval);
  isRunning = false;

  progress = selectedTime * 60;
  localStorage.setItem("progress", progress);

  updateTree();

  alert("🔥 أنجزتي الجلسة!");
}

// تحويل الوقت
function formatTime(sec){
  let m = Math.floor(sec / 60);
  let s = sec % 60;

  return String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
}

// نمو الشجرة
function updateTree(){

  let tree = document.getElementById("tree");
  if(!tree) return;

  let total = selectedTime * 60;

  let ratio = progress / total;

  if(ratio <= 0.2){
    tree.textContent = "🌱";
  }
  else if(ratio <= 0.5){
    tree.textContent = "🌿";
  }
  else if(ratio < 1){
    tree.textContent = "🌳";
  }
  else{
    tree.textContent = "🌳✨";
  }
}

// استرجاع الحالة بعد فتح الصفحة
window.addEventListener("load", () => {

  if(localStorage.getItem("selectedTime")){
    selectedTime = Number(localStorage.getItem("selectedTime"));
  }

  if(localStorage.getItem("seconds")){
    seconds = Number(localStorage.getItem("seconds"));
  }

  if(localStorage.getItem("progress")){
    progress = Number(localStorage.getItem("progress"));
  }

  document.getElementById("selected").textContent = "مدة: " + selectedTime + " دقيقة";
  document.getElementById("timer").textContent = formatTime(seconds);

  updateTree();
});

// =====================
// STREAK SYSTEM 🔥
// =====================

let questions = [
  "أستخدم السوشال ميديا كثير",
  "أتوتر بدون جوالي",
  "أقارن نفسي بالآخرين"
];

let index = 0;
let score = 0;

let streak = Number(localStorage.getItem("streak")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;

let currentLevel = "";

// =====================
// QUIZ
// =====================

function startQuiz(){
  index = 0;
  score = 0;
  showQuestion();
  go("quiz");
}

function showQuestion(){
  document.getElementById("qText").textContent = questions[index];
}

function answer(val){
  score += val;
  index++;

  if(index < questions.length){
    showQuestion();
  } else {
    finishQuiz();
  }
}

// =====================
// RESULT + CLASSIFICATION
// =====================

function finishQuiz(){

  let resultText = "";
  let level = "";

  if(score <= 0){
    resultText = "🟢 تأثير منخفض";
    level = "low";
  }
  else if(score <= 2){
    resultText = "🟠 تأثير متوسط";
    level = "medium";
  }
  else{
    resultText = "🔴 تأثير عالي";
    level = "high";
  }

  currentLevel = level;

  document.getElementById("resultText").textContent = resultText;
  document.getElementById("aiTip").textContent = "تم تحليل سلوكك";

  go("result");
}

// =====================
// CHALLENGES BY LEVEL
// =====================

const challenges = {
  low: [
    "اقرئي 10 دقائق بدون جوال",
    "اكتبي هدفك لليوم"
  ],
  medium: [
    "ابتعدي عن السوشال 30 دقيقة",
    "امشي بدون جوال"
  ],
  high: [
    "يوم كامل بدون سوشال",
    "جلسة هدوء بدون هاتف 1 ساعة"
  ]
};

// =====================
// MOVE TO CHALLENGES
// =====================

function loadChallenge(){

  let list = challenges[currentLevel];
  let task = list[Math.floor(Math.random() * list.length)];

  document.getElementById("missionText").textContent = task;
}

// =====================
// COMPLETE CHALLENGE
// =====================

function completeChallenge(){

  xp += 20;
  streak += 1;

  localStorage.setItem("xp", xp);
  localStorage.setItem("streak", streak);

  alert("🔥 +20 XP | ستريك زاد");

  go("home");
}

// =====================
// NAV HELP
// =====================

function go(page){
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));

  document.getElementById(page).classList.add("active");

  if(page === "challenges"){
    loadChallenge();
  }
    }

    // =====================
// RESET / RELAX SYSTEM 🌙
// =====================

// أصوات
const rainSound = new Audio("https://actions.google.com/sounds/v1/weather/rain.ogg");
const cafeSound = new Audio("https://actions.google.com/sounds/v1/ambiences/crowd_bar.ogg");

rainSound.loop = true;
cafeSound.loop = true;

let currentSound = null;

// =====================
// SOUNDS
// =====================

function stopAllSounds(){
  rainSound.pause();
  cafeSound.pause();

  rainSound.currentTime = 0;
  cafeSound.currentTime = 0;
}

function playRain(){
  stopAllSounds();
  rainSound.play();
  currentSound = "rain";
}

function playCafe(){
  stopAllSounds();
  cafeSound.play();
  currentSound = "cafe";
}

// =====================
// BREATHING MODE
// =====================

function breathing(){

  let msg = document.createElement("div");

  msg.style.position = "fixed";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%)";
  msg.style.padding = "20px";
  msg.style.background = "rgba(0,0,0,0.6)";
  msg.style.color = "white";
  msg.style.borderRadius = "20px";
  msg.style.textAlign = "center";
  msg.style.zIndex = "9999";

  document.body.appendChild(msg);

  let steps = [
    "شهيق…",
    "حبس النفس…",
    "زفير…",
    "كرري"
  ];

  let i = 0;

  let interval = setInterval(() => {

    msg.textContent = steps[i];

    i++;

    if(i >= steps.length){
      i = 0;
    }

  }, 2000);

  // يوقف بعد 20 ثانية
  setTimeout(() => {
    clearInterval(interval);
    msg.remove();
  }, 20000);
}