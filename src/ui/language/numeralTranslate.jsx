function convertNumerals(value, digits) {
    if (value === null || value === undefined) return value;

    return value
        .toString()
        .replace(/\d/g, (digit) => digits[Number(digit)]);
}

const LANGUAGE_DIGITS = {
    assamese: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
    hindi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
};

export default function numeralTranslator(language, n) {
    if (LANGUAGE_DIGITS[language]) {
        return convertNumerals(n, LANGUAGE_DIGITS[language]);
    }
    return n;
}
