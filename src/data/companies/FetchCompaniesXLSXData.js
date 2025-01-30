import * as XLSX from 'xlsx';

// Function to get the company image URL
function getCompanyImage(companyName) {
    // Normalize the company name to match the file name format
    const normalizedCompanyName = companyName
        .toLowerCase()
        .replace(/\s+/g, ' ') // Keep spaces as single spaces
        .replace(/-/g, '') // Remove dashes
        .replace(/,/g, ''); // Remove commas

    const basePath = `/assets/companies/${normalizedCompanyName}`;
    const supportedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

    // Loop through supported extensions to find the correct image
    for (let ext of supportedExtensions) {
        const path = `${basePath}.${ext}`;
        // Here, we assume the path is valid; in real apps, this might require a different check
        if (new Image().src = path) {
            return path;
        }
    }

    // Default image path if none found
    return '/assets/companies/default.jpg';
}

function transformData(organizedData) {
    const companyMap = new Map();
    let companyId = 1;

    // Helper function to clean up company names by removing duplicates and trimming text after '-'
    function cleanCompanyName(name) {
        if (!name) return '';
        const trimmedName = name.split(' -')[0].trim();
        return Array.from(new Set(trimmedName.split(',').map(part => part.trim()))).join(', ');
    }

    // Process each entry in the organizedData
    organizedData.forEach(entry => {
        const company = entry.company || entry.companyName;
        if (!company) return;

        const cleanedCompanyName = cleanCompanyName(company);

        if (!companyMap.has(cleanedCompanyName)) {
            companyMap.set(cleanedCompanyName, {
                id: companyId++,
                name: cleanedCompanyName,
                image: getCompanyImage(cleanedCompanyName), // Set the image path here
                referents: []
            });
        }

        const companyEntry = companyMap.get(cleanedCompanyName);
        const emails = (entry.referentEmail || '').split(',').map(email => email.trim());
        const positions = (entry.referentPosition || '').split(',').map(position => position.trim());

        const maxLength = Math.max(emails.length, positions.length);
        while (emails.length < maxLength) emails.push('');
        while (positions.length < maxLength) positions.push('');

        emails.forEach((email, index) => {
            companyEntry.referents.push({
                id: companyEntry.referents.length + 1,
                name: entry.referentName || '',
                email: email,
                position: positions[index] || ''
            });
        });
    });

    return Array.from(companyMap.values());
}

function organizeData(data) {
    const organizedData = [];

    let headerRowIndex = -1;
    for (let i = 0; i < data.length; i++) {
        if (data[i]['Master Leads'] === 'Name') {
            headerRowIndex = i;
            break;
        }
    }

    if (headerRowIndex === -1) {
        throw new Error('Header row not found');
    }

    const headers = {
        companyName: data[headerRowIndex]['__EMPTY_1'],
        projectTitle: data[headerRowIndex]['__EMPTY_2'],
        referentName: data[headerRowIndex]['__EMPTY_3'],
        company: data[headerRowIndex]['__EMPTY_4'],
        referentPosition: data[headerRowIndex]['__EMPTY_5'],
        email: data[headerRowIndex]['__EMPTY_6']
    };

    for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i];
        if (row['Master Leads'] === '') continue;

        const entry = {
            rowNum: row['__rowNum__'],
            companyName: row['__EMPTY_1'] || '',
            projectTitle: row['__EMPTY_2'] || '',
            referentName: row['__EMPTY_3'] || '',
            company: row['__EMPTY_4'] || '',
            referentPosition: row['__EMPTY_5'] || '',
            referentEmail: row['__EMPTY_6'] || ''
        };

        const headerValues = Object.values(headers);
        const isHeaderRow = Object.values(entry).some(value => headerValues.includes(value));

        if ((entry.referentEmail || entry.referentName) && !isHeaderRow) {
            organizedData.push(entry);
        }
    }

    return organizedData;
}

export const FetchCompaniesXLSXData = async (model) => {
    try {

        let companiesXLSXModelfile = model == 'VayomarGPT' ? "/companies.xlsx" : "/companies_genesis.xlsx";
        const response = await fetch(companiesXLSXModelfile); 
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const organizedData = organizeData(jsonData);
        const transformedData = transformData(organizedData);

        return transformedData;

    } catch (error) {
        console.error('Error fetching and processing data:', error);
    }
};

export default FetchCompaniesXLSXData;
