const extractMetadataFromMarkdown = (markdown) => {
    const charactersBetweenGroupedHyphens = /^---([\s\S]*?)---/;
    const metadataMatched = markdown.match(charactersBetweenGroupedHyphens);
    const metadata = metadataMatched[1];

    if (!metadata) {
        return {};
    }

    const metadataLines = metadata.split("\n");
    const metadataObject = metadataLines.reduce((accumulator, line) => {
        const [key, ...value] = line.split(":").map((part) => part.trim());

        if (key)
            accumulator[key] = value[1] ? value.join(":") : value.join("");
        return accumulator;
    }, {});

    return metadataObject;
};

const removeMetadataFromMarkdown = (markdown) => {
    return markdown.replace(/^---[\s\S]*?---\s*/, '');
}

function renderPage(target, title = "Untitled", author = null) {
    const titleElement = document.getElementById("titl");
    titleElement.textContent = title;

    const otherTitleWhoops = document.getElementById("title");
    otherTitleWhoops.textContent = title;

    const authorElement = document.getElementById("whowrotethis");
    authorElement.textContent = `Author: ${author || "probably dian"}`;

    const mainContainer = document.getElementById("main-container");

    console.log(typeof showdown)

    var converter = new showdown.Converter();
    var cleanContent = removeMetadataFromMarkdown(target.content);
    var html = converter.makeHtml(cleanContent);
    mainContainer.innerHTML = html;
}

function renderFallback() {
    const mainContainer = document.getElementById("main-container");
    mainContainer.innerHTML = "<p>Content not found.</p>";
}

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const target_id = urlParams.get("id")

if (!target_id) {
    console.error("No target ID specified.")
    renderFallback()
} else {
    (async () => {
        for (let i = 0; i < 100; i++) {
            try {
                const res = await fetch("pages/" + i + ".md");
                if (!res.ok) {
                    // skip missing pages
                    continue;
                }
                const text = await res.text();
                const m_id = extractMetadataFromMarkdown(text);

                if (!m_id.id) {
                    // not the matching page, continue searching
                    continue;
                }

                if (m_id.id == target_id) {
                    console.log("found!")
                    renderPage({ content: text }, m_id.title, m_id.author);
                    break
                }
            } catch (err) {
                console.error("Error fetching page:", err);
                renderFallback()
                return
            }
        }
    })();
}
