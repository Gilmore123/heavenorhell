let score = 0;
let questionNum = 1;
let damage = 100;
let currentLevel = "easy";
let currentQuestionIndex = 0;
let hintsUsed = 0;
let timer;
let timeLeft = 30;
let achievements = []; // Array to store achievements
let lowHealthPlaying = false; // Flag to track if the low health sound is already playing
let highScore = document.getElementById("highScoreNum");
let soundSelect = document.getElementsByName("sound")[1];
let streak = 0;

highScore.innerText = Number(
  localStorage.getItem("highScore")
).toLocaleString();

let achievementsdiv = document.getElementById("achievementsSectionItems");
// const questions = {
//     easy: [/* Add easy questions here */],
//     medium: [/* Add medium questions here */],
//     hard: [/* Add hard questions here */]
// };

//Audio
// const win = new Audio("sounds/win.mp3");
const wrong = new Audio("sounds/wrong.mp3");
const correct = new Audio("sounds/correct.mp3");
const levelup1 = new Audio("sounds/levelup.mp3");
const fire = new Audio("sounds/firesound.mp3");
const life = new Audio("sounds/extrahealth.mp3");
const lowhealth = new Audio("sounds/lowhealth.mp3");
const gameComplete = new Audio("sounds/gameCompleteMusic.mp3");
const next_level = new Audio("sounds/next-level-160613.mp3");

// in game music
const music1 = new Audio("sounds/gamemusic1.mp3");
const music2 = new Audio("sounds/gamemusic2.mp3");
const music3 = new Audio("sounds/gamemusic3.mp3");
const music4 = new Audio("sounds/gamemusic4.mp3");
const music5 = new Audio("sounds/gamemusic5.mp3");
const music6 = new Audio("sounds/gamemusic6.mp3");

const inGameMusic = [music1, music2, music3, music4, music5, music6];

// game over music
const gameOverMusic1 = new Audio("sounds/gameOverMusic1.mp3");
const gameOverMusic2 = new Audio("sounds/gameOvermusic2.mp3");
const gameOverMusic3 = new Audio("sounds/gameOverMusic3.mp3");

// low health adlibs
const lowHealthMusicAdlibs1 = new Audio("sounds/can-you-feel-it-82940.mp3");
const lowHealthMusicAdlibs2 = new Audio("sounds/think-about-it-103162.mp3");
const lowHealthMusicAdlibs3 = new Audio("sounds/very-evil-laugh-205258.mp3");
const lowHealthMusicAdlibs4 = new Audio("sounds/soulswallow02-108300.mp3");
const lowHealthMusicAdlibs5 = new Audio("sounds/man-crying-1-184688.mp3");

// Correct answer adlibs
const correctMusicAdlibs1 = new Audio(
  "sounds/positive-tone-man-says-great-209738.mp3"
);
const correctMusicAdlibs2 = new Audio(
  "sounds/positive-tone-man-says-impressive-209742.mp3"
);
const correctMusicAdlibs3 = new Audio(
  "sounds/positive-tone-man-says-magnificent-209732.mp3"
);
const correctMusicAdlibs4 = new Audio(
  "sounds/positive-tone-man-says-outstanding-186557.mp3"
);
const correctMusicAdlibs5 = new Audio(
  "sounds/positive-tone-man-says-superb-209737.mp3"
);
const correctMusicAdlibs6 = new Audio("sounds/man-says-amazing-184036.mp3");
const correctMusicAdlibs7 = new Audio("sounds/man-says-awesome-184037.mp3");
const correctMusicAdlibs8 = new Audio("sounds/man-says-epic-184039.mp3");

// Arrays for adlibs
let lowHealth = [
  lowHealthMusicAdlibs1,
  lowHealthMusicAdlibs2,
  lowHealthMusicAdlibs3,
  lowHealthMusicAdlibs4,
  lowHealthMusicAdlibs5,
];
let goodHealth = [
  correctMusicAdlibs1,
  correctMusicAdlibs2,
  correctMusicAdlibs3,
  correctMusicAdlibs4,
  correctMusicAdlibs5,
  correctMusicAdlibs6,
  correctMusicAdlibs7,
  correctMusicAdlibs8,
];

function gameWrongAdlibs() {
  lowHealth.forEach((item) => {
    if (item.paused !== true) {
      item.pause();
      item.currentTime = 0;
    }
  });

  if (damage > 0 && damage < 51) {
    lowHealth[Math.floor(Math.random() * 6)].play();
  } else return;
}

function gameCorrectAdlibs() {
  goodHealth.forEach((item) => {
    if (item.paused !== true) {
      item.pause();
      item.currentTime = 0;
    }
  });
  if (damage > 50 && damage < 100) {
    goodHealth[Math.floor(Math.random() * 7)].play();
  } else return;
}

