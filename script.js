let user = "";
let xp = 0;
let level = 1;
let streak = 0;
let lastDay = null;
let dailyDone = false;
let behaviorScore = 0;
let answersCount = 0;
let i = 0;

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

const challenges = {
    easy: ["لا تستخدمي السوشال ميديا 10 دقائق", "حاولي القيام بهواية جديده كرسم مثلا", "اقضي يوم مع العائلة دون استخدام السوشال ميديا"],
    medium: ["لا تستخدمي السوشال ميديا لمدة 30دقيقة اليوم", "ناقشي المعلمه عن موضوع الدرس امام طالبات الصف", "القي فقره ضمن فقرات الاذاعة المدرسيه اليوميه"],
    hard: ["اقضي اليوم دون استخدام برامج التواصل", "اخرجي للمشي ساعه كامله دون الجوال", "اذهبي للتنزه مع احد الصديقات دون استخدام السوشال ميديا"]
};

// ===== START =====
function startApp() {
    let nameInput = document.getElementById("name").value;
    if (!nameInput) return alert("اكتبي الاسم");
    user = nameInput;
    save();
    go("quiz");
    showQ();
}

function showQ() {
    document.getElementById("qText").textContent = questions[i];
    clickSound.play();
}

function answer(val) {
    // حساب النقاط بناءً على القيمة المرسلة من الأزرار (1، 0.5، إلخ)
    if (val >= 0.5) {
        if (i === 0 || i === 2 || i === 4) {
            behaviorScore++;
        } else {
            answersCount++;
        }
    }

    i++;

    if (i < questions.length) {
        showQ(); // عرض السؤال التالي
    } else {
        finishQuiz();
    }
}

function ai() {
    if (behaviorScore >= 3) return "استخدامك عالي جداً للسوشال ميديا، خففيه تدريجياً لراحتك.";
    if (answersCount >= 1) return "استخدامك متوسط، لكن تذكري أن التوازن سيقلل من توترك.";
    return "أنتِ رائعة وتوازنك ممتاز! حافظي على هذا المستوى.";
}

function finishQuiz() {
    let finalResult = behaviorScore >= 3 ? "تأثير مرتفع" : "تأثير منخفض";
    document.getElementById("resultText").textContent = finalResult;
    document.getElementById("aiTip").textContent = ai();
    go("result");
}

function chooseLevel(levelType) {
    let list = challenges[levelType];
    let task = list[Math.floor(Math.random() * list.length)];
    
    localStorage.setItem("selectedLevel", levelType);
    document.getElementById("missionText").textContent = task;
    document.getElementById("aiText").textContent = getAiTip(levelType);
    
    go("challenge");
}

function getAiTip(levelType) {
    if (levelType === "easy") return "يوم هادي ممتاز 👍";
    if (levelType === "medium") return "توازن جميل 🔥";
    if (levelType === "hard") return "أداء قوي جدًا 🏆";
    return "";
}

function completeTask() {
    xp += 20;
    save();
    updateDashboard();
    
    if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
    
    successSound.play();
    alert("🔥 عزيمتك رائعه +20 XP");
    
    setTimeout(() => { go('dashboard'); }, 2000);
}

// ===== UTILS =====
function go(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function updateDashboard() {
    document.getElementById("xpText").textContent = xp;
    document.getElementById("levelText").textContent = level;
    document.getElementById("streakText").textContent = streak;
}

function save() {
    localStorage.setItem("user", user);
    localStorage.setItem("xp", xp);
}

window.onload = function() {
    xp = Number(localStorage.getItem("xp")) || 0;
    user = localStorage.getItem("user") || "";
    if(user) document.getElementById("name").value = user;
    updateDashboard();
};