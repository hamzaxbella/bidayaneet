import Link from "next/link";
import Brand from "@/components/Brand";
export default function NotFound() {
  return (
    <main className="error-page">
      <Brand />
      <span className="eyebrow">404 · UN AUTRE CHEMIN</span>
      <h1>Cette page est introuvable.</h1>
      <p>
        Vérifie l’adresse ou utilise le bouton précédent pour retrouver ton
        espace.
      </p>
      <Link className="button button-primary" href="/auth/neet/sign-in">
        Connexion à l’espace jeune
      </Link>
    </main>
  );
}
