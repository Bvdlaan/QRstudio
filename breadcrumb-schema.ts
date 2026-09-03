(function() {
  const pathParts = window.location.pathname
    .replace(/\.html$/, '')
    .split('/')
    .filter(p => p && p !== 'index');

  const itemList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.qrstudio.nl/"
    }
  ];

  pathParts.forEach((part, index) => {
    const formatted = part.replace(/-/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase());
    const url = "https://www.qrstudio.nl/" + pathParts.slice(0, index + 1).join('/') + "/";
    itemList.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": formatted,
      "item": url
    });
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemList
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
})();
