/**
 * @constant {number} MAX_NUM_PUBS
 * @description Specifies the maximum number of publications to fetch from PubMed.
 * Adjust this value to limit the number of results (valid options are 10, 20, 50, 100, or 200).
 */
const MAX_NUM_PUBS = 10;

/**
 * @function fetchPublications
 * @description Fetches a list of publications from PubMed using E-Utilities, based on the provided author's name.
 *
 * @param {string} authorName - The author's name to search for publications.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of publication objects.
 *
 * @throws Will log errors to the console if fetching or parsing fails.
 */
async function fetchPublications(authorName) {
  console.log(`Fetching publications from PubMed for ${authorName}...`);

  try {
    // Fetch the list of PubMed IDs for the specified author
    const idsResponse = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(authorName)}[Author]&sort=date&retmax=${MAX_NUM_PUBS}&retmode=xml`,
    );

    if (!idsResponse.ok) {
      throw new Error(`Failed to fetch PubMed IDs: ${idsResponse.statusText}`);
    }

    const idsText = await idsResponse.text();
    const idsXml = new DOMParser().parseFromString(idsText, "application/xml");

    // Get the list of IDs
    const idList = Array.from(idsXml.getElementsByTagName("Id"))
      .map((id) => id.textContent)
      .join(",");
    if (!idList) {
      console.error("No PubMed IDs found");
      return [];
    }

    // Fetch detailed information for each PubMed ID
    const detailsResponse = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${idList}&retmode=xml`,
    );
    if (!detailsResponse.ok) {
      throw new Error(
        `Failed to fetch publication details: ${detailsResponse.statusText}`,
      );
    }

    const detailsText = await detailsResponse.text();
    const detailsXml = new DOMParser().parseFromString(
      detailsText,
      "application/xml",
    );

    // Parse the publication details
    const publications = Array.from(
      detailsXml.getElementsByTagName("PubmedArticle"),
    ).map((article) => {
      const title = article.querySelector("ArticleTitle")
        ? article.querySelector("ArticleTitle").textContent
        : "No Title";
      const authors = Array.from(article.querySelectorAll("Author"))
        .map((author) => {
          const lastName = author.querySelector("LastName")
            ? author.querySelector("LastName").textContent
            : "";
          const foreName = author.querySelector("ForeName")
            ? author.querySelector("ForeName").textContent
            : "";
          return `${foreName} ${lastName}`.trim();
        })
        .join(", ");
      const journal = article.querySelector("Title")
        ? article.querySelector("Title").textContent
        : "No Journal";
      const year = article.querySelector("PubDate Year")
        ? article.querySelector("PubDate Year").textContent
        : "No Year";
      const pmid = article.querySelector("PMID").textContent;
      const link = `https://pubmed.ncbi.nlm.nih.gov/${pmid}`;
      const doi = article.querySelector("ArticleId[IdType='doi']")
        ? article.querySelector("ArticleId[IdType='doi']").textContent
        : "No DOI";

      return { title, authors, journal, year, link, pmid, doi };
    });

    return publications;
  } catch (error) {
    console.error("Error fetching publications:", error);
    return [];
  }
}

/**
 * @function renderPublications
 * @description Renders a list of publication objects into an HTML container with the provided container ID.
 *
 * @param {Array<Object>} publications - An array of publication objects to render.
 * @param {string} containerId - The ID of the container element where publications should be rendered.
 *
 * @throws Will log an error if the container element is not found.
 */
function renderPublications(publications, containerId) {
  console.log("Rendering publications...");

  const container = document.querySelector(`#${containerId}`);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "list-unstyled";

  publications.forEach((pub) => {
    const li = document.createElement("li");
    li.className = "publication-list";
    li.innerHTML = `
      <strong><a href="${pub.link}" target="_blank" class="publication-link">${pub.title}</a></strong> 
      ${pub.authors}. 
      <i>${pub.journal}</i>, ${pub.year}. 
      PubMed ID: ${pub.pmid}. 
      DOI: ${pub.doi}
    `;
    ul.appendChild(li);
  });

  container.appendChild(ul);
  console.log("Publications rendered successfully");
}

/**
 * @function initializePubMedSection
 * @description Initializes the PubMed section by fetching publications and rendering them in the specified container.
 *
 * @param {string} authorName - The author's name to search for publications.
 * @param {string} containerId - The ID of the container element where publications should be rendered.
 */
async function initializePubMedSection(authorName, containerId) {
  try {
    const publications = await fetchPublications(authorName);
    renderPublications(publications, containerId);
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

console.log("pubmed_recent_publications.js loaded");
