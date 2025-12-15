// Basic modal functionality with keyboard support and accessible focus
    const grid = document.getElementById('poemGrid');
    const backdrop = document.getElementById('modalBackdrop');
    const modalTitle = document.getElementById('modalTitle');
    const modalAuthor = document.getElementById('modalAuthor');
    const modalPoem = document.getElementById('modalPoem');
    const closeBtn = document.getElementById('closeBtn');

    let lastFocused = null;

    function openModal(title, author, poem, opener){
      lastFocused = opener || document.activeElement;
      modalTitle.textContent = title;
      modalAuthor.textContent = author;
      modalPoem.textContent = poem;
      backdrop.classList.add('show');
      backdrop.setAttribute('aria-hidden','false');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal(){
      backdrop.classList.remove('show');
      backdrop.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      if(lastFocused) lastFocused.focus();
    }

    // click handler for cards
    grid.addEventListener('click', e =>{
      const card = e.target.closest('.card');
      if(!card) return;
      const title = card.dataset.title || 'Poema';
      const author = card.dataset.author || '';
      const poem = card.dataset.poem || '';
      openModal(title, author, poem, card);
    });

    // keyboard: Enter/Space opens selected card
    grid.addEventListener('keydown', e =>{
      if(e.key === 'Enter' || e.key === ' '){
        const card = e.target.closest('.card');
        if(!card) return;
        e.preventDefault();
        const title = card.dataset.title || 'Poema';
        const author = card.dataset.author || '';
        const poem = card.dataset.poem || '';
        openModal(title, author, poem, card);
      }
    });

    // close events
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', e =>{ if(e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', e =>{ if(e.key === 'Escape' && backdrop.classList.contains('show')) closeModal(); });

    // progressive reveal animation delay
    document.querySelectorAll('.fade-up').forEach((el,i)=> el.style.animationDelay = (i*70)+'ms');
