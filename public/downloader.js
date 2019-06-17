const requestURL = "http://data.hisparc.nl/data/14004/events/?download=True&start=2019-01-01+00%3A00%3A00&end=2019-01-02+00%3A00%3A00";

$(".DownloadButton").click(() => {
    downloadData();
});

$(document).ready(() => {
    Object.keys(DataLocationMap).forEach(key => {
        const item = DataLocationMap[key];

        $(".AllowedFieldsContainer").append("<div class='col-md-6'><p>" + item.name + ": &nbsp;<input type='checkbox' checked /></p></div>");
    });
});

const DataLocationMap = {
    pulseHeight: { slot: 4, name: "Min Pulse Height", parse: x => parseInt(x) },
    integral: { slot: 8, name: "Integral", parse: x => parseInt(x) },
    numberOfMips: { slot: 12, name: "Number of Mips", parse: x => parseFloat(x) },
    arrivalTime: { slot: 16, name: "Relative Arrival Time", parse: x => parseFloat(x) },
    triggerTime: { slot: 20, name: "Relative Trigger Time" , parse: x => parseFloat(x) },
    zenith: { slot: 21, name: "Zenith Angle" , parse: x => parseFloat(x) },
    azimuth: { slot: 22, name: "Azimuth Angle", parse: x => parseFloat(x) }
};

const downloadData = () => {
    axios.post("http://localhost:3000/datadownload", { requiredUrl: requestURL }).then(data => {
        data = data.data; // Find the actual response data

        let items = [];

        data.split("\n")
            .filter(row => !row.startsWith("#"))
            .forEach(row => {
                const subItem = row.split("\t");
                const buildingData = {};

                // Create this data map
                Object.keys(DataLocationMap).forEach(key => {
                    const thisDataObject = DataLocationMap[key];

                    buildingData[key] = thisDataObject.parse(subItem[thisDataObject.slot]);
                });

                items.push({
                    date: new Date(parseInt(subItem[2]) * 1000),
                    data: buildingData
                });
            });

        const originalTotalSize = items.length;
        const wantedPercentage = $(".Input_EnterPercentage").val();
        const wantedSize = Math.floor(originalTotalSize / 100 * (wantedPercentage === undefined ? 10 : parseFloat(wantedPercentage)));

        items = items.sort((a, b) => {
            return b.data.pulseHeight - a.data.pulseHeight;
        })
            .slice(0, Math.min(originalTotalSize, wantedSize))
            .sort((a, b) => {
                return a.date.getTime() - b.date.getTime()
            }); // Post time sort

        console.log("Sorted data. Total item count was " + originalTotalSize + ", sorted to " + items.length);
        console.log("Exporting to CSV");

        let titleKeys = "";

        Object.keys(DataLocationMap)
            .map(item => DataLocationMap[item].name + ",")
            .forEach(item => titleKeys += item);

        let csvStringData = "UNIX Date,Display Date,"
            + titleKeys.substring(0, titleKeys.length - 1)
            + "\n";

        items.forEach(item => {
            let rowDataString = "";

            Object.keys(DataLocationMap)
                .map(key => item.data[key] + ",")
                .forEach(item => rowDataString += item);

            csvStringData += item.date.getTime() + "," + item.date + ","
                + rowDataString.substring(0, rowDataString.length - 1) + "\n"
        });

        // Download this
        download("HiSPARC Data.csv", csvStringData)
    });
};

const download = (filename, text) => {
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};
