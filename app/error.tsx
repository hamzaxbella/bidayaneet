"use client";
import { useEffect } from "react";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="error-page">
      <span className="eyebrow">REPRENONS LE CHEMIN</span>
      <h1>La page n’a pas pu s’afficher.</h1>
      <p>Réessaie dans un instant. Ton prochain pas t’attend.</p>
      <button className="button button-primary" onClick={reset}>
        Réessayer
      </button>
    </main>
  );
}
