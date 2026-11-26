import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Animated,
  Easing,
  I18nManager,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

/* ===================== CONSTANTS ===================== */
const APP_VERSION = "0.9.1-beta";

const SERIF = Platform.select({ ios: "Georgia", default: "serif" });
const TYPEWRITER = Platform.select({ ios: "American Typewriter", default: "serif" });
const MONO = Platform.select({ ios: "Menlo", default: "monospace" });

const THEMES = {
  dark: {
    dark: true,
    bg: "#0F1226",
    card: "#1B1F3B",
    cardAlt: "#252A52",
    border: "#2E3466",
    primary: "#FF3D81",
    primaryDark: "#B5205A",
    secondary: "#4DD0E1",
    secondaryDark: "#2A8C99",
    text: "#FFFFFF",
    muted: "#AAB0FF",
    success: "#4CAF50",
    danger: "#FF5252",
    dangerDark: "#B53030",
    onPrimary: "#FFFFFF",
    onSecondary: "#0F1226",
    onAccent: "#FFFFFF"
  },
  light: {
    dark: false,
    bg: "#F1F2FA",
    card: "#FFFFFF",
    cardAlt: "#E8EAF8",
    border: "#D3D7EE",
    primary: "#E91E63",
    primaryDark: "#A8124A",
    secondary: "#0097A7",
    secondaryDark: "#006874",
    text: "#1B1F3B",
    muted: "#5C63A8",
    success: "#2E7D32",
    danger: "#D32F2F",
    dangerDark: "#9A1F1F",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onAccent: "#FFFFFF"
  },

  /* ---------- secret themes (unlocked from the About screen) ---------- */

  // warm, slowly swirling paint pool with drifting embers
  hearth: {
    dark: true,
    fx: "hearth",
    name: { en: "Hearth", ar: "الموقد" },
    bg: "#2A1610",
    card: "rgba(48,27,19,0.80)",
    solid: "#34200F",
    cardAlt: "#4A2A1B",
    border: "rgba(255,200,130,0.20)",
    primary: "#F0A03C",
    primaryDark: "#B56A1A",
    secondary: "#86C9B4",
    secondaryDark: "#4E8F7C",
    text: "#FFF0DA",
    muted: "#DDB894",
    success: "#9BC96B",
    danger: "#F26B4F",
    dangerDark: "#A83A26",
    onPrimary: "#2A1408",
    onSecondary: "#1E1410",
    onAccent: "#2A1408",
    avatars: ["#E8A33D", "#C8502A", "#8FB996", "#D98E73", "#E6C79C", "#5B9A8B", "#B5651D", "#D4A5A5", "#9C6644", "#F0D58C"]
  },

  // fog, ash, a failing light
  hollow: {
    dark: true,
    fx: "hollow",
    font: SERIF,
    name: { en: "Hollow", ar: "الجوف" },
    bg: "#0D0E0F",
    card: "rgba(22,24,25,0.84)",
    solid: "#171919",
    cardAlt: "#242728",
    border: "rgba(190,190,178,0.14)",
    primary: "#9A4331",
    primaryDark: "#5E2418",
    secondary: "#8E9A94",
    secondaryDark: "#566059",
    text: "#D4D1C6",
    muted: "#8D8B82",
    success: "#7E9B7A",
    danger: "#B8452F",
    dangerDark: "#6F2415",
    onPrimary: "#EDE6D8",
    onSecondary: "#0D0E0F",
    onAccent: "#EDE6D8",
    avatars: ["#8E9A94", "#A89F91", "#7A8B99", "#9B7E6E", "#8C8F7A", "#A58A8A", "#6F8280", "#B1A99A", "#7D7468", "#94A3A0"]
  },

  // newsprint zine: flat ink, hard shadows, halftone dots
  riso: {
    dark: false,
    fx: "riso",
    hard: true,
    font: TYPEWRITER,
    name: { en: "Riso", ar: "حبر" },
    bg: "#F2EBDD",
    card: "#FBF7EE",
    cardAlt: "#EADFC9",
    border: "#1F1A17",
    primary: "#E8472B",
    primaryDark: "#1F1A17",
    secondary: "#2B5BA8",
    secondaryDark: "#1F1A17",
    text: "#1F1A17",
    muted: "#6B5E52",
    success: "#2F7D4F",
    danger: "#C62828",
    dangerDark: "#1F1A17",
    onPrimary: "#FFF8EC",
    onSecondary: "#FFF8EC",
    onAccent: "#FFF8EC",
    avatars: ["#E8472B", "#2B5BA8", "#F2B632", "#2F8F6B", "#E58AA6", "#7A4FA0", "#F28C28", "#3AA6B9", "#8C6A4B", "#1F1A17"]
  },

  // deep water: light shafts and rising bubbles
  abyss: {
    dark: true,
    fx: "abyss",
    name: { en: "Abyss", ar: "الأعماق" },
    bg: "#061C26",
    card: "rgba(9,45,58,0.76)",
    solid: "#0A2E3B",
    cardAlt: "#0E4656",
    border: "rgba(150,230,225,0.18)",
    primary: "#FF8E72",
    primaryDark: "#C25A40",
    secondary: "#8FD9C9",
    secondaryDark: "#4FA391",
    text: "#E3F5F1",
    muted: "#8DBFC0",
    success: "#7FD99A",
    danger: "#FF6B6B",
    dangerDark: "#B03A3A",
    onPrimary: "#2B0F08",
    onSecondary: "#06222B",
    onAccent: "#2B0F08",
    avatars: ["#FF8E72", "#8FD9C9", "#F6D58E", "#6FB7E9", "#C9A7EB", "#7FD99A", "#F2A7C3", "#4FC3C7", "#FFB86B", "#A5C8E4"]
  },

  // amber phosphor terminal: scanlines and a rolling refresh bar
  classified: {
    dark: true,
    fx: "crt",
    font: MONO,
    name: { en: "Classified", ar: "سري" },
    bg: "#0B0A06",
    card: "#15110A",
    cardAlt: "#281F0A",
    border: "rgba(255,176,0,0.30)",
    primary: "#FFB000",
    primaryDark: "#9A6A00",
    secondary: "#D9A441",
    secondaryDark: "#7A5A1C",
    text: "#FFE3A3",
    muted: "#B58A3A",
    success: "#8BE07A",
    danger: "#FF5A3D",
    dangerDark: "#99301F",
    onPrimary: "#1A1200",
    onSecondary: "#1A1200",
    onAccent: "#1A1200",
    avatars: ["#FFB000", "#E8A21A", "#D9A441", "#C98B2E", "#FFCF5A", "#B58A3A", "#F2C14E", "#9C7A2C", "#FFE08A", "#8C6B1F"]
  },

  // bright shallow water: lots of bubbles, sun on the surface, fish passing by
  reef: {
    dark: true,
    fx: "reef",
    name: { en: "Reef", ar: "الشعاب" },
    bg: "#0A7C93",
    card: "rgba(7,72,94,0.62)",
    solid: "#0B5A73",
    cardAlt: "#0C6A85",
    border: "rgba(210,255,250,0.30)",
    primary: "#FF9A62",
    primaryDark: "#C4602C",
    secondary: "#BDF5EA",
    secondaryDark: "#6FBFB2",
    text: "#F2FFFD",
    muted: "#B2E8E4",
    success: "#8BE8A8",
    danger: "#FF6B6B",
    dangerDark: "#B03A3A",
    onPrimary: "#3A1608",
    onSecondary: "#07485E",
    onAccent: "#3A1608",
    avatars: ["#FF9A62", "#FFD25E", "#BDF5EA", "#FF8FA3", "#8BE8A8", "#A9C8FF", "#FFB3E1", "#7FE0E8", "#F7C59F", "#D5F28C"]
  },

  // night sky, crescent, swaying lanterns, gold and mint
  ramadan: {
    dark: true,
    fx: "ramadan",
    name: { en: "Ramadan", ar: "رمضان" },
    bg: "#0B1030",
    card: "rgba(20,26,70,0.78)",
    solid: "#151B4A",
    cardAlt: "#1E2760",
    border: "rgba(240,200,110,0.26)",
    primary: "#E9B949",
    primaryDark: "#A67C1C",
    secondary: "#7FD1C5",
    secondaryDark: "#3F9A8E",
    text: "#FFF6DD",
    muted: "#B8B6DE",
    success: "#6FCF97",
    danger: "#F0685A",
    dangerDark: "#A33A30",
    onPrimary: "#1A1330",
    onSecondary: "#0B1030",
    onAccent: "#1A1330",
    avatars: ["#E9B949", "#7FD1C5", "#E58AA6", "#6FCF97", "#A99BE8", "#F2D28B", "#5DB7C9", "#D9825B", "#B8D98A", "#C9A7EB"]
  }
};

const SECRET_THEMES = ["hearth", "hollow", "riso", "abyss", "classified", "reef", "ramadan"];

const SPACING = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 };

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

// screen -> where the Back button goes
const BACK = {
  setup: "home",
  gameType: "setup",
  mafiaConfig: "gameType",
  category: "gameType",
  editCategory: "category",
  imposterConfig: "category",
  discussion: "reveal",
  voting: "discussion",
  voteResults: "voting",
  revealImposters: "voteResults",
  imposterGuess: "revealImposters",
  about: "home"
};

const TEXT = {
  en: {
    title: "DAKHIL",
    tagline: "One word. One liar.",
    startGame: "Start Game",
    addPlayers: "Add Players",
    addPlayer: "Add Player",
    playerName: "Player Name",
    continue: "Continue",
    back: "Back",
    results: "Results",
    chooseCategory: "Choose Category",
    customCategory: "Or Custom Category",
    categoryName: "Category Name",
    categoryWords: "Words (separate with , ، - _ or space)",
    createStart: "Create and Start",
    discussion: "Discussion",
    discussionInfo: "Discuss who the imposters are.",
    StartVoting: "Start Voting",
    votingResults: "Voting Results",
    revealResult: "Reveal Result",
    revealImposter: "Reveal Imposter",
    impostersWin: "IMPOSTERS WIN",
    playersWin: "PLAYERS WIN",
    playAgain: "Play Again (Same Group)",
    newGame: "New Game",
    confirm: "Confirm",
    confirmVote: "Confirm Vote",
    tapToFlip: "Tap to Flip",
    secretWord: "Secret word",
    imposters: "Imposters",
    imposter: "Imposter",
    ConfirmStart: "Confirm and Start",
    PassPhone2: "Pass Phone to",
    URIm: "You Are Imposter",
    StartDiscussion: "Start Discussion",
    chooseWord: "Choose Word",
    imposterGuess: "What's the Word ?",
    gameResult: "Game Result",
    home: "Home",
    goHome: "Back to Home",
    keepTeam: "Keep the team?",
    yes: "Yes",
    no: "No",
    gameMode: "Game Mode",
    classicMode: "Classic",
    classicInfo: "Imposters don't get a word and know they are the imposters.",
    agentMode: "Secret Agent",
    agentInfo: "The imposter gets a different word and doesn't know they are the imposter.",
    imposterWord: "Imposter's word",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    editCategory: "Edit Word List",
    needName: "Enter a category name.",
    needWords: "Add at least 3 different words.",
    nameTaken: "A category with this name already exists.",
    deleteCategoryTitle: "Delete Category",
    deleteCategoryMsg: "This category will be permanently deleted.",
    quickGroups: "Quick Groups",
    playerN: "Player",
    players: "players",
    savedTeams: "Saved Teams",
    teamName: "Team name",
    saveTeam: "Save This Team",
    deleteTeamTitle: "Delete Team",
    deleteTeamMsg: "This saved team will be deleted.",
    about: "About",
    wordsCount: "words",
    chooseCharacter: "Choose Color",
    tapAvatar: "Tap an avatar to change its color",
    voteFor: "Pick the imposter",
    votesWord: "votes",
    yourTeam: "Your Team"
  },

  ar: {
    title: "دخيل",
    tagline: "كلمة واحدة. كاذب واحد.",
    startGame: "ابدأ اللعبة",
    addPlayers: "إضافة لاعبين",
    addPlayer: "إضافة لاعب",
    playerName: "اسم اللاعب",
    continue: "متابعة",
    back: "رجوع",
    results: "النتيجة",
    chooseCategory: "اختر الفئة",
    customCategory: "او فئة خاصة",
    categoryName: "اسم الفئة",
    categoryWords: "الكلمات (افصل بينها بـ , أو ، أو - أو _ أو مسافة)",
    createStart: "العب بهذه الفئة",
    discussion: "نقاش",
    discussionInfo:
      "قوموا بطرح اسئلة على بعضكم البعض لمحاولة اكتشاف الدخيل. الاسئلة يجب الا تكشف عن الكلمة",
    StartVoting: "ابدأ التصويت",
    votingResults: "نتائج التصويت",
    revealResult: "كشف النتيجة",
    revealImposter: "كشف الدخلاء",
    impostersWin: "الدخلاء فازوا",
    playersWin: "اللاعبون فازوا",
    playAgain: "إعادة اللعب (نفس المجموعة)",
    newGame: "لعبة جديدة",
    confirm: "تأكيد",
    confirmVote: "تأكيد التصويت",
    tapToFlip: "اضغط للكشف",
    secretWord: "الكلمة السرية",
    imposters: "الدخلاء",
    imposter: "دخيل",
    ConfirmStart: "تاكيد و بدأ",
    PassPhone2: "اعطي الهاتف ل",
    URIm: "انت الدخيل",
    StartDiscussion: "ابدأ النقاش",
    chooseWord: "اختر الكلمة",
    imposterGuess: "ما هي الكلمة ؟",
    gameResult: "النتائج",
    home: "الرئيسية",
    goHome: "العودة للرئيسية",
    keepTeam: "هل تريد الاحتفاظ بالفريق؟",
    yes: "نعم",
    no: "لا",
    gameMode: "نمط اللعب",
    classicMode: "كلاسيكي",
    classicInfo: "الدخيل لا يحصل على كلمة ويعلم أنه الدخيل.",
    agentMode: "العميل السري",
    agentInfo: "يحصل الدخيل على كلمة مختلفة ولا يعلم أنه الدخيل.",
    imposterWord: "كلمة الدخيل",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    editCategory: "تعديل قائمة الكلمات",
    needName: "اكتب اسم الفئة.",
    needWords: "أضف 3 كلمات مختلفة على الأقل.",
    nameTaken: "توجد فئة بنفس هذا الاسم.",
    deleteCategoryTitle: "حذف الفئة",
    deleteCategoryMsg: "سيتم حذف هذه الفئة نهائيا.",
    quickGroups: "مجموعات جاهزة",
    playerN: "لاعب",
    players: "لاعبين",
    savedTeams: "الفرق المحفوظة",
    teamName: "اسم الفريق",
    saveTeam: "احفظ هذا الفريق",
    deleteTeamTitle: "حذف الفريق",
    deleteTeamMsg: "سيتم حذف هذا الفريق المحفوظ.",
    about: "حول",
    wordsCount: "كلمات",
    chooseCharacter: "اختر اللون",
    tapAvatar: "اضغط على الصورة لتغيير لونها",
    voteFor: "اختر الدخيل",
    votesWord: "أصوات",
    yourTeam: "فريقك"
  }
};

