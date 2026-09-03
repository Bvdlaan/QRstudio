// --- QR Studio Share & Functionality ---

/**
 * Handles sharing to social platforms.
 * Includes specific logic for WhatsApp to bypass browser security errors
 * by using deep links (mobile) or web interface (desktop).
 */
function shareTo(platform) {
  const url = window.location.href;
  const text = "Bekijk deze handige uitleg over QR-codes:";
  let shareUrl = "";

  switch (platform) {
    case 'whatsapp':
      // 1. Detecteer of de gebruiker op een mobiel apparaat zit
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobiel: Open direct de app (vermijdt SSL/Certificaat fouten)
        shareUrl = `whatsapp://send?text=${encodeURIComponent(text + " " + url)}`;
      } else {
        // Desktop: Ga direct naar WhatsApp Web (vermijdt api.whatsapp.com blokkade)
        shareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
      }
      break;
      
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
      
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      break;
      
    case 'email':
      shareUrl = `mailto:?subject=${encodeURIComponent("Handige uitleg over QR-codes")}&body=${encodeURIComponent("Bekijk deze pagina: " + url)}`;
      break;
  }

  if (shareUrl) {
    // Open in nieuw tabblad (behalve mailto, wat de client opent)
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Copies the current page URL to the clipboard.
 * Includes a fallback for older browsers or non-secure contexts.
 */
function copyShareLink() {
  const url = window.location.href;
  
  // Probeer de moderne Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showCopyMessage();
    }).catch(err => {
      console.error('Clipboard API failed', err);
      fallbackCopyTextToClipboard(url);
    });
  } else {
    // Fallback als de API niet bestaat
    fallbackCopyTextToClipboard(url);
  }
}

// Helper: Toon het "Gekopieerd!" berichtje
function showCopyMessage() {
  const msg = document.getElementById('copy-message');
  if (msg) {
    msg.classList.add('visible');
    
    // Verberg weer na 3 seconden
    setTimeout(() => {
      msg.classList.remove('visible');
    }, 3000);
  }
}

// Helper: Fallback methode voor oudere browsers
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Zorg dat het element niet zichtbaar is in de layout
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopyMessage();
    }
  } catch (err) {
    console.error('Fallback copy failed', err);
  }

  document.body.removeChild(textArea);
}