const fs = require('fs');
new Promise((resolve, reject) => {
    fs.readdir("./CSV", function(error, filenames) {
      if (error) return reject(error);
      resolve(filenames.filter(filename => /\.csv$/i.test(filename)));
    });
}).then(files => {
    const csvs = files.map(file => {
        return fs.readFileSync("./CSV/" + file, `utf8`).split(`\n`);
    });
    return Promise.resolve(csvs);
}).then(async csvs => {
    await asyncForEach(csvs, async (csv) => {
        let csvComponents = [];
        csv.forEach(element => {
            csvComponents.push(element.split("|"));
        });
        let simplifiedData = [];
        for (var i = 0, l = csvComponents.length; i < l - 1; i++) {
            simplifiedData[i] = csvComponents[i];
            simplifiedData[i][1] = csvComponents[i][0].match(/\(([^)]+)\)/) ? csvComponents[i][0].match(/\(([^)]+)\)/)[1] : csvComponents[i][0].split(' ')[1];
            simplifiedData[i][2] = csvComponents[i][0].split(',')[0];
            console.log(simplifiedData[i][2], simplifiedData[i][1])
            simplifiedData[i][3] = simplifiedData[i][1].toLowerCase() + '.' + simplifiedData[i][2].toLowerCase() + '@cfafranchisee.com';
        }
        console.log("Total Unique Devices/Sites: ", simplifiedData.length);

        var directory = './'
        fs.writeFile(directory + "/compiledEmails.csv", await generateCSV(simplifiedData), function (err) {
            if (err) throw err;
            console.log("Generated CSV");
        });
    });
});
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}
const generateCSV = (inputDat) => new Promise((resolve, reject) => {
    var lineArray = [];
    inputDat.forEach(function (infoArray, index) {
        var line = infoArray.join("|");
        lineArray.push(line);
    });
    var csvContent = lineArray.join("\n");
    resolve(csvContent);
});