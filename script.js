let user = "";

let xp = 0;
let level = 1;
let streak = 0;

let lastDay = null;
let dailyDone = false;

let behaviorScore = 0;
let answersCount = 0;

// ===== SOUNDS =====
const clickSound = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
const successSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");

// ===== QUESTIONS =====
const questions = [
"أستخدم السوشال ميديا كثير يوميًا",
"أتوتر من التفاعل الواقعي مع الاخرين",
"أفضل التواصل في السوشال على الواقع",
"أشعر بالخوف اثناء جوابي في الحصه",
"أفضل قضاء نهاية الاسبوع في المنزل واستخدام السوشال ميديا طوال اليوم",
];

let i = 0;
let score = 0;

// ===== START =====
function startApp(){
let name = document.getElementById("name").value;
if(!name) return alert("اكتبي الاسم");

user = name;
save();

go("quiz");
showQ();
initDaily();
updateDashboard();
}

// ===== QUIZ =====
function showQ(){
document.getElementById("qText").textContent = questions[i];
clickSound.play();
}

function answer(val){

score += val;
answersCount++;

if(val < 0) behaviorScore++;

i++;

clickSound.play();

if(i < questions.length){
showQ();
}else{
finishQuiz();
}
}

// ===== AI =====
function ai(){

if(behaviorScore >= 3){
return "⚠️ استخدامك عالي جدًا للسوشال، خففيه تدريجيًا.";
}

if(answersCount >= 3){
return "📊 استخدامك متوسط، هذا جيد لكن  تحتاجين توازن أكثر.";
}

return "✅  انت رائعه و توازنك ممتاز حافظي عليه بالتحديات اليوميه ";
}

// ===== QUIZ RESULT =====
function finishQuiz(){

let result = score > 1 ? "تأثير مرتفع" : "تأثير منخفض";

document.getElementById("resultText").textContent = result;
document.getElementById("aiTip").textContent = ai();

go("result");
save();
}

// ===== DAILY MISSION =====
function initDaily(){

let today = new Date().toDateString();

if(lastDay !== today){
dailyDone = false;

let missions = [
"لا تستخدمي الشوثال ميديا اليوم لدة  30 دقيقة",
"قومي بـقراءة ثلاثة صفحات من كتابك المفضل  ",
"قومي برياضةالمشي يوميا لمدة 5 دقائق"
];

document.getElementById("missionText").textContent =
"🎯 " + missions[Math.floor(Math.random()*missions.length)];

lastDay = today;
save();
}
}

function completeMission(){

if(dailyDone) return;

xp += 30;
streak++;

dailyDone = true;

successSound.play();
animateXP();
updateDashboard();
save();

notify("🎉 أنجزت المهمة!");
}

// ===== XP ANIMATION =====
function animateXP(){

let bar = document.getElementById("barFill");

bar.style.transition = "0.7s cubic-bezier(.2,.8,.2,1)";
bar.style.width = (xp % 100) + "%";
bar.style.transform = "scaleX(1.05)";

setTimeout(()=>bar.style.transform="scaleX(1)",300);
}

// ===== LEVEL SYSTEM =====
function checkLevel(){

if(xp >= 100){
level++;
xp = 0;
notify("🔥 Level Up!");
}
}

// ===== DASHBOARD LIVE =====
function updateDashboard(){

document.getElementById("xpText").textContent = xp;
document.getElementById("levelText").textContent = level;
document.getElementById("streakText").textContent = streak;

}
// ===== SAVE SYSTEM =====
function save(){

localStorage.setItem("user", user);
localStorage.setItem("xp", xp);
localStorage.setItem("level", level);
localStorage.setItem("streak", streak);
localStorage.setItem("lastDay", lastDay);
localStorage.setItem("dailyDone", dailyDone);
}

// ===== LOAD =====
window.onload = function(){

user = localStorage.getItem("user") || "";
xp = Number(localStorage.getItem("xp")) || 0;
level = Number(localStorage.getItem("level")) || 1;
streak = Number(localStorage.getItem("streak")) || 0;

lastDay = localStorage.getItem("lastDay");
dailyDone = localStorage.getItem("dailyDone") === "true";

updateDashboard();
initDaily();

if(user){
document.getElementById("name").value = user;
}
};

