export const SCIENCE_GRADIENT = 'linear-gradient(135deg,#00c9a7,#7cf5d9)'

/** The four TRF Science sub-sections. `id` doubles as the on-page anchor (/trf-science#chemicals). */
export const SCIENCE_RANGES = [
  {
    id: 'lab-supplies',
    icon: '🧪',
    title: 'Lab Supplies',
    desc: 'The everyday consumables that keep a lab running — from pipette tips to protective wear.',
    items: ['Pipettes & tips', 'Filter paper', 'Gloves & lab coats', 'Sample containers', 'Labels & markers', 'Cleaning & safety supplies'],
  },
  {
    id: 'lab-equipment',
    icon: '🔬',
    title: 'Lab Equipment',
    desc: 'Instruments and apparatus for teaching, testing and research labs of any size.',
    items: ['Microscopes', 'Balances & scales', 'Hot plates & stirrers', 'Centrifuges', 'Ovens & incubators', 'Stands, clamps & burners'],
  },
  {
    id: 'chemicals',
    icon: '⚗️',
    title: 'Chemicals',
    desc: 'Laboratory reagents and chemicals for education, quality control and analysis.',
    items: ['Acids & bases', 'Salts & reagents', 'Indicators & stains', 'Solvents', 'Buffer solutions', 'Standards'],
  },
  {
    id: 'glassware',
    icon: '🧫',
    title: 'Glassware',
    desc: 'Durable laboratory glassware for measuring, mixing, heating and storage.',
    items: ['Beakers', 'Flasks', 'Test tubes & racks', 'Measuring cylinders', 'Burettes & pipettes', 'Petri dishes'],
  },
] as const

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
