import {
  getDatabasesFromPage,
  queryDatabase,
  getPageImages,
  parseConfig,
  parsePrices,
  parseExtras,
  parseRules,
  parsePortfolio,
  parseSocials,
  parseAvatar,
} from "@/lib/notion";
import ClientUI from "@/components/ClientUI";

export const revalidate = 60;

export default async function Home() {
  const pageId = process.env.NOTION_PAGE_ID;

  if (!pageId) {
    throw new Error("NOTION_PAGE_ID не задан в .env.local");
  }

  const databases = await getDatabasesFromPage(pageId);

  let config = {};
  let prices = [];
  let extras = [];
  let rules = [];
  let portfolio = [];
  let socials = [];
  let avatarUrl = null;

  for (const db of databases) {
    const title = (db.child_database?.title || "").toLowerCase();
    const items = await queryDatabase(db.id);

    if (title.includes("config") || title.includes("конфиг") || title.includes("настройки")) {
      config = parseConfig(items);
    }
    else if (title.includes("price") || title.includes("цена") || title.includes("прайс")) {
      prices = parsePrices(items);
    }
    else if (title.includes("extra") || title.includes("доп") || title.includes("добавка")) {
      extras = parseExtras(items);
    }
    else if (title.includes("rule") || title.includes("правило") || title.includes("tos")) {
      rules = parseRules(items);
    }
    else if (title.includes("portfolio") || title.includes("работа") || title.includes("арт") || title.includes("портфолио")) {
      portfolio = parsePortfolio(items);
    }
    else if (title.includes("social") || title.includes("соц") || title.includes("ссылки")) {
      socials = parseSocials(items);
    }
    else if (title.includes("avatar") || title.includes("аватар")) {
      avatarUrl = parseAvatar(items);
    }
  }

  if (portfolio.length === 0) {
    const pageImages = await getPageImages(pageId);
    portfolio = pageImages.map((url, i) => ({
      name: `Art ${i + 1}`,
      image: url,
      category: "",
    }));
  }

  const defaultConfig = {
    nickname: "rinne",
    title: "Illustrator",
    status: "open",
    slots_total: "3",
    slots_taken: "2",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=rinne&backgroundColor=e9d5ff",
    footer_text: "Made with love by rinne",
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Если аватарка загружена файлом в базу Avatar — она приоритетнее URL из Config
  if (avatarUrl) {
    finalConfig.avatar_url = avatarUrl;
  }

  return (
    <ClientUI
      config={finalConfig}
      prices={prices}
      extras={extras}
      rules={rules}
      portfolio={portfolio}
      socials={socials}
    />
  );
}
