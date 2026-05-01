const fs = require('fs');
const pdf = require('pdf-parse');

const pdfFunc = typeof pdf === 'function' ? pdf : pdf.default || pdf.pdf;

let dataBuffer = fs.readFileSync('C:\\web-jagatama\\Produk\\Company Profile.pdf');

pdfFunc(dataBuffer).then(function(data) {
    fs.writeFileSync('C:\\web-jagatama\\scratch\\company_profile.txt', data.text);
    console.log('PDF text extracted to scratch/company_profile.txt');
}).catch(function(error) {
    console.error('Error extracting PDF:', error);
});
