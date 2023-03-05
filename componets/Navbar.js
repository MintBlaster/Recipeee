import Link from "next/link";

export default function Navbar() {
  const user = 'u';
  const username = 'l';

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">Home</button>
          </Link>
        </li>

        {/*user is signed in and has username */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || "/hacker.png"} />
              </Link>
            </li>
          </>
        )}
        {/*user is not singed OR has not created username */}
        {!username && (
          <>
            <li>
              <Link href="/enter">
                <button className="btn-blue">Log In</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