const sounds = {
  click: require("./sounds/click.mp3"),
  flip: require("./sounds/flip.mp3"),
  next: require("./sounds/next.mp3"),
  start: require("./sounds/start.mp3"),
  win: require("./sounds/win.mp3")
};

/* ===================== AVATARS (color + first letter) ===================== */

const AVATAR_COLORS = [
  "#FFB74D", "#81C784", "#64B5F6", "#BA68C8", "#F48FB1",
  "#FFD54F", "#4DB6AC", "#A1887F", "#90A4AE", "#E57373"
];

// lets Avatar / Mark pick up the current theme without prop drilling
const ThemeCtx = React.createContext({ palette: AVATAR_COLORS, colors: THEMES.dark });

function inkOn(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#1E1612" : "#FFFFFF";
}

function firstLetter(name) {
  const ch = Array.from((name || "").trim())[0];
  return ch ? ch.toUpperCase() : "?";
}

function Avatar({ id = 0, name = "", size = 64 }) {
  const { palette } = React.useContext(ThemeCtx);
  const bg = palette[((id % palette.length) + palette.length) % palette.length];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: Math.max(1.5, size * 0.04),
        borderColor: "rgba(0,0,0,0.16)"
      }}
    >
      <Text
        style={{
          color: inkOn(bg),
          fontSize: size * 0.46,
          fontWeight: "900",
          includeFontPadding: false
        }}
      >
        {firstLetter(name)}
      </Text>
    </View>
  );
}

// non-player badges: spy "?", imposter "!", win tick
function Mark({ kind = "spy", size = 64 }) {
  const { colors } = React.useContext(ThemeCtx);
  const bad = kind === "imposter";
  const win = kind === "win";
  const bg = bad ? colors.danger : win ? colors.success : colors.primary;
  const edge = bad ? colors.dangerDark : win ? colors.success : colors.primaryDark;
  const fg = bad || win ? "#FFFFFF" : colors.onPrimary;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: size * 0.05,
        borderColor: edge
      }}
    >
      {win ? (
        <Icon name="check" size={size * 0.5} color={fg} />
      ) : (
        <Text style={{ color: fg, fontSize: size * 0.58, fontWeight: "900", includeFontPadding: false }}>
          {bad ? "!" : "?"}
        </Text>
      )}
    </View>
  );
}

/* ===================== MOTION HELPERS ===================== */

const FILL = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" };

// deterministic pseudo-random so particles don't jump on re-render
const rnd = (i, s = 1) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// 0 -> 1 loop on the native thread. alternate = ping-pong (smooth sway)
function useLoop(duration, { alternate = true, delay = 0 } = {}) {
  const v = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const native = { useNativeDriver: true };
    const body = alternate
      ? Animated.sequence([
          Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), ...native }),
          Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), ...native })
        ])
      : Animated.timing(v, { toValue: 1, duration, easing: Easing.linear, ...native });
    const anim = Animated.sequence([Animated.delay(delay), Animated.loop(body)]);
    anim.start();
    return () => anim.stop();
  }, []);
  return v;
}

// fake radial gradient: stacked circles, cached as one texture
const SoftBlob = React.memo(function SoftBlob({ d, color, op = 0.5, layers = 10, squash = 1 }) {
  const a = 1 - Math.pow(1 - op, 1 / layers);
  return (
    <View
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      style={{ width: d, height: d, transform: [{ scaleY: squash }] }}
    >
      {Array.from({ length: layers }, (_, i) => {
        const s = d * (1 - (i / layers) * 0.85);
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: (d - s) / 2,
              top: (d - s) / 2,
              width: s,
              height: s,
              borderRadius: s / 2,
              backgroundColor: color,
              opacity: a
            }}
          />
        );
      })}
    </View>
  );
});

function Vignette({ color = "#000", strength = 0.5, steps = 9 }) {
  const { width: W, height: H } = useWindowDimensions();
  const a = 1 - Math.pow(1 - strength, 1 / steps);
  const out = [];
  for (let i = 0; i < steps; i++) {
    const f = (i + 1) / steps;
    const tv = H * 0.2 * f;
    const th = W * 0.28 * f;
    const base = { position: "absolute", backgroundColor: color, opacity: a };
    out.push(
      <View key={"t" + i} style={[base, { top: 0, left: 0, right: 0, height: tv }]} />,
      <View key={"b" + i} style={[base, { bottom: 0, left: 0, right: 0, height: tv }]} />,
      <View key={"l" + i} style={[base, { left: 0, top: 0, bottom: 0, width: th }]} />,
      <View key={"r" + i} style={[base, { right: 0, top: 0, bottom: 0, width: th }]} />
    );
  }
  return <View pointerEvents="none" style={FILL}>{out}</View>;
}

// slow irregular dip, like a failing light (gap scales the quiet time)
function Flicker({ color = "#000", max = 0.2, gap = 1 }) {
  const v = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const to = (val, ms) => Animated.timing(v, { toValue: val, duration: ms, useNativeDriver: true });
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(3200 * gap), to(max, 70), to(0, 60), to(max * 0.8, 50), to(0, 140),
        Animated.delay(5200 * gap), to(max * 0.5, 220), to(0, 400),
        Animated.delay(8000 * gap)
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return <Animated.View pointerEvents="none" style={[FILL, { backgroundColor: color, opacity: v }]} />;
}

function Particle({ i, W, H, color, up, ring, minS, maxS, minD, maxD, sway, peak }) {
  const size = minS + rnd(i, 1) * (maxS - minS);
  const dur = (minD + rnd(i, 2) * (maxD - minD)) * 1000;
  const v = useLoop(dur, { alternate: false, delay: rnd(i, 3) * dur });
  const travel = H * (0.55 + rnd(i, 5) * 0.5);
  const amp = sway * (0.5 + rnd(i, 6));
  const top = up ? H - 6 : -size - 6;
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: rnd(i, 4) * W,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: ring ? "transparent" : color,
        borderWidth: ring ? 1 : 0,
        borderColor: color,
        opacity: v.interpolate({
          inputRange: [0, 0.15, 0.8, 1],
          outputRange: [0, peak * (0.5 + rnd(i, 7) * 0.5), peak * 0.5, 0]
        }),
        transform: [
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: up ? [0, -travel] : [0, travel] }) },
          { translateX: v.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, amp, 0, -amp, 0] }) }
        ]
      }}
    />
  );
}

function Particles({ count, ...p }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Particle key={i} i={i} {...p} />
      ))}
    </>
  );
}

function Drift({ cx, cy, d, color, op, dur, amp, squash = 1 }) {
  const a = useLoop(dur);
  const b = useLoop(dur * 1.37);
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: cx - d / 2,
        top: cy - d / 2,
        transform: [
          { translateX: a.interpolate({ inputRange: [0, 1], outputRange: [-amp, amp] }) },
          { translateY: b.interpolate({ inputRange: [0, 1], outputRange: [amp * 0.8, -amp * 0.8] }) }
        ]
      }}
    >
      <SoftBlob d={d} color={color} op={op} squash={squash} />
    </Animated.View>
  );
}

/* ===================== THEME: HEARTH ===================== */
// two counter-rotating paint pools (teal against brick and amber), plus rising embers

function HearthBack({ W, H }) {
  const S = Math.max(W, H) * 1.7;
  const c = S / 2;
  const r1 = useLoop(120000, { alternate: false }).interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const r2 = useLoop(90000, { alternate: false }).interpolate({ inputRange: [0, 1], outputRange: ["360deg", "0deg"] });
  const at = (deg, rad) => ({
    cx: c + Math.cos((deg * Math.PI) / 180) * rad,
    cy: c + Math.sin((deg * Math.PI) / 180) * rad
  });
  const box = { position: "absolute", width: S, height: S, left: (W - S) / 2, top: (H - S) / 2 };
  return (
    <>
      <Animated.View style={[box, { transform: [{ rotate: r1 }] }]}>
        <Drift {...at(20, S * 0.2)} d={S * 0.55} color="#C2512C" op={0.6} dur={16000} amp={S * 0.05} />
        <Drift {...at(140, S * 0.22)} d={S * 0.45} color="#E9A23B" op={0.45} dur={21000} amp={S * 0.05} squash={0.7} />
        <Drift {...at(255, S * 0.2)} d={S * 0.55} color="#1D5E5A" op={0.65} dur={18000} amp={S * 0.06} />
        <Drift cx={c} cy={c} d={S * 0.3} color="#7A2B3A" op={0.5} dur={24000} amp={S * 0.04} />
      </Animated.View>
      <Animated.View style={[box, { transform: [{ rotate: r2 }] }]}>
        <Drift {...at(70, S * 0.3)} d={S * 0.28} color="#F6DDA6" op={0.16} dur={19000} amp={S * 0.03} />
        <Drift {...at(200, S * 0.28)} d={S * 0.34} color="#D9622B" op={0.28} dur={23000} amp={S * 0.04} />
        <Drift {...at(310, S * 0.26)} d={S * 0.3} color="#2E8F86" op={0.25} dur={17000} amp={S * 0.04} />
      </Animated.View>
      <Particles count={16} W={W} H={H} color="#FFB35C" up minS={2} maxS={5} minD={9} maxD={18} sway={18} peak={0.8} />
      <Vignette color="#140805" strength={0.6} />
    </>
  );
}

/* ===================== THEME: HOLLOW ===================== */
// drifting fog banks, falling ash, a dying red glow, a light that sometimes fails

function FogBank({ W, H, y, w, sq, op, dur, amp, color = "#AEB4AF" }) {
  const v = useLoop(dur);
  const bw = W * w;
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: (W - bw) / 2,
        top: H * y - bw / 2,
        transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [-amp, amp] }) }]
      }}
    >
      <SoftBlob d={bw} color={color} op={op} squash={sq} />
    </Animated.View>
  );
}

function Siren({ W, H }) {
  const v = useLoop(4200);
  const d = W * 1.3;
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: -W * 0.35,
        top: H * 0.78 - d / 2,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] })
      }}
    >
      <SoftBlob d={d} color="#7A2A18" op={0.3} squash={0.8} />
    </Animated.View>
  );
}

function HollowBack({ W, H }) {
  return (
    <>
      <Siren W={W} H={H} />
      <FogBank W={W} H={H} y={0.1} w={2.0} sq={0.22} op={0.1} dur={40000} amp={W * 0.25} />
      <FogBank W={W} H={H} y={0.33} w={2.2} sq={0.2} op={0.12} dur={52000} amp={W * 0.3} />
      <FogBank W={W} H={H} y={0.58} w={2.0} sq={0.24} op={0.12} dur={36000} amp={W * 0.25} />
      <FogBank W={W} H={H} y={0.84} w={2.3} sq={0.26} op={0.2} dur={58000} amp={W * 0.3} />
      <Particles count={18} W={W} H={H} color="#BDB9AE" up={false} minS={1.5} maxS={3.5} minD={14} maxD={26} sway={14} peak={0.45} />
      <Vignette color="#000" strength={0.75} />
    </>
  );
}

function HollowFront({ W, H }) {
  return (
    <>
      <FogBank W={W} H={H} y={0.3} w={2.2} sq={0.22} op={0.05} dur={47000} amp={W * 0.3} />
      <FogBank W={W} H={H} y={0.72} w={2.4} sq={0.24} op={0.06} dur={61000} amp={W * 0.3} />
      <Flicker color="#000" max={0.2} />
    </>
  );
}

/* ===================== THEME: RISO ===================== */

function Halftone({ color, style, rows = 6, cols = 6, gap = 13, max = 9 }) {
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = 1 - (r + c) / (rows + cols - 2);
      const s = Math.max(1.5, max * t);
      dots.push(
        <View
          key={r + "-" + c}
          style={{
            position: "absolute",
            left: c * gap + (max - s) / 2,
            top: r * gap + (max - s) / 2,
            width: s,
            height: s,
            borderRadius: s / 2,
            backgroundColor: color
          }}
        />
      );
    }
  }
  return (
    <View style={[{ position: "absolute", width: cols * gap, height: rows * gap, opacity: 0.4 }, style]}>
      {dots}
    </View>
  );
}

function RisoBack({ W, H }) {
  const d = W * 0.8;
  return (
    <>
      {/* two misregistered ink discs */}
      <View style={{ position: "absolute", left: -W * 0.25, top: -W * 0.2, width: d, height: d, borderRadius: d / 2, backgroundColor: "#E8472B", opacity: 0.1 }} />
      <View style={{ position: "absolute", left: -W * 0.18, top: -W * 0.13, width: d, height: d, borderRadius: d / 2, backgroundColor: "#2B5BA8", opacity: 0.08 }} />
      <Halftone color="#E8472B" style={{ top: 16, right: 12, transform: [{ scaleX: -1 }] }} />
      <Halftone color="#2B5BA8" style={{ bottom: 16, left: 12, transform: [{ scaleY: -1 }] }} />
    </>
  );
}

/* ===================== THEME: ABYSS ===================== */

function Ray({ x, w, H, rot, dur, op }) {
  const v = useLoop(dur);
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: -H * 0.2,
        width: w,
        height: H * 1.5,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [op * 0.5, op] }),
        transform: [
          { rotate: v.interpolate({ inputRange: [0, 1], outputRange: [rot - 4 + "deg", rot + 4 + "deg"] }) }
        ]
      }}
    >
      {[1, 0.62, 0.3].map((k, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: (w * (1 - k)) / 2,
            width: w * k,
            backgroundColor: "#CFFFF4",
            opacity: 0.5
          }}
        />
      ))}
    </Animated.View>
  );
}

function SurfaceGlow({ W, H }) {
  const v = useLoop(7000);
  const d = W * 1.8;
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: (W - d) / 2,
        top: H * 0.02 - d / 2,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] })
      }}
    >
      <SoftBlob d={d} color="#3AA8A6" op={0.32} squash={0.55} />
    </Animated.View>
  );
}

function AbyssBack({ W, H }) {
  return (
    <>
      <SurfaceGlow W={W} H={H} />
      <Ray x={W * 0.05} w={W * 0.22} H={H} rot={14} dur={11000} op={0.12} />
      <Ray x={W * 0.38} w={W * 0.3} H={H} rot={18} dur={13000} op={0.09} />
      <Ray x={W * 0.7} w={W * 0.2} H={H} rot={12} dur={9500} op={0.11} />
      <Particles count={14} W={W} H={H} color="#BFEFEA" ring up minS={4} maxS={13} minD={9} maxD={19} sway={14} peak={0.55} />
      <Vignette color="#02090D" strength={0.6} />
    </>
  );
}

/* ===================== THEME: CLASSIFIED (CRT) ===================== */

