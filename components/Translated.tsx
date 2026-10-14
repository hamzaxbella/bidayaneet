"use client";
import { useTranslation } from "./LanguageProvider";
export default function Translated({ value }: { value: string }) {
  const { text } = useTranslation();
  return <>{text(value)} </>;
}
