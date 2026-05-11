import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

/* ─── Helpers ─── */
function getPropText(properties, key) {
  const prop = properties[key];
  if (!prop) return "";

  switch (prop.type) {
    case "title":
      return prop.title?.[0]?.plain_text || "";
    case "rich_text":
      return prop.rich_text?.[0]?.plain_text || "";
    case "url":
      return prop.url || "";
    case "number":
      return prop.number ?? "";
    case "checkbox":
      return prop.checkbox;
    case "select":
      return prop.select?.name || "";
    case "files": {
      const file = prop.files?.[0];
      if (!file) return "";
      if (file.type === "file") return file.file.url;
      if (file.type === "external") return file.external.url;
      return "";
    }
    default:
      return "";
  }
}

/* ─── Fetch databases from a Notion page ─── */
export async function getDatabasesFromPage(pageId) {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });
  return blocks.results.filter((b) => b.type === "child_database");
}

/* ─── Query a database ─── */
export async function queryDatabase(dbId) {
  const res = await notion.databases.query({
    database_id: dbId,
    page_size: 100,
  });
  return res.results;
}

/* ─── Get images directly from page blocks (fallback) ─── */
export async function getPageImages(pageId) {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });
  return blocks.results
    .filter((b) => b.type === "image")
    .map((b) => b.image.file?.url || b.image.external?.url)
    .filter(Boolean);
}

/* ─── Parsers ─── */
export function parseConfig(items) {
  const config = {};
  items.forEach((item) => {
    const key = getPropText(item.properties, "Key") || getPropText(item.properties, "Name");
    const value = getPropText(item.properties, "Value");
    if (key) config[key.toLowerCase().trim().replace(/\s+/g, "_")] = value;
  });
  return config;
}

export function parsePrices(items) {
  return items
    .map((item) => ({
      name: getPropText(item.properties, "Name"),
      price: getPropText(item.properties, "Price"),
      description: getPropText(item.properties, "Description"),
      extra: getPropText(item.properties, "Extra"),
      icon: getPropText(item.properties, "Icon") || "🎨",
      popular: getPropText(item.properties, "Popular") === true || getPropText(item.properties, "Popular") === "true",
      order: Number(getPropText(item.properties, "Order")) || 0,
    }))
    .sort((a, b) => a.order - b.order);
}

export function parseExtras(items) {
  return items
    .map((item) => ({
      name: getPropText(item.properties, "Name"),
      price: getPropText(item.properties, "Price"),
      order: Number(getPropText(item.properties, "Order")) || 0,
    }))
    .sort((a, b) => a.order - b.order);
}

export function parseRules(items) {
  return items
    .map((item) => ({
      category: getPropText(item.properties, "Category"),
      content: getPropText(item.properties, "Content"),
      order: Number(getPropText(item.properties, "Order")) || 0,
    }))
    .sort((a, b) => a.order - b.order);
}

export function parsePortfolio(items) {
  return items
    .map((item) => ({
      name: getPropText(item.properties, "Name"),
      image: getPropText(item.properties, "Image"),
      category: getPropText(item.properties, "Category"),
    }))
    .filter((p) => p.image);
}

export function parseSocials(items) {
  return items.map((item) => ({
    name: getPropText(item.properties, "Name"),
    url: getPropText(item.properties, "URL"),
    icon: getPropText(item.properties, "Icon") || "fas fa-link",
    color: getPropText(item.properties, "Color") || "purple",
    image: getPropText(item.properties, "Image"),
  }));
}

/* ─── Avatar parser ─── */
export function parseAvatar(items) {
  if (!items || items.length === 0) return null;
  // Берём первую запись из базы Avatar
  const first = items[0];
  const image = getPropText(first.properties, "Image");
  const url = getPropText(first.properties, "URL");
  return image || url || null;
}
