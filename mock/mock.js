const express = require("express");
const app = express();
const PORT = 5000;

/**
 * First about the Data
 * As per the OpenAPI spec. i have created the data with some more additional fields
 * to make the UI good like(logo url and more teams).
 *
 * and to mock the dynamic nature i have added 30sec of interval to update the
 * last_updated field.
 *
 */

// Initial data
TEAMS = {
  last_updated: new Date().toISOString(),
  NCAAB: [
    {
      id: "1",
      name: "Blue Devils",
      nickname: "DUKE",
      display_name: "Duke University",
      conference: "ACC",
      division: "Atlantic",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Duke_Athletics_logo.svg",
    },
    {
      id: "2",
      name: "Wildcats",
      nickname: "UK",
      display_name: "University of Kentucky",
      conference: "SEC",
      division: "East",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Kentucky_Wildcats_logo.svg",
    },
    {
      id: "3",
      name: "Tar Heels",
      nickname: "UNC",
      display_name: "University of North Carolina",
      conference: "ACC",
      division: "Coastal",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/North_Carolina_Tar_Heels_logo.svg",
    },
    {
      id: "4",
      name: "Jayhawks",
      nickname: "KU",
      display_name: "University of Kansas",
      conference: "Big 12",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Kansas_Jayhawks_1946_logo.svg",
    },
    {
      id: "5",
      name: "Gonzaga Bulldogs",
      nickname: "ZAGS",
      display_name: "Gonzaga University",
      conference: "WCC",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Gonzaga_Bulldogs_wordmark.svg",
    },
    {
      id: "6",
      name: "Spartans",
      nickname: "MSU",
      display_name: "Michigan State University",
      conference: "Big Ten",
      division: "East",
      logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Michigan_State_Athletics_logo.svg",
    },
  ],
  NCAAF: [
    {
      id: "7",
      name: "Crimson Tide",
      nickname: "ALA",
      display_name: "University of Alabama",
      conference: "SEC",
      division: "West",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Alabama_Athletics_logo.svg",
    },
    {
      id: "8",
      name: "Buckeyes",
      nickname: "OSU",
      display_name: "Ohio State University",
      conference: "Big Ten",
      division: "East",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Ohio_State_Buckeyes_logo.svg",
    },
    {
      id: "9",
      name: "Tigers",
      nickname: "LSU",
      display_name: "Louisiana State University",
      conference: "SEC",
      division: "West",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/LSU_Athletics_logo.svg",
    },
    {
      id: "10",
      name: "Wolverines",
      nickname: "MICH",
      display_name: "University of Michigan",
      conference: "Big Ten",
      division: "East",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Michigan_Wolverines_logo.svg",
    },
    {
      id: "11",
      name: "Longhorns",
      nickname: "TEX",
      display_name: "University of Texas",
      conference: "Big 12",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Texas_Longhorns_logo.svg",
    },
    {
      id: "12",
      name: "Trojans",
      nickname: "USC",
      display_name: "University of Southern California",
      conference: "Pac-12",
      division: "South",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/USC_Trojans_logo.svg",
    },
  ],
  NFL: [
    {
      id: "13",
      name: "Vikings",
      nickname: "MIN",
      display_name: "Minnesota",
      conference: "NFC",
      division: "North",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/48/Minnesota_Vikings_logo.svg",
    },
    {
      id: "14",
      name: "Packers",
      nickname: "GB",
      display_name: "Green Bay",
      conference: "NFC",
      division: "North",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Green_Bay_Packers_logo.svg",
    },
    {
      id: "15",
      name: "Chiefs",
      nickname: "KC",
      display_name: "Kansas City",
      conference: "AFC",
      division: "West",
      logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Kansas_City_Chiefs_logo.svg",
    },
    {
      id: "16",
      name: "Cowboys",
      nickname: "DAL",
      display_name: "Dallas",
      conference: "NFC",
      division: "East",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Dallas_Cowboys.svg",
    },
    {
      id: "17",
      name: "Eagles",
      nickname: "PHI",
      display_name: "Philadelphia",
      conference: "NFC",
      division: "East",
      logo: "https://upload.wikimedia.org/wikipedia/en/8/8e/Philadelphia_Eagles_logo.svg",
    },
    {
      id: "18",
      name: "49ers",
      nickname: "SF",
      display_name: "San Francisco",
      conference: "NFC",
      division: "West",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/San_Francisco_49ers_logo.svg",
    },
    {
      id: "19",
      name: "Bills",
      nickname: "BUF",
      display_name: "Buffalo",
      conference: "AFC",
      division: "East",
      logo: "https://upload.wikimedia.org/wikipedia/en/7/77/Buffalo_Bills_logo.svg",
    },
  ],
  UFL: [
    {
      id: "20",
      name: "Battlehawks",
      nickname: "STL",
      display_name: "St. Louis",
      conference: "XFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/en/9/9c/St._Louis_Battlehawks_logo.png",
    },
    {
      id: "21",
      name: "Brahmas",
      nickname: "SA",
      display_name: "San Antonio",
      conference: "XFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/en/2/22/San_Antonio_Brahmas_logo.png",
    },
    {
      id: "22",
      name: "Defenders",
      nickname: "DC",
      display_name: "Washington",
      conference: "XFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/DC_Defenders_logo.png",
    },
    {
      id: "23",
      name: "Roughnecks",
      nickname: "HOU",
      display_name: "Houston",
      conference: "XFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/en/d/d9/Houston_Roughnecks_logo_%282022%29.png",
    },
  ],
  USFL: [
    {
      id: "24",
      name: "Stallions",
      nickname: "BIRM",
      display_name: "Birmingham",
      conference: "USFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/en/9/9a/Birmingham_Stallions_logo.svg",
    },
    {
      id: "25",
      name: "Generals",
      nickname: "NJ",
      display_name: "New Jersey",
      conference: "USFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/02/New_Jersey_Generals_logo.svg",
    },
    {
      id: "26",
      name: "Stars",
      nickname: "PHI",
      display_name: "Philadelphia",
      conference: "USFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/en/5/5c/Philadelphia_Stars_logo.svg",
    },
    {
      id: "27",
      name: "Panthers",
      nickname: "MICH",
      display_name: "Michigan",
      conference: "USFL",
      division: "None",
      logo: "https://upload.wikimedia.org/wikipedia/en/7/71/Michigan_Panthers_transparent.png",
    },
  ],
};

// Function to update the last_updated timestamp every 30 seconds
function updateData() {
  setInterval(() => {
    TEAMS.last_updated = new Date().toISOString();
    console.log(`Data updated at ${TEAMS.last_updated}`);
  }, 30000);
}

// Route to get all teams
app.get("/api/teams", (req, res) => {
  res.json(TEAMS);
});

// Start the server and the update interval
updateData();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
