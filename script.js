const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLanguage: "ru",
            buttonText: "Нажми на меня!",
            newWord: "",
            words: [],
            apiKey: "ТВОЙ_API_КЛЮЧ", // ВСТАВЬ СВОЙ API-ключ от OpenAI
            texts: {
                ru: {
                    button: "Нажми на меня!",
                    clicked: "Ты нажал на меня!",
                    heading: "Добро пожаловать в приложение для изучения немецкого!",
                    subheading: "Здесь ты можешь учить новые немецкие слова",
                },
                de: {
                    button: "Klick mich!",
                    clicked: "Du hast mich geklickt!",
                    heading: "Willkommen in der Learn-German-App!",
                    subheading: "Hier kannst du neue deutsche Wörter lernen",
                },
                en: {
                    button: "Click me!",
                    clicked: "You clicked me!",
                    heading: "Welcome to the Learn-German App!",
                    subheading: "Here you can learn new German words",
                }
            }
        };
    },
    methods: {
        async fetchWords() {
            const response = await fetch("words.json");
            this.words = await response.json();
        },
        async translateWord(word, targetLang) {
            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "system", content: `Переведи слово "${word}" на ${targetLang}` }],
                        max_tokens: 10
                    })
                });

                const data = await response.json();
                return data.choices[0].message.content.trim();
            } catch (error) {
                console.error("Ошибка при переводе:", error);
                return "Ошибка перевода";
            }
        },
        async addWord() {
            if (this.newWord.trim() !== "") {
                const translatedDe = await this.translateWord(this.newWord, "немецкий");
                const translatedEn = await this.translateWord(this.newWord, "английский");

                this.words.push({
                    ru: this.newWord,
                    de: translatedDe,
                    en: translatedEn
                });

                this.newWord = "";
            }
        },
        removeWord(index) {
            this.words.splice(index, 1);
        }
    },
    mounted() {
        this.fetchWords();
    }
}).mount("#app");
