# French and Arabic interface

The production web console (`/platform`), authentication pages and browser field view (`/terrain`) support French and Arabic. The FR / العربية control changes the interface immediately without remounting forms. Arabic uses RTL navigation and layout; email, phone, passwords and date inputs retain LTR formatting. User-entered text inputs use automatic direction.

The preference is saved in a `bidaya-language` cookie for one year. The root server layout reads it with the current asynchronous Next.js cookies API and renders the correct language and direction before hydration. Only the exact value `ar` selects Arabic; other values use French.

`components/LanguageProvider.tsx` contains the context, switcher, date formatting and translation lookup. `lib/translations.ts` maps French interface copy to Arabic. Data keys and submitted enum values remain unchanged. Names, descriptions, messages and field notes retain their entered language; records are not automatically translated. CSV column headings, states and yes/no values follow the selected interface language.

This change is for the web platform. It does not change the standalone React Native APK. Historical prototype dashboards outside `/platform` are not part of this translation surface.

Verification includes desktop and mobile language persistence across reload and navigation, RTL drawer placement, language switching while a form contains unsaved Arabic text, authentication error messages, recorded names, Arabic CSV, all mediator sections, no horizontal page overflow and browser runtime errors. Existing permission, diagnosis, nominal journey and offline synchronization checks also run against isolated test data.