function CrtFront({ W, H }) {
  const gap = 6;
  const n = Math.ceil(H / gap);
  const v = useLoop(8000, { alternate: false });
  const bandH = H * 0.22;
  return (
    <>
      <View
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
        style={[FILL, { opacity: 0.16 }]}
      >
        {Array.from({ length: n }, (_, i) => (
          <View key={i} style={{ position: "absolute", left: 0, right: 0, top: i * gap, height: 2, backgroundColor: "#000" }} />
        ))}
      </View>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: bandH,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-H * 0.3, H * 1.1] }) }]
        }}
      >
        {[1, 0.6, 0.25].map((k, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (bandH * (1 - k)) / 2,
              height: bandH * k,
              backgroundColor: "#FFB000",
              opacity: 0.03
            }}
          />
        ))}
      </Animated.View>
      <Flicker color="#FFB000" max={0.05} gap={0.5} />
      <Vignette color="#000" strength={0.6} />
    </>
  );
}

/* ===================== THEME: REEF ===================== */
// shiny bubbles of every size, sunlit surface, caustic light, fish drifting through

function Bubble({ i, W, H }) {
  const size = 6 + Math.pow(rnd(i, 1), 2) * 34; // many small, a few big
  const dur = (8 + rnd(i, 2) * 12) * (size > 22 ? 0.85 : 1) * 1000;
  const v = useLoop(dur, { alternate: false, delay: rnd(i, 3) * dur });
  const amp = 8 + rnd(i, 6) * 22;
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: rnd(i, 4) * W,
        top: H + 4,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.2,
        borderColor: "rgba(235,255,252,0.85)",
        backgroundColor: "rgba(255,255,255,0.07)",
        opacity: v.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 0.9, 0.8, 0] }),
        transform: [
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -H * 1.1] }) },
          { translateX: v.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, amp, 0, -amp, 0] }) }
        ]
      }}
    >
      <View
        style={{
          position: "absolute",
          left: size * 0.2,
          top: size * 0.16,
          width: size * 0.24,
          height: size * 0.24,
          borderRadius: size * 0.12,
          backgroundColor: "#FFFFFF",
          opacity: 0.85
        }}
      />
    </Animated.View>
  );
}

function Fish({ W, y, size, color, dur, dir, delay, op }) {
  const v = useLoop(dur, { alternate: false, delay });
  const bob = useLoop(2600 + size * 20);
  const bw = size;
  const bh = size * 0.55;
  const tw = size * 0.4;
  const from = dir > 0 ? -size * 2 : W + size;
  const to = dir > 0 ? W + size : -size * 2;
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: y,
        left: 0,
        opacity: op,
        transform: [
          { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [from, to] }) },
          { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] }) },
          { scaleX: dir }
        ]
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 0,
            height: 0,
            borderTopWidth: bh * 0.5,
            borderBottomWidth: bh * 0.5,
            borderLeftWidth: tw,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: color,
            marginRight: -1
          }}
        />
        <View style={{ width: bw, height: bh, borderRadius: bh / 2, backgroundColor: color, overflow: "hidden" }}>
          <View style={{ position: "absolute", left: bw * 0.34, top: 0, bottom: 0, width: bw * 0.07, backgroundColor: "rgba(255,255,255,0.35)" }} />
          <View style={{ position: "absolute", right: bw * 0.16, top: bh * 0.28, width: bh * 0.16, height: bh * 0.16, borderRadius: bh * 0.08, backgroundColor: "#0B2F3B" }} />
        </View>
      </View>
    </Animated.View>
  );
}

function ReefBack({ W, H }) {
  return (
    <>
      <FogBank W={W} H={H} y={0.02} w={2.4} sq={0.7} op={0.38} dur={16000} amp={W * 0.1} color="#6FEFE0" />
      <Drift cx={W * 0.25} cy={H * 0.3} d={W * 1.0} color="#9FF1E8" op={0.14} dur={19000} amp={W * 0.12} />
      <Drift cx={W * 0.8} cy={H * 0.55} d={W * 0.9} color="#4FD3D0" op={0.16} dur={23000} amp={W * 0.1} />
      <Drift cx={W * 0.4} cy={H * 0.9} d={W * 1.1} color="#F2D7A0" op={0.14} dur={27000} amp={W * 0.1} />
      <Fish W={W} y={H * 0.22} size={38} color="#FF9A62" dur={26000} dir={1} delay={2000} op={0.9} />
      <Fish W={W} y={H * 0.5} size={26} color="#FFD25E" dur={34000} dir={-1} delay={8000} op={0.75} />
      <Fish W={W} y={H * 0.72} size={20} color="#BDE9F5" dur={44000} dir={1} delay={0} op={0.45} />
      {Array.from({ length: 22 }, (_, i) => (
        <Bubble key={i} i={i} W={W} H={H} />
      ))}
      <Vignette color="#03323F" strength={0.45} />
    </>
  );
}

/* ===================== THEME: RAMADAN ===================== */

const RAMADAN_BG = "#0B1030";

function Twinkle({ i, W, H }) {
  const size = 1.5 + rnd(i, 1) * 2.2;
  const v = useLoop(1600 + rnd(i, 2) * 3200, { delay: rnd(i, 3) * 3000 });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: rnd(i, 4) * W,
        top: rnd(i, 5) * H * 0.75,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#FFF3C4",
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.95] })
      }}
    />
  );
}

// eight-pointed star made of two squares
function Khatam({ size, color, style, width = 1.2 }) {
  const sq = { position: "absolute", width: size, height: size, borderWidth: width, borderColor: color };
  return (
    <View style={[{ width: size, height: size }, style]}>
      <View style={sq} />
      <View style={[sq, { transform: [{ rotate: "45deg" }] }]} />
    </View>
  );
}

// hangs from the top edge; the wrapper is centred on the pivot so it swings like a pendulum
function Lantern({ x, L, s, dur, rot, delay }) {
  const sway = useLoop(dur, { delay });
  const flick = useLoop(1300 + (x % 7) * 90);
  const T = L + s * 2.4;
  const w = s * 2;
  const cx = w / 2;
  const gold = "#E9B949";
  const bw = s * 0.9;
  const bodyTop = T + L + s * 0.3;
  const glowOp = flick.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x - cx,
        top: -T,
        width: w,
        height: T * 2,
        transform: [{ rotate: sway.interpolate({ inputRange: [0, 1], outputRange: [-rot + "deg", rot + "deg"] }) }]
      }}
    >
      <View style={{ position: "absolute", left: cx - 0.75, top: T, width: 1.5, height: L, backgroundColor: gold, opacity: 0.6 }} />
      <View
        style={{
          position: "absolute",
          left: cx - s * 0.45,
          top: T + L,
          width: 0,
          height: 0,
          borderLeftWidth: s * 0.45,
          borderRightWidth: s * 0.45,
          borderBottomWidth: s * 0.3,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: gold
        }}
      />
      <Animated.View style={{ position: "absolute", left: cx - s * 1.6, top: bodyTop + s * 0.65 - s * 1.6, opacity: glowOp }}>
        <SoftBlob d={s * 3.2} color="#FFB84D" op={0.3} />
      </Animated.View>
      <View
        style={{
          position: "absolute",
          left: cx - bw / 2,
          top: bodyTop,
          width: bw,
          height: s * 1.3,
          borderRadius: s * 0.3,
          borderWidth: 2,
          borderColor: gold,
          backgroundColor: "rgba(255,170,60,0.30)",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <Animated.View style={{ width: s * 0.36, height: s * 0.6, borderRadius: s * 0.2, backgroundColor: "#FFD98A", opacity: glowOp }} />
      </View>
      <View style={{ position: "absolute", left: cx - bw * 0.3, top: bodyTop + s * 1.3, width: bw * 0.6, height: s * 0.14, borderRadius: s * 0.05, backgroundColor: gold }} />
      <View style={{ position: "absolute", left: cx - 0.75, top: bodyTop + s * 1.44, width: 1.5, height: s * 0.35, backgroundColor: gold, opacity: 0.7 }} />
    </Animated.View>
  );
}

function RamadanBack({ W, H }) {
  const M = W * 0.26;
  const pulse = useLoop(6000);
  const spin = useLoop(90000, { alternate: false });
  const gold = "#E9B949";
  const ring = d => ({
    position: "absolute",
    left: M / 2 - d / 2,
    top: M / 2 - d / 2,
    width: d,
    height: d,
    borderRadius: d / 2,
    borderWidth: 1,
    borderColor: gold
  });
  const bottomStars = Math.ceil(W / 46);
  return (
    <>
      {Array.from({ length: 26 }, (_, i) => (
        <Twinkle key={i} i={i} W={W} H={H} />
      ))}

      {/* huge slow khatam in the corner */}
      <Animated.View
        style={{
          position: "absolute",
          left: -W * 0.25,
          top: H * 0.62,
          opacity: 0.09,
          transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }]
        }}
      >
        <Khatam size={W * 0.7} color={gold} width={2} />
      </Animated.View>

      {/* crescent */}
      <View style={{ position: "absolute", left: W * 0.68, top: H * 0.06, width: M, height: M }}>
        <View style={{ width: M, height: M, borderRadius: M / 2, backgroundColor: "#F6E3A1" }} />
        <View style={{ position: "absolute", left: M * 0.3, top: -M * 0.1, width: M * 0.88, height: M * 0.88, borderRadius: M * 0.44, backgroundColor: RAMADAN_BG }} />
        <Animated.View
          style={[
            ring(M * 1.6),
            {
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.06] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }]
            }
          ]}
        />
        <Animated.View
          style={[
            ring(M * 2.1),
            {
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.14] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1] }) }]
            }
          ]}
        />
      </View>

      <Lantern x={W * 0.08} L={70} s={26} dur={3400} rot={4} delay={0} />
      <Lantern x={W * 0.27} L={130} s={32} dur={4200} rot={3.5} delay={600} />
      <Lantern x={W * 0.48} L={92} s={24} dur={3800} rot={4.5} delay={1200} />

      <Text
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: H * 0.1,
          textAlign: "center",
          fontSize: W * 0.16,
          fontWeight: "900",
          color: gold,
          opacity: 0.09
        }}
      >
        رمضان كريم
      </Text>

      {Array.from({ length: bottomStars }, (_, k) => (
        <Khatam key={k} size={16} color={gold} style={{ position: "absolute", left: k * 46 + 10, bottom: 14, opacity: 0.3 }} />
      ))}

      <Vignette color="#04061A" strength={0.5} />
    </>
  );
}

/* ===================== THEME LAYERS ===================== */

function ThemeBack({ fx }) {
  const { width: W, height: H } = useWindowDimensions();
  const Comp = { hearth: HearthBack, hollow: HollowBack, riso: RisoBack, abyss: AbyssBack, reef: ReefBack, ramadan: RamadanBack }[fx];
  if (!Comp) return null;
  return (
    <View pointerEvents="none" style={FILL}>
      <Comp W={W} H={H} />
    </View>
  );
}

function ThemeFront({ fx }) {
  const { width: W, height: H } = useWindowDimensions();
  const Comp = { hollow: HollowFront, crt: CrtFront }[fx];
  if (!Comp) return null;
  return (
    <View pointerEvents="none" style={[FILL, { zIndex: 30, elevation: 30 }]}>
      <Comp W={W} H={H} />
    </View>
  );
}

// gentle bob for the home badge
function Float({ children, amp = 5, duration = 2600 }) {
  const v = useLoop(duration);
  return (
    <Animated.View
      style={{ transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-amp, amp] }) }] }}
    >
      {children}
    </Animated.View>
  );
}

/* ===================== ICONS (no emoji, no font needed) ===================== */

function Icon({ name, size = 22, color = "#FFFFFF", bg = "transparent", off = false }) {
  const s = size;
  const box = { width: s, height: s, alignItems: "center", justifyContent: "center", direction: "ltr" };
  const bar = (w, h, extra) => ({
    position: "absolute",
    width: w,
    height: h,
    borderRadius: h / 2,
    backgroundColor: color,
    ...extra
  });

  if (name === "close") {
    return (
      <View style={box}>
        <View style={bar(s * 0.95, s * 0.14, { transform: [{ rotate: "45deg" }] })} />
        <View style={bar(s * 0.95, s * 0.14, { transform: [{ rotate: "-45deg" }] })} />
      </View>
    );
  }

  if (name === "back") {
    const d = s * 0.5;
    return (
      <View style={box}>
        <View
          style={{
            width: d,
            height: d,
            borderLeftWidth: s * 0.14,
            borderBottomWidth: s * 0.14,
            borderColor: color,
            transform: [{ rotate: I18nManager.isRTL ? "225deg" : "45deg" }],
            marginLeft: I18nManager.isRTL ? -s * 0.15 : s * 0.15
          }}
        />
      </View>
    );
  }

  if (name === "check") {
    return (
      <View style={box}>
        <View
          style={{
            width: s * 0.55,
            height: s * 0.3,
            borderLeftWidth: s * 0.14,
            borderBottomWidth: s * 0.14,
            borderColor: color,
            transform: [{ rotate: "-45deg" }],
            marginTop: -s * 0.08
          }}
        />
      </View>
    );
  }

  if (name === "home") {
    return (
      <View style={box}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: s * 0.5,
            borderRightWidth: s * 0.5,
            borderBottomWidth: s * 0.4,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: color
          }}
        />
        <View style={{ width: s * 0.72, height: s * 0.42, backgroundColor: color, alignItems: "center", justifyContent: "flex-end" }}>
          <View style={{ width: s * 0.18, height: s * 0.26, backgroundColor: bg }} />
        </View>
      </View>
    );
  }

  if (name === "sound") {
    return (
      <View style={[box, { flexDirection: "row" }]}>
        <View style={{ width: s * 0.16, height: s * 0.3, backgroundColor: color }} />
        <View
          style={{
            width: 0,
            height: 0,
            borderTopWidth: s * 0.24,
            borderBottomWidth: s * 0.24,
            borderRightWidth: s * 0.26,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderRightColor: color
          }}
        />
        {!off && (
          <View
            style={{
              width: s * 0.2,
              height: s * 0.5,
              borderRadius: s * 0.25,
              borderWidth: s * 0.09,
              borderColor: "transparent",
              borderRightColor: color,
              marginLeft: s * 0.04
            }}
          />
        )}
        {off && <View style={bar(s * 1.05, s * 0.1, { transform: [{ rotate: "-45deg" }] })} />}
      </View>
    );
  }

  if (name === "sun") {
    return (
      <View style={box}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <View
            key={a}
            style={{ position: "absolute", width: s, height: s, alignItems: "center", transform: [{ rotate: a + "deg" }] }}
          >
            <View style={{ width: s * 0.1, height: s * 0.2, borderRadius: s * 0.05, backgroundColor: color }} />
          </View>
        ))}
        <View style={{ width: s * 0.42, height: s * 0.42, borderRadius: s * 0.21, backgroundColor: color }} />
      </View>
    );
  }

  if (name === "moon") {
    return (
      <View style={box}>
        <View style={{ width: s * 0.8, height: s * 0.8, borderRadius: s * 0.4, backgroundColor: color }} />
        <View
          style={{
            position: "absolute",
            width: s * 0.66,
            height: s * 0.66,
            borderRadius: s * 0.33,
            backgroundColor: bg,
            left: s * 0.4,
            top: s * 0.0
          }}
        />
      </View>
    );
  }

  if (name === "info") {
    return (
      <View style={[box, { borderRadius: s / 2, borderWidth: s * 0.09, borderColor: color }]}>
        <Text style={{ color, fontWeight: "900", fontSize: s * 0.55, includeFontPadding: false }}>i</Text>
      </View>
    );
  }

  return <View style={box} />;
}

