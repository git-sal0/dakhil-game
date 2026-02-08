import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { Alert } from "react-native";




import {
  FlatList,
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


/* ===================== CONSTANTS ===================== */
const APP_VERSION = "0.9.1-beta";
const COLORS = {
  bg: "#0F1226",
  card: "#1B1F3B",
  primary: "#FF3D81",
  secondary: "#4DD0E1",
  text: "#FFFFFF",
  muted: "#AAB0FF",
  success: "#4CAF50",
  danger: "#FF5252"
};

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32
};

/* ===================== APP ===================== */

export default function App() {
  const [screen, setScreen] = useState("home");

  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [soundOn, setSoundOn] = useState(true);


  const DEFAULT_CATEGORIES = {
    food: {
      label: { en: "Food", ar: "طعام" },
      words: {
        en: ["pizza", "burger", "apple", "rice"],
        ar: ["بيتزا", "برغر", "تفاح", "أرز"]
      }
    },
    animals: {
      label: { en: "Animals", ar: "حيوانات" },
      words: {
        en: ["cat", "dog", "lion", "cow"],
        ar: ["قط", "كلب", "أسد", "بقرة"]
      }
    },
    clothes: {
      label: { en: "Clothes", ar: "ملابس" },
      words: {
        en: ["shirt", "pants", "skirt", "jacket"],
        ar: ["قميص", "بنطال", "تنورة", "سترة"]
      }
    }
  };
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [secretWord, setSecretWord] = useState(null);

  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customWordsText, setCustomWordsText] = useState("");

  const [impostersCount, setImpostersCount] = useState(1);
  const [imposterIds, setImposterIds] = useState([]);

  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [selectedVotes, setSelectedVotes] = useState([]);

  const [currentImposterGuessIndex, setCurrentImposterGuessIndex] = useState(0);
  const [imposterWon, setImposterWon] = useState(false);
  const [language, setLanguage] = useState("en");


  const isArabic = language === "ar";
  const TEXT = {
    en: {
      title: "DAKHIL",
      tagline: "One word. One liar.",
      startGame: "Start Game",
      addPlayers: "Add Players",
      addPlayer: "Add Player",
      playerName:"Player Name",
      continue: "Continue",
      back: "Back",
      results:"Results",
      chooseCategory: "Choose Category",
      customCategory:"Or Custom Category",
      categoryName:"Category Name",
      categoryWords:"Words (comma separated)",
      createStart:"Create and Start",
      discussion: "Discussion",
      discussionInfo: "Discuss who the imposters are.",
      StartVoting: "Start Voting",
      votingResults: "Voting Results",
      revealResult: "Reveal Result",
      revealImposter: "reveal Imposter",
      impostersWin: "IMPOSTERS WIN",
      playersWin: "PLAYERS WIN",
      playAgain: "Play Again (Same Group)",
      newGame: "New Game",
      confirm: "Confirm",
      confirmVote:"Confirm Vote",
      tapToFlip: "Tap to Flip",
      secretWord: "Secret word",
      imposters: "Imposters",
      imposter: "Imposter",
      ConfirmStart:"Confirm and Start",
      PassPhone2:"Pass Phone to",
      URIm:"You Are Imposter",
      StartDiscussion:"Start Discussion",
      chooseWord:"Choose Word",
      imposterGuess:"What's the Word ?",
      gameResult:"gameResult",

    },
  
    ar: {
      title: "دخيل",
      tagline: "كلمة واحدة. كاذب واحد.",
      startGame: "ابدأ اللعبة",
      addPlayers: "إضافة لاعبين",
      addPlayer: "إضافة لاعب",
      playerName:"اسم اللاعب",
      continue: "متابعة",
      back: "رجوع",
      results:"النتيجة",
      chooseCategory: "اختر الفئة",
      customCategory:"او فئة خاصة",
      categoryName:"اسم الفئة",
      categoryWords:"الكلمات (ضع فاصلة , بين الكلمات)",
      createStart:"العب بهذه الفئة",
      discussion: "نقاش",
      discussionInfo: "قوموا بطرح اسئلة على بعضكم البعض لمحاولة اكتشاف الدخيل. الاسئلة يجب الا تكشف عن الكلمة",
      StartVoting: "ابدأ التصويت",
      votingResults: "نتائج التصويت",
      revealResult: "كشف النتيجة",
      revealImposter:"كشف الدخلاء",
      impostersWin: "الدخلاء فازوا",
      playersWin: "اللاعبون فازوا",
      playAgain: "إعادة اللعب (نفس المجموعة)",
      newGame: "لعبة جديدة",
      confirm: "تأكيد",
      confirmVote:"تأكيد التصويت",
      tapToFlip: "اضغط للكشف",
      secretWord: "الكلمة السرية",
      imposters: "الدخلاء",
      imposter: "دخيل",
      ConfirmStart:"تاكيد و بدأ",
      PassPhone2:"اعطي الهاتف ل",
      URIm:"انت الدخيل",
      StartDiscussion:"ابدأ النقاش",
      chooseWord:"اختر الكلمة",
      imposterGuess:"ما هي الكلمة ؟",
      gameResult:"النتائج",
    }
  };


  const sounds = {
    click: require("./sounds/click.mp3"),
    flip: require("./sounds/flip.mp3"),
    next: require("./sounds/next.mp3"),
    start: require("./sounds/start.mp3"),
    win: require("./sounds/win.mp3")
  };
  
  async function playSound(type) {
    if (!soundOn) return;
    try {
      const { sound } = await Audio.Sound.createAsync(sounds[type]);
      await sound.setVolumeAsync(0.6);
      await sound.playAsync();
    } catch (e) {
      // silent fail
    }
  }
  
  

  async function deleteCustomCategory(key) {
    // 1. Remove from state
    setCategories(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  
    // 2. Remove from AsyncStorage
    const saved = await AsyncStorage.getItem("CUSTOM_CATEGORIES");
    if (!saved) return;
  
    const parsed = JSON.parse(saved);
    delete parsed[key];
  
    await AsyncStorage.setItem(
      "CUSTOM_CATEGORIES",
      JSON.stringify(parsed)
    );
  }
  function confirmDeleteCategory(key) {
    Alert.alert(
      "Delete Category",
      "This category will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCustomCategory(key)
        }
      ]
    );
  }
  
  function BackButton({ to }) {
    return (
      <TouchableOpacity
        onPress={() => setScreen(to)}
        style={{ marginBottom: 10 }}
      >
        <Text style={{ color: COLORS.muted, fontSize: 16 }}>
          ← {t("back")}
        </Text>
      </TouchableOpacity>
    );
  }
  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("CUSTOM_CATEGORIES");
      if (saved) {
        setCategories(prev => ({
          ...DEFAULT_CATEGORIES,
          ...JSON.parse(saved)
        }));
      }
    })();
  }, []);
  
  
  function switchLanguage(lang) {
    setLanguage(lang);
  
    const shouldBeRTL = lang === "ar";
  
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      // App reload is required in real devices
    }
  }
  

   function t(key) {
    return TEXT[language][key] || key;
    }


  /* ===================== HELPERS ===================== */

  const isImposter = id => imposterIds.includes(id);

  function addPlayer() {
    if (!playerName.trim()) return;
    setPlayers(p => [...p, { id: Date.now(), name: playerName.trim() }]);
    setPlayerName("");
  }

  function removePlayer(id) {
    setPlayers(p => p.filter(x => x.id !== id));
  }

  function chooseCategory(categoryKey, words) {
    const randomWord =
      words[Math.floor(Math.random() * words.length)];
  
    setSelectedCategory(categoryKey);
    setSecretWord(randomWord);
    setScreen("imposterConfig");
  }
  
  async function addCustomCategory() {
    const words = customWordsText
      .split(",")
      .map(w => w.trim())
      .filter(Boolean);
  
    if (!customCategoryName || words.length < 3) return;
  
    const newCategory = {
      [customCategoryName]: {
        label: {
          en: customCategoryName,
          ar: customCategoryName
        },
        words: {
          en: words,
          ar: words
        }
      }
    };
  
    const saved = await AsyncStorage.getItem("CUSTOM_CATEGORIES");
    const parsed = saved ? JSON.parse(saved) : {};
  
    const updatedCustom = { ...parsed, ...newCategory };
  
    await AsyncStorage.setItem(
      "CUSTOM_CATEGORIES",
      JSON.stringify(updatedCustom)
    );
  
    setCategories(prev => ({ ...prev, ...newCategory }));
  
    chooseCategory(customCategoryName, words);
    setCustomCategoryName("");
    setCustomWordsText("");
  }
  
  

  function selectImposters() {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setImposterIds(shuffled.slice(0, impostersCount).map(p => p.id));
    setCurrentRevealIndex(0);
    setCardFlipped(false);
    setScreen("reveal");
  }
  React.useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true
    });
  }, []);
  
  function toggleVote(id) {
    setSelectedVotes(v =>
      v.includes(id)
        ? v.filter(x => x !== id)
        : v.length < impostersCount
        ? [...v, id]
        : v
    );
  }

  function confirmVote() {
    const newVotes = { ...votes };
    selectedVotes.forEach(id => (newVotes[id] = (newVotes[id] || 0) + 1));
    setVotes(newVotes);
    setSelectedVotes([]);
    currentVoterIndex + 1 < players.length
      ? setCurrentVoterIndex(i => i + 1)
      : setScreen("voteResults");
  }

  function getTopVoted() {
    return Object.entries(votes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => ({
        player: players.find(p => p.id === Number(id)),
        count
      }));
  }

  /* ===================== UI ===================== */

  return (
    <View style={styles.container}>

{/* ===================== HOME ===================== */}
{screen === "home" && ( 
  <View style={{ flex: 1, justifyContent: "center" }}>
<View style={styles.homeTopBar}>
  {/* Language toggle */}
  <View style={styles.langToggle}>
    <TouchableOpacity
      style={[
        styles.langButton,
        language === "en" && styles.langActive
      ]}
      onPress={() => {
        playSound("click");
        switchLanguage("en");
      }}
    >
      <Text style={styles.langText}>EN</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.langButton,
        language === "ar" && styles.langActive
      ]}
      onPress={() => {
        playSound("click");
        switchLanguage("ar");
      }}
    >
      <Text style={styles.langText}>AR</Text>
    </TouchableOpacity>

    <TouchableOpacity
  style={[
    styles.langButton,
    soundOn && styles.langActive
  ]}
  onPress={() => {
    playSound("click");   // play first
    setSoundOn(s => !s); // then toggle
  }}
>
  <Text style={styles.langText}>
    {soundOn ? "🔊" : "🔇"}
  </Text>
</TouchableOpacity>



  </View>

  {/* About */}
  <TouchableOpacity onPress={() => {
  playSound("click");
  setScreen("about");
}}>
    <Text style={styles.aboutMini}>ℹ︎</Text>
  </TouchableOpacity>
</View>


<Text style={styles.title}>{t("title")}</Text>
<Text style={styles.homeTagline}>
  {t("tagline")}
</Text>

    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={() => {
        playSound("start");
        setScreen("setup");
      }}
    >
<Text style={styles.buttonPrimaryText}>
  {t("startGame")}
</Text>
    </TouchableOpacity>
    <Text style={{ color: "#888", fontSize: 12, textAlign: "center" ,marginTop:60}}>
  DAKHIL v0.9.1 (Beta)
</Text>

  </View>
)}

