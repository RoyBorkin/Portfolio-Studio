/*! Portfolio Studio. Copyright (c) 2026 Roy Borkin. All rights reserved. Unauthorized copying, modification or distribution is prohibited without written permission. */
// Default project: Roy Borkin. Asset refs look like "a:<id>" and resolve through project.assets.
export const uid = () => Math.random().toString(36).slice(2, 9);

export function defaultProject(assets = {}) {
  return {
    version: 1,
    name: 'Roy Borkin — portfolio',
    template: 'classic',
    variant: 1,
    theme: {
      overrides: {},          // { bg, surface, fg, muted, accent, accent2, line }
      fontDisplay: '', fontBody: '', fontMono: '',
      scale: 1, radius: null, motion: 'full', cursor: true, grain: true, effects3d: true,
      customCss: '',
    },
    site: {
      title: 'Roy Borkin — Industrial Designer, Programmer, Researcher, Maker',
      description: 'Portfolio of Roy Borkin: industrial design, generative and computational design, software and research.',
      lang: 'en', dir: 'ltr', favicon: 'a:logo', url: 'https://royborkin.github.io/',
      showCopyright: true, copyright: '',
    },
    profile: {
      firstName: 'Roy', lastName: 'Borkin',
      intro: 'Hi, my name is',
      role: 'Industrial Designer',
      roles: ['Industrial Designer', 'Programmer', 'Researcher', 'Maker'],
      tagline: 'I merge traditional craft with AI and computational design to engineer data-driven physical products.',
      location: 'Haifa, Israel',
      status: 'PhD researcher at the Technion',
      altName: 'ロイ・ボルキン',
      timezone: 'Asia/Jerusalem',
      photo: 'a:photo', cutout: 'a:cutout', sketch: 'a:sketch', logo: 'a:logo',
    },
    sections: [
      { id: 'home', label: 'Main', title: 'Roy Borkin', subtitle: '', enabled: true },
      { id: 'works', label: 'My Works', title: 'My works', subtitle: 'Projects, studio posts and what I share on Instagram and LinkedIn.', enabled: true },
      { id: 'sandbox', label: 'SandBox', title: 'SandBox', subtitle: 'Code on GitHub and a library of small web apps.', enabled: true },
      { id: 'about', label: 'About me', title: 'About me', subtitle: '', enabled: true },
      { id: 'portfolio', label: 'Portfolio', title: 'Portfolio', subtitle: 'Full portfolios, one for each side of the work.', enabled: true },
    ],
    contacts: [
      { id: uid(), type: 'email', label: 'Email', value: 'royborkin@gmail.com', show: true },
      { id: uid(), type: 'phone', label: 'Phone', value: '+972525530002', show: true },
      { id: uid(), type: 'whatsapp', label: 'WhatsApp', value: 'https://wa.me/qr/CRRXW6FTKRALE1', show: true },
      { id: uid(), type: 'linkedin', label: 'LinkedIn', value: 'https://www.linkedin.com/in/royborkin/', show: true },
      { id: uid(), type: 'instagram', label: 'Instagram', value: 'https://www.instagram.com/royborkin/', show: true },
      { id: uid(), type: 'github', label: 'GitHub', value: 'https://github.com/royborkin', show: true },
      { id: uid(), type: 'photos', label: 'Photo blog', value: 'https://www.eyeem.com/u/royborkin', show: false },
    ],
    works: {
      showFilters: true,
      instagram: { mode: 'manual', username: 'royborkin', token: '', feedUrl: '', limit: 24 },
      linkedin: { mode: 'manual', feedUrl: '', limit: 24 },
      items: [
        { id: uid(), kind: 'project', title: 'Carved maple archtop guitar', date: '2025-06-10', image: 'a:work-archtop', url: '', text: 'A hollow-body electric with a hand-carved maple top, gold hardware and a vibrato tailpiece. Designed and built end to end.', tags: ['Luthiery', 'Woodworking'] },
        { id: uid(), kind: 'project', title: 'Parametric prosthetic arm', date: '2021-09-01', image: 'a:work-prosthesis', url: '', text: 'Product design for a parametric prosthesis with Tikun Olam Makers, generated from the user\'s measurements.', tags: ['Parametric design', 'Medical'] },
        { id: uid(), kind: 'project', title: 'Acoustic guitar build', date: '2024-03-15', image: 'a:work-acoustic', url: '', text: 'Steel-string acoustic guitar. Edit this card to add the story, materials and process photos.', tags: ['Luthiery'] },
        { id: uid(), kind: 'project', title: 'Flat-pack outdoor set', date: '2022-05-20', image: 'a:work-furniture', url: '', text: 'Table and four chairs cut from sheet stock, assembled without hardware. Edit this card to add details.', tags: ['Furniture', 'CNC'] },
        { id: uid(), kind: 'project', title: 'Copper and brass rings', date: '2020-11-02', image: 'a:work-rings', url: '', text: 'Twisted and forged wire jewelry. Edit this card to add details.', tags: ['Metalwork'] },
        { id: uid(), kind: 'project', title: 'Wooden toy helicopter', date: '2019-07-12', image: 'a:work-helicopter', url: '', text: 'A pull-along toy in birch ply with turned wheels. Edit this card to add details.', tags: ['Toys', 'Woodworking'] },
        { id: uid(), kind: 'post', title: 'Handheld device concept', date: '2023-02-08', image: 'a:work-device', url: '', text: 'A post written for this site. Use posts for news, process notes and anything that is not a full project.', tags: ['Concept'] },
        { id: uid(), kind: 'instagram', title: 'Instagram post', date: '2025-01-20', image: '', url: 'https://www.instagram.com/royborkin/', text: 'Paste a post link (instagram.com/p/…) to show it here with the official embed.', tags: [] },
        { id: uid(), kind: 'linkedin', title: 'LinkedIn post', date: '2024-11-05', image: '', url: 'https://www.linkedin.com/in/royborkin/', text: 'Paste a post link (linkedin.com/posts/…) or its embed code to show it here.', tags: [] },
      ],
    },
    sandbox: {
      github: { user: 'royborkin', includeForks: false, hide: [], pinned: [], limit: 24 },
      apps: [
        { id: uid(), title: 'Mini app slot', text: 'Link a web app or upload a single HTML file. It opens right here in a window.', url: '', html: '', image: '', date: '2026-01-01', status: 'soon' },
        { id: uid(), title: 'Generative pattern toy', text: 'Example placeholder — replace with one of your apps.', url: '', html: '', image: '', date: '2025-08-01', status: 'soon' },
      ],
    },
    about: {
      photo: 'a:about-japan',
      bio: 'With over a decade of experience in product development and cross-disciplinary research, I merge traditional craft with AI and computational design to solve complex challenges. Leveraging expertise across generative modeling, advanced manufacturing, and software development, I engineer data-driven physical products.',
      stats: [
        { value: '13+', label: 'Years of experience' },
        { value: '30+', label: 'Projects' },
        { value: '8', label: 'Awards' },
        { value: '3', label: 'Languages' },
      ],
      experience: [
        { id: uid(), title: 'Researcher', org: 'DesignTech Lab · Technion', place: 'Haifa', years: '2024 – now', text: 'Research in algorithms and AI, psychoacoustics, computational acoustics, generative design, marine biology and marine environments, artificial coral reef rehabilitation, 3D printing, CNC, plastic recycling and research-based design.' },
        { id: uid(), title: 'Lab Manager & Teaching Assistant', org: 'DesignTech Lab · Technion', place: 'Haifa', years: '2024 – 2026', text: 'Ran daily lab operations, budgets, collaborations and conferences; taught design and AI courses and maintained the 3D printers and CNC machines.' },
        { id: uid(), title: 'Co-founder & Head of Product', org: 'SAFERA', place: 'California / Israel', years: '2023 – 2026', text: 'Startup preventing weapon misuse and theft. Led development across mechanics, electronics, software and design, delivering several functional proofs of concept.' },
        { id: uid(), title: 'Mechanical Engineer & CAD for Manufacturing', org: 'Freelance', place: '', years: '', text: 'Conceptualized and developed products for manufacturing, with detailed work plans for smooth production.' },
        { id: uid(), title: 'Industrial & Mechanical Designer', org: 'Jonathan Bar-Or studio', place: 'Pardes-Hanna', years: '2022 – 2024', text: 'Mechanical, medical-equipment and graphic design; solved customer problems with UX & UI, CAD and procedural modeling.' },
        { id: uid(), title: 'Workshop Supervisor', org: 'Bezalel Academy', place: 'Jerusalem', years: '2019 – 2022', text: 'Ran the industrial design workshops: wood, machining, plastics and composites. CNC, laser, 3D printing and manual machines.' },
        { id: uid(), title: 'Prosthesis Designer', org: 'Tikun Olam Makers', place: 'Tel Aviv', years: '2021', text: 'Product designer on a parametric prosthesis project, combining programming and parametric design.' },
        { id: uid(), title: 'Industrial Designer', org: 'Israel Defense Forces · 81 unit', place: '', years: '2013 – 2017', text: 'Designed and built functional products; industrial design services, material spraying, mechanical engineering, UX & UI.' },
      ],
      education: [
        { id: uid(), title: 'PhD in Industrial Design', place: 'Technion · Haifa', years: '2026 – now' },
        { id: uid(), title: 'M.Sc in Industrial Design', place: 'Technion · Haifa', years: '2024 – 2026' },
        { id: uid(), title: 'Scuba Diver Researcher — AAUS', place: 'IUI · Eilat', years: '2026' },
        { id: uid(), title: 'Musical Instruments Craft', place: 'Living National Treasures · Tokyo', years: '2024' },
        { id: uid(), title: 'Fullstack Course', place: 'Code Chrysalis · Tokyo', years: '2024' },
        { id: uid(), title: 'B.Des in Industrial Design', place: 'Bezalel · Jerusalem', years: '2017 – 2022' },
        { id: uid(), title: 'CAM & CNC Operator', place: 'Modeling Center', years: '2020 – 2022' },
        { id: uid(), title: 'Safety Course for Workshops', place: "Israel's Department of Labor", years: '2019' },
        { id: uid(), title: 'CAD & Technical Drawing', place: 'IDF', years: '2015 – 2016' },
      ],
      skills: [
        { id: uid(), group: 'Software', items: 'Illustrator, Photoshop, Adobe XD, Figma, Premiere, Lightroom, InDesign, Unity, Unreal Engine, Office' },
        { id: uid(), group: '3D render & model', items: 'SolidCAM, SolidWorks, Fusion 360, Lumion, KeyShot, Blender, Rhino, Grasshopper, SketchUp, ZBrush, Onshape, TouchDesigner' },
        { id: uid(), group: 'Coding', items: 'C++, C#, JavaScript, HTML, CSS, SQL, Python, G-code, local LLMs, n8n, Git, Node.js, Docker, ML, deep learning' },
        { id: uid(), group: 'Craft', items: 'Woodworking, metalworking, painting, sculpting, luthiery, photography, 3D printer building, scuba diving' },
        { id: uid(), group: 'Languages', items: 'English, Hebrew, Japanese' },
      ],
      resume: { label: 'Resume', url: 'https://drive.google.com/file/d/1N9Mst2Cg-vUXsJl-Dst0A_oDC7I8uUTJ/view?usp=sharing' },
    },
    portfolio: {
      items: [
        { id: uid(), title: 'Designer portfolio', text: 'Industrial design, craft and research projects in depth.', url: '', image: 'a:work-furniture', kind: 'designer' },
        { id: uid(), title: 'Programmer portfolio', text: 'Software, generative tools and computational design.', url: '', image: 'a:work-device', kind: 'programmer' },
      ],
    },
    mix: { bg: '', nav: '', menu: '', contacts: '', hero: '', sections: '' },
    textfx: { on: true, name: 'template', heads: 'template', body: 'template', speed: 1, stagger: 1, replay: 'always' },
    cursor: { style: 'template', size: 1, color: '', follow: 0.45, grow: true, labels: true, label: 'View', click: true, magnetic: -1, snap: 0, snapReach: 40, hideNative: false, image: '' },
    layout: { transition: 'default', speed: 1, loop: false, wheel: true, swipe: true, keys: true, density: 1, cols: { works: {}, code: {} }, els: {}, secBg: {} },
    assets,
  };
}
