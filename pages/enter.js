import { signInWithPopup, signInAnonymously, signOut } from "firebase/auth";
import { auth , firestore, googleAuthProvider } from "../lib/firebase";
import { doc , getDoc , getFirestore, writeBatch  } from "firebase/firestore";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);
  // 1. user is signed out <SignInButton />
  // 2. user is signed in, but missing username <UsernameForm />
  // 3. user is signed in, has username <SignOutButton />
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="btn-google" onClick={() => signInWithGoogle()}>
      <img src={"/google-icon.png"} /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(getFirestore(), "users", user.uid);
    const usernameDoc = doc(getFirestore(), "usernames", formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(getFirestore());
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });

    batch.set(usernameDoc, { uid: user.uid });

    try {
      await batch.commit();
    } catch (error) {
      print(error);
    }
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setIsValid(false);
      setLoading(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setIsValid(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        setLoading(true);
        const ref = doc(getFirestore(), "usernames", username);
        const snap = await getDoc(ref);
        console.log("Firestore read executed!", snap.exists());
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500), []);

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
          <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>
          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
};

function UsernameMessage({username , isValid , loading}){
  if (loading) {
    return <p>Checking Username...</p>
  }
  else if (isValid) {
    return <p className="text-success">{username} is available!</p>
  }
  else if (username && !isValid) {
    return <p className="text-danger">This username is not available!</p>
  }
  else {
    return <p></p>
  }
}