/* ===================== LA FAMIGLIA (mafia mode) ===================== */

const ROLES = {
  godfather: {
    team: "mafia",
    glyph: "G",
    it: "Il Padrino",
    name: { en: "Godfather", ar: "العرّاب" },
    desc: {
      en: "You run the Family. Your word breaks ties, and the Detective sees you as innocent.",
      ar: "أنت زعيم العائلة. كلمتك تحسم التعادل، والمحقق يراك بريئاً."
    }
  },
  mafioso: {
    team: "mafia",
    glyph: "M",
    it: "Il Soldato",
    name: { en: "Mafioso", ar: "رجل العصابة" },
    desc: {
      en: "Serve the Don. Pick a victim at night, then lie well by day. Omertà.",
      ar: "اخدم العرّاب. اختر ضحية ليلاً وكذب بإتقان نهاراً. الصمت أولاً."
    }
  },
  doctor: {
    team: "town",
    glyph: "+",
    it: "Il Dottore",
    name: { en: "Doctor", ar: "الطبيب" },
    desc: {
      en: "Protect one player each night. You may save yourself.",
      ar: "احمِ لاعباً واحداً كل ليلة. يمكنك حماية نفسك."
    }
  },
  detective: {
    team: "town",
    glyph: "?",
    it: "Il Commissario",
    name: { en: "Detective", ar: "المحقق" },
    desc: {
      en: "Investigate one player each night and learn if they are with the Family.",
      ar: "حقّق مع لاعب كل ليلة واعرف إن كان من العائلة."
    }
  },
  civilian: {
    team: "town",
    glyph: "C",
    it: "Il Cittadino",
    name: { en: "Citizen", ar: "مواطن" },
    desc: {
      en: "No powers, just instinct. Find the Family before it is too late.",
      ar: "بلا قدرات، فقط حدسك. اكتشف العائلة قبل فوات الأوان."
    }
  }
};

const isMafiaRole = r => r === "godfather" || r === "mafioso";
const maxMafia = n => Math.max(1, Math.floor(n / 3));
const MIN_MAFIA_PLAYERS = 5;

const MAFIA_TEXT = {
  en: {
    chooseGame: "Choose a Game",
    dakhilGame: "Dakhil",
    dakhilGameInfo: "One secret word. Find the one who doesn't know it.",
    mafiaGame: "La Famiglia",
    mafiaGameInfo: "Italian mafia. The Family strikes by night, the city fights back by day.",
    mafiaMin: "La Famiglia needs at least 5 players.",
    mafiaSize: "Mafia members",
    rolesPreview: "Roles in play",
    dealRoles: "Deal the Roles",
    yourFamily: "Your family",
    beginNight: "Begin the Night",
    nightFalls: "La Notte",
    nightIntro: "Night falls on the city. Everyone close your eyes. The phone goes around, one player at a time.",
    ready: "I'm ready",
    pickTarget: "Choose tonight's victim",
    pickSave: "Who do you protect?",
    pickProbe: "Who do you investigate?",
    sleepTight: "You sleep soundly tonight. Nothing to do but dream.",
    done: "Done",
    isInnocent: "is innocent",
    isMafia: "is with the Family",
    dawnTitle: "Il Giorno",
    foundDead: "was found dead.",
    noOneDied: "Nobody died tonight. Either the Family slept in, or the Doctor was quick.",
    wasA: "They were",
    townSquare: "La Piazza",
    townInfo: "Accuse, defend, bargain. When you agree, tap who leaves town.",
    eliminate: "Eliminate",
    eliminateTitle: "Eliminate player",
    noElimination: "Nobody. Skip to night",
    verdict: "The town has spoken",
    sentAway: "was sent away.",
    familyWins: "THE FAMILY WINS",
    cityWins: "THE CITY WINS",
    alive: "Alive",
    gone: "Gone",
    goneList: "Gone"
  },
  ar: {
    chooseGame: "اختر اللعبة",
    dakhilGame: "دخيل",
    dakhilGameInfo: "كلمة سرية واحدة. اكتشف من لا يعرفها.",
    mafiaGame: "لا فاميليا",
    mafiaGameInfo: "مافيا إيطالية. العائلة تضرب ليلاً والمدينة تردّ نهاراً.",
    mafiaMin: "تحتاج لا فاميليا إلى 5 لاعبين على الأقل.",
    mafiaSize: "عدد أفراد المافيا",
    rolesPreview: "الأدوار",
    dealRoles: "وزّع الأدوار",
    yourFamily: "عائلتك",
    beginNight: "ابدأ الليل",
    nightFalls: "الليل (La Notte)",
    nightIntro: "يحلّ الليل على المدينة. أغمضوا أعينكم. سيمرّ الهاتف لاعباً لاعباً.",
    ready: "أنا جاهز",
    pickTarget: "اختر ضحية الليلة",
    pickSave: "من تحمي؟",
    pickProbe: "مع من تحقّق؟",
    sleepTight: "تنام بسلام الليلة. لا شيء عليك سوى الأحلام.",
    done: "تم",
    isInnocent: "بريء",
    isMafia: "من العائلة",
    dawnTitle: "النهار (Il Giorno)",
    foundDead: "وُجد ميتاً.",
    noOneDied: "لم يمت أحد الليلة. إمّا نامت العائلة أو أسرع الطبيب.",
    wasA: "كان",
    townSquare: "الساحة (La Piazza)",
    townInfo: "اتهموا، دافعوا، تفاوضوا. عندما تتفقون اضغطوا على من سيغادر المدينة.",
    eliminate: "إقصاء",
    eliminateTitle: "إقصاء لاعب",
    noElimination: "لا أحد. انتقل إلى الليل",
    verdict: "المدينة قالت كلمتها",
    sentAway: "تم إبعاده.",
    familyWins: "العائلة فازت",
    cityWins: "المدينة فازت",
    alive: "حيّ",
    gone: "خرج",
    goneList: "خرجوا"
  }
};
Object.assign(TEXT.en, MAFIA_TEXT.en);
Object.assign(TEXT.ar, MAFIA_TEXT.ar);

function roleTone(role, colors) {
  if (isMafiaRole(role)) return { bg: colors.danger, fg: "#FFFFFF", text: colors.danger };
  if (role === "doctor") return { bg: colors.success, fg: "#FFFFFF", text: colors.success };
  if (role === "detective") return { bg: colors.secondary, fg: colors.onSecondary, text: colors.secondary };
  return { bg: colors.cardAlt, fg: colors.text, text: colors.muted };
}

function RoleBadge({ role, size = 64 }) {
  const { colors } = React.useContext(ThemeCtx);
  const tone = roleTone(role, colors);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tone.bg,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: size * 0.05,
        borderColor: "rgba(0,0,0,0.22)"
      }}
    >
      <Text style={{ color: tone.fg, fontSize: size * 0.52, fontWeight: "900", includeFontPadding: false }}>
        {ROLES[role].glyph}
      </Text>
    </View>
  );
}

function NightMark({ size = 100 }) {
  const { colors } = React.useContext(ThemeCtx);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.cardAlt,
        borderWidth: size * 0.04,
        borderColor: colors.primary,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={{ color: colors.text, fontSize: size * 0.36, fontWeight: "900", letterSpacing: 2, includeFontPadding: false }}>
        Zz
      </Text>
    </View>
  );
}

/* ===================== APP ===================== */

