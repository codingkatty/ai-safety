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

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const target_id = urlParams.get("id")

for (let i = 0; i < 100; i++) {
    const p = await fetch("pages/" + i + ".md")
    const m_id = extractMetadataFromMarkdown(p).id

    if (m_id == target_id) {
        console.log("found!")
        break
    }
}