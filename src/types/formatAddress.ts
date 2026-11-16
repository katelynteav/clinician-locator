export function formatAddress(c: {
    address: string;
    city: string;
    state: string;
    zipCode: string | number;
}) {
    return[c.address, c.city, `${c.state} ${c.zipCode}`.trim()]
        .filter(Boolean)
        .join(", ");
}