// ===== NAV =====
function go(id){

document.querySelectorAll(".screen").forEach(s=>{
s.classList.remove("active");
});

let page = document.getElementById(id);

if(!page){
console.log("Screen not found:", id);
return;
}

page.classList.add("active");
}

// ===== NOTIFY =====
function notify(msg){

let n = document.createElement("div");
n.textContent = msg;

n.style.position = "fixed";
n.style.bottom = "80px";
n.style.left = "50%";
n.style.transform = "translateX(-50%)";
n.style.background = "rgba(34,197,94,0.9)";
n.style.padding = "12px 18px";
n.style.borderRadius = "14px";
n.style.color = "#fff";
n.style.backdropFilter = "blur(10px)";
n.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";

document.body.appendChild(n);

setTimeout(()=>n.remove(),2000);
}

function getToday(){
return new Date().toDateString();
}

let selectedDay = localStorage.getItem("selectedDay");
let selectedLevel = localStorage.getItem("selectedLevel");

function chooseLevel(level){

let today = getToday();

if(selectedDay === today){
alert(" اختيارك رائع اليوم  ");
return;
}

localStorage.setItem("selectedDay", today);
localStorage.setItem("selectedLevel", level);

// 👇 هنا أهم شيء
startDailyChallenge(level);

go('challenge'); // 🔥 
}

const challenges = {
easy: [
"لا تستخدمي السوشال ميديا 10 دقائق",
"حاولي القيام بهواية جديده كرسم مثلا ",
"اقضي يوم مع العائلة دون استخدام السوشال ميديا "
],

medium: [
"  لا تستخدمي السوشال ميديا لمدة 30دقيقة اليوم",
"ناقشي المعلمه عن موضوع الدرس امام طالبات الصف  ",
"القي فقره ضمن فقرات الاذاعة المدرسيه اليوميه "
],

hard: [
" اقضي اليوم دون استخدام احد برامج التواصل كالسناب شات او الانستقرام او التيك توك   ",
"اخرجي للمشي ساعه كامله دون الجوال ",
"اذهبي للتنزه مع احد الصديقات دون استخدام السوشال ميديا "
]
};

function chooseLevel(level){

let list = challenges[level];

// اختيار عشوائي
let task = list[Math.floor(Math.random()*list.length)];

// عرض التحدي
document.getElementById("missionText").textContent = task;

// الانتقال للشاشة
go("challenge");
}
function startDailyChallenge(level){

let list = challenges[level];
let task = list[Math.floor(Math.random()*list.length)];

document.getElementById("taskText").textContent = task;

go("challenge");
}

function completeTask(){

let xp = parseInt(localStorage.getItem("xp") || "0");

xp += 20;

localStorage.setItem("xp", xp);

alert(" 🔥 عزيمتك رائعه +20 XP");

updateDashboard();
}

function aiTip(){

let level = localStorage.getItem("selectedLevel");

if(level === "easy"){
return "يوم ممتاز للبدا بتغيير  👍";
}
if(level === "medium"){
return "توازنك جميل، استمري انت ملهمه🔥";
}
if(level === "hard"){
return "يوم قوي! إنجازك كان مذهل  🏆";
}
}
function aiTip(){

let level = localStorage.getItem("selectedLevel");

if(level === "easy"){
return "يوم هادي ممتاز 👍";
}
if(level === "medium"){
return "توازن جميل 🔥";
}
if(level === "hard"){
return "أداء قوي جدًا 🏆";
}
}
document.getElementById("aiText").textContent = aiTip();
function completeTask(){

// XP
let xp = Number(localStorage.getItem("xp") || 0);
xp += 20;
localStorage.setItem("xp", xp);

// 🎉 احتفال (confetti)
if (typeof confetti === "function") {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 }
  });
}

// صوت (اختياري)
const successSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
successSound.play();

// رسالة سريعة
notify("🎉 أنجزتي التحدي! +20 XP");

// 🔁 رجوع لصفحة اختيار المستوى بعد ثانيتين
setTimeout(()=>{
  go('daily');
}, 2000);

// تحديث الداشبورد (إذا عندك)
updateDashboard && updateDashboard();
}