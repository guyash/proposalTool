import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { programStructureOptionsWithIndexes, methodologiesOptionsWithIndexes } from '../data/mockData';

async function modifyLineSpacingInZip(zip) {

    const slideFiles = Object.keys(zip.files).filter(filename =>
        filename.startsWith('ppt/slides/slide') && filename.endsWith('.xml')
    );

    for (const slideFile of slideFiles) {
        let content = await zip.file(slideFile).async('string');
        content = modifyLineSpacing(content);
        zip.file(slideFile, content);
    }

    return zip;
}

function modifyLineSpacing(xmlContent) {
    console.log("xmlContent", xmlContent);
    const pPrRegex = /<a:pPr[^>]*>([\s\S]*?)<\/a:pPr>/g;

    return xmlContent.replace(pPrRegex, (match, inner) => {
        if (/<a:lnSpc/.test(inner)) {
            return match.replace(/<a:lnSpc>[\s\S]*?<\/a:lnSpc>/,
                '<a:lnSpc><a:spcPct val="150000"/></a:lnSpc>');
        } else {
            return match.replace('>', '><a:lnSpc><a:spcPct val="150000"/></a:lnSpc>');
        }
    });
}



export function getDateString() {
    const date = new Date();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let suffix;
    if (day === 1 || day === 21 || day === 31) {
        suffix = "st";
    } else if (day === 2 || day === 22) {
        suffix = "nd";
    } else if (day === 3 || day === 23) {
        suffix = "rd";
    } else {
        suffix = "th";
    }

    return `(${month} ${day}${suffix}, ${year})`;
}


function inspectTextboxPositions(slideDoc, index) {
    console.log(`--- Inspecting Textbox Positions in Slide ${index + 1} ---`);

    // Find all shape elements that contain textboxes
    const shapes = slideDoc.getElementsByTagName('p:sp');

    Array.from(shapes).forEach((shape, i) => {
        const textBox = shape.getElementsByTagName('p:txBody')[0];
        if (textBox) {
            console.log(`\nTextbox ${i + 1}:`);

            // Get the position information
            const xfrm = shape.getElementsByTagName('a:xfrm')[0];
            if (xfrm) {
                const off = xfrm.getElementsByTagName('a:off')[0];
                const ext = xfrm.getElementsByTagName('a:ext')[0];

                if (off && ext) {
                    const x = off.getAttribute('x');
                    const y = off.getAttribute('y');
                    const width = ext.getAttribute('cx');
                    const height = ext.getAttribute('cy');

                    console.log(`  Position: x=${x}, y=${y}`);
                    console.log(`  Size: width=${width}, height=${height}`);

                    // Show how to move this textbox
                    console.log('\n  To move this textbox:');
                    console.log(`  const shape = slideDoc.getElementsByTagName('p:sp')[${i}];`);
                    console.log(`  const xfrm = shape.getElementsByTagName('a:xfrm')[0];`);
                    console.log(`  const off = xfrm.getElementsByTagName('a:off')[0];`);
                    console.log(`  // Move 100000 EMUs right and 50000 EMUs down`);
                    console.log(`  off.setAttribute('x', '${parseInt(x) + 100000}');`);
                    console.log(`  off.setAttribute('y', '${parseInt(y) + 50000}');`);
                }
            }

            // Show a preview of the text content
            const textContent = textBox.textContent.trim().substring(0, 50);
            console.log(`  Text preview: "${textContent}${textContent.length >= 50 ? '...' : ''}"`);
        }
    });

    console.log('\n--- End of Textbox Position Inspection ---\n');
}


