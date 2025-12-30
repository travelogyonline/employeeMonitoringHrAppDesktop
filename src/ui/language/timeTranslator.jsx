function convertTime(value, config) {
  if (value === null || value === undefined) return value;

  const { digits, am, pm } = config;

  return value
    .toString()
    // Convert digits
    .replace(/\d/g, (digit) => digits[Number(digit)])
    // Convert AM / PM
    .replace(/\bAM\b/i, am)
    .replace(/\bPM\b/i, pm);
}

const LANGUAGE_CONFIG = {
  assamese: {
    digits: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
    am: 'পূৰ্বাহ্ণ',
    pm: 'অপৰাহ্ণ',
  },
  hindi: {
    digits: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
    am: 'पूर्वाह्न',
    pm: 'अपराह्न',
  },
};

export default function timeTranslator(language, time) {
  if (LANGUAGE_CONFIG[language]) {
    return convertTime(time, LANGUAGE_CONFIG[language]);
  }
  return time;
}
