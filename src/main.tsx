import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from "./contexts/language.context.tsx";
import "./i18n/index.ts";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>

      <App />
    </LanguageProvider>
  </StrictMode>,
)

// import { StrictMode, useEffect } from "react";
// import { createRoot } from "react-dom/client";
// import { LanguageProvider } from "./contexts/language.context.tsx";
// import "./i18n/index.ts";
// import "./index.css";
// import App from "./App.tsx";

// import { createChat } from "@n8n/chat";
// import "@n8n/chat/style.css";

// // Wrapper component عشان نشغّل الشات صح
// function Root() {
//   useEffect(() => {
//     createChat({
//       webhookUrl:
//         "https://ayaanwar.app.n8n.cloud/webhook/a6b1a0e3-8102-428e-bb8a-8ebfaf3ebff7/chat",
//     });
//   }, []);

//   return (
//     <LanguageProvider>
//       <App />
//     </LanguageProvider>
//   );
// }

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <Root />
//   </StrictMode>
// );

// import { StrictMode, useEffect } from "react";
// import { createRoot } from "react-dom/client";
// import { LanguageProvider } from "./contexts/language.context.tsx";
// import "./i18n/index.ts";
// import "./index.css";
// import App from "./App.tsx";

// import { createChat } from "@n8n/chat";
// import "@n8n/chat/style.css";

// /* =========================================================
//    أسئلة الاقتراح اللي هتظهر كـ "Chips" فوق زر الشات
//    عدّلي النصوص دي زي ما يناسب منصة مشاريع التخرج بتاعتك
//    ========================================================= */
// const SUGGESTED_QUESTIONS = [
//   "اقترح لي فكرة مشروع تخرج 💡",
//   "دوّر لي على مشاريع مشابهة لفكرتي",
//   "إزاي أسجل مشروعي على المنصة؟",
//   "إيه الأقسام المتاحة في المنصة؟",
// ];

// /**
//  * بيدور على الـ textarea وزرار الإرسال جوه الشات بوت بتاع n8n
//  * ويكتب فيه السؤال ويبعته تلقائي زي ما لو المستخدم كتبه بنفسه
//  */
// function sendSuggestion(text: string) {
//   const textarea = document.querySelector<HTMLTextAreaElement>(
//     ".chat-input textarea, .chat-inputs textarea, textarea[data-test-id='chat-input']"
//   );
//   const sendButton = document.querySelector<HTMLButtonElement>(
//     ".chat-input button[type='submit'], .chat-input-send-button, button[data-test-id='send-message-button']"
//   );

//   if (!textarea) return;

//   // لازم نستخدم الـ native setter عشان React/Vue يحسّوا إن القيمة اتغيرت فعلاً
//   const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
//     window.HTMLTextAreaElement.prototype,
//     "value"
//   )?.set;
//   nativeInputValueSetter?.call(textarea, text);
//   textarea.dispatchEvent(new Event("input", { bubbles: true }));
//   textarea.focus();

//   setTimeout(() => {
//     if (sendButton) {
//       sendButton.click();
//     } else {
//       textarea.dispatchEvent(
//         new KeyboardEvent("keydown", {
//           key: "Enter",
//           code: "Enter",
//           bubbles: true,
//         })
//       );
//     }
//   }, 60);
// }

// /**
//  * بيبني شريط الاقتراحات (chips) ويضيفه فوق نافذة الشات
//  * وبيظهره بس لما الشات يكون مفتوح
//  */
// function setupSuggestionChips() {
//   if (document.getElementById("chat-suggestions-bar")) return;

//   const bar = document.createElement("div");
//   bar.id = "chat-suggestions-bar";
//   bar.className = "chat-suggestions-bar";

//   SUGGESTED_QUESTIONS.forEach((question) => {
//     const chip = document.createElement("button");
//     chip.type = "button";
//     chip.className = "suggestion-chip";
//     chip.textContent = question;
//     chip.addEventListener("click", () => sendSuggestion(question));
//     bar.appendChild(chip);
//   });

//   document.body.appendChild(bar);

//   // نراقب الصفحة عشان نظهر/نخفي شريط الاقتراحات حسب فتح وقفل الشات
//   const observer = new MutationObserver(() => {
//     const chatIsOpen = !!document.querySelector(".chat-window");
//     const hasMessages = !!document.querySelector(".chat-message");
//     bar.classList.toggle("is-visible", chatIsOpen && !hasMessages);
//   });

//   observer.observe(document.body, { childList: true, subtree: true });
// }

// function Root() {
//   useEffect(() => {
//     createChat({
//       webhookUrl:
//         "https://khotwaplatform.app.n8n.cloud/webhook/9609c13b-98ba-493f-a7a0-91ce5eb79990/chat",
//       mode: "window",
//       showWelcomeScreen: true,
//       initialMessages: [
//         "أهلاً بيك 👋",
//         "أنا المساعد الذكي لمنصة مشاريع التخرج، تقدر تسألني عن أفكار المشاريع، أو تدور على مشاريع مشابهة، أو تعرف إزاي تسجل مشروعك.",
//       ],
//       i18n: {
//         en: {
//           title: "🎓 مساعد مشاريع التخرج",
//           subtitle: "اسألني عن أي حاجة تخص المشاريع والأفكار",
//           footer: "",
//           getStarted: "ابدأ المحادثة",
//           inputPlaceholder: "اكتب سؤالك هنا...",
//           closeButtonTooltip: "إغلاق",
//         },
//       },
//     });

//     // نأخر شوية عشان الشات يخلص يركب نفسه في الـ DOM الأول
//     const timeoutId = setTimeout(setupSuggestionChips, 300);

//     return () => {
//       clearTimeout(timeoutId);
//       document.getElementById("chat-suggestions-bar")?.remove();
//     };
//   }, []);

//   return (
//     <LanguageProvider>
//       <App />
//     </LanguageProvider>
//   );
// }

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <Root />
//   </StrictMode>
// );