// Call checkAchievements after each answer is processed
const questions = {
  easy: [
    {
      question: "What did the wise men follow to find Jesus?",
      answers: [
        { text: "A cloud", correct: false },
        { text: "A star", correct: true },
        { text: "The moon", correct: false },
        { text: "A bird", correct: false },
      ],
      reference: "Matthew 2:2",
    },
    {
      question: "Who was the first king of Israel?",
      answers: [
        { text: "David", correct: false },
        { text: "Solomon", correct: false },
        { text: "Saul", correct: true },
        { text: "Samuel", correct: false },
      ],
      reference: "1 Samuel 10:1",
    },
    {
      question: "What did Jesus feed the 5,000 with?",
      answers: [
        { text: "Bread and fish", correct: true },
        { text: "Bread and wine", correct: false },
        { text: "Fish and grapes", correct: false },
        { text: "Manna", correct: false },
      ],
      reference: "John 6:9-13",
    },

    {
      question: "How many disciples did Jesus have?",
      answers: [
        { text: "10", correct: false },
        { text: "12", correct: true },
        { text: "14", correct: false },
        { text: "15", correct: false },
      ],
      reference: "Luke 6:13",
    },
    {
      question: "Who was the mother of Jesus?",
      answers: [
        { text: "Martha", correct: false },
        { text: "Rachel", correct: false },
        { text: "Ruth", correct: false },
        { text: "Mary", correct: true },
      ],
      reference: "Luke 1:27",
    },
    {
      question: "Who was the first martyr in the Bible?",
      answers: [
        { text: "Stephen", correct: true },
        { text: "Peter", correct: false },
        { text: "Paul", correct: false },
        { text: "John", correct: false },
      ],
      reference: "Acts 7:54-60",
    },
    {
      question: "Which prophet was taken up to heaven in a chariot of fire?",
      answers: [
        { text: "Isaiah", correct: false },
        { text: "Jeremiah", correct: false },
        { text: "Ezekiel", correct: false },
        { text: "Elijah", correct: true },
      ],
      reference: "2 Kings 2:11",
    },
    {
      question: "How many days was Lazarus dead before Jesus raised him?",
      answers: [
        { text: "3", correct: false },
        { text: "4", correct: true },
        { text: "7", correct: false },
        { text: "10", correct: false },
      ],
      reference: "John 11:17",
    },
    {
      question: "Who anointed Jesus' feet with perfume?",
      answers: [
        { text: "Martha", correct: false },
        { text: "Mary Magdalene", correct: true },
        { text: "Elizabeth", correct: false },
        { text: "Ruth", correct: false },
      ],
      reference: "John 12:3",
    },
    {
      question: "In what city was Jesus crucified?",
      answers: [
        { text: "Bethlehem", correct: false },
        { text: "Nazareth", correct: false },
        { text: "Jerusalem", correct: true },
        { text: "Galilee", correct: false },
      ],
      reference: "Matthew 27:33",
    },
    {
      question: "Who was thrown into a fiery furnace but didn’t burn?",
      answers: [
        { text: "Daniel", correct: false },
        { text: "Shadrach, Meshach, and Abednego", correct: true },
        { text: "Moses", correct: false },
        { text: "Joseph", correct: false },
      ],
      reference: "Daniel 3:16-30",
    },

    {
      question: "Who was the father of John the Baptist?",
      answers: [
        { text: "Zacharias", correct: true },
        { text: "Joseph", correct: false },
        { text: "Peter", correct: false },
        { text: "Saul", correct: false },
      ],
      reference: "Luke 1:13",
    },
    {
      question: "Which book in the Bible talks about the fruit of the Spirit?",
      answers: [
        { text: "Philippians", correct: false },
        { text: "Ephesians", correct: false },
        { text: "Galatians", correct: true },
        { text: "James", correct: false },
      ],
      reference: "Galatians 5:22-23",
    },
    {
      question: "What is the last book of the New Testament?",
      answers: [
        { text: "Jude", correct: false },
        { text: "Revelation", correct: true },
        { text: "Acts", correct: false },
        { text: "Hebrews", correct: false },
      ],
      reference: "Revelation 1:1",
    },
    {
      question: "Who was the first apostle to be martyred?",
      answers: [
        { text: "James", correct: true },
        { text: "Peter", correct: false },
        { text: "John", correct: false },
        { text: "Matthew", correct: false },
      ],
      reference: "Acts 12:2",
    },
    {
      question: "What did God create on the first day?",
      answers: [
        { text: "The sky", correct: false },
        { text: "Light", correct: true },
        { text: "Plants", correct: false },
        { text: "Animals", correct: false },
      ],
      reference: "Genesis 1:3-5",
    },
    {
      question: "Mountain where Moses received the Ten Commandments?",
      answers: [
        { text: "Mount Sinai", correct: true },
        { text: "Mount Zion", correct: false },
        { text: "Mount Carmel", correct: false },
        { text: "Mount Ararat", correct: false },
      ],
      reference: "Exodus 19:20",
    },
    {
      question: "What was the occupation of Matthew before following Jesus?",
      answers: [
        { text: "Fisherman", correct: false },
        { text: "Tax collector", correct: true },
        { text: "Carpenter", correct: false },
        { text: "Shepherd", correct: false },
      ],
      reference: "Matthew 9:9",
    },
    {
      question: "What was the name of the first woman in the Bible?",
      answers: [
        { text: "Sarah", correct: false },
        { text: "Ruth", correct: false },
        { text: "Eve", correct: true },
        { text: "Miriam", correct: false },
      ],
      reference: "Genesis 3:20",
    },
    {
      question: "Who interpreted Pharaoh’s dreams?",
      answers: [
        { text: "Joseph", correct: true },
        { text: "Moses", correct: false },
        { text: "Daniel", correct: false },
        { text: "Elijah", correct: false },
      ],
      reference: "Genesis 41:15-16",
    },
    {
      question: "What was the name of the sea that the Israelites crossed?",
      answers: [
        { text: "Dead Sea", correct: false },
        { text: "Red Sea", correct: true },
        { text: "Mediterranean Sea", correct: false },
        { text: "Sea of Galilee", correct: false },
      ],
      reference: "Exodus 14:21",
    },

    {
      question: "What was Paul’s occupation?",
      answers: [
        { text: "Fisherman", correct: false },
        { text: "Tentmaker", correct: true },
        { text: "Shepherd", correct: false },
        { text: "Tax collector", correct: false },
      ],
      reference: "Acts 18:3",
    },
    {
      question: "What did the Israelites eat in the wilderness?",
      answers: [
        { text: "Quail", correct: false },
        { text: "Manna", correct: true },
        { text: "Locusts", correct: false },
        { text: "Bread and fish", correct: false },
      ],
      reference: "Exodus 16:31",
    },
    {
      question: "Which prophet was swallowed by a fish?",
      answers: [
        { text: "Daniel", correct: false },
        { text: "Jonah", correct: true },
        { text: "Elijah", correct: false },
        { text: "Moses", correct: false },
      ],
      reference: "Jonah 1:17",
    },
    {
      question: "How did Judas betray Jesus?",
      answers: [
        { text: "With a kiss", correct: true },
        { text: "With a hug", correct: false },
        { text: "By pointing", correct: false },
        { text: "By shouting", correct: false },
      ],
      reference: "Luke 22:47-48",
    },
    {
      question: "Who was the wisest king of Israel?",
      answers: [
        { text: "Saul", correct: false },
        { text: "Solomon", correct: true },
        { text: "David", correct: false },
        { text: "Josiah", correct: false },
      ],
      reference: "1 Kings 3:12",
    },
    {
      question:
        "Who cut off the ear of the high priest's servant when Jesus was arrested?",
      answers: [
        { text: "John", correct: false },
        { text: "Matthew", correct: false },
        { text: "James", correct: false },
        { text: "Peter", correct: true },
      ],
      reference: "John 18:10",
    },
    {
      question: "What type of bird did Noah send out of the ark first?",
      answers: [
        { text: "Dove", correct: false },
        { text: "Sparrow", correct: false },
        { text: "Eagle", correct: false },
        { text: "Raven", correct: true },
      ],
      reference: "Genesis 8:6-7",
    },
    {
      question: "Which apostle was a tax collector?",
      answers: [
        { text: "John", correct: false },
        { text: "Matthew", correct: true },
        { text: "Peter", correct: false },
        { text: "Andrew", correct: false },
      ],
      reference: "Matthew 9:9",
    },
    {
      question:
        "Which two people in the Bible never died but were taken up to heaven?",
      answers: [
        { text: "Moses and Elijah", correct: false },
        { text: "Elijah and Enoch", correct: true },
        { text: "Isaiah and Jeremiah", correct: false },
        { text: "David and Solomon", correct: false },
      ],
      reference: "Genesis 5:24; 2 Kings 2:11",
    },
    {
      question:
        "What language was most of the Old Testament originally written in?",
      answers: [
        { text: "Greek", correct: false },
        { text: "Aramaic", correct: false },
        { text: "Hebrew", correct: true },
        { text: "Latin", correct: false },
      ],
      reference: "Old Testament Canon",
    },
    {
      question: "Who was swallowed by a great fish?",
      answers: [
        { text: "Jonah", correct: true },
        { text: "Moses", correct: false },
        { text: "Noah", correct: false },
        { text: "Elijah", correct: false },
      ],
      reference: "Jonah 1:17",
    },
    {
      question: "Which book comes first in the Bible?",
      answers: [
        { text: "Exodus", correct: false },
        { text: "Genesis", correct: true },
        { text: "Leviticus", correct: false },
        { text: "Deuteronomy", correct: false },
      ],
      reference: "Genesis 1:1",
    },
    {
      question: "Who led the Israelites out of Egypt?",
      answers: [
        { text: "David", correct: false },
        { text: "Abraham", correct: false },
        { text: "Moses", correct: true },
        { text: "Solomon", correct: false },
      ],
      reference: "Exodus 12:51",
    },
    {
      question: "What was the first miracle Jesus performed?",
      answers: [
        { text: "Healing a blind man", correct: false },
        { text: "Turning water into wine", correct: true },
        { text: "Walking on water", correct: false },
        { text: "Feeding 5,000 people", correct: false },
      ],
      reference: "John 2:1-11",
    },
    {
      question: "Who betrayed Jesus for 30 pieces of silver?",
      answers: [
        { text: "Peter", correct: false },
        { text: "Judas Iscariot", correct: true },
        { text: "John", correct: false },
        { text: "Thomas", correct: false },
      ],
      reference: "Matthew 26:14-15",
    },
    {
      question: "Who built the Ark?",
      answers: [
        { text: "Abraham", correct: false },

        { text: "Moses", correct: false },
        { text: "David", correct: false },
        { text: "Noah", correct: true },
      ],
      reference: "Genesis 6:14",
    },
    {
      question: "Which book in the Bible has the most chapters?",
      answers: [
        { text: "Isaiah", correct: false },
        { text: "Genesis", correct: false },
        { text: "Psalms", correct: true },
        { text: "Jeremiah", correct: false },
      ],
      reference: "Psalms 1-150",
    },
    {
      question: "Who was the first man created by God?",
      answers: [
        { text: "Abraham", correct: false },
        { text: "Moses", correct: false },
        { text: "Noah", correct: false },
        { text: "Adam", correct: true },
      ],
      reference: "Genesis 2:7",
    },
    {
      question: "What did God use to create Eve?",
      answers: [
        { text: "A rib from Adam", correct: true },
        { text: "Dust from the ground", correct: false },
        { text: "Water", correct: false },
        { text: "A tree", correct: false },
      ],
      reference: "Genesis 2:21-22",
    },
    {
      question: "Who was thrown into the lion’s den?",
      answers: [
        { text: "David", correct: false },
        { text: "Daniel", correct: true },
        { text: "Elijah", correct: false },
        { text: "Joshua", correct: false },
      ],
      reference: "Daniel 6:16",
    },
    {
      question: "Which disciple walked on water with Jesus?",
      answers: [
        { text: "Andrew", correct: false },
        { text: "John", correct: false },
        { text: "Peter", correct: true },
        { text: "James", correct: false },
      ],
      reference: "Matthew 14:29",
    },
    {
      question: "Who was the strongest man in the Bible?",
      answers: [
        { text: "David", correct: false },
        { text: "Samson", correct: true },
        { text: "Solomon", correct: false },
        { text: "Saul", correct: false },
      ],
      reference: "Judges 16:30",
    },
    {
      question: "What did Moses part to let the Israelites escape Egypt?",
      answers: [
        { text: "The Jordan River", correct: false },
        { text: "The Red Sea", correct: true },
        { text: "The Mediterranean Sea", correct: false },
        { text: "The Dead Sea", correct: false },
      ],
      reference: "Exodus 14:21",
    },
    {
      question: "Who is considered the father of the Israelites?",
      answers: [
        { text: "Jacob", correct: false },
        { text: "Isaac", correct: false },
        { text: "Abraham", correct: true },
        { text: "Joseph", correct: false },
      ],
      reference: "Genesis 17:5",
    },
    {
      question: "What was the name of the garden where Adam and Eve lived?",
      answers: [
        { text: "Garden of Eden", correct: true },
        { text: "Garden of Gethsemane", correct: false },
        { text: "Garden of Sodom", correct: false },
        { text: "Garden of Nazareth", correct: false },
      ],
      reference: "Genesis 2:8",
    },
    {
      question: "What is the shortest verse in the Bible?",
      answers: [
        { text: "Jesus wept", correct: true },
        { text: "God is love", correct: false },
        { text: "Be joyful", correct: false },
        { text: "He is risen", correct: false },
      ],
      reference: "John 11:35",
    },
    {
      question: "Who led the Israelites into the Promised Land?",
      answers: [
        { text: "Moses", correct: false },
        { text: "Joshua", correct: true },
        { text: "Aaron", correct: false },
        { text: "Caleb", correct: false },
      ],
      reference: "Joshua 1:2",
    },

    {
      question: "Who wrote most of the Psalms?",
      answers: [
        { text: "Moses", correct: false },
        { text: "Solomon", correct: false },
        { text: "Elijah", correct: false },
        { text: "David", correct: true },
      ],
      reference: "Psalms 1-150",
    },

    {
      question: "Who were the parents of Cain and Abel?",
      answers: [
        { text: "Abraham and Sarah", correct: false },
        { text: "Adam and Eve", correct: true },
        { text: "Isaac and Rebekah", correct: false },
        { text: "Jacob and Rachel", correct: false },
      ],
      reference: "Genesis 4:1",
    },

    {
      question: "Who was the first king of Israel?",
      answers: [
        { text: "David", correct: false },
        { text: "Solomon", correct: false },
        { text: "Samuel", correct: false },
        { text: "Saul", correct: true },
      ],
      reference: "1 Samuel 10:1",
    },

    {
      question: "How many days did God take to create the world?",
      answers: [
        { text: "5", correct: false },
        { text: "6", correct: true },
        { text: "7", correct: false },
        { text: "8", correct: false },
      ],
      reference: "Genesis 1:31",
    },
    {
      question:
        "Which king had a dream about a statue made of different metals?",
      answers: [
        { text: "David", correct: false },
        { text: "Solomon", correct: false },
        { text: "Nebuchadnezzar", correct: true },
        { text: "Saul", correct: false },
      ],
      reference: "Daniel 2:31-32",
    },

    {
      question: "What is the last word in the bible?",
      answers: [
        { text: "Moses", correct: false },
        { text: "Amen", correct: true },
        { text: "end", correct: false },
        { text: "bye-bye", correct: false },
      ],
      reference: "Revelation 22:21",
    },
    {
      question: "What did Jacob give Joseph that made his brothers jealous?",
      answers: [
        { text: "A crown", correct: false },
        { text: "A coat of many colors", correct: true },
        { text: "Gold", correct: false },
        { text: "A sword", correct: false },
      ],
      reference: "Genesis 37:3",
    },

    {
      question: "Where was Jesus born?",
      answers: [
        { text: "Nazareth", correct: false },
        { text: "Bethlehem", correct: true },
        { text: "Jerusalem", correct: false },
        { text: "Galilee", correct: false },
      ],
      reference: "Matthew 2:1",
    },
    {
      question: "How many brothers did Joseph have?",
      answers: [
        { text: "10", correct: false },
        { text: "11", correct: true },
        { text: "12", correct: false },
        { text: "9", correct: false },
      ],
      reference: "Genesis 35:23-26",
    },
    {
      question: "Which book in the Bible is known for its love poems?",
      answers: [
        { text: "Proverbs", correct: false },
        { text: "Ecclesiastes", correct: false },
        { text: "Song of Solomon", correct: true },
        { text: "Psalms", correct: false },
      ],
      reference: "Song of Solomon",
    },
    {
      question: "What did Jesus ride into Jerusalem on?",
      answers: [
        { text: "A horse", correct: false },
        { text: "A donkey", correct: true },
        { text: "A camel", correct: false },
        { text: "An ox", correct: false },
      ],
      reference: "Matthew 21:7",
    },
    {
      question: "Who is the ‘Prince of Peace’?",
      answers: [
        { text: "David", correct: false },
        { text: "Solomon", correct: false },
        { text: "Jesus", correct: true },
        { text: "Moses", correct: false },
      ],
      reference: "Isaiah 9:6",
    },
    {
      question: "What city was Saul traveling to when he encountered Jesus?",
      answers: [
        { text: "Jerusalem", correct: false },
        { text: "Damascus", correct: true },
        { text: "Nazareth", correct: false },
        { text: "Antioch", correct: false },
      ],
      reference: "Acts 9:3-6",
    },
    {
      question: "What instrument did David play?",
      answers: [
        { text: "Flute", correct: false },
        { text: "Harp", correct: true },
        { text: "Drums", correct: false },
        { text: "Trumpet", correct: false },
      ],
      reference: "1 Samuel 16:23",
    },
    {
      question: "Who killed Goliath?",
      answers: [
        { text: "Saul", correct: false },
        { text: "David", correct: true },
        { text: "Samson", correct: false },
        { text: "Solomon", correct: false },
      ],
      reference: "1 Samuel 17:50",
    },

    {
      question: "What was the name of Abraham’s first son?",
      answers: [
        { text: "Isaac", correct: false },
        { text: "Ishmael", correct: true },
        { text: "Jacob", correct: false },
        { text: "Esau", correct: false },
      ],
      reference: "Genesis 16:15",
    },
  ],
  medium: [
    {
      question: "Who was the mother of Samuel, the prophet?",
      answers: [
        { text: "Hannah", correct: true },
        { text: "Sarah", correct: false },
        { text: "Rebecca", correct: false },
        { text: "Rachel", correct: false },
      ],
      reference: "1 Samuel 1:20",
    },
    {
      question: "Who interpreted Nebuchadnezzar’s dream about the statue?",
      answers: [
        { text: "Daniel", correct: true },
        { text: "Joseph", correct: false },
        { text: "Elijah", correct: false },
        { text: "Isaiah", correct: false },
      ],
      reference: "Daniel 2:26-28",
    },
    {
      question: "How many plagues did God send on Egypt?",
      answers: [
        { text: "5", correct: false },
        { text: "7", correct: false },
        { text: "10", correct: true },
        { text: "12", correct: false },
      ],
      reference: "Exodus 7-12",
    },
    {
      question: "Who was the first person to see Jesus after His resurrection?",
      answers: [
        { text: "Mary Magdalene", correct: true },
        { text: "Peter", correct: false },
        { text: "John", correct: false },
        { text: "Thomas", correct: false },
      ],
      reference: "John 20:14-16",
    },
    {
      question:
        "What city did Jonah try to flee to instead of going to Nineveh?",
      answers: [
        { text: "Tarshish", correct: true },
        { text: "Joppa", correct: false },
        { text: "Damascus", correct: false },
        { text: "Jericho", correct: false },
      ],
      reference: "Jonah 1:3",
    },
    {
      question:
        "In the Sermon on the Mount, what does Jesus say the pure in heart will do?",
      answers: [
        { text: "Inherit the earth", correct: false },
        { text: "See God", correct: true },
        { text: "Be called sons of God", correct: false },
        { text: "Be comforted", correct: false },
      ],
      reference: "Matthew 5:8",
    },
    {
      question:
        "Which prophet confronted King David about his sin with Bathsheba?",
      answers: [
        { text: "Nathan", correct: true },
        { text: "Samuel", correct: false },
        { text: "Elijah", correct: false },
        { text: "Isaiah", correct: false },
      ],
      reference: "2 Samuel 12:1-7",
    },
    {
      question:
        "Who was the Roman governor who sentenced Jesus to be crucified?",
      answers: [
        { text: "Pontius Pilate", correct: true },
        { text: "Herod", correct: false },
        { text: "Caesar", correct: false },
        { text: "Felix", correct: false },
      ],
      reference: "Matthew 27:24-26",
    },
    {
      question: "How long did it rain during the flood in Noah’s time?",
      answers: [
        { text: "30 days and 30 nights", correct: false },
        { text: "40 days and 40 nights", correct: true },
        { text: "50 days and 50 nights", correct: false },
        { text: "60 days and 60 nights", correct: false },
      ],
      reference: "Genesis 7:12",
    },
    {
      question: "Who built the first temple in Jerusalem?",
      answers: [
        { text: "David", correct: false },
        { text: "Solomon", correct: true },
        { text: "Hezekiah", correct: false },
        { text: "Josiah", correct: false },
      ],
      reference: "1 Kings 6:1",
    },
    {
      question:
        "Who prophesied the coming of the Messiah as a ‘suffering servant’?",
      answers: [
        { text: "Jeremiah", correct: false },
        { text: "Ezekiel", correct: false },
        { text: "Daniel", correct: false },
        { text: "Isaiah", correct: true },
      ],
      reference: "Isaiah 53",
    },
    {
      question: "Which apostle was shipwrecked on his way to Rome?",
      answers: [
        { text: "Peter", correct: false },
        { text: "John", correct: false },
        { text: "James", correct: false },
        { text: "Paul", correct: true },
      ],
      reference: "Acts 27",
    },

    {
      question: "How many times did Peter deny Jesus?",
      answers: [
        { text: "1", correct: false },
        { text: "2", correct: false },
        { text: "3", correct: true },
        { text: "4", correct: false },
      ],
      reference: "Matthew 26:34-75",
    },
    {
      question: "Who was stoned to death for preaching about Jesus?",
      answers: [
        { text: "James", correct: false },
        { text: "Stephen", correct: true },
        { text: "Philip", correct: false },
        { text: "Thomas", correct: false },
      ],
      reference: "Acts 7:54-60",
    },
    {
      question: "Which king had Daniel thrown into the lion’s den?",
      answers: [
        { text: "Nebuchadnezzar", correct: false },
        { text: "Darius", correct: true },
        { text: "Cyrus", correct: false },
        { text: "Belshazzar", correct: false },
      ],
      reference: "Daniel 6:16",
    },
    {
      question: "What was the name of the high priest who put Jesus on trial?",
      answers: [
        { text: "Caiaphas", correct: true },
        { text: "Annas", correct: false },
        { text: "Nicodemus", correct: false },
        { text: "Gamaliel", correct: false },
      ],
      reference: "John 18:24",
    },
    {
      question: "Who was Jacob’s first wife?",
      answers: [
        { text: "Rachel", correct: false },
        { text: "Leah", correct: true },
        { text: "Rebekah", correct: false },
        { text: "Sarah", correct: false },
      ],
      reference: "Genesis 29:23-25",
    },
    {
      question: "Which disciple doubted Jesus' resurrection until he saw Him?",
      answers: [
        { text: "Peter", correct: false },
        { text: "James", correct: false },
        { text: "John", correct: false },
        { text: "Thomas", correct: true },
      ],
      reference: "John 20:24-29",
    },
    {
      question: "Who asked Pilate for Jesus' body after the crucifixion?",
      answers: [
        { text: "Nicodemus", correct: false },
        { text: "Peter", correct: false },
        { text: "Joseph of Arimathea", correct: true },
        { text: "John", correct: false },
      ],
      reference: "Matthew 27:57-58",
    },
    {
      question: "Who did David have killed to cover up his sin with Bathsheba?",
      answers: [
        { text: "Joab", correct: false },
        { text: "Uriah", correct: true },
        { text: "Abner", correct: false },
        { text: "Nathan", correct: false },
      ],
      reference: "2 Samuel 11:14-17",
    },
    {
      question: "What was Paul’s name before he became a follower of Jesus?",
      answers: [
        { text: "Simon", correct: false },
        { text: "Saul", correct: true },
        { text: "Silas", correct: false },
        { text: "Stephen", correct: false },
      ],
      reference: "Acts 9:1-2",
    },
    {
      question: "Who was the first king of Judah after the kingdom split?",
      answers: [
        { text: "Rehoboam", correct: true },
        { text: "Jeroboam", correct: false },
        { text: "Abijah", correct: false },
        { text: "Asa", correct: false },
      ],
      reference: "1 Kings 12:16-20",
    },
    {
      question: "Which prophet confronted Ahab and Jezebel about their sins?",
      answers: [
        { text: "Elijah", correct: true },
        { text: "Isaiah", correct: false },
        { text: "Jeremiah", correct: false },
        { text: "Micah", correct: false },
      ],
      reference: "1 Kings 18:17-18",
    },
    {
      question: "How many days did Jesus fast in the wilderness?",
      answers: [
        { text: "20", correct: false },
        { text: "30", correct: false },
        { text: "40", correct: true },
        { text: "50", correct: false },
      ],
      reference: "Matthew 4:1-2",
    },
    {
      question: "Which Old Testament character was known for his patience?",
      answers: [
        { text: "Moses", correct: false },
        { text: "Abraham", correct: false },
        { text: "Isaiah", correct: false },
        { text: "Job", correct: true },
      ],
      reference: "Job 1-2",
    },
    {
      question: "What did God use to speak to Moses in the wilderness?",
      answers: [
        { text: "A cloud", correct: false },
        { text: "A dove", correct: false },
        { text: "A storm", correct: false },
        { text: "A burning bush", correct: true },
      ],
      reference: "Exodus 3:1-4",
    },
    {
      question: "Who was the woman that hid the Israelite spies in Jericho?",
      answers: [
        { text: "Rahab", correct: true },
        { text: "Ruth", correct: false },
        { text: "Esther", correct: false },
        { text: "Deborah", correct: false },
      ],
      reference: "Joshua 2:1",
    },

    {
      question: "How many years did the Israelites wander in the wilderness?",
      answers: [
        { text: "20", correct: false },
        { text: "30", correct: false },
        { text: "40", correct: true },
        { text: "50", correct: false },
      ],
      reference: "Numbers 14:33-34",
    },
  ],
  hard: [
    {
      question: "Who was the brother of Moses?",
      answers: [
        { text: "Aaron", correct: true },
        { text: "Joseph", correct: false },
        { text: "Abel", correct: false },
        { text: "Jacob", correct: false },
      ],
    },

    {
      question:
        "Which book in the New Testament tells the story of the early church?",
      answers: [
        { text: "Matthew", correct: false },
        { text: "Acts", correct: true },
        { text: "Romans", correct: false },
        { text: "1 Corinthians", correct: false },
      ],
      reference: "Acts 1:1-2",
    },
    {
      question: "What did Jesus do at the Last Supper to show humility?",
      answers: [
        { text: "Prayed", correct: false },
        { text: "Washed the disciples’ feet", correct: true },
        { text: "Broke bread", correct: false },
        { text: "Gave a sermon", correct: false },
      ],
      reference: "John 13:1-17",
    },
    {
      question: "How many days was Jesus in the tomb before He rose?",
      answers: [
        { text: "2", correct: false },
        { text: "3", correct: true },
        { text: "4", correct: false },
        { text: "7", correct: false },
      ],
      reference: "Matthew 12:40",
    },
    {
      question:
        "Who is credited with writing the majority of the letters in the New Testament?",
      answers: [
        { text: "Peter", correct: false },
        { text: "Paul", correct: true },
        { text: "John", correct: false },
        { text: "James", correct: false },
      ],
      reference: "Romans, 1 Corinthians, Galatians, etc.",
    },
    {
      question: "What was the name of the place where Jesus was crucified?",
      answers: [
        { text: "Mount Sinai", correct: false },
        { text: "Golgotha", correct: true },
        { text: "Bethlehem", correct: false },
        { text: "Mount Carmel", correct: false },
      ],
      reference: "Matthew 27:33",
    },
    {
      question: "What did Jesus say is the greatest commandment?",
      answers: [
        { text: "Love your neighbor", correct: false },
        { text: "Love the Lord your God with all your heart", correct: true },
        { text: "Do not steal", correct: false },
        { text: "Honor your father and mother", correct: false },
      ],
      reference: "Matthew 22:37-38",
    },
    {
      question: "Which Gospel is the shortest?",
      answers: [
        { text: "Matthew", correct: false },
        { text: "Mark", correct: true },
        { text: "Luke", correct: false },
        { text: "John", correct: false },
      ],
      reference: "The Gospel of Mark",
    },
    {
      question: "What did God create on the seventh day?",
      answers: [
        { text: "Animals", correct: false },
        { text: "Humans", correct: false },
        { text: "He rested", correct: true },
        { text: "Land", correct: false },
      ],
      reference: "Genesis 2:2",
    },
    {
      question: "Which prophet was thrown into a cistern?",
      answers: [
        { text: "Isaiah", correct: false },
        { text: "Jeremiah", correct: true },
        { text: "Elisha", correct: false },
        { text: "Amos", correct: false },
      ],
      reference: "Jeremiah 38:6",
    },
    {
      question: "Who did an angel tell to name their child John?",
      answers: [
        { text: "Mary", correct: false },
        { text: "Zacharias", correct: true },
        { text: "Joseph", correct: false },
        { text: "Elizabeth", correct: false },
      ],
      reference: "Luke 1:13",
    },
    {
      question: "Who was the woman who became a pillar of salt?",
      answers: [
        { text: "Lot’s wife", correct: true },
        { text: "Sarah", correct: false },
        { text: "Rachel", correct: false },
        { text: "Hagar", correct: false },
      ],
      reference: "Genesis 19:26",
    },
    {
      question: "What was the name of Moses’ sister?",
      answers: [
        { text: "Rebekah", correct: false },
        { text: "Miriam", correct: true },
        { text: "Rachel", correct: false },
        { text: "Leah", correct: false },
      ],
      reference: "Exodus 15:20",
    },
    {
      question: "How many people were saved in Noah's Ark?",
      answers: [
        { text: "7", correct: false },
        { text: "8", correct: true },
        { text: "10", correct: false },
        { text: "12", correct: false },
      ],
      reference: "1 Peter 3:20",
    },
    {
      question: "Who was the only female judge of Israel?",
      answers: [
        { text: "Deborah", correct: true },
        { text: "Esther", correct: false },
        { text: "Miriam", correct: false },
        { text: "Ruth", correct: false },
      ],
      reference: "Judges 4:4",
    },
    {
      question: "What food did Esau sell his birthright for?",
      answers: [
        { text: "Bread", correct: false },
        { text: "Lentil stew", correct: true },
        { text: "Fish", correct: false },
        { text: "Honey", correct: false },
      ],
      reference: "Genesis 25:34",
    },
    {
      question: "How many books are there in the Bible?",
      answers: [
        { text: "60", correct: false },
        { text: "66", correct: true },
        { text: "70", correct: false },
        { text: "72", correct: false },
      ],
      reference: "66 books: 39 in Old Testament, 27 in New Testament",
    },
    {
      question: "Who wrote the book of Revelation?",
      answers: [
        { text: "Paul", correct: false },
        { text: "John", correct: true },
        { text: "Peter", correct: false },
        { text: "Luke", correct: false },
      ],
      reference: "Revelation 1:1-2",
    },
    {
      question: "Which king of Israel was known for his wisdom?",
      answers: [
        { text: "David", correct: false },
        { text: "Solomon", correct: true },
        { text: "Saul", correct: false },
        { text: "Hezekiah", correct: false },
      ],
      reference: "1 Kings 3:12",
    },
    {
      question: "Which river did Jesus get baptized in?",
      answers: [
        { text: "Tigris", correct: false },
        { text: "Euphrates", correct: false },
        { text: "Jordan", correct: true },
        { text: "Nile", correct: false },
      ],
      reference: "Matthew 3:13",
    },
    {
      question: "Who gave Jesus gifts after His birth?",
      answers: [
        { text: "Shepherds", correct: false },
        { text: "Wise men", correct: true },
        { text: "Angels", correct: false },
        { text: "Priests", correct: false },
      ],
      reference: "Matthew 2:1-12",
    },

    {
      question: "How many people did Jesus feed with five loaves and two fish?",
      answers: [
        { text: "3,000", correct: false },
        { text: "5,000", correct: true },
        { text: "7,000", correct: false },
        { text: "4,000", correct: false },
      ],
      reference: "Matthew 14:13",
    },

    {
      question:
        "Which book of the Bible contains the story of David and Goliath?",
      answers: [
        { text: "1 Kings", correct: false },
        { text: "1 Samuel", correct: true },
        { text: "2 Samuel", correct: false },
        { text: "Judges", correct: false },
      ],
      reference: "1 Samuel 17",
    },
    {
      question: "Who betrayed Samson to the Philistines?",
      answers: [
        { text: "Delilah", correct: true },
        { text: "Rahab", correct: false },
        { text: "Ruth", correct: false },
        { text: "Bathsheba", correct: false },
      ],
      reference: "Judges 16:4",
    },
    {
      question: "What was the name of Moses’ wife?",
      answers: [
        { text: "Zipporah", correct: true },
        { text: "Miriam", correct: false },
        { text: "Deborah", correct: false },
        { text: "Leah", correct: false },
      ],
      reference: "Exodus 2:21",
    },
    {
      question: "Which prophet saw a vision of a valley of dry bones?",
      answers: [
        { text: "Isaiah", correct: false },
        { text: "Ezekiel", correct: true },
        { text: "Jeremiah", correct: false },
        { text: "Daniel", correct: false },
      ],
      reference: "Ezekiel 37:1-14",
    },

    {
      question: "Which king had John the Baptist beheaded?",
      answers: [
        { text: "Pilate", correct: false },
        { text: "Caesar", correct: false },
        { text: "Herod", correct: true },
        { text: "Nebuchadnezzar", correct: false },
      ],
      reference: "Mark 6:27",
    },
    {
      question: "What were the names of the two sons of Zebedee?",
      answers: [
        { text: "Peter and Andrew", correct: false },
        { text: "Simon and Jude", correct: false },
        { text: "Thomas and Matthew", correct: false },
        { text: "James and John", correct: true },
      ],
      reference: "Matthew 4:21",
    },
    {
      question: "What was the name of David’s first wife?",
      answers: [
        { text: "Bathsheba", correct: false },
        { text: "Abigail", correct: false },
        { text: "Ruth", correct: false },
        { text: "Michal", correct: true },
      ],
      reference: "1 Samuel 18:27",
    },
    {
      question:
        "How many days did it take Nehemiah to rebuild the wall of Jerusalem?",
      answers: [
        { text: "40 days", correct: false },
        { text: "100 days", correct: false },
        { text: "30 days", correct: false },
        { text: "52 days", correct: true },
      ],
      reference: "Nehemiah 6:15",
    },
    {
      question: "What was the name of the angel who appeared to Mary?",
      answers: [
        { text: "Michael", correct: false },
        { text: "Raphael", correct: false },
        { text: "Gabriel", correct: true },
        { text: "Uriel", correct: false },
      ],
      reference: "Luke 1:26",
    },
    {
      question:
        "In which city were followers of Jesus first called Christians?",
      answers: [
        { text: "Jerusalem", correct: false },
        { text: "Rome", correct: false },
        { text: "Antioch", correct: true },
        { text: "Ephesus", correct: false },
      ],
      reference: "Acts 11:26",
    },
    {
      question: "Which Old Testament prophet married a prostitute named Gomer?",
      answers: [
        { text: "Hosea", correct: true },
        { text: "Isaiah", correct: false },
        { text: "Ezekiel", correct: false },
        { text: "Jeremiah", correct: false },
      ],
      reference: "Hosea 1:2-3",
    },
    {
      question: "What is the longest chapter in the Bible?",
      answers: [
        { text: "Psalm 119", correct: true },
        { text: "Genesis 1", correct: false },
        { text: "John 3", correct: false },
        { text: "Revelation 22", correct: false },
      ],
      reference: "Psalm 119",
    },
    {
      question: "Who was the last king of Judah before the Babylonian exile?",
      answers: [
        { text: "Hezekiah", correct: false },
        { text: "Josiah", correct: false },
        { text: "Jehoiakim", correct: false },
        { text: "Zedekiah", correct: true },
      ],
      reference: "2 Kings 24:17",
    },
    {
      question: "What was the name of the island where John was exiled?",
      answers: [
        { text: "Crete", correct: false },
        { text: "Patmos", correct: true },
        { text: "Malta", correct: false },
        { text: "Cyprus", correct: false },
      ],
      reference: "Revelation 1:9",
    },
    {
      question: "Which of the Ten Commandments forbids coveting?",
      answers: [
        { text: "Tenth", correct: true },
        { text: "Fifth", correct: false },
        { text: "Third", correct: false },
        { text: "First", correct: false },
      ],
      reference: "Exodus 20:17",
    },
    {
      question: "Who was the first man to build a city in the Bible?",
      answers: [
        { text: "Noah", correct: false },
        { text: "Cain", correct: true },
        { text: "Enoch", correct: false },
        { text: "Abel", correct: false },
      ],
      reference: "Genesis 4:17",
    },
    {
      question:
        "Who prophesied that a virgin would give birth to a son called Immanuel?",
      answers: [
        { text: "Jeremiah", correct: false },
        { text: "Isaiah", correct: true },
        { text: "Ezekiel", correct: false },
        { text: "Daniel", correct: false },
      ],
      reference: "Isaiah 7:14",
    },
    {
      question:
        "What was the name of the Roman centurion who had faith in Jesus' ability to heal his servant?",
      answers: [
        { text: "Felix", correct: false },
        { text: "Cornelius", correct: true },
        { text: "Jairus", correct: false },
        { text: "Festus", correct: false },
      ],
      reference: "Acts 10:1-2",
    },
    {
      question: "Who was the priest that Samuel served under as a boy?",
      answers: [
        { text: "Aaron", correct: false },
        { text: "Phinehas", correct: false },
        { text: "Nadab", correct: false },
        { text: "Eli", correct: true },
      ],
      reference: "1 Samuel 3:1",
    },
    {
      question: "How old was Noah when the floodwaters came upon the earth?",
      answers: [
        { text: "500 years old", correct: false },
        { text: "400 years old", correct: false },
        { text: "600 years old", correct: true },
        { text: "300 years old", correct: false },
      ],
      reference: "Genesis 7:6",
    },
    {
      question: "What type of wood did Noah use to build the ark?",
      answers: [
        { text: "Cedar", correct: false },
        { text: "Pine", correct: false },
        { text: "Oak", correct: false },
        { text: "Gopher wood", correct: true },
      ],
      reference: "Genesis 6:14",
    },
  ],
};