function getCurrentFormattedDate() {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    function getOrdinalSuffix(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    const ordinalDay = day + getOrdinalSuffix(day);
    return `${month}. ${ordinalDay}, ${year}`;
}

async function deleteSlides(zip, programStructure, methodology, model) {

    const indexesToKeep_programStructure = programStructure.flatMap(program => {
        const value = programStructureOptionsWithIndexes[model][program];
        if (Array.isArray(value)) {
            return value; // If it's already an array, return it as is
        } else if (typeof value === 'number') {
            return [value]; // If it's a number, wrap it in an array
        } else {
            return []; // If it's neither (e.g., undefined or empty array), return an empty array
        }
    });

    const indexesToKeep_methodology = methodology.flatMap(program => {
        const value = methodologiesOptionsWithIndexes[program];
        if (Array.isArray(value)) {
            return value; // If it's already an array, return it as is
        } else if (typeof value === 'number') {
            return [value]; // If it's a number, wrap it in an array
        } else {
            return []; // If it's neither (e.g., undefined or empty array), return an empty array
        }
    });
    const indexesToKeep = indexesToKeep_programStructure.concat(indexesToKeep_methodology);

    const slidesToDelete = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33].filter(index => !indexesToKeep.includes(index));

    // Sort slidesToDelete in descending order to avoid index shifting
    slidesToDelete.sort((a, b) => b - a);

    // Get all slide files
    const slideFiles = Object.keys(zip.files).filter(filename => filename.startsWith('ppt/slides/slide'));
    slideFiles.sort((a, b) => {
        const getNumber = filename => parseInt(filename.match(/slide(\d+)\.xml$/)[1], 10);
        return getNumber(a) - getNumber(b);
    });

    // Remove specified slides
    for (const slideIndex of slidesToDelete) {
        if (slideIndex > 0 && slideIndex <= slideFiles.length) {
            const filename = slideFiles[slideIndex - 1];
            zip.remove(filename);
        }
    }

    // Update presentation.xml
    const presentationXml = await zip.file('ppt/presentation.xml').async('string');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(presentationXml, 'text/xml');
    const sldIdLst = xmlDoc.getElementsByTagName('p:sldIdLst')[0];
    const sldIds = Array.from(sldIdLst.getElementsByTagName('p:sldId'));

    for (const slideIndex of slidesToDelete) {
        if (slideIndex > 0 && slideIndex <= sldIds.length) {
            sldIdLst.removeChild(sldIds[slideIndex - 1]);
        }
    }

    const serializer = new XMLSerializer();
    const updatedPresentationXml = serializer.serializeToString(xmlDoc);
    zip.file('ppt/presentation.xml', updatedPresentationXml);

    // Update [Content_Types].xml
    const contentTypesXml = await zip.file('[Content_Types].xml').async('string');
    const contentTypesDoc = parser.parseFromString(contentTypesXml, 'text/xml');
    const overrides = Array.from(contentTypesDoc.getElementsByTagName('Override'));

    for (const slideIndex of slidesToDelete) {
        const slideFilename = `ppt/slides/slide${slideIndex}.xml`;
        const overrideToRemove = overrides.find(override => override.getAttribute('PartName') === `/${slideFilename}`);
        if (overrideToRemove) {
            overrideToRemove.parentNode.removeChild(overrideToRemove);
        }
    }

    const updatedContentTypesXml = serializer.serializeToString(contentTypesDoc);
    zip.file('[Content_Types].xml', updatedContentTypesXml);

    return zip;
}


