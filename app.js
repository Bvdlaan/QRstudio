const isEnglish = document.documentElement.lang === 'en';

// ========== Theme Management ==========
const initTheme = () => {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const html = document.documentElement;

  // Check voor opgeslagen voorkeur of systeem voorkeur
  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  html.setAttribute('data-theme', savedTheme);

  // Update aria-label based on current theme
  const updateAriaLabel = (theme) => {
    const label = theme === 'dark'
      ? (isEnglish ? 'Switch to light theme' : 'Schakel naar licht thema')
      : (isEnglish ? 'Switch to dark theme' : 'Schakel naar donker thema');
    themeToggles.forEach(toggle => toggle.setAttribute('aria-label', label));
  };

  updateAriaLabel(savedTheme);

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateAriaLabel(newTheme);
    });
  });
};

// ========== Mobile Navigation ==========
const initMobileNav = () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (!navToggle || !navMenu) return;

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Sluit menu bij klik op link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Sluit menu bij klik buiten menu
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
};

// ========== Smooth Scrolling ==========
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// ========== QR Generator Logic ==========
const initQRGenerator = () => {
  const fieldsWrap = document.getElementById('fields');
  const typeField = document.getElementById('typeField');
  const dataField = document.getElementById('dataField');
  const typebar = document.getElementById('typebar');

  if (!fieldsWrap || !typebar) return;

  // URL validator en formatter functie
  const formatURL = (url) => {
    url = url.trim();
    if (!url) return '';
    // Check of de URL al begint met http://, https://, of een ander protocol
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = 'https://' + url;
    }
    return url;
  };

  // Field templates voor elk QR type
  const templates = {
    text: () => isEnglish ? `
      <div class="fields">
        <div>
          <label for="t_text">Text</label>
          <textarea id="t_text" rows="4" placeholder="Enter your text here..." required></textarea>
        </div>
      </div>` : `
      <div class="fields">
        <div>
          <label for="t_text">Tekst</label>
          <textarea id="t_text" rows="4" placeholder="Voer je tekst in..." required></textarea>
        </div>
      </div>`,

    url: () => isEnglish ? `
      <div class="fields">
        <div>
          <label for="u_url">Website URL</label>
          <input id="u_url" type="url" placeholder="yourwebsite.com" required>
          <p class="input-description">Tip: you only need to enter the domain name. <code>https://</code> is automatically added.</p>
        </div>
      </div>` : `
      <div class="fields">
        <div>
          <label for="u_url">Website URL</label>
          <input id="u_url" type="url" placeholder="jouwwebsite.nl" required>
          <p class="input-description">Tip: je hoeft alleen de domeinnaam in te vullen. <code>https://</code> wordt automatisch toegevoegd.</p>
        </div>
      </div>`,

    phone: () => isEnglish ? `
      <div class="fields">
        <div>
          <label for="p_tel">Phone Number</label>
          <input id="p_tel" type="tel" placeholder="+1 202 555 0143" required>
        </div>
      </div>` : `
      <div class="fields">
        <div>
          <label for="p_tel">Telefoonnummer</label>
          <input id="p_tel" type="tel" placeholder="+31 6 12345678" required>
        </div>
      </div>`,

    sms: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="s_tel">Phone Number</label>
          <input id="s_tel" type="tel" placeholder="+1 202 555 0143" required>
        </div>
        <div>
          <label for="s_body">Message (optional)</label>
          <input id="s_body" type="text" placeholder="Your SMS message...">
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="s_tel">Telefoonnummer</label>
          <input id="s_tel" type="tel" placeholder="+31 6 12345678" required>
        </div>
        <div>
          <label for="s_body">Bericht (optioneel)</label>
          <input id="s_body" type="text" placeholder="Je SMS bericht...">
        </div>
      </div>`,

    email: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="e_to">Email Address</label>
          <input id="e_to" type="email" placeholder="name@example.com" required>
        </div>
        <div>
          <label for="e_subj">Subject</label>
          <input id="e_subj" type="text" placeholder="Subject of your message">
        </div>
        <div style="grid-column: 1/-1">
          <label for="e_body">Message</label>
          <textarea id="e_body" rows="3" placeholder="Your message..."></textarea>
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="e_to">E-mailadres</label>
          <input id="e_to" type="email" placeholder="naam@voorbeeld.nl" required>
        </div>
        <div>
          <label for="e_subj">Onderwerp</label>
          <input id="e_subj" type="text" placeholder="Onderwerp van je bericht">
        </div>
        <div style="grid-column: 1/-1">
          <label for="e_body">Bericht</label>
          <textarea id="e_body" rows="3" placeholder="Je bericht..."></textarea>
        </div>
      </div>`,

    whatsapp: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="w_tel">WhatsApp Number (without +)</label>
          <input id="w_tel" type="tel" placeholder="12025550143" required>
        </div>
        <div>
          <label for="w_text">Message (optional)</label>
          <input id="w_text" type="text" placeholder="Hello! 👋">
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="w_tel">WhatsApp nummer (zonder +)</label>
          <input id="w_tel" type="tel" placeholder="31612345678" required>
        </div>
        <div>
          <label for="w_text">Bericht (optioneel)</label>
          <input id="w_text" type="text" placeholder="Hallo! 👋">
        </div>
      </div>`,

    facetime: () => isEnglish ? `
      <div class="fields">
        <div>
          <label for="f_id">FaceTime ID (email or phone)</label>
          <input id="f_id" type="text" placeholder="name@icloud.com or +12025550143" required>
        </div>
      </div>` : `
      <div class="fields">
        <div>
          <label for="f_id">FaceTime ID (e-mail of telefoon)</label>
          <input id="f_id" type="text" placeholder="naam@icloud.com of +31612345678" required>
        </div>
      </div>`,

    location: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="g_lat">Latitude</label>
          <input id="g_lat" type="text" placeholder="40.7128" required>
        </div>
        <div>
          <label for="g_lng">Longitude</label>
          <input id="g_lng" type="text" placeholder="-74.0060" required>
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="g_lat">Breedtegraad (latitude)</label>
          <input id="g_lat" type="text" placeholder="52.3702" required>
        </div>
        <div>
          <label for="g_lng">Lengtegraad (longitude)</label>
          <input id="g_lng" type="text" placeholder="4.8952" required>
        </div>
      </div>`,

    wifi: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="w_ssid">Network Name (SSID)</label>
          <input id="w_ssid" type="text" placeholder="MyWiFi" required>
        </div>
        <div>
          <label for="w_pass">Password</label>
          <input id="w_pass" type="password" placeholder="••••••••" required>
        </div>
        <div>
          <label for="w_type">Security</label>
          <select id="w_type">
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None</option>
          </select>
        </div>
        <div>
          <label for="w_hidden">Hidden network?</label>
          <select id="w_hidden">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="w_ssid">Netwerknaam (SSID)</label>
          <input id="w_ssid" type="text" placeholder="MijnWiFi" required>
        </div>
        <div>
          <label for="w_pass">Wachtwoord</label>
          <input id="w_pass" type="password" placeholder="••••••••" required>
        </div>
        <div>
          <label for="w_type">Beveiliging</label>
          <select id="w_type">
            <option value="WPA">WPA/WPA2/WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Geen</option>
          </select>
        </div>
        <div>
          <label for="w_hidden">Verborgen netwerk?</label>
          <select id="w_hidden">
            <option value="false">Nee</option>
            <option value="true">Ja</option>
          </select>
        </div>
      </div>`,

    event: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="ev_title">Event Title</label>
          <input id="ev_title" type="text" placeholder="Team meeting" required>
        </div>
        <div>
          <label for="ev_loc">Location</label>
          <input id="ev_loc" type="text" placeholder="New York">
        </div>
        <div>
          <label for="ev_start">Start Date & Time</label>
          <input id="ev_start" type="datetime-local" required>
        </div>
        <div>
          <label for="ev_end">End Date & Time</label>
          <input id="ev_end" type="datetime-local" required>
        </div>
        <div style="grid-column: 1/-1">
          <label for="ev_desc">Description</label>
          <textarea id="ev_desc" rows="2" placeholder="Additional information..."></textarea>
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="ev_title">Titel evenement</label>
          <input id="ev_title" type="text" placeholder="Team meeting" required>
        </div>
        <div>
          <label for="ev_loc">Locatie</label>
          <input id="ev_loc" type="text" placeholder="Amsterdam">
        </div>
        <div>
          <label for="ev_start">Start datum & tijd</label>
          <input id="ev_start" type="datetime-local" required>
        </div>
        <div>
          <label for="ev_end">Eind datum & tijd</label>
          <input id="ev_end" type="datetime-local" required>
        </div>
        <div style="grid-column: 1/-1">
          <label for="ev_desc">Beschrijving</label>
          <textarea id="ev_desc" rows="2" placeholder="Extra informatie..."></textarea>
        </div>
      </div>`,

    crypto: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="c_scheme">Cryptocurrency</label>
          <select id="c_scheme">
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="litecoin">Litecoin</option>
          </select>
        </div>
        <div>
          <label for="c_addr">Wallet Address</label>
          <input id="c_addr" type="text" placeholder="bc1q..." required>
        </div>
        <div>
          <label for="c_amt">Amount (optional)</label>
          <input id="c_amt" type="text" placeholder="0.001">
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="c_scheme">Cryptocurrency</label>
          <select id="c_scheme">
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="litecoin">Litecoin</option>
          </select>
        </div>
        <div>
          <label for="c_addr">Wallet adres</label>
          <input id="c_addr" type="text" placeholder="bc1q..." required>
        </div>
        <div>
          <label for="c_amt">Bedrag (optioneel)</label>
          <input id="c_amt" type="text" placeholder="0.001">
        </div>
      </div>`,

    vcard: () => isEnglish ? `
      <div class="fields two">
        <div>
          <label for="v_first">First Name</label>
          <input id="v_first" type="text" required>
        </div>
        <div>
          <label for="v_last">Last Name</label>
          <input id="v_last" type="text" required>
        </div>
        <div>
          <label for="v_org">Organization</label>
          <input id="v_org" type="text" placeholder="Company Name">
        </div>
        <div>
          <label for="v_title">Job Title</label>
          <input id="v_title" type="text" placeholder="CEO">
        </div>
        <div>
          <label for="v_tel">Phone</label>
          <input id="v_tel" type="tel" placeholder="+1 555 123 4567">
        </div>
        <div>
          <label for="v_email">Email</label>
          <input id="v_email" type="email" placeholder="name@company.com">
        </div>
        <div style="grid-column: 1/-1">
          <label for="v_url">Website</label>
          <input id="v_url" type="url" placeholder="https://website.com">
        </div>
      </div>` : `
      <div class="fields two">
        <div>
          <label for="v_first">Voornaam</label>
          <input id="v_first" type="text" required>
        </div>
        <div>
          <label for="v_last">Achternaam</label>
          <input id="v_last" type="text" required>
        </div>
        <div>
          <label key="v_org" for="v_org">Organisatie</label>
          <input id="v_org" type="text" placeholder="Bedrijfsnaam">
        </div>
        <div>
          <label for="v_title">Functie</label>
          <input id="v_title" type="text" placeholder="CEO">
        </div>
        <div>
          <label for="v_tel">Telefoon</label>
          <input id="v_tel" type="tel" placeholder="+31 6 12345678">
        </div>
        <div>
          <label for="v_email">E-mail</label>
          <input id="v_email" type="email" placeholder="naam@bedrijf.nl">
        </div>
        <div style="grid-column: 1/-1">
          <label for="v_url">Website</label>
          <input id="v_url" type="url" placeholder="https://website.nl">
        </div>
      </div>`
  };

  // Payload builders
  const build = {
    text: () => document.getElementById('t_text')?.value || '',

    url: () => {
      const urlInput = document.getElementById('u_url')?.value;
      return formatURL(urlInput) || '';
    },

    phone: () => `tel:${document.getElementById('p_tel')?.value.trim() || ''}`,

    sms: () => {
      const n = document.getElementById('s_tel')?.value.trim() || '';
      const b = document.getElementById('s_body')?.value.trim() || '';
      return b ? `SMSTO:${n}:${b}` : `SMSTO:${n}:`;
    },

    email: () => {
      const to = encodeURIComponent(document.getElementById('e_to')?.value.trim() || '');
      const subj = encodeURIComponent(document.getElementById('e_subj')?.value.trim() || '');
      const body = encodeURIComponent(document.getElementById('e_body')?.value.trim() || '');
      let url = `mailto:${to}`;
      const params = [];
      if (subj) params.push(`subject=${subj}`);
      if (body) params.push(`body=${body}`);
      if (params.length) url += `?${params.join('&')}`;
      return url;
    },

    whatsapp: () => {
      const tel = document.getElementById('w_tel')?.value.replace(/\D/g, '') || '';
      const text = encodeURIComponent(document.getElementById('w_text')?.value.trim() || '');
      return text ? `https://wa.me/${tel}?text=${text}` : `https://wa.me/${tel}`;
    },

    facetime: () => `facetime://${document.getElementById('f_id')?.value.trim() || ''}`,

    location: () => {
      const lat = document.getElementById('g_lat')?.value.trim() || '';
      const lng = document.getElementById('g_lng')?.value.trim() || '';
      return `geo:${lat},${lng}`;
    },

    wifi: () => {
      const ssid = document.getElementById('w_ssid')?.value || '';
      const pass = document.getElementById('w_pass')?.value || '';
      const type = document.getElementById('w_type')?.value || 'WPA';
      const hidden = document.getElementById('w_hidden')?.value === 'true' ? 'true' : 'false';
      return `WIFI:T:${type};S:${ssid};P:${pass};H:${hidden};;`;
    },

    event: () => {
      const title = document.getElementById('ev_title')?.value || '';
      const location = document.getElementById('ev_loc')?.value || '';
      const desc = document.getElementById('ev_desc')?.value || '';
      const start = document.getElementById('ev_start')?.value.replace(/[-:]/g, '') || '';
      const end = document.getElementById('ev_end')?.value.replace(/[-:]/g, '') || '';

      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        location ? `LOCATION:${location}` : '',
        desc ? `DESCRIPTION:${desc}` : '',
        `DTSTART:${start}`,
        `DTEND:${end}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].filter(Boolean).join('\n');
    },

    crypto: () => {
      const scheme = document.getElementById('c_scheme')?.value || 'bitcoin';
      const addr = document.getElementById('c_addr')?.value.trim() || '';
      const amt = document.getElementById('c_amt')?.value.trim() || '';
      return amt ? `${scheme}:${addr}?amount=${amt}` : `${scheme}:${addr}`;
    },

    vcard: () => {
      const first = document.getElementById('v_first')?.value.trim() || '';
      const last = document.getElementById('v_last')?.value.trim() || '';
      const org = document.getElementById('v_org')?.value.trim() || '';
      const title = document.getElementById('v_title')?.value.trim() || '';
      const tel = document.getElementById('v_tel')?.value.trim() || '';
      const email = document.getElementById('v_email')?.value.trim() || '';
      const url = document.getElementById('v_url')?.value.trim() || '';

      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${last};${first};;;`,
        `FN:${first} ${last}`,
        org ? `ORG:${org}` : '',
        title ? `TITLE:${title}` : '',
        tel ? `TEL;TYPE=CELL:${tel}` : '',
        email ? `EMAIL:${email}` : '',
        url ? `URL:${url}` : '',
        'END:VCARD'
      ].filter(Boolean);

      return lines.join('\n');
    }
  };

  // Render fields voor geselecteerd type
  const render = (type) => {
    // Update active button
    [...typebar.querySelectorAll('.btn-type')].forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });

    // Render fields
    fieldsWrap.innerHTML = (templates[type] || templates.text)();

    // Update hidden type field
    typeField.value = type.charAt(0).toUpperCase() + type.slice(1);

    // Voeg event listener toe voor URL veld voor directe feedback
    if (type === 'url') {
      const urlInput = document.getElementById('u_url');
      urlInput?.addEventListener('blur', () => {
        urlInput.value = formatURL(urlInput.value);
      });
    }
  };

  // Type selector clicks
  typebar.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-type');
    if (btn) {
      render(btn.dataset.type);
    }
  });

  // Form submit
  document.getElementById('qrForm')?.addEventListener('submit', (e) => {
    const activeBtn = typebar.querySelector('.btn-type.active');
    const activeType = activeBtn?.dataset.type || 'text';
    const payload = (build[activeType] || build.text)();

    if (!payload) {
      e.preventDefault();
      alert(isEnglish ? 'Please fill in all required fields.' : 'Vul alle verplichte velden in.');
      return;
    }

    dataField.value = payload;
  });

  // Reset button
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    render('text');
    dataField.value = '';
  });

  // Initialize with text type
  render('text');
};


// ========== Initialize Everything ==========
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initSmoothScroll();
  initQRGenerator();
});

// 3D Tilt Effect voor Hero
document.addEventListener('mousemove', (e) => {
  const card = document.getElementById('qr3d');
  if (!card || window.innerWidth <= 768) return; // Niet op mobiel

  // Bereken muispositie tov midden scherm
  const x = (window.innerWidth / 2 - e.pageX) / 25; // Gevoeligheid (hoger = minder beweging)
  const y = (window.innerHeight / 2 - e.pageY) / 25;

  // Pas rotatie toe (inverted voor natuurlijk gevoel)
  card.style.transform = `rotateY(${-x}deg) rotateX(${y}deg)`;
});

// Reset als muis het scherm verlaat
document.addEventListener('mouseleave', () => {
  const card = document.getElementById('qr3d');
  if (card) card.style.transform = `rotateY(0deg) rotateX(0deg)`;
});
