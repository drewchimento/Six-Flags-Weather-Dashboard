import type { Park } from '../types';

export const PARKS_DATA: Park[] = [
  // Tier 1 Parks (11 parks)
  {
    product_name: "SF Great America",
    product_code: "SFGA",
    tier: "1",
    brand: "Six Flags",
    location: {
      address: "1 Great America Parkway, Gurnee, IL 60031",
      city: "Gurnee",
      state: "Illinois",
      region: "Midwest",
      coordinates: { lat: "42.370605", lon: "-87.936111" }
    },
    primary_dmas: "CHICAGO, MILWAUKEE",
    secondary_dmas: ["ROCKFORD"]
  },
  {
    product_name: "Cedar Point",
    product_code: "CPCP",
    tier: "1",
    brand: "Cedar Fair",
    location: {
      address: "1 Cedar Point Dr, Sandusky, OH 44870",
      city: "Sandusky",
      state: "Ohio",
      region: "Midwest",
      coordinates: { lat: "41.4800", lon: "-82.6818" },
      unique_feature: "Located on a peninsula on Lake Erie"
    },
    primary_dmas: "CLEVELAND, DETROIT, TOLEDO, YOUNGSTOWN",
    secondary_dmas: ["COLUMBUS OH", "FLINT-SAGINAW", "FT. WAYNE", "GRAND RAPIDS", "LANSING", "PITTSBURGH"]
  },
  {
    product_name: "Knotts Berry Farm",
    product_code: "KBFM",
    tier: "1",
    brand: "Cedar Fair",
    location: {
      address: "8039 Beach Blvd, Buena Park, CA 90620",
      city: "Buena Park",
      state: "California",
      region: "West",
      coordinates: { lat: "33.844280", lon: "-118.000404" }
    },
    primary_dmas: "LOS ANGELES, PALM SPRINGS",
    secondary_dmas: ["SAN DIEGO"]
  },
  {
    product_name: "SF Magic Mountain",
    product_code: "SFMM",
    tier: "1",
    brand: "Six Flags",
    location: {
      address: "26101 Magic Mountain Parkway, Valencia, CA 91355",
      city: "Valencia",
      state: "California",
      region: "West",
      coordinates: { lat: "34.424919", lon: "-118.595955" }
    },
    primary_dmas: "LOS ANGELES, PALM SPRINGS",
    secondary_dmas: ["SAN DIEGO", "SANTA BARBARA"]
  },
  {
    product_name: "SF Over Texas",
    product_code: "SFOT",
    tier: "1",
    brand: "Six Flags",
    location: {
      address: "2201 Road to Six Flags, Arlington, TX 76011",
      city: "Arlington",
      state: "Texas",
      region: "Southwest",
      coordinates: { lat: "32.755047", lon: "-97.070389" }
    },
    primary_dmas: "DALLAS",
    secondary_dmas: ["HOUSTON", "OKLAHOMA CITY", "SHREVEPORT", "TYLER-LONGVIEW", "WACO-TEMPLE-BRYAN"]
  },
  {
    product_name: "SF Over Georgia",
    product_code: "SFOG",
    tier: "1",
    brand: "Six Flags",
    location: {
      address: "275 Riverside Parkway SW, Austell, GA 30168",
      city: "Austell",
      state: "Georgia",
      region: "Southeast",
      coordinates: { lat: "33.768353", lon: "-84.550171" }
    },
    primary_dmas: "ATLANTA",
    secondary_dmas: ["BIRMINGHAM", "COLUMBUS GA"]
  },
  {
    product_name: "SF Fiesta Texas",
    product_code: "SFFT",
    tier: "1",
    brand: "Six Flags",
    location: {
      address: "17000 IH-10 West, San Antonio, TX 78257",
      city: "San Antonio",
      state: "Texas",
      region: "Southwest",
      coordinates: { lat: "29.599377", lon: "-98.608986" }
    },
    primary_dmas: "SANANTONIO",
    secondary_dmas: ["AUSTIN", "CORPUS CHRISTI", "HARLINGEN-WSLCO-BRNSVL-MCA", "HOUSTON"]
  },
  {
    product_name: "Kings Island",
    product_code: "CFKI",
    tier: "1",
    brand: "Cedar Fair",
    location: {
      address: "6300 Kings Island Dr, Mason, OH 45040",
      city: "Mason",
      state: "Ohio",
      region: "Midwest",
      coordinates: { lat: "39.341300", lon: "-84.272500" }
    },
    primary_dmas: "CINCINNATI, DAYTON",
    secondary_dmas: ["CHARLESTON-HUNTINGTON", "COLUMBUS OH", "INDIANAPOLIS", "LEXINGTON"]
  },
  {
    product_name: "Carowinds",
    product_code: "CFCA",
    tier: "1",
    brand: "Cedar Fair",
    location: {
      address: "14523 Carowinds Blvd, Charlotte, NC 28273",
      city: "Charlotte",
      state: "North Carolina",
      region: "Southeast",
      coordinates: { lat: "35.102333", lon: "-80.941406" },
      unique_feature: "Straddles NC/SC state line"
    },
    primary_dmas: "CHARLOTTE",
    secondary_dmas: ["COLUMBIA SC", "GREENSBORO", "GREENVILLE-SPARTANBURG", "RALEIGH-DURHAM"]
  },
  {
    product_name: "Canadas Wonderland",
    product_code: "CFCW",
    tier: "1",
    brand: "Cedar Fair",
    location: {
      address: "9580 Jane Street, Vaughan, ON L6A 1S6, Canada",
      city: "Vaughan",
      state: "Ontario",
      region: "Canada",
      coordinates: { lat: "43.842365", lon: "-79.541367" }
    },
    primary_dmas: "TORONTO",
    secondary_dmas: ["KITCHNER/WATERLOO/CAMBRIDGE ON", "LONDON", "ONTARIO CA", "ORANGEVILLE"]
  },
  {
    product_name: "SF Great Adventure",
    product_code: "SFAD",
    tier: "1",
    brand: "Six Flags",
    location: {
      address: "1 Six Flags Blvd, Jackson, NJ 08527",
      city: "Jackson",
      state: "New Jersey",
      region: "Northeast",
      coordinates: { lat: "40.136059", lon: "-74.436256" }
    },
    primary_dmas: "NEW YORK",
    secondary_dmas: ["PHILADELPHIA"]
  },
  // Tier 2 Parks (6 parks)
  {
    product_name: "Dorney Park",
    product_code: "CFDP",
    tier: "2",
    brand: "Cedar Fair",
    location: {
      address: "3830 Dorney Park Rd, Allentown, PA 18104",
      city: "Allentown",
      state: "Pennsylvania",
      region: "Northeast",
      coordinates: { lat: "40.578419", lon: "-75.533218" }
    },
    primary_dmas: "ALLENTOWN-BETHLEHEM PA, NEW YORK, PHILADELPHIA",
    secondary_dmas: []
  },
  {
    product_name: "Kings Dominion",
    product_code: "CFKD",
    tier: "2",
    brand: "Cedar Fair",
    location: {
      address: "16000 Theme Park Way, Doswell, VA 23047",
      city: "Doswell",
      state: "Virginia",
      region: "Southeast",
      coordinates: { lat: "37.839844", lon: "-77.444321" }
    },
    primary_dmas: "FREDRICKSBURG, RICHMOND, WASHINGTON DC",
    secondary_dmas: ["BALTIMORE", "NORFOLK", "RALEIGH-DURHAM", "ROANOKE"]
  },
  {
    product_name: "Schlitterbahn Galveston",
    product_code: "SBGV",
    tier: "2",
    brand: "Six Flags",
    location: {
      address: "2109 Lockheed Street, Galveston, TX 77554",
      city: "Galveston",
      state: "Texas",
      region: "Southwest",
      coordinates: { lat: "29.270499", lon: "-94.851987" }
    },
    primary_dmas: "GALVESTON TX, HOUSTON",
    secondary_dmas: []
  },
  {
    product_name: "Schlitterbahn New Braunfels",
    product_code: "SBNB",
    tier: "2",
    brand: "Six Flags",
    location: {
      address: "400 N. Liberty Avenue, New Braunfels, TX 78130",
      city: "New Braunfels",
      state: "Texas",
      region: "Southwest",
      coordinates: { lat: "29.7053577", lon: "-98.1174438" }
    },
    primary_dmas: "SANANTONIO",
    secondary_dmas: ["AUSTIN", "HOUSTON"]
  },
  {
    product_name: "SF Discovery Kingdom",
    product_code: "SFDK",
    tier: "2",
    brand: "Six Flags",
    location: {
      address: "1001 Fairgrounds Dr. SW, Vallejo, CA 94589",
      city: "Vallejo",
      state: "California",
      region: "West",
      coordinates: { lat: "38.1360", lon: "-122.2247" }
    },
    primary_dmas: "SAN FRANCISCO",
    secondary_dmas: ["SACRAMENTO"]
  },
  {
    product_name: "SF New England",
    product_code: "SFNE",
    tier: "2",
    brand: "Six Flags",
    location: {
      address: "1623 Main Street (Route 159), Agawam, MA 01001",
      city: "Agawam",
      state: "Massachusetts",
      region: "Northeast",
      coordinates: { lat: "42.038006", lon: "-72.613647" }
    },
    primary_dmas: "BOSTON, HARTFORD, WORCHESTERCOUNTY",
    secondary_dmas: ["PROVIDENCE", "SPRINGFIELDHOLYOKE"]
  },
  {
    product_name: "SF St Louis",
    product_code: "SFSL",
    tier: "2",
    brand: "Six Flags",
    location: {
      address: "4900 Six Flags Road, Eureka, MO 63025",
      city: "Eureka",
      state: "Missouri",
      region: "Midwest",
      coordinates: { lat: "38.5128", lon: "-90.6751" }
    },
    primary_dmas: "STLOUIS",
    secondary_dmas: ["CHAMPAIGN", "COLUMBIA JEFFERSON CITY", "MEMPHIS", "PADUCAHCAPEGIRARDEAUHRSBRG"]
  },
  // Tier 3 Parks (12 parks)
  {
    product_name: "Californias Great America",
    product_code: "CFGA",
    tier: "3",
    brand: "Cedar Fair",
    location: {
      address: "4701 Great America Pkwy, Santa Clara, CA 95054",
      city: "Santa Clara",
      state: "California",
      region: "West",
      coordinates: { lat: "37.397946", lon: "-121.974294" }
    },
    primary_dmas: "SAN FRANCISCO",
    secondary_dmas: ["MONTEREYSALINAS", "SAN JOSE"]
  },
  {
    product_name: "Michigans Adventure",
    product_code: "CFMA",
    tier: "3",
    brand: "Cedar Fair",
    location: {
      address: "4750 Whitehall Rd, Muskegon, MI 49445",
      city: "Muskegon",
      state: "Michigan",
      region: "Midwest",
      coordinates: { lat: "43.3474", lon: "-86.2789" }
    },
    primary_dmas: "GRAND RAPIDS",
    secondary_dmas: ["DETROIT", "FLINT-SAGINAW"]
  },
  {
    product_name: "Valleyfair",
    product_code: "CFVF",
    tier: "3",
    brand: "Cedar Fair",
    location: {
      address: "1 Valleyfair Dr, Shakopee, MN 55379",
      city: "Shakopee",
      state: "Minnesota",
      region: "Midwest",
      coordinates: { lat: "44.799515", lon: "-93.457775" }
    },
    primary_dmas: "MINNEAPOLIS",
    secondary_dmas: ["MANKATO MN", "ROCHESTERMN"]
  },
  {
    product_name: "Worlds Of Fun",
    product_code: "CFWF",
    tier: "3",
    brand: "Cedar Fair",
    location: {
      address: "4545 Worlds of Fun Avenue, Kansas City, MO 64161",
      city: "Kansas City",
      state: "Missouri",
      region: "Midwest",
      coordinates: { lat: "39.1731", lon: "-94.4867" }
    },
    primary_dmas: "KANSAS CITY",
    secondary_dmas: ["OMAHA", "TOPEKA"]
  },
  {
    product_name: "HH Arlington",
    product_code: "HHAR",
    tier: "3",
    brand: "Six Flags",
    location: {
      address: "1800 E Lamar Boulevard, Arlington, TX 76006",
      city: "Arlington",
      state: "Texas",
      region: "Southwest",
      coordinates: { lat: "32.7619126", lon: "-97.0828909" }
    },
    primary_dmas: "DALLAS",
    secondary_dmas: []
  },
  {
    product_name: "HH Phoenix",
    product_code: "HHAZ",
    tier: "3",
    brand: "Six Flags",
    location: {
      address: "4243 W Pinnacle Peak Road, Glendale, AZ 85310",
      city: "Phoenix",
      state: "Arizona",
      region: "Southwest",
      coordinates: { lat: "33.6958516", lon: "-112.1497195" }
    },
    primary_dmas: "PHOENIX",
    secondary_dmas: []
  },
  {
    product_name: "HH Splashtown",
    product_code: "HHST",
    tier: "3",
    brand: "Six Flags",
    location: {
      address: "21300 Interstate 45 North, Spring, TX 77373",
      city: "Spring",
      state: "Texas",
      region: "Southwest",
      coordinates: { lat: "30.069939", lon: "-95.4342024" }
    },
    primary_dmas: "HOUSTON",
    secondary_dmas: []
  },
  {
    product_name: "SF Darien Lake",
    product_code: "SFDL",
    tier: "3",
    brand: "Six Flags",
    location: {
      address: "9993 Allegheny Road, Corfu, NY 14036",
      city: "Darien Center",
      state: "New York",
      region: "Northeast",
      coordinates: { lat: "42.9285", lon: "-78.3849" }
    },
    primary_dmas: "BUFFALO",
    secondary_dmas: ["ROCHESTERMN", "SYRACUSE"]
  },
  {
    product_name: "SF Frontier City",
    product_code: "SFFC",
    tier: "3",
    brand: "Six Flags",
    location: {
      address: "11501 N I-35 Service Road, Oklahoma City, OK 73131",
      city: "Oklahoma City",
      state: "Oklahoma",
      region: "Southwest",
      coordinates: { lat: "35.5837", lon: "-97.4404" }
    },
    primary_dmas: "OKLAHOMACITY",
    secondary_dmas: ["TULSA"]
  },
  {
    product_name: "SF Great Escape",
    product_code: "SFGE",
    tier: "3",
    brand: "Six Flags",
    location: {
      address: "1172 State Route 9, Queensbury, NY 12804",
      city: "Queensbury",
      state: "New York",
      region: "Northeast",
      coordinates: { lat: "43.3522", lon: "-73.69705" }
    },
    primary_dmas: "ALBANY NY",
    secondary_dmas: ["BURLINGTON"]
  },
  {
    product_name: "SF White Water",
    product_code: "SFWW",
    tier: "3",
    brand: "Six Flags",
    location: {
      address: "250 Cobb Parkway N #100, Marietta, GA 30062",
      city: "Marietta",
      state: "Georgia",
      region: "Southeast",
      coordinates: { lat: "33.9548", lon: "-84.5195" }
    },
    primary_dmas: "ATLANTA",
    secondary_dmas: []
  }
];

export const PARK_TIERS = ['1', '2', '3'] as const;
export const PARK_BRANDS = ['Six Flags', 'Cedar Fair', 'Schlitterbahn'] as const;
export const PARK_REGIONS = ['Midwest', 'West', 'Southwest', 'Southeast', 'Northeast', 'Canada'] as const;
