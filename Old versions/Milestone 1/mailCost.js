const stampedCost = {1: "0.55", 2: "0.70", 3: "0.85", 3.5: "1.00"}
const meteredCost = {1: "0.50", 2: "0.65", 3: "0.80", 3.5: "0.95"}
const flatsCost = [
    0, 1.00, 1.20, 1.40, 1.60, 1.80, 2.00, 2.20, 2.40, 2.60, 2.80, 3.00, 3.20, 3.40
]
const retailCost = [
    [0, 3.80, 3.80, 3.80, 3.80, 4.60, 4.60, 4.60, 4.60, 5.30, 5.30, 5.30, 5.30, 5.90],
    [0, 3.80, 3.80, 3.80, 3.80, 4.60, 4.60, 4.60, 4.60, 5.30, 5.30, 5.30, 5.30, 5.90],
    [0, 3.85, 3.85, 3.85, 3.85, 4.65, 4.65, 4.65, 4.65, 5.35, 5.35, 5.35, 5.35, 5.95],
    [0, 3.90, 3.90, 3.90, 3.90, 4.70, 4.70, 4.70, 4.70, 5.40, 5.40, 5.40, 5.40, 6.05],
    [0, 3.95, 3.95, 3.95, 3.95, 4.75, 4.75, 4.75, 4.75, 5.45, 5.45, 5.45, 5.45, 6.15],
    [0, 4.00, 4.00, 4.00, 4.00, 4.80, 4.80, 4.80, 4.80, 5.50, 5.50, 5.50, 5.50, 6.20],
    [0, 4.05, 4.05, 4.05, 4.05, 4.90, 4.90, 4.90, 4.90, 5.65, 5.65, 5.65, 5.65, 6.40],
    [0, 4.20, 4.20, 4.20, 4.20, 5.00, 5.00, 5.00, 5.00, 5.75, 5.75, 5.75, 5.75, 6.50],
    [0, 4.20, 4.20, 4.20, 4.20, 5.00, 5.00, 5.00, 5.00, 5.75, 5.75, 5.75, 5.75, 6.50]
]

exports.calculateRate = (req, res) => {
    let oz = Number(req.query.oz);
    let type = req.query.mailType;
    // add zone to form if required
    let zone = Number(req.query.zone);
    let cost = undefined;
    if (type === "stamped" || type === "metered") {
        if (oz <= 3) {
            oz = Math.ceil(oz);
        } else if (oz <= 3.5) {
            oz = 3.5;
        }
    } else {
        oz = Math.ceil(oz);
    }

    switch (type) {
        case "stamped":
            cost = stampedCost[oz];
            break;
        case "metered":
            cost = meteredCost[oz];
            break;
        case "flat":
            if (oz <= 13) {
                cost = flatsCost[oz];
            }
            break;
        case "retail":
            if (oz <= 13) {
                cost = retailCost[zone][oz];
            }
            break;
    }
    const calcResult = {oz: oz, zone: zone, type: type, cost: cost};
    if (req.url.includes("Json")) {
        res.json(calcResult)
    }
    res.render('pages/displayResults', calcResult);
}