export default function App() {
  const [screen, setScreen] = useState("home");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [soundOn, setSoundOn] = useState(true);

  const [players, setPlayers] = useState([]); // { id, name, char }
  const [playerName, setPlayerName] = useState("");
  const [pickerFor, setPickerFor] = useState(null); // player id whose character is being chosen
  const [savedTeams, setSavedTeams] = useState([]);
  const [teamName, setTeamName] = useState("");

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [secretWord, setSecretWord] = useState(null);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customWordsText, setCustomWordsText] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState("");
  const [editWordsText, setEditWordsText] = useState("");
  const [formError, setFormError] = useState("");

  const [gameMode, setGameMode] = useState("classic"); // "classic" | "agent"
  const [agentWord, setAgentWord] = useState(null);
  const [impostersCount, setImpostersCount] = useState(1);
  const [imposterIds, setImposterIds] = useState([]);

  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [selectedVotes, setSelectedVotes] = useState([]);

  const [currentImposterGuessIndex, setCurrentImposterGuessIndex] = useState(0);
  const [imposterWon, setImposterWon] = useState(false);

  const [dialog, setDialog] = useState(null); // { title, message, buttons }

  // La Famiglia
  const [mafiaCount, setMafiaCount] = useState(1);
  const [mafiaRoles, setMafiaRoles] = useState({}); // playerId -> role
  const [mafiaDead, setMafiaDead] = useState([]);
  const [mafiaIdx, setMafiaIdx] = useState(0);
  const [mafiaFlipped, setMafiaFlipped] = useState(false);
  const [nightIdx, setNightIdx] = useState(0);
  const [nightStep, setNightStep] = useState("intro"); // intro | pass | act | result
  const [nightPick, setNightPick] = useState(null);
  const [nightActs, setNightActs] = useState({ picks: {}, save: null });
  const [probe, setProbe] = useState(null);
  const [dawn, setDawn] = useState({ victim: null });
  const [verdict, setVerdict] = useState(null);
  const [mafiaWinner, setMafiaWinner] = useState(null);
  const [round, setRound] = useState(0);
  const mAlive = players.filter(p => !mafiaDead.includes(p.id));

  const COLORS = THEMES[theme];
  const palette = COLORS.avatars || AVATAR_COLORS;
  const themeCtx = React.useMemo(() => ({ palette, colors: COLORS }), [theme]);
  const styles = React.useMemo(() => makeStyles(COLORS), [theme]);
  const isArabic = language === "ar";

  // smooth theme switch: a veil in the old background colour fades out
  const fade = React.useRef(new Animated.Value(0)).current;
  const [fadeBg, setFadeBg] = useState(THEMES.dark.bg);
  const toastOp = React.useRef(new Animated.Value(0)).current;
  const [toast, setToast] = useState("");

  function t(key) {
    return TEXT[language][key] || key;
  }

  /* ---------- load saved data ---------- */
  React.useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true
    }).catch(() => {});

    (async () => {
      try {
        const [cats, th, teams] = await Promise.all([
          AsyncStorage.getItem("CUSTOM_CATEGORIES"),
          AsyncStorage.getItem("THEME"),
          AsyncStorage.getItem("SAVED_TEAMS")
        ]);
        if (cats) setCategories({ ...DEFAULT_CATEGORIES, ...JSON.parse(cats) });
        if (th && THEMES[th]) setTheme(th);
        if (teams) setSavedTeams(JSON.parse(teams));
      } catch (e) {}
    })();
  }, []);

  /* ---------- sound / language / theme ---------- */
  async function playSound(type) {
    if (!soundOn) return;
    try {
      const { sound } = await Audio.Sound.createAsync(sounds[type]);
      await sound.setVolumeAsync(0.6);
      sound.setOnPlaybackStatusUpdate(st => {
        if (st.didJustFinish) sound.unloadAsync();
      });
      await sound.playAsync();
    } catch (e) {
      // silent fail
    }
  }

  function switchLanguage(lang) {
    setLanguage(lang);
    const shouldBeRTL = lang === "ar";
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      // App reload is required in real devices
    }
  }

  function changeTheme(next) {
    if (next === theme) return;
    setFadeBg(COLORS.bg);
    fade.stopAnimation();
    fade.setValue(1);
    setTheme(next);
    Animated.timing(fade, {
      toValue: 0,
      duration: 520,
      delay: 60,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
    AsyncStorage.setItem("THEME", next).catch(() => {});
  }

  function toggleTheme() {
    changeTheme(COLORS.dark ? "light" : "dark");
  }

  function flashToast(text) {
    setToast(text);
    toastOp.stopAnimation();
    Animated.sequence([
      Animated.timing(toastOp, { toValue: text ? 1 : 0, duration: 220, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(toastOp, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start();
  }

  // the five secret buttons on the About screen
  function pickSecret(key) {
    playSound("click");
    if (theme === key) {
      changeTheme("dark");
      flashToast("");
    } else {
      changeTheme(key);
      flashToast(THEMES[key].name[language]);
    }
  }

  /* ---------- dialog / navigation ---------- */
  function showDialog(title, message, buttons) {
    setDialog({ title, message, buttons });
  }

  const isImposter = id => imposterIds.includes(id);

  function resetRound() {
    setVotes({});
    setSelectedVotes([]);
    setCurrentVoterIndex(0);
    setImposterIds([]);
    setCurrentRevealIndex(0);
    setCardFlipped(false);
    setCurrentImposterGuessIndex(0);
    setImposterWon(false);
    setAgentWord(null);
  }

  function goHome(keepPlayers) {
    resetRound();
    setSecretWord(null);
    setSelectedCategory(null);
    setImpostersCount(1);
    setFormError("");
    setEditingKey(null);
    setDialog(null);
    setPickerFor(null);
    setMafiaRoles({});
    setMafiaDead([]);
    setMafiaWinner(null);
    setMafiaIdx(0);
    setMafiaFlipped(false);
    if (!keepPlayers) setPlayers([]);
    setScreen("home");
  }

  function confirmGoHome() {
    playSound("click");
    if (players.length === 0) {
      goHome(false);
      return;
    }
    showDialog(t("goHome"), t("keepTeam"), [
      { text: t("no"), onPress: () => goHome(false) },
      { text: t("yes"), primary: true, onPress: () => goHome(true) }
    ]);
  }

  function goBack() {
    playSound("click");
    setFormError("");
    if (screen === "editCategory") setEditingKey(null);
    const to = BACK[screen];
    if (to) setScreen(to);
  }

  /* ---------- players, characters, teams ---------- */
  function nextChar(list) {
    const used = list.map(p => p.char);
    for (let i = 0; i < AVATAR_COLORS.length; i++) {
      if (!used.includes(i)) return i;
    }
    return list.length % AVATAR_COLORS.length;
  }

  function addPlayer() {
    const name = playerName.trim();
    if (!name) return;
    playSound("click");
    setPlayers(p => [...p, { id: Date.now(), name, char: nextChar(p) }]);
    setPlayerName("");
  }

  function removePlayer(id) {
    setPlayers(p => p.filter(x => x.id !== id));
  }

  function setPlayerChar(id, char) {
    setPlayers(p => p.map(x => (x.id === id ? { ...x, char } : x)));
  }

  function applyQuickGroup(n) {
    playSound("click");
    const base = Date.now();
    setPlayers(
      Array.from({ length: n }, (_, i) => ({
        id: base + i,
        name: t("playerN") + " " + (i + 1),
        char: i % AVATAR_COLORS.length
      }))
    );
  }

  const teamPlayerName = p => (typeof p === "string" ? p : p.name);

  function loadTeam(team) {
    const base = Date.now();
    setPlayers(
      team.players.map((p, i) => ({
        id: base + i,
        name: teamPlayerName(p),
        char: typeof p === "string" || p.char === undefined ? i % AVATAR_COLORS.length : p.char
      }))
    );
  }

  async function saveTeam() {
    const name = teamName.trim();
    if (!name || players.length === 0) return;
    playSound("click");

    const team = {
      id: Date.now(),
      name,
      players: players.map(p => ({ name: p.name, char: p.char }))
    };
    const next = [...savedTeams.filter(x => x.name !== name), team];
    setSavedTeams(next);
    setTeamName("");
    try {
      await AsyncStorage.setItem("SAVED_TEAMS", JSON.stringify(next));
    } catch (e) {}
  }

  async function deleteTeam(id) {
    const next = savedTeams.filter(x => x.id !== id);
    setSavedTeams(next);
    try {
      await AsyncStorage.setItem("SAVED_TEAMS", JSON.stringify(next));
    } catch (e) {}
  }

  function confirmDeleteTeam(team) {
    showDialog(t("deleteTeamTitle"), t("deleteTeamMsg"), [
      { text: t("cancel") },
      { text: t("delete"), danger: true, onPress: () => deleteTeam(team.id) }
    ]);
  }

  /* ---------- categories ---------- */
  function chooseCategory(categoryKey, words) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSelectedCategory(categoryKey);
    setSecretWord(randomWord);
    setScreen("imposterConfig");
  }

  function parseWords(text) {
    // separators: , ، (Arabic comma) space - _
    return [
      ...new Set(
        text
          .split(/[,\u060C\s\-_]+/)
          .map(w => w.trim())
          .filter(Boolean)
      )
    ];
  }

  async function addCustomCategory() {
    const words = parseWords(customWordsText);
    const name = customCategoryName.trim();

    if (!name) { setFormError(t("needName")); return; }
    if (words.length < 3) { setFormError(t("needWords")); return; }
    if (categories[name]) { setFormError(t("nameTaken")); return; }
    setFormError("");

    const newCategory = {
      [name]: {
        label: { en: name, ar: name },
        words: { en: words, ar: words }
      }
    };

    const saved = await AsyncStorage.getItem("CUSTOM_CATEGORIES");
    const parsed = saved ? JSON.parse(saved) : {};
    await AsyncStorage.setItem(
      "CUSTOM_CATEGORIES",
      JSON.stringify({ ...parsed, ...newCategory })
    );

    setCategories(prev => ({ ...prev, ...newCategory }));

    chooseCategory(name, words);
    setCustomCategoryName("");
    setCustomWordsText("");
  }

  function openEditCategory(key) {
    const cat = categories[key];
    playSound("click");
    setEditingKey(key);
    setEditName(cat.label[language] || key);
    setEditWordsText(cat.words[language].join(", "));
    setFormError("");
    setScreen("editCategory");
  }

  async function saveEditedCategory() {
    const name = editName.trim();
    const words = parseWords(editWordsText);

    if (!name) { setFormError(t("needName")); return; }
    if (words.length < 3) { setFormError(t("needWords")); return; }
    if (name !== editingKey && categories[name]) {
      setFormError(t("nameTaken"));
      return;
    }

    const updated = {
      label: { en: name, ar: name },
      words: { en: words, ar: words }
    };

    const saved = await AsyncStorage.getItem("CUSTOM_CATEGORIES");
    const parsed = saved ? JSON.parse(saved) : {};
    delete parsed[editingKey];
    parsed[name] = updated;
    await AsyncStorage.setItem("CUSTOM_CATEGORIES", JSON.stringify(parsed));

    // keep the list order (rename in place)
    setCategories(prev => {
      const next = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (k === editingKey) next[name] = updated;
        else next[k] = v;
      });
      return next;
    });

    setFormError("");
    setEditingKey(null);
    setScreen("category");
  }

  async function deleteCustomCategory(key) {
    setCategories(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    const saved = await AsyncStorage.getItem("CUSTOM_CATEGORIES");
    if (!saved) return;
    const parsed = JSON.parse(saved);
    delete parsed[key];
    await AsyncStorage.setItem("CUSTOM_CATEGORIES", JSON.stringify(parsed));
  }

  function confirmDeleteCategory(key) {
    showDialog(t("deleteCategoryTitle"), t("deleteCategoryMsg"), [
      { text: t("cancel") },
      { text: t("delete"), danger: true, onPress: () => deleteCustomCategory(key) }
    ]);
  }

  /* ---------- La Famiglia ---------- */
  function mafiaCheck(dead) {
    const alive = players.filter(p => !dead.includes(p.id));
    const m = alive.filter(p => isMafiaRole(mafiaRoles[p.id])).length;
    const town = alive.length - m;
    return m === 0 ? "town" : m >= town ? "mafia" : null;
  }

  function dealMafia() {
    playSound("start");
    const k = Math.min(mafiaCount, maxMafia(players.length));
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const roles = {};
    shuffled.forEach((p, i) => {
      roles[p.id] =
        i === 0 ? "godfather" : i < k ? "mafioso" : i === k ? "doctor" : i === k + 1 ? "detective" : "civilian";
    });
    setMafiaRoles(roles);
    setMafiaDead([]);
    setMafiaIdx(0);
    setMafiaFlipped(false);
    setMafiaWinner(null);
    setRound(0);
    setScreen("mafiaReveal");
  }

  function beginNight() {
    setRound(r => r + 1);
    setNightIdx(0);
    setNightStep("intro");
    setNightPick(null);
    setNightActs({ picks: {}, save: null });
    setProbe(null);
    setScreen("mafiaNight");
  }

  function nightNext(acts) {
    if (nightIdx + 1 < mAlive.length) {
      setNightIdx(i => i + 1);
      setNightStep("pass");
      setNightPick(null);
      setProbe(null);
    } else {
      resolveNight(acts);
    }
  }

  function nightConfirm() {
    const p = mAlive[nightIdx];
    const r = mafiaRoles[p.id];
    let acts = nightActs;
    if (isMafiaRole(r)) acts = { ...acts, picks: { ...acts.picks, [p.id]: nightPick } };
    else if (r === "doctor") acts = { ...acts, save: nightPick };
    setNightActs(acts);
    playSound("click");
    if (r === "detective") {
      // the Godfather reads as innocent
      setProbe({ id: nightPick, mafia: mafiaRoles[nightPick] === "mafioso" });
      setNightStep("result");
      return;
    }
    nightNext(acts);
  }

  // the Don's vote counts double; ties are settled at random
  function resolveNight(acts) {
    const tally = {};
    Object.entries(acts.picks).forEach(([pid, target]) => {
      const w = mafiaRoles[pid] === "godfather" ? 2 : 1;
      tally[target] = (tally[target] || 0) + w;
    });
    const top = Math.max(0, ...Object.values(tally));
    const tied = Object.keys(tally).filter(k => tally[k] === top).map(Number);
    const target = tied.length ? tied[Math.floor(Math.random() * tied.length)] : null;
    const victim = target !== null && acts.save !== target ? target : null;
    const dead = victim !== null ? [...mafiaDead, victim] : mafiaDead;
    setMafiaDead(dead);
    setDawn({ victim });
    setMafiaWinner(mafiaCheck(dead));
    playSound("next");
    setScreen("mafiaDawn");
  }

  function eliminateMafia(id) {
    const dead = [...mafiaDead, id];
    setMafiaDead(dead);
    setVerdict(id);
    setMafiaWinner(mafiaCheck(dead));
    playSound("flip");
    setScreen("mafiaVerdict");
  }

  function afterDawnOrVerdict(next) {
    if (mafiaWinner) {
      playSound("win");
      setScreen("mafiaResult");
    } else {
      playSound("click");
      next();
    }
  }

  /* ---------- game flow ---------- */
  function selectImposters() {
    const count = players.length >= 6 ? impostersCount : 1;
    setImpostersCount(count);

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setImposterIds(shuffled.slice(0, count).map(p => p.id));

    if (gameMode === "agent") {
      const pool = (categories[selectedCategory]?.words[language] || []).filter(
        w => w !== secretWord
      );
      setAgentWord(
        pool.length ? pool[Math.floor(Math.random() * pool.length)] : null
      );
    } else {
      setAgentWord(null);
    }

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
      }))
      .filter(v => v.player);
  }

  // Secret Agent mode has no word-guess phase: players win if every
  // imposter is among the most-voted players.
  function finishAgentGame() {
    const sortedCounts = players.map(p => votes[p.id] || 0).sort((a, b) => b - a);
    const threshold = Math.max(sortedCounts[impostersCount - 1] || 0, 1);
    const allCaught = imposterIds.every(id => (votes[id] || 0) >= threshold);
    setImposterWon(!allCaught);
    playSound("win");
    setScreen("finalResult");
  }

  /* ===================== UI ===================== */

  const curPlayer = players[currentRevealIndex];
  const voter = players[currentVoterIndex];
  const pickedChar = players.find(p => p.id === pickerFor)?.char;
  const pickedName = players.find(p => p.id === pickerFor)?.name;

  return (
    <ThemeCtx.Provider value={themeCtx}>
    <View style={styles.container}>
      <StatusBar barStyle={COLORS.dark ? "light-content" : "dark-content"} />
      {COLORS.fx && <ThemeBack key={theme} fx={COLORS.fx} />}

      {/* ---------- DIALOG ---------- */}
      <Modal
        visible={!!dialog}
        transparent
        animationType="fade"
        onRequestClose={() => setDialog(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setDialog(null)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            <Text style={styles.modalTitle}>{dialog?.title}</Text>
            <Text style={styles.modalMessage}>{dialog?.message}</Text>
            <View style={styles.modalButtons}>
              {(dialog?.buttons || []).map((b, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.modalButton,
                    b.primary && styles.modalButtonPrimary,
                    b.danger && styles.modalButtonDanger
                  ]}
                  onPress={() => {
                    setDialog(null);
                    if (b.onPress) b.onPress();
                  }}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      (b.primary || b.danger) && styles.modalButtonTextOn
                    ]}
                  >
                    {b.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ---------- CHARACTER PICKER ---------- */}
      <Modal
        visible={pickerFor !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerFor(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setPickerFor(null)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("chooseCharacter")}</Text>
            <View style={styles.pickerGrid}>
              {palette.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.pickerItem, pickedChar === i && styles.pickerItemActive]}
                  onPress={() => {
                    playSound("click");
                    setPlayerChar(pickerFor, i);
                    setPickerFor(null);
                  }}
                >
                  <Avatar id={i} name={pickedName} size={44} />
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ---------- HEADER (Back + Home on every screen except home) ---------- */}
      {screen !== "home" && (
        <View style={styles.headerRow}>
          {BACK[screen] ? (
            <TouchableOpacity
              style={styles.pill}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={goBack}
            >
              <Icon name="back" size={16} color={COLORS.text} />
              <Text style={styles.pillText}>{t("back")}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity
            style={styles.pill}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={confirmGoHome}
          >
            <Icon name="home" size={18} color={COLORS.text} bg={COLORS.cardAlt} />
            <Text style={styles.pillText}>{t("home")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===================== HOME ===================== */}
      {screen === "home" && (
        <View style={styles.homeWrap}>
          <View style={styles.homeTopBar}>
            <View style={styles.segment}>
              <TouchableOpacity
                style={[styles.segBtn, language === "en" && styles.segActive]}
                onPress={() => {
                  playSound("click");
                  switchLanguage("en");
                }}
              >
                <Text style={[styles.segText, language === "en" && styles.segTextActive]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segBtn, language === "ar" && styles.segActive]}
                onPress={() => {
                  playSound("click");
                  switchLanguage("ar");
                }}
              >
                <Text style={[styles.segText, language === "ar" && styles.segTextActive]}>AR</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => {
                  playSound("click");
                  setSoundOn(s => !s);
                }}
              >
                <Icon name="sound" size={22} color={COLORS.text} off={!soundOn} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => {
                  playSound("click");
                  toggleTheme();
                }}
              >
                <Icon
                  name={theme === "dark" ? "sun" : "moon"}
                  size={22}
                  color={COLORS.text}
                  bg={COLORS.cardAlt}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => {
                  playSound("click");
                  setScreen("about");
                }}
              >
                <Icon name="info" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mascotWrap}>
            <View style={styles.mascotGlow} />
            <Float>
              <Mark kind="spy" size={132} />
            </Float>
          </View>

          <Text style={[styles.brand, { letterSpacing: isArabic ? 0 : 8 }]}>{t("title")}</Text>
          <Text style={styles.homeTagline}>{t("tagline")}</Text>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              playSound("start");
              setScreen("setup");
            }}
          >
            <Text style={styles.buttonPrimaryText}>{t("startGame")}</Text>
          </TouchableOpacity>

          <Text style={styles.version}>DAKHIL v{APP_VERSION}</Text>
        </View>
      )}

      {/* ===================== SETUP ===================== */}
      {screen === "setup" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("addPlayers")}</Text>

          {/* premade groups */}
          <Text style={styles.sectionLabel}>{t("quickGroups")}</Text>
          <View style={styles.chipRow}>
            {[3, 4, 5, 6, 7, 8, 9].map(n => (
              <TouchableOpacity key={n} style={styles.chip} onPress={() => applyQuickGroup(n)}>
                <Text style={styles.chipText}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* saved teams */}
          {savedTeams.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>{t("savedTeams")}</Text>
              {savedTeams.map(team => (
                <View key={team.id} style={styles.rowCard}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      playSound("click");
                      loadTeam(team);
                    }}
                  >
                    <Text style={styles.rowTitle}>{team.name}</Text>
                    <View style={styles.miniAvatars}>
                      {team.players.slice(0, 6).map((p, i) => (
                        <View key={i} style={{ marginEnd: 2 }}>
                          <Avatar
                            id={typeof p === "string" || p.char === undefined ? i : p.char}
                            name={teamPlayerName(p)}
                            size={30}
                          />
                        </View>
                      ))}
                    </View>
                    <Text style={styles.rowMeta}>
                      {team.players.length} {t("players")}:{" "}
                      {team.players.map(teamPlayerName).join(", ")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => confirmDeleteTeam(team)}
                  >
                    <Icon name="close" size={14} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {/* add player */}
          <View style={[styles.surface, { marginTop: SPACING.md }]}>
            <TextInput
              style={styles.input}
              placeholder={t("playerName")}
              placeholderTextColor={COLORS.muted}
              value={playerName}
              onChangeText={setPlayerName}
              onSubmitEditing={addPlayer}
            />
            <TouchableOpacity style={styles.buttonSecondary} onPress={addPlayer}>
              <Text style={styles.buttonSecondaryText}>{t("addPlayer")}</Text>
            </TouchableOpacity>
          </View>

          {/* player list */}
          {players.length > 0 && (
            <Text style={styles.sectionLabel}>
              {t("yourTeam")} ({players.length})
            </Text>
          )}
          {players.map(item => (
            <View key={item.id} style={styles.rowCard}>
              <TouchableOpacity
                style={styles.avatarBtn}
                onPress={() => setPickerFor(item.id)}
              >
                <Avatar id={item.char} name={item.name} size={52} />
              </TouchableOpacity>
              <Text style={[styles.rowTitle, { flex: 1, marginStart: SPACING.sm }]}>
                {item.name}
              </Text>
              <TouchableOpacity
                style={styles.removeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => removePlayer(item.id)}
              >
                <Icon name="close" size={14} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}
          {players.length > 0 && <Text style={styles.hint}>{t("tapAvatar")}</Text>}

          {/* save team */}
          {players.length > 0 && (
            <View style={[styles.surface, { marginTop: SPACING.sm }]}>
              <TextInput
                style={styles.input}
                placeholder={t("teamName")}
                placeholderTextColor={COLORS.muted}
                value={teamName}
                onChangeText={setTeamName}
                onSubmitEditing={saveTeam}
              />
              <TouchableOpacity style={styles.buttonSecondary} onPress={saveTeam}>
                <Text style={styles.buttonSecondaryText}>{t("saveTeam")}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.buttonPrimary, players.length < 3 && styles.buttonDisabled]}
            disabled={players.length < 3}
            onPress={() => {
              playSound("click");
              setScreen("gameType");
            }}
          >
            <Text style={styles.buttonPrimaryText}>{t("continue")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== CATEGORY ===================== */}
      {screen === "category" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("chooseCategory")}</Text>

          {Object.entries(categories).map(([key, cat], idx) => {
            const isCustom = !DEFAULT_CATEGORIES[key];
            const label = cat.label[language] || key;
            return (
              <View key={key} style={styles.rowCard}>
                <TouchableOpacity
                  style={styles.catMain}
                  onPress={() => chooseCategory(key, cat.words[language])}
                >
                  <View
                    style={[
                      styles.catBadge,
                      { backgroundColor: palette[idx % palette.length] }
                    ]}
                  >
                    <Text style={[styles.catBadgeText, { color: inkOn(palette[idx % palette.length]) }]}>
                      {firstLetter(label)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginStart: SPACING.sm }}>
                    <Text style={styles.rowTitle}>{label}</Text>
                    <Text style={styles.rowMeta}>
                      {cat.words[language].length} {t("wordsCount")}
                    </Text>
                  </View>
                </TouchableOpacity>

                {isCustom && (
                  <View style={styles.catActions}>
                    <TouchableOpacity
                      style={styles.miniBtn}
                      onPress={() => openEditCategory(key)}
                    >
                      <Text style={styles.miniBtnText}>{t("edit")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.miniBtn, styles.miniBtnDanger]}
                      onPress={() => confirmDeleteCategory(key)}
                    >
                      <Text style={[styles.miniBtnText, { color: COLORS.danger }]}>
                        {t("delete")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          <Text style={styles.sectionLabel}>{t("customCategory")}</Text>
          <View style={styles.surface}>
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
            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
            <TouchableOpacity style={styles.buttonPrimary} onPress={addCustomCategory}>
              <Text style={styles.buttonPrimaryText}>{t("createStart")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* ===================== EDIT CATEGORY ===================== */}
      {screen === "editCategory" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("editCategory")}</Text>

          <View style={styles.surface}>
            <TextInput
              style={styles.input}
              placeholder={t("categoryName")}
              placeholderTextColor={COLORS.muted}
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={[styles.input, { minHeight: 140, textAlignVertical: "top" }]}
              placeholder={t("categoryWords")}
              placeholderTextColor={COLORS.muted}
              value={editWordsText}
              onChangeText={setEditWordsText}
              multiline
            />
            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
          </View>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              playSound("click");
              saveEditedCategory();
            }}
          >
            <Text style={styles.buttonPrimaryText}>{t("save")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonGhost} onPress={goBack}>
            <Text style={styles.buttonGhostText}>{t("cancel")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== IMPOSTER CONFIG ===================== */}
      {screen === "imposterConfig" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("gameMode")}</Text>

          {["classic", "agent"].map(mode => {
            const active = gameMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.modeCard, active && styles.modeCardActive]}
                onPress={() => {
                  playSound("click");
                  setGameMode(mode);
                }}
              >
                <Mark kind={mode === "classic" ? "imposter" : "spy"} size={64} />
                <View style={{ flex: 1, marginHorizontal: SPACING.sm }}>
                  <Text style={styles.rowTitle}>
                    {t(mode === "classic" ? "classicMode" : "agentMode")}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {t(mode === "classic" ? "classicInfo" : "agentInfo")}
                  </Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <Icon name="check" size={14} color={COLORS.onAccent} />}
                </View>
              </TouchableOpacity>
            );
          })}

          <Text style={styles.sectionLabel}>{t("imposters")}</Text>
          <View style={styles.countRow}>
            <TouchableOpacity
              style={[styles.countBtn, impostersCount === 1 && styles.countBtnActive]}
              onPress={() => setImpostersCount(1)}
            >
              <Text style={[styles.countText, impostersCount === 1 && styles.countTextActive]}>
                1 {t("imposter")}
              </Text>
            </TouchableOpacity>

            {players.length >= 6 && (
              <TouchableOpacity
                style={[styles.countBtn, impostersCount === 2 && styles.countBtnActive]}
                onPress={() => setImpostersCount(2)}
              >
                <Text style={[styles.countText, impostersCount === 2 && styles.countTextActive]}>
                  2 {t("imposters")}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.buttonPrimary} onPress={selectImposters}>
            <Text style={styles.buttonPrimaryText}>{t("ConfirmStart")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== REVEAL ===================== */}
      {screen === "reveal" && (
        <View style={styles.centerWrap}>
          {curPlayer ? (
            <>
              <Text style={styles.passText}>{t("PassPhone2")}</Text>
              <View style={styles.revealPlayer}>
                <Avatar id={curPlayer.char} name={curPlayer.name} size={92} />
                <Text style={styles.revealName}>{curPlayer.name}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.flipCard, cardFlipped && styles.flipCardOpen]}
                onPress={() => {
                  playSound("flip");
                  setCardFlipped(!cardFlipped);
                }}
              >
                {!cardFlipped ? (
                  <>
                    <Text style={styles.flipQ}>?</Text>
                    <Text style={styles.flipHint}>{t("tapToFlip")}</Text>
                  </>
                ) : isImposter(curPlayer.id) && !(gameMode === "agent" && agentWord) ? (
                  <>
                    <Mark kind="imposter" size={110} />
                    <Text style={[styles.cardText, { color: COLORS.danger }]}>{t("URIm")}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.flipHint}>{t("secretWord")}</Text>
                    <Text style={styles.cardText}>
                      {isImposter(curPlayer.id) ? agentWord : secretWord}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {cardFlipped && (
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={() => {
                    playSound("next");
                    setCardFlipped(false);
                    setCurrentRevealIndex(i => i + 1);
                  }}
                >
                  <Text style={styles.buttonPrimaryText}>{t("confirm")}</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Mark kind="spy" size={130} />
              <TouchableOpacity
                style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
                onPress={() => {
                  playSound("click");
                  setScreen("discussion");
                }}
              >
                <Text style={styles.buttonPrimaryText}>{t("StartDiscussion")}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* ===================== DISCUSSION ===================== */}
      {screen === "discussion" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("discussion")}</Text>
          <Text style={styles.infoText}>{t("discussionInfo")}</Text>

          <View style={styles.crew}>
            {players.map(p => (
              <View key={p.id} style={styles.crewItem}>
                <Avatar id={p.char} name={p.name} size={64} />
                <Text style={styles.crewName} numberOfLines={1}>
                  {p.name}
                </Text>
              </View>
            ))}
          </View>

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
        </ScrollView>
      )}

      {/* ===================== VOTING ===================== */}
      {screen === "voting" && voter && (
        <View style={{ flex: 1 }}>
          <View style={styles.voterHead}>
            <Avatar id={voter.char} name={voter.name} size={64} />
            <View style={{ marginStart: SPACING.sm, flex: 1 }}>
              <Text style={styles.rowMeta}>{t("PassPhone2")}</Text>
              <Text style={styles.voterName}>{voter.name}</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>
            {t("voteFor")} ({selectedVotes.length}/{impostersCount})
          </Text>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.md }}>
            {players.map(p => {
              const selected = selectedVotes.includes(p.id);
              const self = p.id === voter.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  disabled={self}
                  onPress={() => toggleVote(p.id)}
                  style={[
                    styles.voteOption,
                    selected && styles.voteSelected,
                    self && styles.voteDisabled
                  ]}
                >
                  <Avatar id={p.char} name={p.name} size={46} />
                  <Text style={[styles.voteText, selected && styles.voteSelectedText]}>
                    {p.name}
                  </Text>
                  {selected && <Icon name="check" size={20} color={COLORS.onAccent} />}
                </TouchableOpacity>
              );
            })}
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
            <Text style={styles.buttonPrimaryText}>{t("confirmVote")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===================== VOTE RESULTS ===================== */}
      {screen === "voteResults" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("results")}</Text>

          {getTopVoted().map((v, i, arr) => (
            <View key={i} style={styles.rowCard}>
              <Avatar id={v.player.char} name={v.player.name} size={50} />
              <View style={{ flex: 1, marginStart: SPACING.sm }}>
                <Text style={styles.rowTitle}>{v.player.name}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: Math.max((v.count / arr[0].count) * 100, 8) + "%" }
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.countBig}>{v.count}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              setScreen("revealImposters");
              playSound("click");
            }}
          >
            <Text style={styles.buttonPrimaryText}>{t("revealImposter")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== IMPOSTER REVEAL ===================== */}
      {screen === "revealImposters" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("imposters")}</Text>

          <View style={styles.crew}>
            {imposterIds.map(id => {
              const p = players.find(x => x.id === id);
              if (!p) return null;
              return (
                <View key={id} style={styles.crewItem}>
                  <View style={styles.dangerRing}>
                    <Avatar id={p.char} name={p.name} size={84} />
                  </View>
                  <Text style={[styles.crewName, { color: COLORS.danger }]} numberOfLines={1}>
                    {p.name}
                  </Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              playSound("click");
              if (gameMode === "agent") {
                finishAgentGame();
              } else {
                setCurrentImposterGuessIndex(0);
                setImposterWon(false);
                setScreen("imposterGuess");
              }
            }}
          >
            <Text style={styles.buttonPrimaryText}>
              {gameMode === "agent" ? t("revealResult") : t("chooseWord")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== IMPOSTER GUESS ===================== */}
      {screen === "imposterGuess" && (
        <View style={{ flex: 1 }}>
          <Text style={styles.screenTitle}>{t("imposterGuess")}</Text>

          {(() => {
            const guesser = players.find(p => p.id === imposterIds[currentImposterGuessIndex]);
            return guesser ? (
              <View style={styles.voterHead}>
                <Avatar id={guesser.char} name={guesser.name} size={64} />
                <View style={{ marginStart: SPACING.sm, flex: 1 }}>
                  <Text style={styles.rowMeta}>{t("PassPhone2")}</Text>
                  <Text style={styles.voterName}>{guesser.name}</Text>
                </View>
              </View>
            ) : null;
          })()}

          <Text style={styles.sectionLabel}>{t("secretWord")}</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
            {categories[selectedCategory].words[language].map(word => (
              <TouchableOpacity
                key={word}
                style={styles.voteOption}
                onPress={() => {
                  if (word === secretWord) {
                    setImposterWon(true);
                  }

                  if (currentImposterGuessIndex + 1 < imposterIds.length) {
                    setCurrentImposterGuessIndex(i => i + 1);
                  } else {
                    playSound("win");
                    setScreen("finalResult");
                  }
                }}
              >
                <Text style={[styles.voteText, { textAlign: "center", marginStart: 0 }]}>
                  {word}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ===================== FINAL ===================== */}
      {screen === "finalResult" && (
        <ScrollView
          contentContainerStyle={{ alignItems: "stretch", paddingBottom: SPACING.xl }}
        >
          <Text style={styles.sectionLabelCenter}>{t("gameResult")}</Text>

          <View style={{ alignItems: "center" }}>
            <Mark kind={imposterWon ? "imposter" : "win"} size={120} />
          </View>

          <Text
            style={[
              styles.resultBanner,
              { color: imposterWon ? COLORS.danger : COLORS.success }
            ]}
          >
            {imposterWon ? t("impostersWin") : t("playersWin")}
          </Text>

          <View style={styles.surface}>
            <Text style={styles.rowMeta}>{t("secretWord")}</Text>
            <Text style={styles.wordBig}>{secretWord}</Text>

            {gameMode === "agent" && agentWord && (
              <>
                <Text style={[styles.rowMeta, { marginTop: SPACING.sm }]}>
                  {t("imposterWord")}
                </Text>
                <Text style={[styles.wordBig, { color: COLORS.danger }]}>{agentWord}</Text>
              </>
            )}
          </View>

          <Text style={styles.sectionLabel}>{t("imposters")}</Text>
          {imposterIds.map(id => {
            const p = players.find(x => x.id === id);
            if (!p) return null;
            return (
              <View key={id} style={styles.rowCard}>
                <Avatar id={p.char} name={p.name} size={46} />
                <Text style={[styles.rowTitle, { marginStart: SPACING.sm }]}>{p.name}</Text>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              playSound("click");
              resetRound();
              setScreen("category");
            }}
          >
            <Text style={styles.buttonPrimaryText}>{t("playAgain")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={() => goHome(false)}>
            <Text style={styles.buttonSecondaryText}>{t("newGame")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== GAME TYPE ===================== */}
      {screen === "gameType" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("chooseGame")}</Text>

          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => {
              playSound("click");
              setScreen("category");
            }}
          >
            <Mark kind="spy" size={64} />
            <View style={{ flex: 1, marginHorizontal: SPACING.sm }}>
              <Text style={styles.rowTitle}>{t("dakhilGame")}</Text>
              <Text style={styles.rowMeta}>{t("dakhilGameInfo")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => {
              playSound("click");
              setScreen("mafiaConfig");
            }}
          >
            <RoleBadge role="godfather" size={64} />
            <View style={{ flex: 1, marginHorizontal: SPACING.sm }}>
              <Text style={styles.rowTitle}>{t("mafiaGame")}</Text>
              <Text style={styles.rowMeta}>{t("mafiaGameInfo")}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== MAFIA CONFIG ===================== */}
      {screen === "mafiaConfig" && (() => {
        const n = players.length;
        const k = Math.min(mafiaCount, maxMafia(n));
        const ok = n >= MIN_MAFIA_PLAYERS;
        const lines = [
          ["godfather", 1],
          ["mafioso", k - 1],
          ["doctor", 1],
          ["detective", 1],
          ["civilian", n - k - 2]
        ].filter(([, c]) => c > 0);
        return (
          <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
            <Text style={styles.screenTitle}>{t("mafiaGame")}</Text>
            <Text style={styles.infoText}>{t("mafiaGameInfo")}</Text>

            {!ok ? (
              <Text style={styles.errorText}>{t("mafiaMin")}</Text>
            ) : (
              <>
                <Text style={styles.sectionLabel}>{t("mafiaSize")}</Text>
                <View style={styles.countRow}>
                  {Array.from({ length: maxMafia(n) }, (_, i) => i + 1).map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.countBtn, k === c && styles.countBtnActive]}
                      onPress={() => {
                        playSound("click");
                        setMafiaCount(c);
                      }}
                    >
                      <Text style={[styles.countText, k === c && styles.countTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionLabel}>{t("rolesPreview")}</Text>
                <View style={styles.surface}>
                  {lines.map(([role, c]) => (
                    <View key={role} style={styles.roleLine}>
                      <RoleBadge role={role} size={34} />
                      <View style={{ flex: 1, marginStart: SPACING.sm }}>
                        <Text style={[styles.rowTitle, { fontSize: 16 }]}>{ROLES[role].name[language]}</Text>
                        <Text style={styles.italian}>{ROLES[role].it}</Text>
                      </View>
                      <Text style={styles.countBig}>×{c}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.buttonPrimary, !ok && styles.buttonDisabled]}
              disabled={!ok}
              onPress={dealMafia}
            >
              <Text style={styles.buttonPrimaryText}>{t("dealRoles")}</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      })()}

      {/* ===================== MAFIA ROLE REVEAL ===================== */}
      {screen === "mafiaReveal" && (
        <View style={styles.centerWrap}>
          {mafiaIdx < players.length ? (() => {
            const p = players[mafiaIdx];
            const r = mafiaRoles[p.id];
            const tone = roleTone(r, COLORS);
            const family = players.filter(x => isMafiaRole(mafiaRoles[x.id])).map(x => x.name);
            return (
              <>
                <Text style={styles.passText}>{t("PassPhone2")}</Text>
                <View style={styles.revealPlayer}>
                  <Avatar id={p.char} name={p.name} size={92} />
                  <Text style={styles.revealName}>{p.name}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.flipCard, mafiaFlipped && styles.flipCardOpen]}
                  onPress={() => {
                    playSound("flip");
                    setMafiaFlipped(f => !f);
                  }}
                >
                  {!mafiaFlipped ? (
                    <>
                      <Text style={styles.flipQ}>?</Text>
                      <Text style={styles.flipHint}>{t("tapToFlip")}</Text>
                    </>
                  ) : (
                    <>
                      <RoleBadge role={r} size={72} />
                      <Text style={[styles.cardText, { color: tone.text, fontSize: 30 }]}>
                        {ROLES[r].name[language]}
                      </Text>
                      <Text style={styles.italian}>{ROLES[r].it}</Text>
                      <Text style={styles.roleDesc}>{ROLES[r].desc[language]}</Text>
                      {isMafiaRole(r) && (
                        <Text style={[styles.roleDesc, { color: COLORS.danger, fontWeight: "800" }]}>
                          {t("yourFamily")}: {family.join(", ")}
                        </Text>
                      )}
                    </>
                  )}
                </TouchableOpacity>

                {mafiaFlipped && (
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() => {
                      playSound("next");
                      setMafiaFlipped(false);
                      setMafiaIdx(i => i + 1);
                    }}
                  >
                    <Text style={styles.buttonPrimaryText}>{t("confirm")}</Text>
                  </TouchableOpacity>
                )}
              </>
            );
          })() : (
            <>
              <NightMark size={110} />
              <TouchableOpacity
                style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
                onPress={() => {
                  playSound("click");
                  beginNight();
                }}
              >
                <Text style={styles.buttonPrimaryText}>{t("beginNight")}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* ===================== MAFIA NIGHT ===================== */}
      {screen === "mafiaNight" && (() => {
        const p = mAlive[nightIdx];
        if (!p) return null;
        const r = mafiaRoles[p.id];
        const fam = mAlive.filter(x => isMafiaRole(mafiaRoles[x.id])).map(x => x.name);

        if (nightStep === "intro") {
          return (
            <View style={styles.centerWrap}>
              <NightMark size={110} />
              <Text style={[styles.screenTitle, { marginTop: SPACING.md }]}>
                {t("nightFalls")} {round}
              </Text>
              <Text style={styles.infoText}>{t("nightIntro")}</Text>
              <TouchableOpacity
                style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
                onPress={() => {
                  playSound("click");
                  setNightStep("pass");
                }}
              >
                <Text style={styles.buttonPrimaryText}>{t("beginNight")}</Text>
              </TouchableOpacity>
            </View>
          );
        }

        if (nightStep === "pass") {
          return (
            <View style={styles.centerWrap}>
              <Text style={styles.passText}>{t("PassPhone2")}</Text>
              <View style={styles.revealPlayer}>
                <Avatar id={p.char} name={p.name} size={110} />
                <Text style={styles.revealName}>{p.name}</Text>
              </View>
              <TouchableOpacity
                style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
                onPress={() => {
                  playSound("click");
                  setNightStep("act");
                }}
              >
                <Text style={styles.buttonPrimaryText}>{t("ready")}</Text>
              </TouchableOpacity>
            </View>
          );
        }

        if (nightStep === "result" && probe) {
          const tp = players.find(x => x.id === probe.id);
          return (
            <View style={styles.centerWrap}>
              <Avatar id={tp.char} name={tp.name} size={100} />
              <Text style={styles.revealName}>{tp.name}</Text>
              <Text
                style={[
                  styles.resultBanner,
                  { color: probe.mafia ? COLORS.danger : COLORS.success, fontSize: 26 }
                ]}
              >
                {probe.mafia ? t("isMafia") : t("isInnocent")}
              </Text>
              <TouchableOpacity
                style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
                onPress={() => {
                  playSound("click");
                  nightNext(nightActs);
                }}
              >
                <Text style={styles.buttonPrimaryText}>{t("continue")}</Text>
              </TouchableOpacity>
            </View>
          );
        }

        if (r === "civilian") {
          return (
            <View style={styles.centerWrap}>
              <NightMark size={100} />
              <Text style={[styles.infoText, { marginTop: SPACING.md }]}>{t("sleepTight")}</Text>
              <TouchableOpacity
                style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
                onPress={() => {
                  playSound("click");
                  nightNext(nightActs);
                }}
              >
                <Text style={styles.buttonPrimaryText}>{t("done")}</Text>
              </TouchableOpacity>
            </View>
          );
        }

        const targets = isMafiaRole(r)
          ? mAlive.filter(x => !isMafiaRole(mafiaRoles[x.id]))
          : r === "doctor"
          ? mAlive
          : mAlive.filter(x => x.id !== p.id);
        const prompt = isMafiaRole(r) ? t("pickTarget") : r === "doctor" ? t("pickSave") : t("pickProbe");

        return (
          <View style={{ flex: 1 }}>
            <View style={styles.voterHead}>
              <RoleBadge role={r} size={56} />
              <View style={{ marginStart: SPACING.sm, flex: 1 }}>
                <Text style={styles.rowMeta}>
                  {ROLES[r].name[language]} · {ROLES[r].it}
                </Text>
                <Text style={styles.voterName}>{p.name}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>{prompt}</Text>
            {isMafiaRole(r) && fam.length > 1 && (
              <Text style={styles.hint}>
                {t("yourFamily")}: {fam.join(", ")}
              </Text>
            )}

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.md }}>
              {targets.map(x => {
                const selected = nightPick === x.id;
                return (
                  <TouchableOpacity
                    key={x.id}
                    onPress={() => {
                      playSound("click");
                      setNightPick(x.id);
                    }}
                    style={[styles.voteOption, selected && styles.voteSelected]}
                  >
                    <Avatar id={x.char} name={x.name} size={46} />
                    <Text style={[styles.voteText, selected && styles.voteSelectedText]}>{x.name}</Text>
                    {selected && <Icon name="check" size={20} color={COLORS.onAccent} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={[styles.buttonPrimary, nightPick === null && styles.buttonDisabled]}
              disabled={nightPick === null}
              onPress={nightConfirm}
            >
              <Text style={styles.buttonPrimaryText}>{t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        );
      })()}

      {/* ===================== MAFIA DAWN ===================== */}
      {screen === "mafiaDawn" && (() => {
        const v = dawn.victim !== null ? players.find(x => x.id === dawn.victim) : null;
        const r = v ? mafiaRoles[v.id] : null;
        return (
          <View style={styles.centerWrap}>
            <Text style={styles.sectionLabelCenter}>
              {t("dawnTitle")} {round}
            </Text>
            {v ? (
              <>
                <Avatar id={v.char} name={v.name} size={110} />
                <Text style={[styles.resultBanner, { color: COLORS.danger, marginBottom: 4 }]}>{v.name}</Text>
                <Text style={styles.infoText}>{t("foundDead")}</Text>
                <View style={styles.roleChip}>
                  <RoleBadge role={r} size={30} />
                  <Text style={[styles.rowTitle, { fontSize: 16, marginStart: SPACING.xs }]}>
                    {t("wasA")} {ROLES[r].name[language]}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Mark kind="win" size={100} />
                <Text style={[styles.infoText, { marginTop: SPACING.md }]}>{t("noOneDied")}</Text>
              </>
            )}
            <TouchableOpacity
              style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
              onPress={() => afterDawnOrVerdict(() => setScreen("mafiaDay"))}
            >
              <Text style={styles.buttonPrimaryText}>{t("continue")}</Text>
            </TouchableOpacity>
          </View>
        );
      })()}

      {/* ===================== MAFIA DAY ===================== */}
      {screen === "mafiaDay" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <Text style={styles.screenTitle}>{t("townSquare")}</Text>
          <Text style={styles.infoText}>{t("townInfo")}</Text>

          {mAlive.map(p => (
            <TouchableOpacity
              key={p.id}
              style={styles.voteOption}
              onPress={() => {
                playSound("click");
                showDialog(t("eliminateTitle"), p.name, [
                  { text: t("cancel") },
                  { text: t("eliminate"), danger: true, onPress: () => eliminateMafia(p.id) }
                ]);
              }}
            >
              <Avatar id={p.char} name={p.name} size={46} />
              <Text style={styles.voteText}>{p.name}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.buttonGhost}
            onPress={() => {
              playSound("click");
              beginNight();
            }}
          >
            <Text style={styles.buttonGhostText}>{t("noElimination")}</Text>
          </TouchableOpacity>

          {mafiaDead.length > 0 && (
            <Text style={styles.hint}>
              {t("goneList")}: {mafiaDead.map(id => players.find(x => x.id === id)?.name).join(", ")}
            </Text>
          )}
        </ScrollView>
      )}

      {/* ===================== MAFIA VERDICT ===================== */}
      {screen === "mafiaVerdict" && (() => {
        const v = players.find(x => x.id === verdict);
        if (!v) return null;
        const r = mafiaRoles[v.id];
        return (
          <View style={styles.centerWrap}>
            <Text style={styles.sectionLabelCenter}>{t("verdict")}</Text>
            <Avatar id={v.char} name={v.name} size={110} />
            <Text style={[styles.resultBanner, { marginBottom: 4 }]}>{v.name}</Text>
            <Text style={styles.infoText}>{t("sentAway")}</Text>
            <View style={styles.roleChip}>
              <RoleBadge role={r} size={30} />
              <Text style={[styles.rowTitle, { fontSize: 16, marginStart: SPACING.xs }]}>
                {t("wasA")} {ROLES[r].name[language]}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.buttonPrimary, { alignSelf: "stretch" }]}
              onPress={() => afterDawnOrVerdict(beginNight)}
            >
              <Text style={styles.buttonPrimaryText}>{t("continue")}</Text>
            </TouchableOpacity>
          </View>
        );
      })()}

      {/* ===================== MAFIA RESULT ===================== */}
      {screen === "mafiaResult" && (
        <ScrollView contentContainerStyle={{ alignItems: "stretch", paddingBottom: SPACING.xl }}>
          <Text style={styles.sectionLabelCenter}>{t("gameResult")}</Text>
          <View style={{ alignItems: "center" }}>
            <Mark kind={mafiaWinner === "mafia" ? "imposter" : "win"} size={120} />
          </View>
          <Text
            style={[
              styles.resultBanner,
              { color: mafiaWinner === "mafia" ? COLORS.danger : COLORS.success }
            ]}
          >
            {mafiaWinner === "mafia" ? t("familyWins") : t("cityWins")}
          </Text>

          {players.map(p => {
            const r = mafiaRoles[p.id];
            const out = mafiaDead.includes(p.id);
            return (
              <View key={p.id} style={[styles.rowCard, out && { opacity: 0.55 }]}>
                <Avatar id={p.char} name={p.name} size={46} />
                <View style={{ flex: 1, marginStart: SPACING.sm }}>
                  <Text style={styles.rowTitle}>{p.name}</Text>
                  <Text style={[styles.rowMeta, { color: roleTone(r, COLORS).text, fontWeight: "800" }]}>
                    {ROLES[r].name[language]} · {ROLES[r].it}
                  </Text>
                </View>
                <Text style={styles.rowMeta}>{out ? t("gone") : t("alive")}</Text>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              playSound("click");
              setScreen("mafiaConfig");
            }}
          >
            <Text style={styles.buttonPrimaryText}>{t("playAgain")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => goHome(false)}>
            <Text style={styles.buttonSecondaryText}>{t("newGame")}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ===================== ABOUT ===================== */}
      {screen === "about" && (
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xl }}>
          <View style={{ alignItems: "center" }}>
            <Mark kind="spy" size={110} />
          </View>
          <Text style={styles.screenTitle}>{t("about")}</Text>
          <Text style={[styles.infoText, { fontWeight: "800" }]}>DAKHIL v{APP_VERSION}</Text>

          <View style={styles.surface}>
            <Text style={styles.aboutText}>
              {`دخيل هي لعبة جماعية تعتمد على الملاحظة، النقاش، والخداع.

جميع اللاعبين يحصلون على نفس الكلمة السرية — باستثناء الدخلاء.
من خلال طرح الأسئلة والإجابات الذكية، على اللاعبين اكتشاف من لا يعرف الكلمة… قبل فوات الأوان.

اللعبة مثالية للأصدقاء والعائلة والجلسات الجماعية، وتشجع على التواصل، التفكير، والضحك.

كلمة واحدة.
كاذب واحد.
من هو الدخيل؟`}
            </Text>
          </View>

          <Text style={styles.resultText}>GitHub: https://github.com/git-sal0/dakhil-game</Text>
          <Text style={styles.resultText}>dev: Salma.E.M</Text>

          {/* five quiet dots. each one is a theme. */}
          <View style={styles.secretRow}>
            {SECRET_THEMES.map(key => {
              const active = theme === key;
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.6}
                  style={styles.secretHit}
                  onPress={() => pickSecret(key)}
                >
                  <View
                    style={[
                      styles.secretDot,
                      active && {
                        backgroundColor: THEMES[key].primary,
                        opacity: 1,
                        transform: [{ scale: 1.35 }]
                      }
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <Animated.Text style={[styles.toast, { opacity: toastOp }]}>{toast}</Animated.Text>
        </ScrollView>
      )}

      {COLORS.fx && <ThemeFront key={theme + "-front"} fx={COLORS.fx} />}

      {/* theme switch veil */}
      <Animated.View
        pointerEvents="none"
        style={[FILL, { backgroundColor: fadeBg, opacity: fade, zIndex: 50, elevation: 50 }]}
      />
    </View>
    </ThemeCtx.Provider>
  );
}

/* ===================== STYLES ===================== */

const makeStyles = COLORS => {
  // card elevation: soft by default, none on translucent themes, hard ink offset on riso
  const lift = (o, r, y, e) =>
    COLORS.hard
      ? { shadowColor: COLORS.text, shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 3, height: 3 }, elevation: 0 }
      : COLORS.fx
      ? { shadowOpacity: 0, elevation: 0 }
      : { shadowColor: "#000", shadowOpacity: o, shadowRadius: r, shadowOffset: { width: 0, height: y }, elevation: e };

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: SPACING.lg,
      backgroundColor: COLORS.bg
    },

    /* header */
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
      zIndex: 10
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardAlt,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8
    },
    pillText: {
      fontFamily: COLORS.font,
      color: COLORS.text,
      fontWeight: "800",
      marginStart: 8
    },

    /* typography */
    screenTitle: {
      fontSize: 28,
      fontFamily: COLORS.font,
      fontWeight: "900",
      textAlign: "center",
      color: COLORS.text,
      marginBottom: SPACING.md
    },
    brand: {
      fontSize: 48,
      fontFamily: COLORS.font,
      fontWeight: "900",
      textAlign: "center",
      color: COLORS.primary
    },
    homeTagline: {
      textAlign: "center",
      color: COLORS.muted,
      fontSize: 16,
      fontFamily: COLORS.font,
      marginTop: 4,
      marginBottom: SPACING.md
    },
    sectionLabel: {
      color: COLORS.muted,
      fontSize: 13,
      fontFamily: COLORS.font,
      fontWeight: "800",
      marginTop: SPACING.md,
      marginBottom: SPACING.xs
    },
    sectionLabelCenter: {
      color: COLORS.muted,
      fontSize: 14,
      fontFamily: COLORS.font,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: SPACING.xs
    },
    infoText: {
      color: COLORS.muted,
      textAlign: "center",
      fontSize: 15,
      fontFamily: COLORS.font,
      lineHeight: 22,
      marginBottom: SPACING.md
    },
    aboutText: {
      color: COLORS.text,
      fontSize: 15,
      fontFamily: COLORS.font,
      lineHeight: 26,
      textAlign: "center"
    },
    resultText: {
      textAlign: "center",
      fontSize: 15,
      fontFamily: COLORS.font,
      color: COLORS.muted,
      marginTop: SPACING.sm
    },
    hint: {
      color: COLORS.muted,
      textAlign: "center",
      fontSize: 12,
      fontFamily: COLORS.font,
      marginTop: 2
    },
    version: {
      color: COLORS.muted,
      fontSize: 12,
      fontFamily: COLORS.font,
      textAlign: "center",
      marginTop: SPACING.lg,
      opacity: 0.7
    },
    errorText: {
      fontFamily: COLORS.font,
      color: COLORS.danger,
      textAlign: "center",
      marginBottom: SPACING.xs
    },

    /* surfaces */
    surface: {
      backgroundColor: COLORS.card,
      borderRadius: 22,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...lift(0.12, 8, 4, 3)
    },
    rowCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.card,
      borderRadius: 20,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...lift(0.1, 6, 3, 2)
    },
    rowTitle: {
      color: COLORS.text,
      fontSize: 18,
      fontFamily: COLORS.font,
      fontWeight: "800"
    },
    rowMeta: {
      color: COLORS.muted,
      fontSize: 13,
      fontFamily: COLORS.font,
      marginTop: 2
    },
    input: {
      backgroundColor: COLORS.cardAlt,
      borderRadius: 16,
      padding: 14,
      color: COLORS.text,
      fontSize: 17,
      fontFamily: COLORS.font,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.border
    },

    /* buttons */
    buttonPrimary: {
      backgroundColor: COLORS.primary,
      paddingVertical: 16,
      borderRadius: 22,
      alignItems: "center",
      marginTop: SPACING.lg,
      borderBottomWidth: 5,
      borderBottomColor: COLORS.primaryDark
    },
    buttonPrimaryText: {
      fontSize: 18,
      fontFamily: COLORS.font,
      fontWeight: "900",
      color: COLORS.onPrimary,
      textTransform: "uppercase"
    },
    buttonSecondary: {
      backgroundColor: COLORS.card,
      paddingVertical: 14,
      borderRadius: 20,
      alignItems: "center",
      marginVertical: 6,
      borderWidth: 2,
      borderColor: COLORS.secondary,
      borderBottomWidth: 4,
      borderBottomColor: COLORS.secondaryDark
    },
    buttonSecondaryText: {
      fontSize: 17,
      fontFamily: COLORS.font,
      fontWeight: "800",
      color: COLORS.secondary
    },
    buttonGhost: {
      paddingVertical: 14,
      borderRadius: 20,
      alignItems: "center",
      marginTop: SPACING.sm,
      borderWidth: 2,
      borderColor: COLORS.border
    },
    buttonGhostText: {
      color: COLORS.muted,
      fontWeight: "800",
      fontSize: 16,
      fontFamily: COLORS.font
    },
    buttonDisabled: {
      opacity: 0.35
    },
    iconBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: COLORS.cardAlt,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
      marginStart: 8
    },
    removeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: COLORS.cardAlt,
      alignItems: "center",
      justifyContent: "center",
      marginStart: 8
    },
    miniBtn: {
      borderWidth: 1,
      borderColor: COLORS.secondary,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginStart: 6
    },
    miniBtnDanger: {
      borderColor: COLORS.danger
    },
    miniBtnText: {
      color: COLORS.secondary,
      fontWeight: "800",
      fontSize: 12,
      fontFamily: COLORS.font
    },

    /* home */
    homeWrap: {
      flex: 1,
      justifyContent: "center"
    },
    homeTopBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md
    },
    iconRow: {
      flexDirection: "row",
      alignItems: "center"
    },
    segment: {
      flexDirection: "row",
      backgroundColor: COLORS.cardAlt,
      borderRadius: 20,
      padding: 4,
      borderWidth: 1,
      borderColor: COLORS.border
    },
    segBtn: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 16
    },
    segActive: {
      backgroundColor: COLORS.primary
    },
    segText: {
      fontFamily: COLORS.font,
      fontWeight: "900",
      color: COLORS.muted
    },
    segTextActive: {
      color: COLORS.onAccent
    },
    mascotWrap: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: SPACING.sm
    },
    mascotGlow: {
      position: "absolute",
      width: 190,
      height: 190,
      borderRadius: 95,
      backgroundColor: COLORS.primary,
      opacity: 0.16
    },
    crowd: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: SPACING.sm
    },
    crowdItem: {
      marginHorizontal: 3,
      backgroundColor: COLORS.cardAlt,
      borderRadius: 18,
      padding: 4
    },

    /* setup */
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap"
    },
    chip: {
      backgroundColor: COLORS.card,
      borderWidth: 2,
      borderColor: COLORS.secondary,
      borderRadius: 16,
      paddingVertical: 10,
      paddingHorizontal: 18,
      marginEnd: 8,
      marginBottom: 8
    },
    chipText: {
      color: COLORS.secondary,
      fontSize: 18,
      fontFamily: COLORS.font,
      fontWeight: "900"
    },
    avatarBtn: {
      backgroundColor: COLORS.cardAlt,
      borderRadius: 18,
      padding: 2
    },
    miniAvatars: {
      flexDirection: "row",
      marginTop: 6
    },

    /* category */
    catMain: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center"
    },
    catBadge: {
      width: 46,
      height: 46,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center"
    },
    catBadgeText: {
      fontSize: 22,
      fontFamily: COLORS.font,
      fontWeight: "900",
      color: "#2B1B1B"
    },
    catActions: {
      flexDirection: "row",
      alignItems: "center"
    },

    /* mode / config */
    modeCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.card,
      borderRadius: 22,
      padding: 14,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: COLORS.border
    },
    modeCardActive: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.cardAlt
    },
    radio: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center"
    },
    radioActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary
    },
    countRow: {
      flexDirection: "row"
    },
    countBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 18,
      alignItems: "center",
      backgroundColor: COLORS.card,
      borderWidth: 2,
      borderColor: COLORS.border,
      marginEnd: 8
    },
    countBtnActive: {
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.secondary
    },
    countText: {
      color: COLORS.text,
      fontWeight: "800",
      fontSize: 16,
      fontFamily: COLORS.font
    },
    countTextActive: {
      color: COLORS.onSecondary
    },

    /* reveal */
    centerWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    passText: {
      color: COLORS.muted,
      fontSize: 15,
      fontFamily: COLORS.font,
      fontWeight: "700",
      textAlign: "center"
    },
    revealPlayer: {
      alignItems: "center",
      marginVertical: SPACING.sm
    },
    revealName: {
      fontSize: 28,
      fontFamily: COLORS.font,
      fontWeight: "900",
      color: COLORS.text,
      marginTop: 4
    },
    flipCard: {
      alignSelf: "stretch",
      backgroundColor: COLORS.solid || COLORS.card,
      borderRadius: 28,
      minHeight: 220,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: SPACING.md,
      borderWidth: 3,
      borderColor: COLORS.primary,
      padding: SPACING.md,
      shadowColor: COLORS.primary,
      shadowOpacity: 0.35,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6
    },
    flipCardOpen: {
      borderColor: COLORS.secondary,
      shadowColor: COLORS.secondary
    },
    flipQ: {
      fontSize: 80,
      fontFamily: COLORS.font,
      fontWeight: "900",
      color: COLORS.primary
    },
    flipHint: {
      color: COLORS.muted,
      fontSize: 15,
      fontFamily: COLORS.font,
      fontWeight: "700"
    },
    cardText: {
      fontSize: 38,
      fontFamily: COLORS.font,
      color: COLORS.text,
      fontWeight: "900",
      textAlign: "center",
      marginTop: 6
    },

    /* discussion / crew */
    crew: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center"
    },
    crewItem: {
      width: 92,
      alignItems: "center",
      margin: 6
    },
    crewName: {
      fontFamily: COLORS.font,
      color: COLORS.text,
      fontWeight: "800",
      marginTop: 4,
      maxWidth: 90
    },
    dangerRing: {
      borderWidth: 3,
      borderColor: COLORS.danger,
      borderRadius: 50,
      padding: 4
    },

    /* voting */
    voterHead: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.card,
      borderRadius: 22,
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.border
    },
    voterName: {
      color: COLORS.text,
      fontSize: 24,
      fontFamily: COLORS.font,
      fontWeight: "900"
    },
    voteOption: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.card,
      padding: 12,
      borderRadius: 20,
      marginVertical: 5,
      borderWidth: 2,
      borderColor: COLORS.border
    },
    voteSelected: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primaryDark
    },
    voteDisabled: {
      opacity: 0.35
    },
    voteText: {
      flex: 1,
      marginStart: SPACING.sm,
      fontSize: 20,
      fontFamily: COLORS.font,
      color: COLORS.text,
      fontWeight: "800"
    },
    voteSelectedText: {
      color: COLORS.onAccent
    },

    /* results */
    barTrack: {
      height: 10,
      borderRadius: 5,
      backgroundColor: COLORS.cardAlt,
      marginTop: 8,
      overflow: "hidden"
    },
    barFill: {
      height: 10,
      borderRadius: 5,
      backgroundColor: COLORS.primary
    },
    countBig: {
      color: COLORS.text,
      fontSize: 26,
      fontFamily: COLORS.font,
      fontWeight: "900",
      marginStart: SPACING.sm
    },
    resultBanner: {
      fontSize: 32,
      fontFamily: COLORS.font,
      fontWeight: "900",
      textAlign: "center",
      marginVertical: SPACING.md
    },
    wordBig: {
      color: COLORS.text,
      fontSize: 30,
      fontFamily: COLORS.font,
      fontWeight: "900"
    },

    /* modals */
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      padding: SPACING.lg
    },
    modalCard: {
      backgroundColor: COLORS.solid || COLORS.card,
      borderRadius: 26,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.border
    },
    modalTitle: {
      color: COLORS.text,
      fontSize: 22,
      fontFamily: COLORS.font,
      fontWeight: "900",
      textAlign: "center",
      marginBottom: SPACING.xs
    },
    modalMessage: {
      color: COLORS.muted,
      fontSize: 16,
      fontFamily: COLORS.font,
      textAlign: "center",
      marginBottom: SPACING.md
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "center"
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 18,
      alignItems: "center",
      marginHorizontal: 4,
      borderWidth: 2,
      borderColor: COLORS.secondary
    },
    modalButtonPrimary: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary
    },
    modalButtonDanger: {
      backgroundColor: COLORS.danger,
      borderColor: COLORS.danger
    },
    modalButtonText: {
      color: COLORS.secondary,
      fontWeight: "900",
      fontSize: 16,
      fontFamily: COLORS.font
    },
    modalButtonTextOn: {
      color: COLORS.onAccent
    },
    pickerGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: SPACING.sm
    },
    pickerItem: {
      width: "20%",
      alignItems: "center",
      padding: 4,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: "transparent",
      marginBottom: 6
    },
    pickerItemActive: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.cardAlt
    },

    /* mafia */
    italian: {
      fontFamily: COLORS.font,
      color: COLORS.muted,
      fontSize: 13,
      fontStyle: "italic",
      letterSpacing: 1.5,
      marginTop: 2
    },
    roleDesc: {
      fontFamily: COLORS.font,
      color: COLORS.muted,
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
      marginTop: SPACING.xs
    },
    roleChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.cardAlt,
      borderRadius: 22,
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginVertical: SPACING.sm
    },
    roleLine: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6
    },

    /* secret theme dots (About) */
    secretRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: SPACING.xl
    },
    secretHit: {
      padding: 12
    },
    secretDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: COLORS.muted,
      opacity: 0.28
    },
    toast: {
      textAlign: "center",
      color: COLORS.muted,
      fontSize: 13,
      fontFamily: COLORS.font,
      fontWeight: "800",
      letterSpacing: 2,
      height: 20,
      textTransform: "uppercase"
    }
  });
};