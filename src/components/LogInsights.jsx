import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

const LogInsights = ({ insights, proposalTitle, finalPricingRows, customersSelectedRows, model }) => {

    const [downloaded, setDownloaded] = useState(false);
    const editPresentationRef = useRef(null);

    useEffect(() => {
        if (insights && !downloaded) {
            const editPresentation = async () => {
                try {

                    const modelTemplatePath = model == 'VayomarGPT' ? "/proposal_template.pptx" : "/proposal_template_genesis.pptx";
                    
                    const response = await axios.get(modelTemplatePath, {
                        responseType: 'arraybuffer'
                    });

                    // TOTO: take relevant proposal according to model

                    const content = response.data;
                    const zip = await JSZip.loadAsync(content);
                    const slideFiles = Object.keys(zip.files).filter(filename => filename.startsWith('ppt/slides/slide'));

                    const namespaces = {
                        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                        'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
                    };

                    const createXPathEvaluator = (doc) => {
                        return (xpath) => {
                            const evaluator = new XPathEvaluator();
                            const result = evaluator.evaluate(xpath, doc, (prefix) => namespaces[prefix] || null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                            return result;
                        };
                    };

                    const replaceText = (slideDoc, placeholder, newText) => {
                        const select = createXPathEvaluator(slideDoc);
                        const nodesSnapshot = select(`//a:t[text()='${placeholder}']`);
                        for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
                            const textNode = nodesSnapshot.snapshotItem(i);
                            if (textNode) {
                                textNode.textContent = newText;
                            }
                        }
                    };

                    const removeEmptyLines = (text) => {
                        return text.split('\n').filter(line => line.trim() !== '').join('\n');
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


                    const createTableRow = (slideDoc, rowData, templateRow) => {
                        const newRow = templateRow.cloneNode(true);
                        const cells = newRow.getElementsByTagNameNS(namespaces.a, 'tc');

                        const updateCellContent = (cell, content, isCenterHorizontally = false) => {
                            while (cell.firstChild) {
                                cell.removeChild(cell.firstChild);
                            }

                            const textBody = slideDoc.createElementNS(namespaces.a, 'a:txBody');
                            const bodyPr = slideDoc.createElementNS(namespaces.a, 'a:bodyPr');
                            bodyPr.setAttribute('anchor', 'ctr'); // Vertically center the text
                            const lstStyle = slideDoc.createElementNS(namespaces.a, 'a:lstStyle');
                            const p = slideDoc.createElementNS(namespaces.a, 'a:p');

                            const r = slideDoc.createElementNS(namespaces.a, 'a:r');
                            const t = slideDoc.createElementNS(namespaces.a, 'a:t');
                            t.textContent = content;

                            if (isCenterHorizontally) {
                                const pPr = slideDoc.createElementNS(namespaces.a, 'a:pPr');
                                pPr.setAttribute('algn', 'ctr'); // Center text horizontally
                                p.appendChild(pPr);
                            }

                            r.appendChild(t);
                            p.appendChild(r);
                            textBody.appendChild(bodyPr);
                            textBody.appendChild(lstStyle);
                            textBody.appendChild(p);

                            cell.appendChild(textBody);
                        };

                        if (cells.length >= 3) {
                            updateCellContent(cells[0], rowData.phase);
                            updateCellContent(cells[1], rowData.units, true); // Center units horizontally
                            updateCellContent(cells[2], formatPrice(rowData.price), true); // Center price horizontally and format it
                        }

                        return newRow;
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

                    const cleanedBackground = removeEmptyLines(insights.background_section);
                    const cleanedDesiredOutcomes = removeEmptyLines(insights.desired_outcome_section);

                    for (const slideFile of slideFiles) {
                        const slideXml = await zip.file(slideFile).async("string");
                        const parser = new DOMParser();
                        const slideDoc = parser.parseFromString(slideXml, "application/xml");

                        replaceText(slideDoc, '<TITLE>', proposalTitle);
                        replaceText(slideDoc, '<INTRO>', insights.intro);
                        replaceText(slideDoc, '<PROGRAM_STRUCTURE>', insights.program_structures_refined);
                        replaceText(slideDoc, '<BACKGROUND>', cleanedBackground);
                        replaceText(slideDoc, '<DESIRED_OUTCOMES>', cleanedDesiredOutcomes);
                        replaceText(slideDoc, '<DATE>', getCurrentFormattedDate());

                        const select = createXPathEvaluator(slideDoc);
                        const tables = select('//a:tbl');
                        for (let i = 0; i < tables.snapshotLength; i++) {
                            const table = tables.snapshotItem(i);

                            // Adjust column widths
                            adjustColumnWidths(table);

                            // Find the header, footer, and template rows
                            const rows = select('.//a:tr', table);
                            // const headerRow = rows.snapshotItem(0);
                            const footerRow = rows.snapshotItem(rows.snapshotLength - 1);
                            const templateRow = rows.snapshotItem(1); // Assuming the second row is our white row template

                            // Remove existing white rows between header and footer
                            for (let j = rows.snapshotLength - 2; j > 0; j--) {
                                const row = rows.snapshotItem(j);
                                row.parentNode.removeChild(row);
                            }

                            // Insert new rows from finalPricingRows, excluding the last element
                            for (let j = 0; j < finalPricingRows.length - 1; j++) {
                                const newRow = createTableRow(slideDoc, finalPricingRows[j], templateRow);
                                table.insertBefore(newRow, footerRow);
                            }

                            // Update the rightmost cell of the footer with the price from the last element
                            if (finalPricingRows.length > 0) {
                                const lastElement = finalPricingRows[finalPricingRows.length - 1];
                                updateFooterCell(footerRow, formatPrice(lastElement.price));
                            }
                        }

                        const serializer = new XMLSerializer();
                        const serializedSlideXml = serializer.serializeToString(slideDoc);
                        zip.file(slideFile, serializedSlideXml);
                    }

                    const newPptxContent = await zip.generateAsync({ type: "blob" });
                    saveAs(newPptxContent, "edited_proposal.pptx");
                    setDownloaded(true);
                } catch (error) {
                    console.error('Error editing PPTX:', error);
                    alert('Error editing PPTX file. Please check the console for details.');
                }
            };

            editPresentationRef.current = editPresentation;
            editPresentationRef.current();

        }
    }, [insights, downloaded, proposalTitle, finalPricingRows]);

    return null;
};

export default LogInsights;
