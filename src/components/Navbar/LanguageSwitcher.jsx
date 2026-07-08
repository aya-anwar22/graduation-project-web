import { useLanguage } from "../../contexts/language.context.tsx";

const LanguageSwitcher = () => {
    const { lang, changeLanguage } = useLanguage();

    return (
        <div className="flex gap-2">
            <button
                onClick={() => changeLanguage("ar")}
                className={lang === "ar" ? "font-bold" : ""}
            >
                AR
            </button>
            <button
                onClick={() => changeLanguage("en")}
                className={lang === "en" ? "font-bold" : ""}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
