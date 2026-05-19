const PS = {
  screenHistory: [],
  timerIntervals: {},

  goTo(screenId, pushHistory = true) {
    const current = document.querySelector('.screen.active');
    if (current) {
      if (pushHistory) this.screenHistory.push(current.id);
      current.classList.remove('active');
    }
    const next = document.getElementById(screenId);
    if (next) {
      next.classList.add('active');
      window.scrollTo(0, 0);
    }
  },

  goBack() {
    if (this.screenHistory.length > 0) {
      const prevId = this.screenHistory.pop();
      this.goTo(prevId, false);
    }
  },

  startTimer(elementId, minutes) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let totalSeconds = minutes * 60;
    const update = () => {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      el.textContent = `Holding your slot for ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} mins`;
      if (totalSeconds > 0) totalSeconds--;
    };
    update();
    if (this.timerIntervals[elementId]) clearInterval(this.timerIntervals[elementId]);
    this.timerIntervals[elementId] = setInterval(update, 1000);
  },

  initPickleballFilters() {
    const listEl = document.getElementById('pickleball-event-list');
    const filtersBtn = document.querySelector('[data-filters-btn]');
    if (!listEl || !filtersBtn) return;


    const activeFilters = { format: new Set(), category: new Set(), gender: new Set() };

    const modal = document.createElement('div');
    modal.className = 'filter-modal';
    modal.innerHTML = `
      <div class="filter-modal__header">
        <button class="filter-modal__close">&#10005;</button>
        <span class="filter-modal__title">Filters</span>
        <button class="filter-modal__clear">Clear</button>
      </div>
      <div class="filter-modal__body">
        <div class="filter-group">
          <div class="filter-group__label">Format</div>
          <div class="filter-group__select-all" data-select-all="format">Select all</div>
          <div class="filter-group__chips">
            <button class="filter-chip" data-group="format" data-value="Singles">Singles</button>
            <button class="filter-chip" data-group="format" data-value="Doubles">Doubles</button>
          </div>
        </div>
        <hr class="filter-divider">
        <div class="filter-group">
          <div class="filter-group__label">Category</div>
          <div class="filter-group__select-all" data-select-all="category">Select all</div>
          <div class="filter-group__chips">
            <button class="filter-chip" data-group="category" data-value="Open">Open</button>
            <button class="filter-chip" data-group="category" data-value="Masters">Masters</button>
            <button class="filter-chip" data-group="category" data-value="Youth">Youth</button>
            <button class="filter-chip" data-group="category" data-value="Corporate">Corporate</button>
            <button class="filter-chip" data-group="category" data-value="Para">Para</button>
          </div>
        </div>
        <hr class="filter-divider">
        <div class="filter-group">
          <div class="filter-group__label">Gender</div>
          <div class="filter-group__select-all" data-select-all="gender">Select all</div>
          <div class="filter-group__chips">
            <button class="filter-chip" data-group="gender" data-value="Men's">Men's</button>
            <button class="filter-chip" data-group="gender" data-value="Women's">Women's</button>
            <button class="filter-chip" data-group="gender" data-value="Boys'">Boys'</button>
            <button class="filter-chip" data-group="gender" data-value="Girls'">Girls'</button>
            <button class="filter-chip" data-group="gender" data-value="Mixed">Mixed</button>
          </div>
        </div>
      </div>
      <div class="filter-modal__footer">
        <button class="btn btn--primary filter-modal__done">Done</button>
      </div>
    `;
    document.querySelector('.app').appendChild(modal);

    function applyFilters() {
      Array.from(listEl.children).forEach(card => {
        const titleEl = card.querySelector('div');
        const title = titleEl ? titleEl.textContent.trim() : '';
        let passes = true;

        if (activeFilters.format.size > 0) {
          if (![...activeFilters.format].some(f => title.includes(f))) passes = false;
        }
        if (activeFilters.category.size > 0) {
          if (![...activeFilters.category].some(cat => title.includes(cat))) passes = false;
        }
        if (activeFilters.gender.size > 0) {
          if (![...activeFilters.gender].some(g => title.includes(g))) passes = false;
        }
        card.style.display = passes ? '' : 'none';
      });
      modal.classList.remove('open');
    }

    function clearFilters() {
      activeFilters.format.clear();
      activeFilters.category.clear();
      activeFilters.gender.clear();
      modal.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('selected'));
    }

    modal.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.getAttribute('data-group');
        const value = chip.getAttribute('data-value');
        if (activeFilters[group].has(value)) {
          activeFilters[group].delete(value);
          chip.classList.remove('selected');
        } else {
          activeFilters[group].add(value);
          chip.classList.add('selected');
        }
      });
    });

    modal.querySelectorAll('[data-select-all]').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.getAttribute('data-select-all');
        const chips = modal.querySelectorAll(`.filter-chip[data-group="${group}"]`);
        const allSelected = [...chips].every(c => c.classList.contains('selected'));
        chips.forEach(c => {
          const value = c.getAttribute('data-value');
          if (allSelected) {
            activeFilters[group].delete(value);
            c.classList.remove('selected');
          } else {
            activeFilters[group].add(value);
            c.classList.add('selected');
          }
        });
      });
    });

    modal.querySelector('.filter-modal__close').addEventListener('click', () => modal.classList.remove('open'));
    modal.querySelector('.filter-modal__clear').addEventListener('click', clearFilters);
    modal.querySelector('.filter-modal__done').addEventListener('click', applyFilters);
    filtersBtn.addEventListener('click', () => modal.classList.add('open'));
  },

  initDobFields(root) {
    const container = root || document;
    container.querySelectorAll('.dob-field').forEach(field => {
      const segs = Array.from(field.querySelectorAll('.dob-field__seg'));
      segs.forEach((seg, i) => {
        seg.addEventListener('keydown', e => {
          if (e.key === 'Backspace' && seg.value === '' && i > 0) {
            segs[i - 1].focus();
            e.preventDefault();
          }
          if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
          }
        });
        seg.addEventListener('input', () => {
          seg.value = seg.value.replace(/\D/g, '').slice(0, parseInt(seg.maxLength));
          if (seg.value.length === parseInt(seg.maxLength) && i < segs.length - 1) {
            segs[i + 1].focus();
          }
        });
      });
      field.addEventListener('click', e => {
        if (e.target === field) {
          const first = segs.find(s => !s.value);
          (first || segs[segs.length - 1]).focus();
        }
      });
    });
  },

  initClearButtons() {
    const updateClearVisibility = (input) => {
      const btn = input.closest('.form-input-wrapper')?.querySelector('.form-clear');
      if (btn) btn.style.display = input.value.trim() ? 'flex' : 'none';
    };

    document.querySelectorAll('.form-input-wrapper').forEach(wrapper => {
      const input = wrapper.querySelector('.form-input');
      const btn = wrapper.querySelector('.form-clear');
      if (!input || !btn) return;

      updateClearVisibility(input);

      input.addEventListener('input', () => updateClearVisibility(input));
      input.addEventListener('change', () => updateClearVisibility(input));

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (input && !input.readOnly) {
          input.value = '';
          updateClearVisibility(input);
          input.focus();
        }
      });
    });
  },

  initCheckboxes() {
    document.querySelectorAll('.checkbox-group').forEach(group => {
      const box = group.querySelector('.checkbox-input');
      if (!box) return;
      group.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        box.classList.toggle('checked');
        group.classList.remove('has-error');
      });
    });
  },

  initRadioGroups() {
    document.querySelectorAll('.radio-group').forEach(group => {
      group.querySelectorAll('.radio-option').forEach(option => {
        option.addEventListener('click', () => {
          group.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
        });
      });
    });
  },

  initShowMore() {
    document.querySelectorAll('.show-more-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.previousElementSibling;
        if (text && text.classList.contains('declaration-text--collapsible')) {
          text.classList.toggle('expanded');
          btn.innerHTML = text.classList.contains('expanded') ? 'Show less &#8743;' : 'Show more &#8744;';
        }
      });
    });
  },

  initSectionToggles() {
    document.querySelectorAll('.section-box__header').forEach(header => {
      const chevron = header.querySelector('.section-box__chevron');
      if (!chevron) return;
      header.addEventListener('click', (e) => {
        if (e.target.closest('.section-box__edit')) return;
        header.closest('.section-box').classList.toggle('collapsed');
      });
    });
  },

  initBackButtons() {
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => this.goBack());
    });
  },

  initNavButtons() {
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-goto');
        if (target) this.goTo(target);
      });
    });
  },

  validate(screenId) {
    const screen = document.getElementById(screenId);
    if (!screen) return true;
    let valid = true;
    let firstError = null;

    screen.querySelectorAll('.form-group[data-required]').forEach(group => {
      if (group.offsetParent === null) return;
      const input = group.querySelector('.form-input, .form-select');
      group.classList.remove('has-error');
      if (input) {
        const val = input.value.trim();
        if (!val || val === '' || (input.tagName === 'SELECT' && val === '')) {
          group.classList.add('has-error');
          valid = false;
          if (!firstError) firstError = group;
        }
      }
    });

    screen.querySelectorAll('.date-input-group').forEach(dateGroup => {
      const formGroup = dateGroup.closest('.form-group');
      if (!formGroup || !formGroup.hasAttribute('data-required')) return;
      if (formGroup.offsetParent === null) return;
      formGroup.classList.remove('has-error');
      const inputs = dateGroup.querySelectorAll('.form-input');
      const allFilled = Array.from(inputs).every(i => i.value.trim() !== '');
      if (!allFilled) {
        formGroup.classList.add('has-error');
        valid = false;
        if (!firstError) firstError = formGroup;
      }
    });

    screen.querySelectorAll('.checkbox-group[data-required]').forEach(group => {
      if (group.offsetParent === null) return;
      group.classList.remove('has-error');
      const box = group.querySelector('.checkbox-input');
      if (box && !box.classList.contains('checked')) {
        group.classList.add('has-error');
        valid = false;
        if (!firstError) firstError = group;
      }
    });

    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
  },

  validateAndGo(currentScreenId, nextScreenId) {
    if (this.validate(currentScreenId)) {
      this.goTo(nextScreenId);
    }
  },

  populateSummary(formScreenId, summaryScreenId) {
    const form = document.getElementById(formScreenId);
    const summary = document.getElementById(summaryScreenId);
    if (!form || !summary) return;

    form.querySelectorAll('[data-field]').forEach(input => {
      const fieldName = input.getAttribute('data-field');
      let val = '';
      if (input.tagName === 'SELECT') {
        val = input.options[input.selectedIndex]?.text || '';
      } else {
        val = input.value;
      }
      if (val) {
        summary.querySelectorAll(`[data-summary="${fieldName}"]`).forEach(el => {
          el.textContent = val;
        });
      }
    });

    form.querySelectorAll('.date-input-group[data-field]').forEach(group => {
      const fieldName = group.getAttribute('data-field');
      const inputs = group.querySelectorAll('.form-input');
      if (inputs.length === 3) {
        const day = inputs[0].value;
        const month = inputs[1].value;
        const year = inputs[2].value;
        if (day && month && year) {
          const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          const monthName = months[parseInt(month) - 1] || month;
          const formatted = `${parseInt(day)} ${monthName} ${year}`;
          summary.querySelectorAll(`[data-summary="${fieldName}"]`).forEach(el => {
            el.textContent = formatted;
          });
        }
      }
    });
  },

  populateReview(formScreenId, reviewScreenId) {
    const form = document.getElementById(formScreenId);
    const review = document.getElementById(reviewScreenId);
    if (!form || !review) return;

    form.querySelectorAll('[data-field]').forEach(input => {
      const fieldName = input.getAttribute('data-field');
      const reviewEl = review.querySelector(`[data-review="${fieldName}"]`);
      if (reviewEl) {
        let val = '';
        if (input.tagName === 'SELECT') {
          val = input.options[input.selectedIndex]?.text || '';
        } else if (input.classList.contains('form-input')) {
          val = input.value;
        }
        if (val) reviewEl.textContent = val;
      }
    });

    form.querySelectorAll('.date-input-group[data-field]').forEach(group => {
      const fieldName = group.getAttribute('data-field');
      const reviewEl = review.querySelector(`[data-review="${fieldName}"]`);
      if (reviewEl) {
        const inputs = group.querySelectorAll('.form-input');
        if (inputs.length === 3) {
          const day = inputs[0].value;
          const month = inputs[1].value;
          const year = inputs[2].value;
          if (day && month && year) {
            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            const monthName = months[parseInt(month) - 1] || month;
            reviewEl.textContent = `${parseInt(day)} ${monthName} ${year}`;
          }
        }
      }
    });
  },

  singpassHTML() {
    return `
      <div class="sp-masthead">
        <div class="sp-masthead__icon"></div>
        <span>A Singapore Government Agency Website</span>
        <a class="sp-masthead__link">How to identify &#8744;</a>
      </div>
      <div class="sp-logo"><img src="shared/singpass-logo.png" alt="Singpass" style="height:36px"></div>
      <div class="sp-divider"></div>
      <div class="sp-scam-banner">
        <div class="sp-scam-banner__title">Beware of impersonation scams <span class="sp-scam-banner__chevron">&#9650;</span></div>
        <div class="sp-scam-banner__text">Government officials will NEVER ask you to transfer money or disclose bank log-in details over a phone call. Call the 24/7 ScamShield Helpline at 1799 if you are unsure if something is a scam.</div>
      </div>
      <div class="sp-hero">
        <div class="sp-hero__title">Log in with Singpass</div>
        <div class="sp-hero__subtitle">Your trusted digital identity</div>
      </div>
      <div class="sp-tabs">
        <div class="sp-tab sp-tab--active">Singpass app</div>
        <div class="sp-tab">Password login</div>
      </div>
      <div class="sp-qr-section">
        <div class="sp-qr-section__title">Tap QR code</div>
        <div class="sp-qr-section__subtitle">to log in with Singpass app</div>
        <div class="sp-qr-box">
          <svg viewBox="0 0 200 200" width="190" height="190" style="display:block">
            <rect fill="#fff" width="200" height="200"/>
            <!-- Top-left finder -->
            <rect x="8" y="8" width="42" height="42" fill="#222"/><rect x="14" y="14" width="30" height="30" fill="#fff"/><rect x="20" y="20" width="18" height="18" fill="#222"/>
            <!-- Top-right finder -->
            <rect x="150" y="8" width="42" height="42" fill="#222"/><rect x="156" y="14" width="30" height="30" fill="#fff"/><rect x="162" y="20" width="18" height="18" fill="#222"/>
            <!-- Bottom-left finder -->
            <rect x="8" y="150" width="42" height="42" fill="#222"/><rect x="14" y="156" width="30" height="30" fill="#fff"/><rect x="20" y="162" width="18" height="18" fill="#222"/>
            <!-- Data modules row 1 -->
            <rect x="58" y="8" width="6" height="6" fill="#222"/><rect x="70" y="8" width="6" height="6" fill="#222"/><rect x="82" y="8" width="6" height="6" fill="#222"/><rect x="88" y="8" width="6" height="6" fill="#222"/><rect x="100" y="8" width="6" height="6" fill="#222"/><rect x="112" y="8" width="6" height="6" fill="#222"/><rect x="124" y="8" width="6" height="6" fill="#222"/><rect x="136" y="8" width="6" height="6" fill="#222"/>
            <rect x="58" y="14" width="6" height="6" fill="#222"/><rect x="76" y="14" width="6" height="6" fill="#222"/><rect x="94" y="14" width="6" height="6" fill="#222"/><rect x="106" y="14" width="6" height="6" fill="#222"/><rect x="118" y="14" width="6" height="6" fill="#222"/><rect x="130" y="14" width="6" height="6" fill="#222"/><rect x="142" y="14" width="6" height="6" fill="#222"/>
            <!-- Data rows scattered -->
            <rect x="58" y="26" width="6" height="6" fill="#222"/><rect x="70" y="20" width="6" height="6" fill="#222"/><rect x="82" y="26" width="6" height="6" fill="#222"/><rect x="94" y="20" width="6" height="6" fill="#222"/><rect x="106" y="26" width="6" height="6" fill="#222"/><rect x="118" y="20" width="6" height="6" fill="#222"/><rect x="130" y="26" width="6" height="6" fill="#222"/><rect x="142" y="20" width="6" height="6" fill="#222"/>
            <rect x="58" y="32" width="6" height="6" fill="#222"/><rect x="64" y="38" width="6" height="6" fill="#222"/><rect x="76" y="32" width="6" height="6" fill="#222"/><rect x="88" y="38" width="6" height="6" fill="#222"/><rect x="100" y="32" width="6" height="6" fill="#222"/><rect x="112" y="38" width="6" height="6" fill="#222"/><rect x="124" y="32" width="6" height="6" fill="#222"/><rect x="136" y="38" width="6" height="6" fill="#222"/>
            <!-- Middle area data -->
            <rect x="8" y="58" width="6" height="6" fill="#222"/><rect x="20" y="58" width="6" height="6" fill="#222"/><rect x="32" y="58" width="6" height="6" fill="#222"/><rect x="44" y="58" width="6" height="6" fill="#222"/><rect x="58" y="58" width="6" height="6" fill="#222"/><rect x="70" y="58" width="6" height="6" fill="#222"/><rect x="82" y="58" width="6" height="6" fill="#222"/><rect x="94" y="58" width="6" height="6" fill="#222"/><rect x="106" y="58" width="6" height="6" fill="#222"/><rect x="124" y="58" width="6" height="6" fill="#222"/><rect x="136" y="58" width="6" height="6" fill="#222"/><rect x="150" y="58" width="6" height="6" fill="#222"/><rect x="162" y="58" width="6" height="6" fill="#222"/><rect x="174" y="58" width="6" height="6" fill="#222"/><rect x="186" y="58" width="6" height="6" fill="#222"/>
            <rect x="14" y="64" width="6" height="6" fill="#222"/><rect x="26" y="64" width="6" height="6" fill="#222"/><rect x="38" y="64" width="6" height="6" fill="#222"/><rect x="58" y="64" width="6" height="6" fill="#222"/><rect x="76" y="64" width="6" height="6" fill="#222"/><rect x="88" y="64" width="6" height="6" fill="#222"/><rect x="106" y="64" width="6" height="6" fill="#222"/><rect x="118" y="64" width="6" height="6" fill="#222"/><rect x="136" y="64" width="6" height="6" fill="#222"/><rect x="156" y="64" width="6" height="6" fill="#222"/><rect x="168" y="64" width="6" height="6" fill="#222"/><rect x="180" y="64" width="6" height="6" fill="#222"/>
            <rect x="8" y="70" width="6" height="6" fill="#222"/><rect x="20" y="70" width="6" height="6" fill="#222"/><rect x="44" y="70" width="6" height="6" fill="#222"/><rect x="64" y="70" width="6" height="6" fill="#222"/><rect x="82" y="70" width="6" height="6" fill="#222"/><rect x="100" y="70" width="6" height="6" fill="#222"/><rect x="112" y="70" width="6" height="6" fill="#222"/><rect x="130" y="70" width="6" height="6" fill="#222"/><rect x="150" y="70" width="6" height="6" fill="#222"/><rect x="174" y="70" width="6" height="6" fill="#222"/><rect x="186" y="70" width="6" height="6" fill="#222"/>
            <rect x="14" y="76" width="6" height="6" fill="#222"/><rect x="32" y="76" width="6" height="6" fill="#222"/><rect x="50" y="76" width="6" height="6" fill="#222"/><rect x="70" y="76" width="6" height="6" fill="#222"/><rect x="88" y="76" width="6" height="6" fill="#222"/><rect x="106" y="76" width="6" height="6" fill="#222"/><rect x="124" y="76" width="6" height="6" fill="#222"/><rect x="142" y="76" width="6" height="6" fill="#222"/><rect x="156" y="76" width="6" height="6" fill="#222"/><rect x="168" y="76" width="6" height="6" fill="#222"/>
            <!-- More scattered data -->
            <rect x="8" y="82" width="6" height="6" fill="#222"/><rect x="26" y="82" width="6" height="6" fill="#222"/><rect x="44" y="82" width="6" height="6" fill="#222"/><rect x="64" y="82" width="6" height="6" fill="#222"/><rect x="76" y="82" width="6" height="6" fill="#222"/><rect x="118" y="82" width="6" height="6" fill="#222"/><rect x="136" y="82" width="6" height="6" fill="#222"/><rect x="150" y="82" width="6" height="6" fill="#222"/><rect x="162" y="82" width="6" height="6" fill="#222"/><rect x="180" y="82" width="6" height="6" fill="#222"/>
            <rect x="20" y="88" width="6" height="6" fill="#222"/><rect x="38" y="88" width="6" height="6" fill="#222"/><rect x="50" y="88" width="6" height="6" fill="#222"/><rect x="70" y="88" width="6" height="6" fill="#222"/><rect x="82" y="88" width="6" height="6" fill="#222"/><rect x="100" y="88" width="6" height="6" fill="#222"/><rect x="112" y="88" width="6" height="6" fill="#222"/><rect x="130" y="88" width="6" height="6" fill="#222"/><rect x="142" y="88" width="6" height="6" fill="#222"/><rect x="162" y="88" width="6" height="6" fill="#222"/><rect x="174" y="88" width="6" height="6" fill="#222"/>
            <rect x="8" y="94" width="6" height="6" fill="#222"/><rect x="32" y="94" width="6" height="6" fill="#222"/><rect x="44" y="94" width="6" height="6" fill="#222"/><rect x="58" y="94" width="6" height="6" fill="#222"/><rect x="76" y="94" width="6" height="6" fill="#222"/><rect x="94" y="94" width="6" height="6" fill="#222"/><rect x="106" y="94" width="6" height="6" fill="#222"/><rect x="124" y="94" width="6" height="6" fill="#222"/><rect x="136" y="94" width="6" height="6" fill="#222"/><rect x="156" y="94" width="6" height="6" fill="#222"/><rect x="186" y="94" width="6" height="6" fill="#222"/>
            <!-- Lower rows -->
            <rect x="8" y="106" width="6" height="6" fill="#222"/><rect x="26" y="106" width="6" height="6" fill="#222"/><rect x="38" y="106" width="6" height="6" fill="#222"/><rect x="58" y="106" width="6" height="6" fill="#222"/><rect x="70" y="106" width="6" height="6" fill="#222"/><rect x="88" y="106" width="6" height="6" fill="#222"/><rect x="100" y="106" width="6" height="6" fill="#222"/><rect x="118" y="106" width="6" height="6" fill="#222"/><rect x="130" y="106" width="6" height="6" fill="#222"/><rect x="150" y="106" width="6" height="6" fill="#222"/><rect x="174" y="106" width="6" height="6" fill="#222"/><rect x="186" y="106" width="6" height="6" fill="#222"/>
            <rect x="14" y="112" width="6" height="6" fill="#222"/><rect x="32" y="112" width="6" height="6" fill="#222"/><rect x="50" y="112" width="6" height="6" fill="#222"/><rect x="64" y="112" width="6" height="6" fill="#222"/><rect x="82" y="112" width="6" height="6" fill="#222"/><rect x="94" y="112" width="6" height="6" fill="#222"/><rect x="112" y="112" width="6" height="6" fill="#222"/><rect x="124" y="112" width="6" height="6" fill="#222"/><rect x="142" y="112" width="6" height="6" fill="#222"/><rect x="156" y="112" width="6" height="6" fill="#222"/><rect x="168" y="112" width="6" height="6" fill="#222"/><rect x="180" y="112" width="6" height="6" fill="#222"/>
            <rect x="8" y="118" width="6" height="6" fill="#222"/><rect x="20" y="118" width="6" height="6" fill="#222"/><rect x="38" y="118" width="6" height="6" fill="#222"/><rect x="58" y="118" width="6" height="6" fill="#222"/><rect x="76" y="118" width="6" height="6" fill="#222"/><rect x="88" y="118" width="6" height="6" fill="#222"/><rect x="106" y="118" width="6" height="6" fill="#222"/><rect x="118" y="118" width="6" height="6" fill="#222"/><rect x="136" y="118" width="6" height="6" fill="#222"/><rect x="150" y="118" width="6" height="6" fill="#222"/><rect x="162" y="118" width="6" height="6" fill="#222"/><rect x="186" y="118" width="6" height="6" fill="#222"/>
            <rect x="14" y="124" width="6" height="6" fill="#222"/><rect x="26" y="124" width="6" height="6" fill="#222"/><rect x="44" y="124" width="6" height="6" fill="#222"/><rect x="64" y="124" width="6" height="6" fill="#222"/><rect x="76" y="124" width="6" height="6" fill="#222"/><rect x="94" y="124" width="6" height="6" fill="#222"/><rect x="112" y="124" width="6" height="6" fill="#222"/><rect x="130" y="124" width="6" height="6" fill="#222"/><rect x="142" y="124" width="6" height="6" fill="#222"/><rect x="162" y="124" width="6" height="6" fill="#222"/><rect x="174" y="124" width="6" height="6" fill="#222"/>
            <!-- Bottom data rows -->
            <rect x="58" y="136" width="6" height="6" fill="#222"/><rect x="70" y="136" width="6" height="6" fill="#222"/><rect x="82" y="136" width="6" height="6" fill="#222"/><rect x="100" y="136" width="6" height="6" fill="#222"/><rect x="118" y="136" width="6" height="6" fill="#222"/><rect x="130" y="136" width="6" height="6" fill="#222"/><rect x="142" y="136" width="6" height="6" fill="#222"/>
            <rect x="58" y="142" width="6" height="6" fill="#222"/><rect x="76" y="142" width="6" height="6" fill="#222"/><rect x="94" y="142" width="6" height="6" fill="#222"/><rect x="106" y="142" width="6" height="6" fill="#222"/><rect x="124" y="142" width="6" height="6" fill="#222"/><rect x="136" y="142" width="6" height="6" fill="#222"/>
            <rect x="58" y="150" width="6" height="6" fill="#222"/><rect x="70" y="150" width="6" height="6" fill="#222"/><rect x="88" y="156" width="6" height="6" fill="#222"/><rect x="100" y="150" width="6" height="6" fill="#222"/><rect x="112" y="156" width="6" height="6" fill="#222"/><rect x="130" y="150" width="6" height="6" fill="#222"/><rect x="142" y="156" width="6" height="6" fill="#222"/>
            <rect x="58" y="162" width="6" height="6" fill="#222"/><rect x="76" y="168" width="6" height="6" fill="#222"/><rect x="94" y="162" width="6" height="6" fill="#222"/><rect x="106" y="168" width="6" height="6" fill="#222"/><rect x="124" y="162" width="6" height="6" fill="#222"/><rect x="136" y="168" width="6" height="6" fill="#222"/>
            <rect x="58" y="174" width="6" height="6" fill="#222"/><rect x="70" y="174" width="6" height="6" fill="#222"/><rect x="82" y="180" width="6" height="6" fill="#222"/><rect x="100" y="174" width="6" height="6" fill="#222"/><rect x="118" y="180" width="6" height="6" fill="#222"/><rect x="130" y="174" width="6" height="6" fill="#222"/><rect x="142" y="180" width="6" height="6" fill="#222"/>
            <rect x="150" y="136" width="6" height="6" fill="#222"/><rect x="168" y="136" width="6" height="6" fill="#222"/><rect x="180" y="136" width="6" height="6" fill="#222"/><rect x="156" y="142" width="6" height="6" fill="#222"/><rect x="174" y="142" width="6" height="6" fill="#222"/><rect x="186" y="142" width="6" height="6" fill="#222"/>
            <rect x="150" y="150" width="6" height="6" fill="#222"/><rect x="162" y="156" width="6" height="6" fill="#222"/><rect x="180" y="150" width="6" height="6" fill="#222"/><rect x="150" y="168" width="6" height="6" fill="#222"/><rect x="168" y="162" width="6" height="6" fill="#222"/><rect x="186" y="168" width="6" height="6" fill="#222"/>
            <rect x="156" y="174" width="6" height="6" fill="#222"/><rect x="174" y="180" width="6" height="6" fill="#222"/><rect x="186" y="174" width="6" height="6" fill="#222"/><rect x="150" y="186" width="6" height="6" fill="#222"/><rect x="168" y="186" width="6" height="6" fill="#222"/><rect x="180" y="186" width="6" height="6" fill="#222"/>
          </svg>
          <div class="sp-qr-box__center"><svg width="20" height="24" viewBox="0 0 20 24" fill="none"><path d="M15 8h-1V6A4 4 0 007 6v2H6a2 2 0 00-2 2v8a2 2 0 002 2h9a2 2 0 002-2v-8a2 2 0 00-2-2zM10 16a2 2 0 110-4 2 2 0 010 4zm2.1-8H7.9V6a2.1 2.1 0 114.2 0v2z" fill="#fff"/></svg></div>
        </div>
        <div class="sp-bottom-logo"><img src="shared/singpass-logo.png" alt="Singpass" style="height:28px"></div>
      </div>
      <div class="sp-tap-hint">Tap anywhere to continue</div>`;
  },

  initLiveRevalidation() {
    document.querySelectorAll('.form-group[data-required]').forEach(group => {
      const input = group.querySelector('.form-input, .form-select');
      if (!input) return;
      const handler = () => {
        if (!group.classList.contains('has-error')) return;
        const val = input.value.trim();
        if (val && val !== '') {
          group.classList.remove('has-error');
        }
      };
      input.addEventListener('input', handler);
      input.addEventListener('change', handler);
    });

    document.querySelectorAll('.date-input-group').forEach(dateGroup => {
      const formGroup = dateGroup.closest('.form-group');
      if (!formGroup || !formGroup.hasAttribute('data-required')) return;
      dateGroup.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
          if (!formGroup.classList.contains('has-error')) return;
          const allFilled = Array.from(dateGroup.querySelectorAll('.form-input')).every(i => i.value.trim() !== '');
          if (allFilled) formGroup.classList.remove('has-error');
        });
      });
    });
  },

  launchFireworks(container) {
    const fw = document.createElement('div');
    fw.className = 'fireworks';
    container.appendChild(fw);

    const grays = ['#888', '#AAA', '#666', '#999', '#BBB', '#777', '#CCC', '#555'];
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    const burst = (cx, cy, delay) => {
      setTimeout(() => {
        const count = 18 + Math.floor(Math.random() * 10);
        for (let i = 0; i < count; i++) {
          const p = document.createElement('div');
          p.className = 'firework-particle';
          p.style.left = cx + 'px';
          p.style.top = cy + 'px';
          p.style.background = grays[Math.floor(Math.random() * grays.length)];
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
          const dist = 60 + Math.random() * 80;
          p.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
          p.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
          p.style.animationDelay = (Math.random() * 0.15) + 's';
          fw.appendChild(p);
        }
      }, delay);
    };

    const addSparkles = (delay) => {
      setTimeout(() => {
        for (let i = 0; i < 20; i++) {
          const s = document.createElement('div');
          s.className = 'firework-sparkle';
          s.style.left = (Math.random() * w) + 'px';
          s.style.top = (Math.random() * h * 0.7) + 'px';
          s.style.background = grays[Math.floor(Math.random() * grays.length)];
          s.style.animationDelay = (Math.random() * 0.6) + 's';
          fw.appendChild(s);
        }
      }, delay);
    };

    burst(w * 0.3, h * 0.25, 100);
    burst(w * 0.7, h * 0.2, 400);
    burst(w * 0.5, h * 0.35, 700);
    burst(w * 0.2, h * 0.4, 1000);
    burst(w * 0.8, h * 0.3, 1200);
    addSparkles(200);
    addSparkles(600);
    addSparkles(1100);
  },

  initSuccessScreens() {
    const origGoTo = this.goTo.bind(this);
    const self = this;
    this.goTo = function(screenId, pushHistory) {
      origGoTo(screenId, pushHistory);
      const screen = document.getElementById(screenId);
      if (screen && screen.querySelector('.success-screen')) {
        const container = screen.querySelector('.success-screen');
        const existing = container.querySelector('.fireworks');
        if (existing) existing.remove();
        self.launchFireworks(container);

        const nextScreen = container.getAttribute('data-success-next');
        if (nextScreen) {
          if (self._successTimer) clearTimeout(self._successTimer);
          self._successTimer = setTimeout(() => {
            origGoTo(nextScreen, true);
          }, 3000);
          container.addEventListener('click', () => {
            if (self._successTimer) clearTimeout(self._successTimer);
            origGoTo(nextScreen, true);
          }, { once: true });
        }
      }
    };
  },

  initPaymentAutofill() {
    document.querySelectorAll('[data-payment-section]').forEach(section => {
      const inputs = section.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          const alreadyFilled = Array.from(inputs).some(i => i.value.trim() && !i.placeholder);
          if (alreadyFilled) return;

          const nameSource = section.getAttribute('data-payment-section');
          let cardName = 'Darren Ho Jun Le';
          if (nameSource) {
            const nameEl = document.querySelector(nameSource);
            if (nameEl) {
              const val = nameEl.value || nameEl.textContent;
              if (val && val.trim()) cardName = val.trim();
            }
          }

          const fields = {
            'card-number': '4242 4242 4242 4242',
            'card-expiry': '12 / 28',
            'card-cvc': '123',
            'card-name': cardName,
            'card-address': '123 Clementi Ave 3, #08-45, Singapore 129588'
          };

          section.querySelectorAll('[data-field]').forEach(el => {
            const key = el.getAttribute('data-field');
            if (fields[key]) {
              el.value = fields[key];
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });

          section.querySelectorAll('.form-input').forEach(el => {
            if (!el.getAttribute('data-field') && !el.value.trim()) {
              const label = el.closest('.form-group')?.querySelector('.form-label')?.textContent || '';
              if (label.includes('Card number')) el.value = '4242 4242 4242 4242';
              else if (label.includes('Expiry')) el.value = '12 / 28';
              else if (label.includes('CVC')) el.value = '123';
              else if (label.includes('Name on card')) el.value = cardName;
              else if (label.includes('Billing')) el.value = '123 Clementi Ave 3, #08-45, Singapore 129588';
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        }, { once: true });
      });
    });
  },

  initInviteModal() {
    const modalHTML = `
      <div class="invite-modal" id="invite-modal">
        <div class="invite-modal__card">
          <button class="invite-modal__close" onclick="PS.closeInviteModal()">&#10005;</button>
          <div class="invite-modal__title">Invite members to your team</div>
          <div class="invite-modal__desc">Copy and share this link with your team. Each member will fill in their own details to join.</div>
          <div class="invite-modal__label">INVITE LINK</div>
          <div class="invite-modal__link-box">
            <span class="invite-modal__link-text">gms.sport.gov.sg/xHcsd23d</span>
            <button class="invite-modal__copy-btn" onclick="this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1500)">Copy</button>
          </div>
          <div class="invite-modal__qr">&#9968;</div>
        </div>
      </div>`;
    if (!document.getElementById('invite-modal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      document.getElementById('invite-modal').addEventListener('click', (e) => {
        if (e.target.id === 'invite-modal') this.closeInviteModal();
      });
    }
  },

  openInviteModal() {
    document.getElementById('invite-modal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeInviteModal() {
    document.getElementById('invite-modal')?.classList.remove('active');
    document.body.style.overflow = '';
  },

  initAll() {
    this.initSuccessScreens();
    this.initInviteModal();
    this.initClearButtons();
    this.initCheckboxes();
    this.initRadioGroups();
    this.initShowMore();
    this.initSectionToggles();
    this.initBackButtons();
    this.initNavButtons();
    this.initLiveRevalidation();
    this.initPaymentAutofill();

    document.querySelectorAll('.sp-page[data-sp-next]').forEach(page => {
      page.addEventListener('click', () => {
        const next = page.getAttribute('data-sp-next');
        if (next) PS.goTo(next);
      });
      page.innerHTML = PS.singpassHTML();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => PS.initAll());