let currentQuestions = questions[currentLevel];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

//// to delete high score
function deleteScore() {
  localStorage.removeItem("highScore");
  highScore.innerText = "";
  console.log("hello");
}
document.querySelector("#deleteScore").addEventListener("click", deleteScore);

///// function to set the high score

function setScore() {
  let storedScore = Number(localStorage.getItem("highScore")) || 0; // Get high score from localStorage or set to 0
  if (score > storedScore) {
    // Compare current score with stored high score
    localStorage.setItem("highScore", score); // Update high score in localStorage
    highScore.innerText = score; // Update the high score display
  }
}

/////

function startQuiz() {
  if (soundSelect.checked == false) {
    music1.loop = true;
    music1.volume = 0.8;
    music1.play();
  }
  document.getElementById("startScreen").classList.add("hide");
  document.getElementById("quiz-container").classList.remove("hide");

  score = 0;
  questionNum = 1;
  streak = 0;
  damage = 100;
  hintsUsed = 0;
  currentQuestionIndex = 0;
  achievements = []; // Reset achievements when the quiz starts

  // Initialize and shuffle questions
  currentQuestions = [...questions[currentLevel]];
  shuffleArray(currentQuestions);

  showQuestion(currentQuestions[currentQuestionIndex]);
  startTimer();
}

function nextQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  startTimer();
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerText = "";

  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    showQuestion(currentQuestions[currentQuestionIndex]);
    document.getElementById("next-btn").classList.add("hide");
  } else if (
    currentQuestionIndex == currentQuestions.length &&
    questionNum < 136 //this is the max question in the game + 1
  ) {
    currentQuestionIndex = 0;
    currentQuestions = [...questions[currentLevel]];
    // currentQuestions = questions[currentLevel];
    shuffleArray(currentQuestions);
    showQuestion(currentQuestions[currentQuestionIndex]);
  }

  // else if (
  //   currentQuestionIndex == currentQuestions.length &&
  //   questionNum === 6
  // ) {
  //   showResult();
  // }
  else {
    //stop ingame music if playing
    if (soundSelect.checked == false) {
      inGameMusic.forEach((item) => item.pause());
    } //stop in game music
    setScore();
    showResult();
  }
}

function showQuestion(question) {
  // autorun select
  let autorun = document.getElementsByName("auto")[1];
  document.getElementById("question").innerText = question.question;
  const answerButtonsElement = document.getElementById("answer-buttons");
  answerButtonsElement.innerHTML = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.onclick = () => {
      checkAnswer(answer.correct, question.reference);
      document.querySelectorAll("button").forEach((b) => {
        if (
          b.id !== "next-btn" &&
          b.id !== "gameover-reset" &&
          b.id !== "restart-btn"
        ) {
          b.disabled = true;
        }
      });
      if (autorun.checked == true) {
        document.getElementById("next-btn").classList.remove("hide");
      } else if (autorun.checked == false) {
        setTimeout(() => {
          nextQuestion();
        }, 1500);
      }
    };

    const li = document.createElement("li");
    li.appendChild(button);
    answerButtonsElement.appendChild(li);
  });
}

