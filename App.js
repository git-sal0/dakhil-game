import React, { useState } from "react";
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
const APP_VERSION = "0.9.0-beta";
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

  const [categories, setCategories] = useState({
    food: {
      label: {
        en: "Food",
        ar: "طعام"
      },
      words: {
        en: ["pizza", "burger", "apple", "rice"],
        ar: ["بيتزا", "برغر", "تفاح", "أرز"]
      }
    },
  
    animals: {
      label: {
        en: "Animals",
        ar: "حيوانات"
      },
      words: {
        en: ["cat", "dog", "lion", "cow"],
        ar: ["قط", "كلب", "أسد", "بقرة"]
      }
    },
  
    clothes: {
      label: {
        en: "Clothes",
        ar: "ملابس"
      },
      words: {
        en: ["shirt", "pants", "skirt", "jacket"],
        ar: ["قميص", "بنطال", "تنورة", "سترة"]
      }
    }
  });
  

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
  
  function addCustomCategory() {
    const words = customWordsText.split(",").map(w => w.trim()).filter(Boolean);
    if (!customCategoryName || words.length < 3) return;
    setCategories(prev => ({
        ...prev,
        [customCategoryName]: {
          label: {
            en: customCategoryName,
            ar: customCategoryName
          },
          words: {
            [language]: words
          }
        }
      }));
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
    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
  <TouchableOpacity
    style={styles.buttonSecondary}
    onPress={() => switchLanguage("en")}
  >
    <Text style={styles.buttonSecondaryText}>EN</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.buttonSecondary, { marginLeft: 10 }]}
    onPress={() => switchLanguage("ar")}
  >
    <Text style={styles.buttonSecondaryText}>AR</Text>
  </TouchableOpacity>
</View>

<Text style={styles.title}>{t("title")}</Text>
<Text style={styles.homeTagline}>
  {t("tagline")}
</Text>

    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={() => setScreen("setup")}
    >
<Text style={styles.buttonPrimaryText}>
  {t("startGame")}
</Text>
    </TouchableOpacity>
    <Text style={{ color: "#888", fontSize: 12, textAlign: "center" ,marginTop:60}}>
  DAKHIL v0.9.0 (Beta)
</Text>

  </View>
)}

{/* ===================== SETUP ===================== */}
{screen === "setup" && (
  <>
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
      onPress={() => setScreen("category")}
    >
      <Text style={styles.buttonPrimaryText}>{t("continue")}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.buttonGhost}
      onPress={() => setScreen("home")}
    >
      <Text style={styles.buttonGhostText}>{t("back")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== CATEGORY ===================== */}
{screen === "category" && (
  <ScrollView>
    <Text style={styles.title}>{t("chooseCategory")}</Text>

    {Object.entries(categories).map(([key, cat]) => (
        <TouchableOpacity
        key={key}
        style={styles.buttonSecondary}
        onPress={() =>
            chooseCategory(
            key,
            cat.words[language]   // 👈 language-specific words
            )
        }
        >
        <Text style={styles.buttonSecondaryText}>
            {cat.label[language]}
        </Text>
        </TouchableOpacity>
    ))}


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
      onPress={() => setScreen("setup")}
    >
      <Text style={styles.buttonGhostText}>{t("back")}</Text>
    </TouchableOpacity>
  </ScrollView>
)}

{/* ===================== IMPOSTER CONFIG ===================== */}
{screen === "imposterConfig" && (
  <>
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
          onPress={() => setCardFlipped(!cardFlipped)}
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
        onPress={() => setScreen("discussion")}
      >
        <Text style={styles.buttonPrimaryText}>{t("StartDiscussion")}</Text>
      </TouchableOpacity>
    )}
  </>
)}

{/* ===================== DISCUSSION ===================== */}
{screen === "discussion" && (
  <>
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
      }}
    >
      <Text style={styles.buttonPrimaryText}>{t("StartVoting")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== VOTING ===================== */}
{screen === "voting" && (
  <>
    <Text style={styles.title}>
    {t("PassPhone2")}  {players[currentVoterIndex].name}
    </Text>

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

    <TouchableOpacity
      style={[
        styles.buttonPrimary,
        selectedVotes.length !== impostersCount && styles.buttonDisabled
      ]}
      disabled={selectedVotes.length !== impostersCount}
      onPress={confirmVote}
    >
      <Text style={styles.buttonPrimaryText}>{t("confirmVote")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== RESULTS ===================== */}
{screen === "voteResults" && (
  <>
    <Text style={styles.title}>{t("results")}</Text>
    {getTopVoted().map((v, i) => (
      <Text key={i} style={styles.resultText}>
        {v.player.name}: {v.count}
      </Text>
    ))}

    

    <TouchableOpacity
      style={styles.buttonPrimary}
      onPress={() => setScreen("revealImposters")}
    >
    <Text style={styles.buttonPrimaryText}>{t("revealImposter")}</Text>
    </TouchableOpacity>
  </>
)}

{/* ===================== Imposter reveal ===================== */}
{screen === "revealImposters" && (
  <>
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
      }}
    >
      <Text style={styles.buttonPrimaryText}>{t("chooseWord")}</Text>
    </TouchableOpacity>


  </>
)}
{screen === "imposterGuess" && (
  <View style={{ flex: 1 }}>
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
  }
});