export default async function proccessAndDownloadPPTX({
    insights,
    selectedCurrency,
    proposalTitle,
    finalPricingRows,
    customersSelectedRows,
    companyLogoPath,
    programStructure,
    methodology,
    desiredOutcomesOpening,
    company,
    model,
    userName,
    userRole,
    userCompany,

}) {
    try {
        const companyName = company ? company.name : "";
        const serializer = new XMLSerializer();
        const parser = new DOMParser();

        const modelTemplatePath = model == 'VayomarGPT' ? "/proposal_template.pptx" : "/proposal_template_genesis.pptx";

        const response = await axios.get(modelTemplatePath, {
            responseType: 'arraybuffer'
        });

        // TOTO: take relevant proposal according to model

        const content = response.data;
        let zip = await JSZip.loadAsync(content);

        if (model === "VayomarGPT") {
            zip = await deleteSlides(zip, programStructure, methodology, model);
        }
        const slideFiles = Object.keys(zip.files).filter(filename => filename.startsWith('ppt/slides/slide'));
        slideFiles.sort((a, b) => {
            const getNumber = filename => parseInt(filename.match(/slide(\d+)\.xml$/)[1], 10);
            return getNumber(a) - getNumber(b);
        });


        const replaceImage = async (zip, imageId, companyLogoPath) => {
            try {
                const imageResponse = await fetch(companyLogoPath);
                if (!imageResponse.ok) {
                    throw new Error("Failed to fetch the image.");
                }

                // Convert the image to an array buffer
                const imageBuffer = await imageResponse.arrayBuffer();

                // Replace image with "rId6"
                let modelImage = model == "VayomarGPT" ? "image4.png" : "image3.png";
                zip.file(`ppt/media/${modelImage}`, imageBuffer); // This is the placeholder file name
                zip.file(`ppt/media/image${imageId}.png`, imageBuffer); // Use imageId to replace the actual image

            } catch (error) {
                console.log("Error replacing image:", error);
            }
        };

        // Usage
        const firstSlideFile = slideFiles[0];
        const firstSlideXml = await zip.file(firstSlideFile).async("string");
        const firstSlideDoc = parser.parseFromString(firstSlideXml, "application/xml");

        if (companyLogoPath !== '') {
            await replaceImage(zip, 'rId6', companyLogoPath);
        }

        const updatedSlideXml = new XMLSerializer().serializeToString(firstSlideDoc);
        zip.file(firstSlideFile, updatedSlideXml);


        const namespaces = {
            'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
            'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
            'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
        };

        const createXPathEvaluator = (doc) => {
            return (xpath) => {
                const evaluator = new XPathEvaluator();
                const result = evaluator.evaluate(xpath, doc, (prefix) => namespaces[prefix] || null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                return result;
            };
        };

        const replaceText = (slideDoc, placeholder, newText, isTitle = false) => {
            const select = createXPathEvaluator(slideDoc);
            const nodesSnapshot = select(`//a:t[text()='${placeholder}']`);

            for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
                const textNode = nodesSnapshot.snapshotItem(i);
                if (textNode) {
                    const lines = newText.split('\n');
                    const parentParagraph = findParentParagraph(textNode);
                    const originalTextRun = findParentTextRun(textNode);

                    // Process the first line
                    const firstLine = lines[0];
                    if (firstLine.startsWith('^')) {
                        textNode.textContent = ' ' + firstLine.slice(1).trim();
                        addBulletPoint(parentParagraph);
                    } else {
                        textNode.textContent = firstLine;
                        removeBulletPoint(parentParagraph);
                    }
                    if (!isTitle) {
                        setLeftAlignmentAndLineSpacing(parentParagraph, 1.0);
                    }

                    // Insert new paragraphs for subsequent lines
                    let lastParagraph = parentParagraph;
                    for (let j = 1; j < lines.length; j++) {
                        const line = lines[j];
                        const newParagraph = parentParagraph.cloneNode(false); // Shallow clone

                        let newText;
                        if (line.startsWith('^')) {
                            newText = ' ' + line.slice(1).trim();
                            addBulletPoint(newParagraph);
                        } else {
                            newText = line;
                            removeBulletPoint(newParagraph);
                        }

                        const newTextRun = createTextRun(slideDoc, newText);
                        copyTextProperties(originalTextRun, newTextRun);
                        newParagraph.appendChild(newTextRun);
                        if (!isTitle) {
                            setLeftAlignmentAndLineSpacing(newParagraph);
                        }

                        lastParagraph.parentNode.insertBefore(newParagraph, lastParagraph.nextSibling);
                        lastParagraph = newParagraph;
                    }
                }
            }
        };

        const findParentTextRun = (node) => {
            while (node && node.nodeName !== 'a:r') {
                node = node.parentNode;
            }
            return node;
        };

        const copyTextProperties = (sourceRun, targetRun) => {
            const rPr = findChildElement(sourceRun, 'a:rPr');
            if (rPr) {
                const newRPr = rPr.cloneNode(true);
                targetRun.insertBefore(newRPr, targetRun.firstChild);
            }
        };

        const findParentParagraph = (node) => {
            while (node && node.nodeName !== 'a:p') {
                node = node.parentNode;
            }
            return node;
        };

        const createTextRun = (doc, text) => {
            const r = doc.createElement('a:r');
            const t = doc.createElement('a:t');
            t.textContent = text;
            r.appendChild(t);
            return r;
        };

        const addBulletPoint = (paragraph) => {
            let pPr = findOrCreateChildElement(paragraph, 'a:pPr');
            removeChildElement(pPr, 'a:buNone');

            let buChar = findOrCreateChildElement(pPr, 'a:buChar');
            buChar.setAttribute('char', '•');
        };

        const removeBulletPoint = (paragraph) => {
            let pPr = findOrCreateChildElement(paragraph, 'a:pPr');
            removeChildElement(pPr, 'a:buChar');

            findOrCreateChildElement(pPr, 'a:buNone');
        };

        const findOrCreateChildElement = (parent, tagName) => {
            let element = findChildElement(parent, tagName);
            if (!element) {
                element = parent.ownerDocument.createElement(tagName);
                parent.appendChild(element);
            }
            return element;
        };

        const findChildElement = (parent, tagName) => {
            for (let i = 0; i < parent.childNodes.length; i++) {
                if (parent.childNodes[i].nodeName === tagName) {
                    return parent.childNodes[i];
                }
            }
            return null;
        };

        const removeChildElement = (parent, tagName) => {
            const element = findChildElement(parent, tagName);
            if (element) {
                parent.removeChild(element);
            }
        };

        const setLeftAlignmentAndLineSpacing = (paragraph, lineSpacing = null) => {
            let pPr = findOrCreateChildElement(paragraph, 'a:pPr');
            let algn = findOrCreateChildElement(pPr, 'a:algn');
            algn.setAttribute('val', 'l'); // 'l' for left alignment

            if (lineSpacing !== null) {
                let lnSpc = findOrCreateChildElement(pPr, 'a:lnSpc');
                let spcPct = findOrCreateChildElement(lnSpc, 'a:spcPct');
                // PowerPoint uses 100,000 as 100% line spacing
                spcPct.setAttribute('val', Math.round(lineSpacing * 100000).toString());
            }
        };

        const adjustColumnWidths = (table) => {
            const gridColElements = table.getElementsByTagNameNS(namespaces.a, 'gridCol');
            if (gridColElements.length >= 3) {
                // Adjust widths to make Phase larger and Price smaller
                gridColElements[0].setAttribute('w', '2800000'); // Phase column width further increased
                gridColElements[2].setAttribute('w', '1300000'); // Price column width further decreased
            }
        };

        const formatPrice = (price) => {
            if (typeof price !== 'string') {
                price = String(price); // Convert to string if it's not already
            }

            return price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        const createTableRow = (slideDoc, rowData, templateRow, rowIndex) => {
            const newRow = templateRow.cloneNode(true);  // Clone the template row
            const cells = newRow.getElementsByTagNameNS(namespaces.a, 'tc');  // Get the table cells

            // Ensure each row has a unique identifier
            const extLst = newRow.getElementsByTagNameNS(namespaces.a, 'extLst');
            if (extLst.length > 0) {
                const rowIdExt = extLst[0].getElementsByTagNameNS('http://schemas.microsoft.com/office/drawing/2014/main', 'rowId');
                if (rowIdExt.length > 0) {
                    rowIdExt[0].setAttribute('val', `${rowIndex}`); // Set a unique rowId for each row
                }
            }

            const updateCellContent = (cell, content, isCenterHorizontally = false) => {
                // Clear any existing content from the cell
                while (cell.firstChild) {
                    cell.removeChild(cell.firstChild);
                }

                // Create the necessary structure for text inside the cell
                const textBody = slideDoc.createElementNS(namespaces.a, 'a:txBody');
                const bodyPr = slideDoc.createElementNS(namespaces.a, 'a:bodyPr');
                bodyPr.setAttribute('anchor', 'ctr');  // Vertically center the text
                textBody.appendChild(bodyPr);

                const lstStyle = slideDoc.createElementNS(namespaces.a, 'a:lstStyle');
                textBody.appendChild(lstStyle);

                const p = slideDoc.createElementNS(namespaces.a, 'a:p');  // Create a paragraph element

                // Create a run for text content
                const r = slideDoc.createElementNS(namespaces.a, 'a:r');
                const t = slideDoc.createElementNS(namespaces.a, 'a:t');
                t.textContent = content;  // Set the actual text content

                // Create run properties and set the font to Calibri
                const rPr = slideDoc.createElementNS(namespaces.a, 'a:rPr');
                const latin = slideDoc.createElementNS(namespaces.a, 'a:latin');
                latin.setAttribute('typeface', 'Calibri');  // Set font to Calibri
                rPr.appendChild(latin);
                r.appendChild(rPr);  // Append run properties to the run

                // Add text content to the run
                r.appendChild(t);
                p.appendChild(r);  // Add the run to the paragraph

                // Optionally center the text horizontally
                if (isCenterHorizontally) {
                    const pPr = slideDoc.createElementNS(namespaces.a, 'a:pPr');
                    pPr.setAttribute('algn', 'ctr');  // Center the text horizontally
                    p.appendChild(pPr);
                }

                // Append the paragraph to the text body
                textBody.appendChild(p);

                // Append the entire text body to the cell
                cell.appendChild(textBody);
            };

            // Update the content for each cell in the row
            if (cells.length >= 3) {
                updateCellContent(cells[0], rowData.phase);  // Update the Phase column
                updateCellContent(cells[1], rowData.units, true);  // Center units horizontally
                updateCellContent(cells[2], formatPrice(rowData.price), true);  // Center price horizontally and format it
            }

            return newRow;  // Return the new row with updated content
        };

        const updateFooterCell = (footerRow, content) => {
            const cells = footerRow.getElementsByTagNameNS(namespaces.a, 'tc');
            if (cells.length > 0) {
                const lastCell = cells[cells.length - 1];
                const textElements = lastCell.getElementsByTagNameNS(namespaces.a, 't');
                if (textElements.length > 0) {
                    textElements[0].textContent = content;
                }
            }
        };

        const updateHeaderCell = (headerRow) => {
            const cells = headerRow.getElementsByTagNameNS(namespaces.a, 'tc');

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];

                const textElements = cell.getElementsByTagNameNS(namespaces.a, 't');

                for (let j = 0; j < textElements.length; j++) {
                    const textElement = textElements[j];

                    if (textElement.textContent === "Price (USD)") {
                        textElement.textContent = `Price (${extractCurrencyName(selectedCurrency?.label) || ""})`;
                    }
                }
            }
        };

        function extractCurrencyName(value) {
            return value.split(' ').pop();
        }

        for (const [index, slideFile] of slideFiles.entries()) {
            const slideXml = await zip.file(slideFile).async("string");

            const slideDoc = parser.parseFromString(slideXml, "application/xml");

            // Fixing the issue when sentences begin right after a period
            insights.desired_outcome_section = insights.desired_outcome_section.replace(/\.([^\s])/g, '. $1');
            insights.intro = insights.intro.replace(/\.([^\s])/g, '. $1');
            insights.program_structures_refined = insights.program_structures_refined.replace(/\.([^\s])/g, '. $1');
            insights.background_section = insights.background_section.replace(/\.([^\s])/g, '. $1');

            let desiredOutcomesWithIntro = insights.desired_outcome_section;
            if (desiredOutcomesOpening === 'defined-outcomes') {
                desiredOutcomesWithIntro = 'As discussed, this program is designed with the following desired outcomes in mind:\n\n' + desiredOutcomesWithIntro;
            } else if (desiredOutcomesOpening === 'undefined-outcomes') {
                desiredOutcomesWithIntro = 'Although specific outcome of this program will need to be defined together, this document was designed with the following desired outcome in mind:\n\n' + desiredOutcomesWithIntro;
            }

            replaceText(slideDoc, '<TITLE>', proposalTitle, true);
            replaceText(slideDoc, '<INTRO>', insights.intro);
            replaceText(slideDoc, '<PROGRAM_STRUCTURE>', insights.program_structures_refined);
            replaceText(slideDoc, '<BACKGROUND>', insights.background_section);

            if (model == "VayomarGPT") {
                replaceText(slideDoc, '<DESIRED_OUTCOMES>', desiredOutcomesWithIntro);
            }
            replaceText(slideDoc, '<DATE>', getCurrentFormattedDate());
            replaceText(slideDoc, 'Signed on behalf of <COMPANY>', 'Signed on behalf of ' + companyName);

            if (model == "GenesisGPT") {
                replaceText(slideDoc, '<USER_NAME>', userName || "");
                replaceText(slideDoc, '<USER_ROLE>', userRole || "");
                replaceText(slideDoc, 'Signed on behalf of <USER_COMPANY>', 'Signed on behalf of ' + userCompany || "");
            }

            customersSelectedRows = customersSelectedRows.slice(0, 3);

            switch (customersSelectedRows.length) {
                case 0:
                    for (let i = 0; i < 3; i++) {
                        replaceText(slideDoc, `<CUSTOMER_LINE_${i + 1}>`, "");
                        replaceText(slideDoc, `<CUSTOMER_EMAIL_${i + 1}>`, "");
                    }
                    replaceText(slideDoc, `<CUSTOMER_LINE_4>`, "");
                    break;

                case 1:
                    const customer = customersSelectedRows[0];
                    const name = customer ? customer.name : "";
                    const position = customer ? customer.position : "";
                    const email = customer ? customer.email : "";

                    replaceText(slideDoc, `<CUSTOMER_LINE_1>`, name);
                    replaceText(slideDoc, `<CUSTOMER_LINE_2>`, position);
                    replaceText(slideDoc, `<CUSTOMER_LINE_3>`, companyName);
                    replaceText(slideDoc, `<CUSTOMER_EMAIL_1>`, email);
                    replaceText(slideDoc, `<CUSTOMER_LINE_4>`, "");
                    replaceText(slideDoc, `<CUSTOMER_EMAIL_2>`, "");
                    replaceText(slideDoc, `<CUSTOMER_EMAIL_3>`, "");
                    break;

                case 2:
                    for (let i = 0; i < customersSelectedRows.length; i++) {
                        const customer = customersSelectedRows[i];
                        const name = customer ? customer.name : "";
                        const position = customer ? customer.position : "";
                        const email = customer ? customer.email : "";
                        const nameAndPosition = name && position ? name + ' - ' + position : name || position;

                        replaceText(slideDoc, `<CUSTOMER_LINE_${i + 1}>`, nameAndPosition);
                        replaceText(slideDoc, `<CUSTOMER_EMAIL_${i + 1}>`, email);
                    }
                    replaceText(slideDoc, `<CUSTOMER_LINE_3>`, company?.name || "");
                    replaceText(slideDoc, `<CUSTOMER_LINE_4>`, "");
                    replaceText(slideDoc, `<CUSTOMER_EMAIL_3>`, "");
                    break;

                case 3:
                    for (let i = 0; i < customersSelectedRows.length; i++) {
                        const customer = customersSelectedRows[i];
                        const name = customer ? customer.name : "";
                        const position = customer ? customer.position : "";
                        const email = customer ? customer.email : "";
                        const nameAndPosition = name && position ? name + ' - ' + position : name || position;

                        replaceText(slideDoc, `<CUSTOMER_LINE_${i + 1}>`, nameAndPosition);
                        replaceText(slideDoc, `<CUSTOMER_EMAIL_${i + 1}>`, email);
                    }
                    replaceText(slideDoc, `<CUSTOMER_LINE_4>`, companyName);
                    break;

                default:
                    break;

            }

            const select = createXPathEvaluator(slideDoc);
            const tables = select('//a:tbl');
            for (let i = 0; i < tables.snapshotLength; i++) {
                const table = tables.snapshotItem(i);

                // Adjust column widths
                adjustColumnWidths(table);

                // Find the header, footer, and template rows
                const rows = select('.//a:tr', table);
                const headerRow = rows.snapshotItem(0);
                const footerRow = rows.snapshotItem(rows.snapshotLength - 1);
                const templateRow = rows.snapshotItem(1); // Assuming the second row is our white row template

                updateHeaderCell(headerRow);

                // Remove existing white rows between header and footer
                for (let j = rows.snapshotLength - 2; j > 0; j--) {
                    const row = rows.snapshotItem(j);
                    row.parentNode.removeChild(row);
                }

                // Insert new rows from finalPricingRows, excluding the last element
                for (let j = 0; j < finalPricingRows.length - 1; j++) {
                    const newRow = createTableRow(slideDoc, finalPricingRows[j], templateRow, j + 1);
                    table.insertBefore(newRow, footerRow);
                }

                // Update the rightmost cell of the footer with the price from the last element
                if (finalPricingRows.length > 0) {
                    const lastElement = finalPricingRows[finalPricingRows.length - 1];
                    updateFooterCell(footerRow, formatPrice(lastElement.price));
                }

                try {
                    inspectTextboxPositions(slideDoc, index);
                    const modelIndices = {
                        VayomarGPT: 16,
                        GenesisGPT: 15
                    };
                    
                    const shape = slideDoc.getElementsByTagName('p:sp')[modelIndices[model]];
                    
                    const xfrm = shape.getElementsByTagName('a:xfrm')[0];
                    const off = xfrm.getElementsByTagName('a:off')[0];

                    const rowHeightEMUs = 0.4 * 914400;
                    const numberOfRows = finalPricingRows.length - 2;
                    const offset = rowHeightEMUs * numberOfRows;

                    const currentY = parseInt(off.getAttribute('y'));
                    const newY = currentY + offset;
                    off.setAttribute('y', String(newY));
                } catch (error) {
                    console.error('Error moving down the text below the pricing table:', error);
                }

            }

            const serializedSlideXml = serializer.serializeToString(slideDoc);
            zip.file(slideFile, serializedSlideXml);

        }

        zip = await modifyLineSpacingInZip(zip);
        const newPptxContent = await zip.generateAsync({ type: "blob" });

        const dateString = getDateString();
        const finalFn = proposalTitle + " " + dateString + ".pptx";

        saveAs(newPptxContent, finalFn);
    } catch (error) {
        console.error('Error editing PPTX:', error);
        alert('Error editing PPTX file. Please check the console for details.');
    }
}