// function checkAnswer(isCorrect, reference) {
//   const messageContainer = document.getElementById("message-container");

//   if (isCorrect) {
//     correct.play();
//     questionNum++;
//     clearInterval(timer);
//     messageContainer.innerText = `Correct! The answer is in ${reference}.`;
//     messageContainer.style.color = "green";
//     score += 1;
//     gameCorrectAdlibs();

//     updateScoreDisplay("+1"); // Update score display after a correct answer
//     updateHealth();
//   } else {
//     gameWrongAdlibs();

//     highlightCorrectAnswer(); // Highlight the correct answer

//     wrong.play();
//     questionNum++;
//     damage -= 12.5;
//     // damage -= 20;

//     clearInterval(timer);

//     messageContainer.innerText = `Incorrect. The answer is in ${reference}.`;
//     messageContainer.style.color = "red";
//   }
//   checkDamage();

//   checkProgress(); // Check level progression
//   checkAchievements(); // Check if an achievement is unlocked
// }
async function checkAnswer(isCorrect, reference) {
  const messageContainer = document.getElementById("message-container");

  if (isCorrect) {
    correct.play();
    questionNum++;
    clearInterval(timer);
    messageContainer.innerText = `Correct! The answer is in ${reference}.`;
    messageContainer.style.color = "green";
    streak += 1;
    await gameCorrectAdlibs();

    let points = () => {
      if (streak < 5) {
        score += 10;
        updateScoreDisplay("+10");
      } else if (streak >= 5 && streak < 10) {
        score += 25;
        updateScoreDisplay("+25");
      } else if (streak >= 10 && streak < 15) {
        score += 50;
        updateScoreDisplay("+50");
      } else if (streak >= 15) {
        score += 100;
        updateScoreDisplay("+100");
      }
    };
    points();

    updateHealth();
  } else {
    await gameWrongAdlibs(); // Await the function to ensure it completes properly

    wrong.play();
    questionNum++;
    damage -= 20;
    clearInterval(timer);
    streak = 0;

    messageContainer.innerText = `Incorrect. The answer is in ${reference}.`;
    messageContainer.style.color = "red";
    highlightCorrectAnswer(); // Highlight the correct answer
  }
  checkDamage();
  checkProgress();
  checkAchievements();
}

