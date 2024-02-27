export const normal: string[][] = [
    ["address", "city", "state", "price"],
    ["847 Thayer", "Boston", "MA", "788477"],
    ["12 Waterman", "Providence", "RI", "627352"],
    ["772 Smith", "Richmond", "VA", "438728"]
];
export const malformed: string[][] = [
    ["address", "city", "state", "price"],
    ["67 Thayer", "Cranston", "RI", "92573"],
    ["123 Main", "Providence", "RI", "756473", "renting"],
    ["1490 Smith", "Dallas", "TX", "100324"]
];
export const noHeaders: string[][] = [
    ["2553 West", "Los Angeles", "CA", "1773990"],
    ["918 Shelby", "Seattle", "WA", "913741"],
    ["1553 Broadway", "New York", "NY", "4373884"]
];
export const empty: string[][] = [];
export const missing: string[][] = [
    ["address", "city", "state", "price"],
    ["MA", "788477"],
    ["12 Waterman", "Providence", "RI"],
    ["772 Smith", "Richmond", "VA", "438728"]
];

export const jsonMap = new Map<string, string[][]>();
jsonMap.set("normal", normal);
jsonMap.set("malformed", malformed);
jsonMap.set("noHeaders", noHeaders);
jsonMap.set("empty", empty);
jsonMap.set("missing", missing);

export const userMap = new Map<string, string>();
userMap.set("john", "johnpassword");
userMap.set("alex", "alexpassword");
userMap.set("bob", "bobpassword");

export const resultMap = new Map<string, string[][]>();
resultMap.set("MA 2", [["847 Thayer", "Boston", "MA", "788477"]]);
// resultMap.set("")