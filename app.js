const axios = require("axios");
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(process.env.PORT | 3000, () => {
    console.log("Started server");
});

// const requestURL = "http://data.hisparc.nl/data/14004/events/?download=True&start=2019-01-01+00%3A00%3A00&end=2019-01-02+00%3A00%3A00";

// axios.get(requestURL).then(data => {
//     console.log(data.data.length);
    
//     data = data.data; // Find the actual response data
    
//     let items = [];
    
//     data.split("\n").forEach(row => {
//         if(!row.startsWith("#")) {
//             const subItem = row.split("\t");
            
//             // console.log(items[2]); // 3rd point
            
//             items.push({
//                 date: new Date(parseInt(subItem[2]) * 1000),
//                 data: {
//                     pulseHeight: parseInt(subItem[4])
//                 }
//             });
//         }
//     });
    
//     const originalTotalSize = items.length;
//     const wantedSize = Math.floor(originalTotalSize / 10); // 10%
    
//     items = items.sort((a, b) => { return b.data.pulseHeight - a.data.pulseHeight; })
//         .slice(0, Math.min(originalTotalSize, wantedSize))
//         .sort((a, b) => { return a.date.getTime() - b.date.getTime() }); // Post time sort
        
//     console.log("Sorted data. Total item count was " + originalTotalSize + ", sorted to " + items.length);
//     console.log("Exporting to CSV");
    
//     let csvStringData = "UNIX Date,Display Date,Pulse Height\n";
    
//     items.forEach(item => {
//         csvStringData += item.date.getTime() + "," + item.date + "," + item.data.pulseHeight + "\n"
//     });
    
//     // Save this data to a file
//     fs.writeFile("test.csv", csvStringData, () => {});
// });