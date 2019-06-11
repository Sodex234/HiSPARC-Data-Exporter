const requestURL = "http://data.hisparc.nl/data/14004/events/?download=True&start=2019-01-01+00%3A00%3A00&end=2019-01-02+00%3A00%3A00";

$(".DownloadButton").click(() => {
    downloadData();
});

const dataLocationMap = {
    pulseHeights: { slot: 4, name: "Min Pulse Height (4x)" },
    integral: 5,
    numberOfMips: 6,
    arrivalTimes: 7,

};

const downloadData = () => {
    axios.get(requestURL).then(data => {
        console.log(data.data.length);

        data = data.data; // Find the actual response data

        let items = [];

        data.split("\n").forEach(row => {
            if (!row.startsWith("#")) {
                const subItem = row.split("\t");

                // console.log(items[2]); // 3rd point

                items.push({
                    date: new Date(parseInt(subItem[2]) * 1000),
                    data: {
                        pulseHeight: parseInt(subItem[4])
                    }
                });
            }
        });

        const originalTotalSize = items.length;
        const wantedSize = Math.floor(originalTotalSize / 10); // 10%

        items = items.sort((a, b) => {
            return b.data.pulseHeight - a.data.pulseHeight;
        })
            .slice(0, Math.min(originalTotalSize, wantedSize))
            .sort((a, b) => {
                return a.date.getTime() - b.date.getTime()
            }); // Post time sort

        console.log("Sorted data. Total item count was " + originalTotalSize + ", sorted to " + items.length);
        console.log("Exporting to CSV");

        let csvStringData = "UNIX Date,Display Date,Pulse Height\n";

        items.forEach(item => {
            csvStringData += item.date.getTime() + "," + item.date + "," + item.data.pulseHeight + "\n"
        });

        // Save this data to a file
        // CSV string file

        // $("body").append("<p>" + csvStringData + "</p>")

        // $("body").append("<a href=\"data:application/octet-stream,field1%2Cfield2%0Afoo%2Cbar%0Agoo%2Cgai%0A\">Download File</a>");

        download("HiSPARC Data.csv", csvStringData)
    });
};

const download = (filename, text) => {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};