function highlightCorrectAnswer() {
  const currentQuestion = currentQuestions[currentQuestionIndex];
  document.querySelectorAll("button").forEach((button) => {
    if (
      button.innerText === currentQuestion.answers.find((a) => a.correct).text
    ) {
      button.style.backgroundColor = "green";
    } else if (button.id === "next-btn") {
      button.style.backgroundColor = "#4a90e2";
    } else if (button.id === "hint-btn") {
      button.style.backgroundColor = "#4a90e2";
    } else button.style.backgroundColor = "red";
  });
}

function showResult() {
  clearInterval(timer);
  timeLeft = 0;
  gameComplete.play();
  document.getElementById("quiz-container").classList.add("hide");
  document.getElementById("result-container").classList.remove("hide");
  document.getElementById("final-score").innerText = `Your score: ${score}`;
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      document.getElementById("timer").innerText = `Time Left: ${timeLeft}`;
    } else {
      wrong.play();
      damage -= 20;
      streak = 0;
      checkDamage();
      clearInterval(timer);
      questionNum++;

      //change levels if needed
      if (questionNum >= 65 && currentLevel === "easy") {
        currentLevel = "medium";

        // currentQuestions = questions[currentLevel];
        // document.getElementById("difficultyLevel").innerText = "Level: 2";
      } else if (questionNum >= 93 && currentLevel === "medium") {
        currentLevel = "hard";
        // currentQuestions = questions[currentLevel];
        // document.getElementById("difficultyLevel").innerText = "Level: 3";
      }
      //
      nextQuestion();
    }
  }, 1000);
}

