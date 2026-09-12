// Content for the sample site. Figures, names and reviews are placeholders.
export const asset = (p) => `${import.meta.env.BASE_URL}assets/${p}`;

export const company = {
  name: "Brick by Brick Group",
  legal: "Brick by Brick Group LLC",
  phone: "(630) 555-0184",
  phoneHref: "tel:+16305550184",
  email: "hello@brickbybrickgroup.com",
  office: "12800 Archer Avenue, Lemont, IL 60439",
  serving: "Lemont, DuPage, Cook and Will counties",
  license: "License #GC-000000",
};

export const services = [
  { key: "custom-homes", title: "Custom homes", desc: "New builds on your lot or ours, from first sketch to keys." },
  { key: "additions", title: "Additions and renovations", desc: "Second storeys, extensions and whole-home remodels that match the original brick." },
  { key: "multifamily", title: "Multi-family", desc: "Townhomes, duplexes and small apartment buildings." },
  { key: "commercial", title: "Commercial buildings", desc: "Retail, offices and tenant improvements delivered around your opening date." },
  { key: "industrial", title: "Industrial and warehouses", desc: "Ground-up warehouses, workshops and light-industrial facilities." },
  { key: "metal-buildings", title: "Metal buildings", desc: "Pre-engineered steel buildings erected and finished by our own crews." },
  { key: "masonry", title: "Masonry and brickwork", desc: "Brick, block and stone by masons who have laid it for decades." },
  { key: "design-build", title: "Design-build", desc: "In-house design and 3D renderings so you see the building before we build it." },
  { key: "sitework", title: "Site work and foundations", desc: "Excavation, grading, footings, slabs and utilities." },
];

export const projects = [
  { img: "custom-homes", title: "Two-storey custom home", meta: "New build · 3,400 sq ft", alt: "Two-storey brick custom home on a corner lot" },
  { img: "industrial", title: "Distribution warehouse", meta: "Industrial · 52,000 sq ft", alt: "Industrial warehouse with brick office front and loading docks" },
  { img: "multifamily", title: "Brick rowhomes", meta: "Multi-family · 9 units", alt: "Row of brick townhouses under construction" },
  { img: "commercial", title: "Retail building", meta: "Commercial · 5,800 sq ft", alt: "Single-storey brick retail building with storefront glass" },
  { img: "additions", title: "Rear brick addition", meta: "Addition to a 1960s ranch", alt: "Brick addition being built onto an older house" },
  { img: "metal-buildings", title: "Steel machine shop", meta: "Pre-engineered metal building", alt: "Steel building frame being erected by crane" },
];

export const steps = [
  { title: "Tell us what you're building", desc: "A call, then a site visit. We walk the lot with you, read the plans if you have them, and listen for what matters most." },
  { title: "Design and a fixed price", desc: "Our in-house designer turns the brief into drawings and 3D renderings. You get an itemised price that doesn't move unless you change the scope." },
  { title: "Permits and build", desc: "We handle engineering, permits and inspections. One site manager, one schedule, a photo update every Friday." },
  { title: "Walkthrough and warranty", desc: "We walk every room with you, close the punch list, and hand over the keys with a written warranty." },
];

export const pillars = [
  { title: "Transparent pricing", desc: "Itemised quotes, no allowances that balloon later, no change orders without your signature." },
  { title: "See it before we build it", desc: "3D renderings of every design-build project so you can change your mind on screen, not on site." },
  { title: "Our own crews", desc: "Masonry, framing and site work in-house. Fewer handoffs, fewer delays, one standard." },
  { title: "Local and family-run", desc: "We live where we build. Our reputation is on the same streets as our projects." },
];

export const facts = [
  { n: "20+", label: "years building locally" },
  { n: "300+", label: "homes and buildings delivered" },
  { n: "$25M", label: "bonding capacity" },
  { n: "5.0", label: "Google rating, 120+ reviews" },
];

export const reviews = [
  { quote: "They gave us a price, a schedule and a site manager's cell number. All three held. Our addition was done two days early and the brick matches the 1962 original so well you can't find the seam.", who: "Karen and Steve M., home addition" },
  { quote: "We needed a 52,000 square foot warehouse open before our old lease ended. Brick by Brick hit the date. The Friday photo updates meant I never had to drive out to check.", who: "Ray K., operations manager, distribution warehouse" },
  { quote: "First custom home and we were nervous about the unknowns. The 3D renderings and the itemised quote took most of that away. The rest went away when we met the crew.", who: "Anita and Joe D., custom home" },
];

export const projectTypes = ["Custom home", "Addition or renovation", "Multi-family", "Commercial", "Industrial or warehouse", "Metal building", "Something else"];
