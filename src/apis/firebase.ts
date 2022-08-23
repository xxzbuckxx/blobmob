import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  updateCurrentUser,
} from "firebase/auth";
import { game } from "@App";
import shop from "@Game/shop";
import { player } from "@Game/entities/player";

const {
  VITE_API_KEY,
  VITE_AUTH_DOMAIN,
  VITE_PROJECT_ID,
  VITE_STORAGE_BUCKET,
  VITE_MESSAGING_SENDER_ID,
  VITE_APP_ID,
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const getAccount = async () => {
  const uid = "" + auth?.currentUser?.uid;
  if (uid === "undefined") {
    return;
  }

  const docRef = doc(db, "players", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(docSnap.data());
    const {
      coins,
      playerAttr,
      purchasedBodies,
      purchasedFaces,
      purchasedHats,
    } = docSnap.data();

    game.coins = coins;
    shop.purchasedBodies = purchasedBodies;
    shop.purchasedFaces = purchasedFaces;
    shop.purchasedHats = purchasedHats;
    player.updateAttributes(playerAttr);
  } else {
    console.log("firebase: getAccount: Creating new user");
    await setDoc(docRef, {
      uid: uid,
      username: auth?.currentUser?.displayName,
      coins: game.coins,
      playerAttr: {
        maxSpeed: player.maxSpeed,
        maxCool: player.maxCool,
        maxPower: player.maxPower,
        maxHealth: player.maxHealth,
      },
      purchasedBodies: shop.purchasedBodies,
      purchasedFaces: shop.purchasedFaces,
      purchasedHats: shop.purchasedHats,
    });
    saveHighscore(game.highscore);
  }
};

export const updateAccount = async () => {
  const uid = "" + auth?.currentUser?.uid;
  if (uid === "undefined") {
    return;
  }

  const docRef = doc(db, "players", uid);
  await updateDoc(docRef, {
    coins: game.coins,
    playerAttr: {
      maxSpeed: player.maxSpeed,
      maxCool: player.maxCool,
      maxPower: player.maxPower,
      maxHealth: player.maxHealth,
    },
    purchasedBodies: shop.purchasedBodies,
    purchasedFaces: shop.purchasedFaces,
    purchasedHats: shop.purchasedHats,
  });
};

export const getHighscore = async () => {
  console.log("firebase: getHighscore: GETTING HIGHSCORE");

  const uid = "" + auth?.currentUser?.uid;
  const docRef = doc(db, "highscores", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(
      "firebase: getHighscore: Highscore exists:",
      docSnap.data().score
    );
    game.highscore = docSnap.data().score;
  } else {
    console.error("firebase: getHighscore: couldn't retrieve highscore");
  }
};

export const saveHighscore = async (score: Number) => {
  try {
    const uid = "" + auth?.currentUser?.uid;
    const docRef = doc(db, "highscores", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Highscore exists");
      if (score > docSnap.data().score) {
        await updateDoc(docRef, {
          score: score,
        });
      } else {
        console.log("not a new highscore :/");
      }
    } else {
      const highscoresRef = collection(db, "highscores");
      const newDocRef = await setDoc(doc(highscoresRef, uid), {
        uid: uid,
        username: auth?.currentUser?.displayName,
        score: score,
      });
      console.log("Document written");
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const signInGoogle = () => {
  console.log("sign in attempt");
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider).then((result) => {
    const user = result.user;
    console.log(user);
  });
  getAccount();
};

export const signInFacebook = () => {
  console.log("sign in attempt");
  const provider = new FacebookAuthProvider();

  signInWithPopup(auth, provider).then((result) => {
    const user = result.user;
  });
};

export const signOut = () => {
  auth.signOut();
  window.location.reload();
};