function updateScoreDisplay(amount) {
  document.getElementById("score").innerText = `Score: ${score}`;
  let pointAnimation = document.getElementById("points");

  pointAnimation.innerText = amount;
  pointAnimation.classList.add("points");

  setTimeout(() => {
    pointAnimation.classList.remove("points");
    pointAnimation.innerText = "";
  }, 900);
}

function updateHealth() {
  if (score > 1 && damage < 100) {
    // life.play();

    if (streak === 2 || streak === 4 || streak === 8 || streak === 10) {
      damage += 20;
      console.log("damage increased");
      updateScoreDisplay("❤+");
      popup("+Health", life);
    } // Increase damage
    else return;
  }
  // No need for an else block if you just want to do nothing when conditions aren't met
}

let addAnimations;
let removeAnimations;

function popup(message, sound) {
  let popupdiv = document.getElementById("achievementsPopup");
  let popupinner = document.getElementById("achievementsPopupInner");
  let medal = document.getElementById("medal");

  sound.play();

  popupdiv.classList.remove("hide");

  medal.innerHTML = message;

  addAnimations = setTimeout(() => {
    popupinner.classList.add("zoomOutDown");
  }, 2000);
  // return the popup element to the original state
  removeAnimations = setTimeout(() => {
    popupinner.classList.remove("zoomOutDown");
    popupdiv.classList.add("hide");
  }, 2750);
}

