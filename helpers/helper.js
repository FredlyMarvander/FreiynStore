function total(harga, diskon) {
    let value = harga * ((100 - diskon) / 100)

    let result = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(value);

    return result
}

module.exports = { total }