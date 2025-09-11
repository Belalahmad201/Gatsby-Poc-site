#!/usr/bin/env node

const axios = require("axios");
const cheerio = require("cheerio");
const { Command } = require("commander");
const express = require("express");

const program = new Command();

program
  .option("--url <url>", "Target webpage URL")
  .option("--domain <domain>", "Domain to check backlinks for")
  .option("--out <file>", "Output JSON file")
  .option("--server", "Run in server mode")
  .option("--port <number>", "Port for server mode", "3000")
  .option("--puppeteer", "Use Puppeteer to render JavaScript content");

program.parse(process.argv);
const options = program.opts();

async function fetchPageContent(url, usePuppeteer = false) {
  if (usePuppeteer) {
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const content = await page.content();
    await browser.close();
    return content;
  } else {
    const { data } = await axios.get(url);
    return data;
  }
}

async function extractBacklinks(url, domain, usePuppeteer = false) {
  try {
    const html = await fetchPageContent(url, usePuppeteer);
    const $ = cheerio.load(html);

    const links = [];
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      const rel = $(el).attr("rel") || "";
      const anchor = $(el).text().trim();

      links.push({ href, rel, anchor });
    });

    const backlinks = links.filter((l) => l.href.includes(domain));

    return {
      url,
      domain,
      totalLinks: links.length,
      targetDomainCount: backlinks.length,
      backlinks,
    };
  } catch (err) {
    return { error: err.message };
  }
}

async function main() {
  if (options.server) {
    const app = express();

    app.get("/check", async (req, res) => {
      const { url, domain, puppeteer } = req.query;
      if (!url || !domain) {
        return res
          .status(400)
          .json({ error: "Please provide url and domain parameters" });
      }
      const result = await extractBacklinks(
        url,
        domain,
        puppeteer === "true"
      );
      res.json(result);
    });

    app.listen(options.port, () => {
      console.log(`Server running on http://localhost:${options.port}`);
    });
  } else if (options.url && options.domain) {
    const result = await extractBacklinks(
      options.url,
      options.domain,
      options.puppeteer
    );

    if (options.out) {
      const fs = require("fs");
      fs.writeFileSync(options.out, JSON.stringify(result, null, 2));
      console.log(`Results saved to ${options.out}`);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } else {
    program.help();
  }
}

main();