function checkAchievements() {
  if (score >= 50 && !achievements.includes("Seeker")) {
    achievements.push("Seeker");
    // levelup1.play();
    // alert("You've earned the 'Novice Bible Scholar' achievement!");
    popup("Seeker", levelup1);
  }
  if (score >= 250 && !achievements.includes("Witness")) {
    achievements.push("Witness");
    // levelup1.play();
    // alert("You've earned the 'Bible NoviceII' achievement!");
    popup("Witness", levelup1);
  }

  if (streak === 7 && !achievements.includes("Streak7")) {
    achievements.push("Streak7");
    // levelup1.play();
    // alert("You've earned the 'Bible Apprentice' achievement!");
    popup("Streak7", levelup1);
  }

  if (streak === 15 && !achievements.includes("Streak15")) {
    achievements.push("Streak15");
    // levelup1.play();
    // alert("You've earned the 'Bible Apprentice' achievement!");
    popup("Streak15", levelup1);
  }

  if (score >= 500 && !achievements.includes("Apprentice")) {
    achievements.push("Apprentice");
    // levelup1.play();
    // alert("You've earned the 'Bible Apprentice' achievement!");
    popup("Apprentice", levelup1);
  }
  if (score >= 1000 && !achievements.includes("Disciple")) {
    achievements.push("Disciple");
    popup("Disciple", levelup1);
  }
  if (score >= 2000 && !achievements.includes("Prophet")) {
    achievements.push("Prophet");
    // levelup1.play();
    // alert("You've earned the 'Bible MasterII' achievement!");
    popup("Prophet", levelup1);
  }
  if (score >= 3000 && !achievements.includes("Scholar")) {
    achievements.push("Scholar");
    // levelup1.play();
    // alert("You've earned the 'Elite' achievement!");
    popup("Scholar", levelup1);
  }
  if (score >= 4000 && !achievements.includes("Angel")) {
    achievements.push("Angel");
    // levelup1.play();
    // alert("You've earned the 'Elite' achievement!");
    popup("Angel", levelup1);
  }
  // achievementsdiv.innerHTML = "";

  //  existing items in achievementItems
  let existDivs = document.querySelectorAll("div.achievementItems");
  let numberOfDivs = existDivs.length;
  //

  achievements.forEach((item) => {
    console.log("your item is: " + achievements.indexOf(item));
    console.log(achievements[numberOfDivs]);

    if (achievements[numberOfDivs] === item) {
      const items = document.createElement("div"); // Create a new div element
      items.innerText = item; // Set the text inside the div
      items.classList.add("achievementAnimation");

      items.classList.add("achievementItems"); // Add a class for styling
      achievementsdiv.appendChild(items); // Append the div to achievementsdiv
    } else return;
  });
}

function checkProgress() {
  if (questionNum >= 65 && currentLevel === "easy") {
    currentLevel = "medium";

    // currentQuestions = questions[currentLevel];
    // document.getElementById("difficultyLevel").innerText = "Level: 2";
  } else if (questionNum >= 93 && currentLevel === "medium") {
    currentLevel = "hard";
    // currentQuestions = questions[currentLevel];
    // document.getElementById("difficultyLevel").innerText = "Level: 3";
  }
  let leveldiv = document.getElementById("difficultyLevel");
  console.log("The question number is " + questionNum);

  switch (questionNum) {
    case 10:
      if (leveldiv.innerText !== "Level: 2/6") {
        next_level.play();
        leveldiv.innerText = "Level: 2/6";

        if (soundSelect.checked == false) {
          music1.pause();
          music2.volume = 0.8;

          music2.play();
          music2.loop = true;
        }
      }

      break;
    case 30:
      if (leveldiv.innerText !== "Level: 3/6") {
        next_level.play();
        leveldiv.innerText = "Level: 3/6";

        if (soundSelect.checked == false) {
          music2.pause();
          music3.volume = 0.8;

          music3.play();
          music3.loop = true;
        }
      }

      break;
    case 60:
      if (leveldiv.innerText !== "Level: 4/6") {
        next_level.play();
        leveldiv.innerText = "Level: 4/6";

        if (soundSelect.checked == false) {
          music3.pause();
          music4.volume = 0.8;
          music4.play();
          music4.loop = true;
        }
      }

      break;
    case 90:
      if (leveldiv.innerText !== "Level: 5/6") {
        next_level.play();
        leveldiv.innerText = "Level: 5/6";

        if (soundSelect.checked == false) {
          music4.pause();
          music5.volume = 0.8;
          music5.play();
          music5.loop = true;
        }
      }

      break;
    case 110:
      if (leveldiv.innerText !== "Level: 6/6") {
        next_level.play();
        leveldiv.innerText = "Level: 6/6";

        if (soundSelect.checked == false) {
          music5.pause();
          music6.volume = 0.8;
          music6.play();
          music6.loop = true;
        }
      }
      break;
  }
}

function checkDamage() {
  let meter = document.getElementById("damagemeter");
  meter.style.width = damage + "%";

  if (damage <= 40 && damage !== 0) {
    let damageFire = document.getElementById("damageFire");
    damageFire.classList.remove("hide");
    if (!lowHealthPlaying) {
      lowhealth.play();
      lowhealth.loop = true; // Start looping the low health sound
      lowHealthPlaying = true; // Set the flag to true
    }
  } else {
    if (!damageFire.classList.contains("hide")) {
      damageFire.classList.add("hide");
    }
    if (lowHealthPlaying) {
      lowhealth.pause(); // Stop the sound if damage is above threshold
      lowhealth.currentTime = 0; // Reset sound to start
      lowHealthPlaying = false; // Reset the flag
    }
  }

  if (damage === 0) {
    if (soundSelect.checked == false) {
      inGameMusic.forEach((item) => item.pause());
    } //stop in game music
    setScore(); // set the high score if it is higher the previous
    gameOver(); // Call the gameOver function if damage is zero
  }
}

// function gameOver() {
//   // Get references to the elements
//   let gameoverContainer = document.getElementById("gameoverContainer");
//   let gameContainer = document.getElementById("container");
//   let resetBtn = document.getElementById("gameover-reset"); // Updated ID

//   music1.pause();
//   music1.curentTime = 0;
//   // Play and loop the fire sound
//   fire.play();
//   fire.loop = true;

//   // Show the game over container and hide the game container
//   gameoverContainer.classList.remove("hide");
//   gameContainer.classList.add("hide");

//   // Reset the game when the reset button is clicked
//   resetBtn.addEventListener("click", () => {
//     console.log("Reset button clicked"); // Debugging line

//     fire.pause();
//     fire.currentTime = 0;

//     // Hide the game over container and show the game container
//     gameoverContainer.classList.add("hide");
//     gameContainer.classList.remove("hide");

//     // Restart the quiz
//     startQuiz();
//   });
// }

function gameOver() {
  let gameoverContainer = document.getElementById("gameoverContainer");
  let quizContainer = document.getElementById("mainContainer");
  let musicArray = [gameOverMusic1, gameOverMusic2, gameOverMusic3];

  // Pause and reset game music
  music1.pause();
  music1.currentTime = 0;

  // Play fire sound
  fire.play();
  fire.loop = true;

  musicArray[Math.floor(Math.random() * 3)].play();

  // Show the game over container and hide the quiz container
  gameoverContainer.classList.remove("hide");
  quizContainer.classList.add("hide");
  gameoverContainer.style.display = "block";

  // Attach the event listener to the reset button once it's visible
  let resetBtn = document.getElementById("gameover-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      console.log("Reset button clicked");

      // Stop the fire sound
      fire.pause();
      fire.currentTime = 0;
      //  to stop the music in the array if playing;
      musicArray.forEach((music) => {
        if (!music.paused) {
          music.pause(); // Pause the music
          music.currentTime = 0; // Reset the music to the beginning
        }
      });

      // Hide the game over container and show the quiz container
      gameoverContainer.classList.add("hide");

      // Restart the quiz
      location.reload();
    });
  } else {
    console.log("Reset button not found!");
  }
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("restart-btn").addEventListener("click", () => {
  console.log("clicked");
  location.reload();
});

// document.getElementById("hint-btn").addEventListener("click", useHint);

// Ensure `useHint` function exists
function useHint() {
  // Implement hint logic
}