{/* ===================== SETUP ===================== */}
{screen === "setup" && (
  <>
      <BackButton to="home" />
    <Text style={styles.title}>{t("addPlayers")}</Text>

    <View style={styles.addPlayerCard}>
      <TextInput
        style={styles.input}
        placeholder={t("playerName")}
        placeholderTextColor={COLORS.muted}
        value={playerName}
        onChangeText={setPlayerName}
      />

      <TouchableOpacity style={styles.buttonSecondary} onPress={addPlayer}>
        <Text style={styles.buttonSecondaryText}>{t("addPlayer")}</Text>
      </TouchableOpacity>
    </View>

    <FlatList
      data={players}
      keyExtractor={i => i.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.playerRow}>
          <Text style={styles.baseText}>{item.name}</Text>
          <TouchableOpacity onPress={() => removePlayer(item.id)}>
            <Text style={styles.remove}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    />

    <TouchableOpacity
      style={[
        styles.buttonPrimary,
        players.length < 3 && styles.buttonDisabled
      ]}
      disabled={players.length < 3}
      onPress={() => {
        playSound("click");
        setScreen("category");
      }}
    >
      <Text style={styles.buttonPrimaryText}>{t("continue")}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.buttonGhost}
      onPress={() => {
        playSound("click");
        setScreen("category");
      }}
    >
      <Text style={styles.buttonGhostText}>{t("back")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== CATEGORY ===================== */}
{screen === "category" && (
  <ScrollView>
        <BackButton to="setup" />
    <Text style={styles.title}>{t("chooseCategory")}</Text>
    {Object.entries(categories).map(([key, cat]) => {
  const isCustom = !DEFAULT_CATEGORIES[key];

  return (
    <View key={key} style={{ marginBottom: 10 }}>
      {/* Category button */}
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() =>
          chooseCategory(key, cat.words[language])
        }
      >
        <Text style={styles.buttonSecondaryText}>
          {cat.label[language]}
        </Text>
      </TouchableOpacity>

      {/* DELETE BUTTON (custom categories only) */}
      {isCustom && (
        <TouchableOpacity
          onPress={() => confirmDeleteCategory(key)}
        >
          <Text
            style={{
              color: COLORS.danger,
              textAlign: "center",
              marginTop: 4
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
})}





    <Text style={styles.subtitle}>{t("customCategory")}</Text>

    <TextInput
      style={styles.input}
      placeholder={t("categoryName")}
      placeholderTextColor={COLORS.muted}
      value={customCategoryName}
      onChangeText={setCustomCategoryName}
    />

    <TextInput
      style={styles.input}
      placeholder={t("categoryWords")}
      placeholderTextColor={COLORS.muted}
      value={customWordsText}
      onChangeText={setCustomWordsText}
    />

    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={addCustomCategory}
    >
      <Text style={styles.buttonPrimaryText}>{t("createStart")}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.buttonGhost}
      onPress={() => {
        playSound("click");
        setScreen("setup");
      }}
    >
      <Text style={styles.buttonGhostText}>{t("back")}</Text>
    </TouchableOpacity>
  </ScrollView>
)}

{/* ===================== IMPOSTER CONFIG ===================== */}
{screen === "imposterConfig" && (
  <>
      <BackButton to="category" />
    <Text style={styles.title}>{t("imposters")}</Text>

    <TouchableOpacity
      style={styles.buttonSecondary}
      onPress={() => setImpostersCount(1)}
    >
      <Text style={styles.buttonSecondaryText}>1 {t("imposter")}</Text>
    </TouchableOpacity>

    {players.length >= 6 && (
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => setImpostersCount(2)}
      >
        <Text style={styles.buttonSecondaryText}>2 {t("imposters")}</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={selectImposters}
    >
      <Text style={styles.buttonPrimaryText}>{t("ConfirmStart")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== REVEAL ===================== */}
{screen === "reveal" && (
  <>
    {currentRevealIndex < players.length ? (
      <>
        <Text style={styles.playerReveal}>
          {t("PassPhone2")} {players[currentRevealIndex].name}
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            playSound("flip");
            setCardFlipped(!cardFlipped);
          }}
          
        >
          <Text style={styles.cardText}>
            {cardFlipped
              ? isImposter(players[currentRevealIndex].id)
                ? t("URIm")
                : secretWord
              : t("tapToFlip")}
          </Text>
        </TouchableOpacity>

        {cardFlipped && (
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              setCardFlipped(false);
              setCurrentRevealIndex(i => i + 1);
            }}
          >
            <Text style={styles.buttonPrimaryText}>{t("confirm")}</Text>
          </TouchableOpacity>
        )}
      </>
    ) : (
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => {
          playSound("click");
          setScreen("discussion");
        }}
      >
        <Text style={styles.buttonPrimaryText}>{t("StartDiscussion")}</Text>
      </TouchableOpacity>
    )}
  </>
)}

{/* ===================== DISCUSSION ===================== */}
{screen === "discussion" && (
  <>
  <BackButton to="reveal" />
    <Text style={styles.title}>{t("discussion")}</Text>
        <Text style={styles.info}>
        {t("discussionInfo")}
    </Text>


    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={() => {
        setVotes({});
        setCurrentVoterIndex(0);
        setSelectedVotes([]);
        setScreen("voting");
        playSound("click");
      }}
      
    >
      <Text style={styles.buttonPrimaryText}>{t("StartVoting")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== VOTING ===================== */}
{screen === "voting" && (
  <View style={{ flex: 1 }}>
        <BackButton to="discussion" />
    <Text style={styles.title}>
      {t("PassPhone2")} {players[currentVoterIndex].name}
    </Text>

    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {players.map(p => (
        <TouchableOpacity
          key={p.id}
          disabled={p.id === players[currentVoterIndex].id}
          onPress={() => toggleVote(p.id)}
          style={[
            styles.voteOption,
            selectedVotes.includes(p.id) && styles.voteSelected
          ]}
        >
          <Text style={styles.voteText}>{p.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    <TouchableOpacity
      style={[
        styles.buttonPrimary,
        selectedVotes.length !== impostersCount && styles.buttonDisabled
      ]}
      disabled={selectedVotes.length !== impostersCount}
      onPress={() => {
        playSound("click");
        confirmVote();
      }}
      
    >
      <Text style={styles.buttonPrimaryText}>
        {t("confirmVote")}
      </Text>
    </TouchableOpacity>
  </View>
)}


{/* ===================== RESULTS ===================== */}
{screen === "voteResults" && (
  <>
  <BackButton to="voting" />
    <Text style={styles.title}>{t("results")}</Text>
    {getTopVoted().map((v, i) => (
      <Text key={i} style={styles.resultText}>
        {v.player.name}: {v.count}
      </Text>
    ))}

    

    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={() =>{
         setScreen("revealImposters");
         playSound("click");}}
    >
    <Text style={styles.buttonPrimaryText}>{t("revealImposter")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== Imposter reveal ===================== */}
{screen === "revealImposters" && (
  <>
  <BackButton to="voteResults" />
    <Text style={styles.title}>{t("imposters")}</Text>

    {imposterIds.map(id => {
      const p = players.find(x => x.id === id);
      return <Text key={id} style={styles.resultText}>{p.name}</Text>;
    })}
        <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={() => {
        setCurrentImposterGuessIndex(0);
        setImposterWon(false);
        setScreen("imposterGuess");
        playSound("click");
      }}
    >
      <Text style={styles.buttonPrimaryText}>{t("chooseWord")}</Text>
    </TouchableOpacity>


  </>
)}
{screen === "imposterGuess" && (
  <View style={{ flex: 1 }}>
    <BackButton to="revealImposters" />
    <Text style={styles.title}>
      {t("imposterGuess")}
    </Text>

    <Text style={styles.info}>
      {t("PassPhone2")}{" "}
      {
        players.find(
          p => p.id === imposterIds[currentImposterGuessIndex]
        )?.name
      }
    </Text>

    <Text style={styles.subtitle}>
    {t("secretWord")} :
    </Text>

    <ScrollView>
      {categories[selectedCategory].words[language].map(word => (
        <TouchableOpacity
          key={word}
          style={styles.voteOption}
          onPress={() => {
            if (word === secretWord) {
              setImposterWon(true);
            }

            if (
              currentImposterGuessIndex + 1 <
              imposterIds.length
            ) {
              setCurrentImposterGuessIndex(i => i + 1);
            } else {
              playSound("win");
              setScreen("finalResult");
            }
          }}
        >
          <Text style={styles.voteText}>
            {word}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}

{/* ===================== final ===================== */}

{screen === "finalResult" && (
    <>
      <Text style={styles.title}>{t("gameResult")}</Text>
  
      <Text style={styles.resultText}>
  {imposterWon ? t("impostersWin") : t("playersWin")}
</Text>
  
      <Text style={styles.subtitle}>
      {t("secretWord")}: {secretWord}
      </Text>
  
      <Text style={[styles.baseText, { marginTop: 20 }]}>
        {t("imposters")}:
      </Text>
  
      {imposterIds.map(id => {
        const p = players.find(x => x.id === id);
        return (
          <Text key={id} style={styles.baseText}>
            {p?.name}
          </Text>
        );
      })}
  
      {/* SAME PLAYERS */}
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => {
          setVotes({});
          setSelectedVotes([]);
          setCurrentVoterIndex(0);
          setImposterIds([]);
          setCurrentRevealIndex(0);
          playSound("click");
          setCardFlipped(false);
          setCurrentImposterGuessIndex(0);
          setImposterWon(false);
          setScreen("category");
        }}
      >
        <Text style={styles.buttonPrimaryText}>
        {t("playAgain")}
        </Text>
      </TouchableOpacity>
  
      {/* NEW GAME */}
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => {
          setPlayers([]);
          setVotes({});
          setSelectedVotes([]);
          setCurrentVoterIndex(0);
          setImposterIds([]);
          setSecretWord(null);
          setSelectedCategory(null);
          setCurrentRevealIndex(0);
          setCardFlipped(false);
          setCurrentImposterGuessIndex(0);
          setImposterWon(false);
          setScreen("home");
        }}
      >
        <Text style={styles.t}>
        {t("newGame")}
        </Text>
      </TouchableOpacity>
    </>
  )}
  {screen === "about" && (
  <>
    <BackButton to="home" />
    <Text style={styles.title}>About</Text>

    <Text style={styles.info}>
      DAKHIL v{APP_VERSION}
    </Text>
    <TouchableOpacity>
      <Text style={styles.info}>

دخيل هي لعبة جماعية تعتمد على الملاحظة، النقاش، والخداع.

جميع اللاعبين يحصلون على نفس الكلمة السرية — باستثناء الدخلاء.
من خلال طرح الأسئلة والإجابات الذكية، على اللاعبين اكتشاف من لا يعرف الكلمة… قبل فوات الأوان.

اللعبة مثالية للأصدقاء والعائلة والجلسات الجماعية، وتشجع على التواصل، التفكير، والضحك.

كلمة واحدة.
كاذب واحد.
من هو الدخيل؟
      </Text>
    </TouchableOpacity>

    <TouchableOpacity>
      <Text style={styles.resultText}>
        GitHub: https://github.com/git-sal0/dakhil-game
      </Text>
    </TouchableOpacity>

    <TouchableOpacity>
      <Text style={styles.resultText}>
        dev: Salma.E.M
      </Text>
    </TouchableOpacity>
  </>
)}


    </View>
  );
}

  

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.bg
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },


  homeTagline: {
    textAlign: "center",
    color: COLORS.muted,
    marginBottom: SPACING.xl
  },

  subtitle: {
    textAlign: "center",
    fontSize: 20,
    color: COLORS.secondary,
    marginVertical: SPACING.md
  },

  baseText: {
    color: COLORS.text,
    fontSize: 18
  },

  resultText: {
    textAlign: "center",
    fontSize: 22,
    color: COLORS.text,
    marginVertical: 6
  },

  input: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    color: COLORS.text,
    fontSize: 18,
    marginBottom: SPACING.sm
  },

  addPlayerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md
  },

  playerRow: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  remove: {
    color: COLORS.danger,
    fontSize: 22
  },

  playerReveal: {
    fontSize: 26,
    textAlign: "center",
    color: COLORS.text,
    marginBottom: SPACING.md
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SPACING.xl,
    borderWidth: 3,
    borderColor: COLORS.primary
  },

  cardText: {
    fontSize: 36,
    color: COLORS.text,
    fontWeight: "900"
  },

  voteOption: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 22,
    marginVertical: 6,
    alignItems: "center"
  },

  voteSelected: {
    backgroundColor: COLORS.primary
  },

  voteText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: "900"
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    marginTop: SPACING.lg
  },

  buttonPrimaryText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
    textTransform: "uppercase"
  },

  buttonSecondary: {
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginVertical: 6,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },

  buttonSecondaryText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.secondary
  },

  buttonGhost: {
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginVertical: 6,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    marginBottom:30
  },

  buttonGhostText: {
    color: COLORS.muted,
  },
  info: {
    color: COLORS.muted,
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.35
  },
  homeTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg
  },
  
  langToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 4
  },
  
  langButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16
  },
  
  langActive: {
    backgroundColor: COLORS.primary
  },
  
  langText: {
    fontWeight: "900",
    color: COLORS.text
  },
  
  aboutMini: {
    fontSize: 22,
    color: COLORS.muted,
    padding: 6
  }
  
});
