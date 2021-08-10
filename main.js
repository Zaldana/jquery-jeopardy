async function main() {
    const rawData = await fetch('jeopardy.json');
    const data = await rawData.json();
}

// main();