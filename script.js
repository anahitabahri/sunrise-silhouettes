const poems = [
    {
      content: ["sunrise silhouettes:", "an unmasking"]
    },
    {
      content: [
        "in the quiet hours before dawn, stars begin to fade,",
        "shadows cling long, cool air surrounds me, a familiar veil.",
        "",
        "i watch as night hesitates, slow to give way,",
        "warmth, a fleeting whisper brushing my skin."
      ]
    },
    {
      content: [
        "your words, like early rays, peek over the horizon,",
        "gentle but insistent, they trace the cool air, testing.",
        "",
        "my walls tremble, curious—",
        "can i let this unexpected warmth in?"
      ]
    },
    {
      content: [
        "each shared laugh paints the sky in hues of warmth,",
        "sunrise colors spilling across our horizon.",
        "",
        "i feel the cool facade beginning to melt,",
        "revealing a glow, long suppressed."
      ]
    },
    {
      content: [
        "in the gentle light of dawn, your hand finds mine,",
        "warmth seeps into my cool skin, a slow, steady thaw.",
        "",
        "the mask continues to melt,",
        "revealing light i've kept hidden, now uncovered."
      ]
    },
    {
      content: [
        "day blooms fully, your warmth now constant,",
        "my mask pools beneath the clear morning light.",
        "",
        "in this new clarity, a mystery dawns:",
        "what masks might you still wear?"
      ]
    },
    {
      // end section with image
      content: [""]
    }
  ];

  const colors = [
    { start: '#1a1a2e', end: '#16213e' },    // Night
    { start: '#16213e', end: '#532b88' },    // Pre-dawn
    { start: '#532b88', end: '#c36f2d' },    // Dawn
    { start: '#c36f2d', end: '#e55c30' },    // Sunrise
    { start: '#e55c30', end: '#f4d03f' }     // Full morning
  ];

  function interpolateColor(color1, color2, factor) {
    if (!color1 || !color2) {
      console.error('Invalid colors:', { color1, color2 });
      return '#000000';
    }

    const r1 = parseInt(color1.slice(1,3), 16);
    const g1 = parseInt(color1.slice(3,5), 16);
    const b1 = parseInt(color1.slice(5,7), 16);
    const r2 = parseInt(color2.slice(1,3), 16);
    const g2 = parseInt(color2.slice(3,5), 16);
    const b2 = parseInt(color2.slice(5,7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  function getGradient(progress) {
    progress = Math.min(1, Math.max(0, progress));
    const maxIndex = colors.length - 1;
    const scaledProgress = progress * maxIndex;
    const index = Math.min(Math.floor(scaledProgress), maxIndex - 1);
    const remainder = scaledProgress - index;

    const currentColor = colors[index];
    const nextColor = colors[Math.min(index + 1, maxIndex)];

    if (!currentColor || !nextColor) {
      console.error('Color lookup failed:', {
        progress,
        maxIndex,
        scaledProgress,
        index,
        remainder,
        currentColor,
        nextColor
      });
      return 'linear-gradient(135deg, #000000, #000000)';
    }

    const startColor = interpolateColor(currentColor.start, nextColor.start, remainder);
    const endColor = interpolateColor(currentColor.end, nextColor.end, remainder);

    return `linear-gradient(135deg, ${startColor}, ${endColor})`;
  }

  // create poem elements
  const content = document.getElementById('content');
  poems.forEach((poem, index) => {
    const container = document.createElement('div');
    container.className = 'poem-container';
    
    const poemDiv = document.createElement('div');
    poemDiv.className = 'poem';
    poemDiv.id = `poem-${index}`;

    if (index === poems.length - 1) {
      const img = document.createElement('img');
      img.src = 'image.png';  
      img.alt = 'line drawing';
      img.className = 'final-image';
      poemDiv.appendChild(img);

      const signatureContainer = document.createElement('div');
      signatureContainer.className = 'signature-container';
      
      const signature = document.createElement('div');
      signature.className = 'signature';
      signature.textContent = 'anahita';
      signatureContainer.appendChild(signature);

      const bisous = document.createElement('div');
      bisous.className = 'bisous';
      bisous.textContent = 'xx';
      signatureContainer.appendChild(bisous);
      
      poemDiv.appendChild(signatureContainer);
    } else {
      poem.content.forEach((line, i) => {
        const p = document.createElement('p');
        p.className = 'poem-line';
        if (index === 0) {
          p.className += i === 0 ? ' title' : ' subtitle';
        }
        p.textContent = line;
        poemDiv.appendChild(p);
      });
    }

    container.appendChild(poemDiv);
    content.appendChild(container);
  });

  function handleScroll() {
    requestAnimationFrame(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;

      document.getElementById('background').style.background = getGradient(progress);

      poems.forEach((_, index) => {
        const poem = document.getElementById(`poem-${index}`);
        const opacity = Math.max(0, Math.min(1, 
          1 - Math.abs((progress * (poems.length - 1)) - index) * 1.5
        ));
        poem.style.opacity = opacity;
      });
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();
