export interface ContactInterface {
    CoE?: string;
    AM?: string;
}

export function parseContactValues(text: string): ContactInterface[] {
    const template = /(?:CoE: (\S+)(?:, )?)|(?:AM: (\S+)(?:, )?)/g;
    const matches: ContactInterface[] = [];
    let match;

    while ((
        match = template.exec(text)) !== null) {
        const link: ContactInterface = {};

        if (match[1] !== undefined) {
            link.CoE = match[1].replace(/,$/, '');
        }
        if (match[2] != undefined) {
            link.AM = match[2].replace(/,$/, '');
        }
        matches.push(link);
    }
    return matches;

